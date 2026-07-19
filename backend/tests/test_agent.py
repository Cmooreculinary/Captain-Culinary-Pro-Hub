from __future__ import annotations

import asyncio
import json

import httpx

from app.agent import OllamaAgentRuntime
from app.config import Settings


def test_ollama_payload_uses_continuity_limits() -> None:
    async def scenario() -> None:
        captured: dict[str, object] = {}

        async def handler(request: httpx.Request) -> httpx.Response:
            captured.update(json.loads(request.content))
            return httpx.Response(
                200,
                content=b'{"message":{"content":"Ready"},"done":true}\n',
                headers={"content-type": "application/x-ndjson"},
            )

        settings = Settings(
            cors_origins=("http://localhost:5173",),
            ollama_base_url="http://127.0.0.1:11434",
            ollama_model="qwen3:1.7b",
            ollama_context_tokens=4096,
            ollama_think=False,
            ollama_timeout_seconds=5,
            max_camera_frame_bytes=2048,
            ws_allow_missing_origin=False,
        )
        runtime = OllamaAgentRuntime(settings)
        await runtime._client.aclose()
        runtime._client = httpx.AsyncClient(
            base_url=settings.ollama_base_url,
            transport=httpx.MockTransport(handler),
        )

        chunks = [chunk async for chunk in runtime.stream_reply(({"role": "user", "content": "Begin"},))]
        await runtime.close()

        assert chunks == ["Ready"]
        assert captured["model"] == "qwen3:1.7b"
        assert captured["think"] is False
        assert captured["options"] == {"num_ctx": 4096}

    asyncio.run(scenario())
