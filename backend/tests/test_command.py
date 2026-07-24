from __future__ import annotations

from collections.abc import AsyncIterator, Sequence

from fastapi.testclient import TestClient

from app.command import COMMAND_PROTOCOL_VERSION, build_command_manifest
from app.config import Settings
from app.contracts import ChatMessage
from app.main import create_app


class FakeAgent:
    provider = "fake-cloud"
    model = "fake-model"
    configured = True

    async def stream_reply(self, messages: Sequence[ChatMessage]) -> AsyncIterator[str]:
        yield "Ready."

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


def test_command_manifest_reports_only_working_capabilities() -> None:
    manifest = build_command_manifest(FakeAgent())

    assert manifest.protocol_version == COMMAND_PROTOCOL_VERSION
    assert manifest.capabilities.text_streaming is True
    assert manifest.capabilities.interruption is True
    assert manifest.capabilities.camera_transport is True
    assert manifest.capabilities.camera_retention == "none"
    assert manifest.capabilities.vision_reasoning is False
    assert manifest.capabilities.audio_input is False
    assert manifest.capabilities.audio_output is False
    assert manifest.capabilities.avatar_renderer is False
    assert manifest.capabilities.automatic_runtime_handoff is False


def test_command_manifest_pins_safety_boundary() -> None:
    safety = build_command_manifest(FakeAgent()).safety

    assert safety.one_action_at_a_time is True
    assert safety.waits_for_confirmation is True
    assert safety.camera_food_safety_claims is False
    assert safety.camera_allergen_claims is False
    assert safety.camera_doneness_claims is False


def test_command_manifest_endpoint_reports_active_runtime() -> None:
    app = create_app(settings(), FakeAgent())

    with TestClient(app) as client:
        response = client.get("/command/v1/manifest")

    assert response.status_code == 200
    payload = response.json()
    assert payload["service"] == "captain-culinary-command"
    assert payload["protocol_version"] == "1.0.0"
    assert payload["runtime"] == {
        "provider": "fake-cloud",
        "model": "fake-model",
        "configured": True,
    }
    assert payload["endpoints"]["coaching_websocket"] == "/ws/coach/{session_id}"
