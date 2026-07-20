from __future__ import annotations

import asyncio
import base64
import binascii
import re
from contextlib import asynccontextmanager
from typing import Any

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, status
from fastapi.middleware.cors import CORSMiddleware

from .agent import AgentRuntimeError, create_agent_runtime
from .config import Settings
from .contracts import AgentRuntimeAdapter
from .session import CameraFrameMetadata, CoachSession


DATA_URL_PATTERN = re.compile(r"^data:(image/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$")


def _valid_image_signature(mime_type: str, payload: bytes) -> bool:
    if mime_type == "image/jpeg":
        return payload.startswith(b"\xff\xd8\xff")
    if mime_type == "image/png":
        return payload.startswith(b"\x89PNG\r\n\x1a\n")
    if mime_type == "image/webp":
        return len(payload) >= 12 and payload[:4] == b"RIFF" and payload[8:12] == b"WEBP"
    return False


def _decode_camera_frame(data_url: str, max_bytes: int) -> tuple[str, bytes]:
    match = DATA_URL_PATTERN.fullmatch(data_url)
    if match is None:
        raise ValueError("Camera frame must be a JPEG, PNG, or WebP data URL")
    mime_type, encoded = match.groups()
    if len(encoded) > ((max_bytes + 2) // 3) * 4 + 4:
        raise ValueError("Camera frame exceeds the configured size limit")
    try:
        payload = base64.b64decode(encoded, validate=True)
    except (binascii.Error, ValueError) as exc:
        raise ValueError("Camera frame contains invalid base64") from exc
    if len(payload) > max_bytes:
        raise ValueError("Camera frame exceeds the configured size limit")
    if not _valid_image_signature(mime_type, payload):
        raise ValueError("Camera frame content does not match its declared image type")
    return mime_type, payload


def create_app(
    settings: Settings | None = None,
    agent_runtime: AgentRuntimeAdapter | None = None,
) -> FastAPI:
    resolved_settings = settings or Settings.from_env()
    runtime = agent_runtime or create_agent_runtime(resolved_settings)

    @asynccontextmanager
    async def lifespan(application: FastAPI):
        application.state.agent_runtime = runtime
        yield
        await runtime.close()

    application = FastAPI(
        title="Captain Culinary Pro Hub — Controlled Spike",
        version="0.1.0",
        lifespan=lifespan,
    )
    application.state.settings = resolved_settings
    application.add_middleware(
        CORSMiddleware,
        allow_origins=list(resolved_settings.cors_origins),
        allow_credentials=True,
        allow_methods=["GET"],
        allow_headers=["Content-Type"],
    )

    @application.get("/")
    async def root() -> dict[str, str]:
        return {
            "service": "captain-culinary-pro-hub-spike",
            "status": "controlled-evaluation",
        }

    @application.get("/health")
    async def health() -> dict[str, Any]:
        return {
            "status": "ok",
            "provider": runtime.provider,
            "model": runtime.model,
            "agent_configured": runtime.configured,
            "camera_retention": "none",
            "avatar_renderer": "disabled-pending-licensed-asset",
        }

    @application.websocket("/ws/coach/{session_id}")
    async def coach_socket(websocket: WebSocket, session_id: str) -> None:
        if not resolved_settings.origin_is_allowed(websocket.headers.get("origin")):
            await websocket.close(code=status.WS_1008_POLICY_VIOLATION, reason="Origin not allowed")
            return

        await websocket.accept()
        session = CoachSession(session_id=session_id)
        send_lock = asyncio.Lock()

        async def send(event: dict[str, Any]) -> None:
            async with send_lock:
                await websocket.send_json(event)

        async def run_reply(text: str, generation: int) -> None:
            session.history.append({"role": "user", "content": text})
            chunks: list[str] = []
            await send({"type": "assistant-start", "generation": generation})
            try:
                async for chunk in runtime.stream_reply(tuple(session.history)):
                    if generation != session.generation:
                        return
                    chunks.append(chunk)
                    await send({"type": "text-delta", "text": chunk, "generation": generation})
                if generation == session.generation:
                    reply = "".join(chunks).strip()
                    if reply:
                        session.history.append({"role": "assistant", "content": reply})
                    await send({"type": "assistant-complete", "text": reply, "generation": generation})
            except asyncio.CancelledError:
                raise
            except AgentRuntimeError as exc:
                if generation == session.generation:
                    await send({"type": "error", "code": "agent-runtime", "message": str(exc)})
            except Exception:
                if generation == session.generation:
                    await send(
                        {
                            "type": "error",
                            "code": "internal-error",
                            "message": "The coaching response failed unexpectedly",
                        }
                    )
            finally:
                current = asyncio.current_task()
                if session.response_task is current:
                    session.response_task = None

        await send(
            {
                "type": "ready",
                "session_id": session_id,
                "provider": runtime.provider,
                "model": runtime.model,
                "agent_configured": runtime.configured,
                "camera_reasoning": False,
            }
        )

        try:
            while True:
                event = await websocket.receive_json()
                event_type = event.get("type")

                if event_type == "heartbeat":
                    await send({"type": "heartbeat-ack"})
                    continue

                if event_type == "interrupt-signal":
                    interrupted = await session.interrupt()
                    await send(
                        {
                            "type": "interruption-ack",
                            "interrupted": interrupted,
                            "generation": session.generation,
                        }
                    )
                    continue

                if event_type == "camera-frame":
                    try:
                        mime_type, frame = _decode_camera_frame(
                            str(event.get("data_url", "")),
                            resolved_settings.max_camera_frame_bytes,
                        )
                    except ValueError as exc:
                        await send({"type": "error", "code": "invalid-camera-frame", "message": str(exc)})
                        continue
                    session.latest_camera_frame = CameraFrameMetadata(
                        mime_type=mime_type,
                        byte_count=len(frame),
                    )
                    await send(
                        {
                            "type": "camera-frame-ack",
                            "mime_type": mime_type,
                            "byte_count": len(frame),
                            "retained": False,
                            "vision_reasoning": False,
                        }
                    )
                    continue

                if event_type == "text-input":
                    text = str(event.get("text", "")).strip()
                    if not text:
                        await send({"type": "error", "code": "empty-input", "message": "Text input is required"})
                        continue
                    if len(text) > 4000:
                        await send({"type": "error", "code": "input-too-long", "message": "Text input exceeds 4000 characters"})
                        continue
                    if session.response_task is not None and not session.response_task.done():
                        await send(
                            {
                                "type": "error",
                                "code": "response-in-progress",
                                "message": "Interrupt the current response before sending another instruction",
                            }
                        )
                        continue
                    session.generation += 1
                    session.response_task = asyncio.create_task(run_reply(text, session.generation))
                    continue

                await send({"type": "error", "code": "unknown-event", "message": "Unsupported event type"})
        except WebSocketDisconnect:
            await session.interrupt()

    return application


app = create_app()
