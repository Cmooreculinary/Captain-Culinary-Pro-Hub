"""Permanent safety-invariant regression suite.

Each test here pins one of the non-negotiable safety invariants from
CLAUDE.md. These tests must never be weakened or removed without the
operator's explicit approval.
"""

from __future__ import annotations

import base64
import json
from pathlib import Path

import httpx
import pytest

from app.agent import AgentRuntimeError, ClaudeAgentRuntime, OllamaAgentRuntime
from app.config import PROTOTYPE_SYSTEM_PROMPT, Settings, _parse_origins
from app.main import _decode_camera_frame, _valid_image_signature
from app.session import CameraFrameMetadata


REPO_ROOT = Path(__file__).resolve().parents[2]


def make_settings(**overrides) -> Settings:
    values = dict(
        cors_origins=("http://localhost:5173",),
        ollama_base_url="http://127.0.0.1:11434",
        ollama_model="test-model",
        ollama_context_tokens=4096,
        ollama_think=False,
        ollama_timeout_seconds=5,
        max_camera_frame_bytes=2048,
        ws_allow_missing_origin=False,
    )
    values.update(overrides)
    return Settings(**values)


class TestCoachingOneActionAtATime:
    def test_prompt_requires_one_action_and_confirmation(self) -> None:
        assert "Give one action at a time and wait for confirmation" in PROTOTYPE_SYSTEM_PROMPT

    def test_prompt_stops_on_unsafe_conditions(self) -> None:
        assert (
            "If the user reports an unsafe condition, stop the cooking sequence"
            in PROTOTYPE_SYSTEM_PROMPT
        )


class TestNoFoodSafetyClaimsFromCamera:
    def test_prompt_forbids_camera_based_safety_claims(self) -> None:
        assert (
            "Never claim that food is safe, allergen-free, or fully cooked based on a camera frame"
            in PROTOTYPE_SYSTEM_PROMPT
        )

    def test_prompt_forbids_pretending_to_see(self) -> None:
        assert "Do not claim to see a camera image" in PROTOTYPE_SYSTEM_PROMPT


class TestCameraFramesAreMetadataOnly:
    def test_camera_metadata_carries_no_pixel_data(self) -> None:
        fields = set(CameraFrameMetadata.__dataclass_fields__)
        assert fields == {"mime_type", "byte_count", "received_at"}

    def test_backend_never_writes_camera_frames(self) -> None:
        for path in (REPO_ROOT / "backend" / "app").rglob("*.py"):
            source = path.read_text(encoding="utf-8")
            assert "open(" not in source, (
                f"{path.name} opens files; camera frames must never touch disk"
            )


class TestCameraSizeAndSignatureChecks:
    def test_oversized_frame_is_rejected(self) -> None:
        payload = b"\x89PNG\r\n\x1a\n" + b"x" * 4096
        data_url = "data:image/png;base64," + base64.b64encode(payload).decode("ascii")
        with pytest.raises(ValueError, match="size limit"):
            _decode_camera_frame(data_url, max_bytes=2048)

    def test_mismatched_signature_is_rejected(self) -> None:
        payload = b"\x89PNG\r\n\x1a\n" + b"actually-png"
        data_url = "data:image/jpeg;base64," + base64.b64encode(payload).decode("ascii")
        with pytest.raises(ValueError, match="does not match"):
            _decode_camera_frame(data_url, max_bytes=2048)

    def test_non_image_data_url_is_rejected(self) -> None:
        data_url = "data:text/html;base64," + base64.b64encode(b"<html>").decode("ascii")
        with pytest.raises(ValueError, match="JPEG, PNG, or WebP"):
            _decode_camera_frame(data_url, max_bytes=2048)

    def test_invalid_base64_is_rejected(self) -> None:
        with pytest.raises(ValueError, match="invalid base64"):
            _decode_camera_frame("data:image/png;base64,invalid", max_bytes=2048)

    @pytest.mark.parametrize(
        ("mime_type", "payload", "expected"),
        [
            ("image/jpeg", b"\xff\xd8\xff" + b"rest", True),
            ("image/png", b"\x89PNG\r\n\x1a\n" + b"rest", True),
            ("image/webp", b"RIFF1234WEBP", True),
            ("image/jpeg", b"\x89PNG\r\n\x1a\n", False),
            ("image/webp", b"RIFF1234NOPE", False),
            ("image/gif", b"GIF89a", False),
        ],
    )
    def test_signature_table(self, mime_type: str, payload: bytes, expected: bool) -> None:
        assert _valid_image_signature(mime_type, payload) is expected


class TestNoWildcardCors:
    def test_wildcard_alone_is_rejected(self) -> None:
        with pytest.raises(ValueError, match="Wildcard"):
            _parse_origins("*")

    def test_wildcard_among_valid_origins_is_rejected(self) -> None:
        with pytest.raises(ValueError, match="Wildcard"):
            _parse_origins("http://localhost:5173,*")

    def test_empty_origin_list_is_rejected(self) -> None:
        with pytest.raises(ValueError, match="at least one explicit origin"):
            _parse_origins(" , ")


class TestNoSecretsInRepo:
    def test_env_files_are_gitignored(self) -> None:
        gitignore = (REPO_ROOT / ".gitignore").read_text(encoding="utf-8").splitlines()
        assert ".env" in gitignore

    def test_env_example_contains_no_key_material(self) -> None:
        example = (REPO_ROOT / "backend" / ".env.example").read_text(encoding="utf-8")
        for line in example.splitlines():
            if line.strip().startswith("ANTHROPIC_API_KEY"):
                _, _, value = line.partition("=")
                assert value.strip() == "", ".env.example must ship with an empty API key"

    def test_no_anthropic_key_material_in_tracked_sources(self) -> None:
        key_prefix = "sk-" + "ant-"  # split so this scan never matches itself
        for pattern in ("backend/app/**/*.py", "backend/tests/**/*.py"):
            for path in REPO_ROOT.glob(pattern):
                assert key_prefix not in path.read_text(encoding="utf-8"), (
                    f"{path} contains what looks like an Anthropic API key"
                )


class TestClaudeRequiresNoRealKey:
    @pytest.mark.anyio
    async def test_unconfigured_claude_fails_safely_without_network(self) -> None:
        runtime = ClaudeAgentRuntime(make_settings(anthropic_api_key=""))
        assert runtime.configured is False
        with pytest.raises(AgentRuntimeError, match="ANTHROPIC_API_KEY"):
            async for _ in runtime.stream_reply(({"role": "user", "content": "hi"},)):
                raise AssertionError("No reply should stream without a key")


class TestOllamaOfflineFallback:
    @pytest.mark.anyio
    async def test_ollama_streams_a_full_reply_offline(self) -> None:
        lines = [
            json.dumps({"message": {"content": "Nice work, "}}),
            json.dumps({"message": {"content": "Chef."}, "done": True}),
        ]

        def handler(request: httpx.Request) -> httpx.Response:
            assert request.url.path == "/api/chat"
            return httpx.Response(200, text="\n".join(lines))

        runtime = OllamaAgentRuntime(make_settings())
        await runtime._client.aclose()
        runtime._client = httpx.AsyncClient(
            base_url="http://127.0.0.1:11434",
            transport=httpx.MockTransport(handler),
        )
        chunks = [
            chunk
            async for chunk in runtime.stream_reply(({"role": "user", "content": "hi"},))
        ]
        assert "".join(chunks) == "Nice work, Chef."
        await runtime.close()

    @pytest.mark.anyio
    async def test_ollama_surfaces_stream_errors_safely(self) -> None:
        def handler(request: httpx.Request) -> httpx.Response:
            return httpx.Response(200, text=json.dumps({"error": "model not found"}))

        runtime = OllamaAgentRuntime(make_settings())
        await runtime._client.aclose()
        runtime._client = httpx.AsyncClient(
            base_url="http://127.0.0.1:11434",
            transport=httpx.MockTransport(handler),
        )
        with pytest.raises(AgentRuntimeError, match="model not found"):
            async for _ in runtime.stream_reply(({"role": "user", "content": "hi"},)):
                pass
        await runtime.close()
