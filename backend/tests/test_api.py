from __future__ import annotations

import asyncio
import base64
from collections.abc import AsyncIterator, Sequence

from fastapi.testclient import TestClient
from starlette.websockets import WebSocketDisconnect

from app.config import Settings
from app.contracts import ChatMessage
from app.main import create_app


class FakeAgent:
    provider = "fake"
    model = "fake-model"
    configured = True

    async def stream_reply(self, messages: Sequence[ChatMessage]) -> AsyncIterator[str]:
        assert messages[-1]["content"] == "Start the egg test"
        yield "Confirm your station "
        await asyncio.sleep(0)
        yield "is clear."

    async def close(self) -> None:
        return None


def settings() -> Settings:
    return Settings(
        cors_origins=("http://localhost:5173",),
        ollama_base_url="http://127.0.0.1:11434",
        ollama_model="test-model",
        ollama_context_tokens=4096,
        ollama_think=False,
        ollama_timeout_seconds=5,
        max_camera_frame_bytes=2048,
        ws_allow_missing_origin=False,
    )


def test_health_and_streaming_exchange() -> None:
    app = create_app(settings(), FakeAgent())
    with TestClient(app) as client:
        health = client.get("/health")
        assert health.status_code == 200
        payload = health.json()
        assert payload["agent_configured"] is True
        assert payload["provider"] == "fake"
        assert payload["model"] == "fake-model"

        with client.websocket_connect(
            "/ws/coach/test-session",
            headers={"origin": "http://localhost:5173"},
        ) as websocket:
            assert websocket.receive_json()["type"] == "ready"
            websocket.send_json({"type": "text-input", "text": "Start the egg test"})
            assert websocket.receive_json()["type"] == "assistant-start"
            assert websocket.receive_json()["text"] == "Confirm your station "
            assert websocket.receive_json()["text"] == "is clear."
            completed = websocket.receive_json()
            assert completed == {
                "type": "assistant-complete",
                "text": "Confirm your station is clear.",
                "generation": 1,
            }


def test_camera_transport_reports_no_retention_or_reasoning() -> None:
    app = create_app(settings(), FakeAgent())
    png_header = b"\x89PNG\r\n\x1a\n" + b"test-frame"
    data_url = "data:image/png;base64," + base64.b64encode(png_header).decode("ascii")

    with TestClient(app) as client:
        with client.websocket_connect(
            "/ws/coach/camera-test",
            headers={"origin": "http://localhost:5173"},
        ) as websocket:
            websocket.receive_json()
            websocket.send_json({"type": "camera-frame", "data_url": data_url})
            reply = websocket.receive_json()
            assert reply["type"] == "camera-frame-ack"
            assert reply["retained"] is False
            assert reply["vision_reasoning"] is False


def test_unapproved_websocket_origin_is_rejected() -> None:
    app = create_app(settings(), FakeAgent())
    with TestClient(app) as client:
        try:
            with client.websocket_connect(
                "/ws/coach/origin-test",
                headers={"origin": "https://unapproved.example"},
            ):
                raise AssertionError("Connection should not be accepted")
        except WebSocketDisconnect as exc:
            assert exc.code == 1008
            assert exc.reason == "Origin not allowed"
