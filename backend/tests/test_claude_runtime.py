from __future__ import annotations

from types import SimpleNamespace

import anthropic
import httpx
import pytest

from app.agent import (
    AgentRuntimeError,
    ClaudeAgentRuntime,
    OllamaAgentRuntime,
    create_agent_runtime,
)
from app.config import PROTOTYPE_SYSTEM_PROMPT, Settings


def settings(**overrides) -> Settings:
    values = dict(
        cors_origins=("http://localhost:5173",),
        ollama_base_url="http://127.0.0.1:11434",
        ollama_model="test-model",
        ollama_timeout_seconds=5,
        max_camera_frame_bytes=2048,
        ws_allow_missing_origin=False,
        agent_provider="claude",
        anthropic_api_key="test-key-not-real",
        claude_model="claude-fable-5",
    )
    values.update(overrides)
    return Settings(**values)


class FakeMessageStream:
    def __init__(self, chunks, stop_reason="end_turn"):
        self._chunks = chunks
        self._stop_reason = stop_reason
        self.exited = False

    async def __aenter__(self):
        return self

    async def __aexit__(self, *exc_info):
        self.exited = True
        return False

    @property
    def text_stream(self):
        async def generate():
            for chunk in self._chunks:
                if isinstance(chunk, Exception):
                    raise chunk
                yield chunk

        return generate()

    async def get_final_message(self):
        return SimpleNamespace(stop_reason=self._stop_reason)


class FakeClaudeClient:
    def __init__(self, stream: FakeMessageStream):
        self.stream_kwargs: dict | None = None
        self.closed = False
        outer = self

        class Messages:
            def stream(self, **kwargs):
                outer.stream_kwargs = kwargs
                return stream

        self.messages = Messages()

    async def close(self):
        self.closed = True


@pytest.mark.anyio
async def test_streams_text_with_unchanged_system_prompt():
    stream = FakeMessageStream(["Confirm your station ", "is clear."])
    client = FakeClaudeClient(stream)
    runtime = ClaudeAgentRuntime(settings(), client=client)

    chunks = [
        chunk
        async for chunk in runtime.stream_reply(
            ({"role": "user", "content": "Start the egg test"},)
        )
    ]

    assert chunks == ["Confirm your station ", "is clear."]
    assert client.stream_kwargs["model"] == "claude-fable-5"
    assert client.stream_kwargs["system"] == PROTOTYPE_SYSTEM_PROMPT
    assert client.stream_kwargs["messages"] == [
        {"role": "user", "content": "Start the egg test"}
    ]
    # Fable 5 always thinks; sending a thinking config would be rejected.
    assert "thinking" not in client.stream_kwargs
    assert stream.exited


@pytest.mark.anyio
async def test_interruption_closes_the_stream():
    stream = FakeMessageStream(["one", "two", "three"])
    runtime = ClaudeAgentRuntime(settings(), client=FakeClaudeClient(stream))

    reply = runtime.stream_reply(({"role": "user", "content": "hi"},))
    assert await reply.__anext__() == "one"
    await reply.aclose()

    assert stream.exited


@pytest.mark.anyio
async def test_unconfigured_without_api_key():
    runtime = ClaudeAgentRuntime(
        settings(anthropic_api_key=""),
        client=FakeClaudeClient(FakeMessageStream(["must not stream"])),
    )

    assert runtime.configured is False
    with pytest.raises(AgentRuntimeError, match="ANTHROPIC_API_KEY"):
        await runtime.stream_reply(({"role": "user", "content": "hi"},)).__anext__()


@pytest.mark.anyio
@pytest.mark.parametrize(
    ("error", "expected"),
    [
        (
            anthropic.APIConnectionError(
                request=httpx.Request("POST", "https://api.anthropic.com/v1/messages")
            ),
            "Cannot reach the Claude API",
        ),
        (
            anthropic.APIStatusError(
                "server error",
                response=httpx.Response(
                    500,
                    request=httpx.Request("POST", "https://api.anthropic.com/v1/messages"),
                ),
                body=None,
            ),
            "The Claude API returned HTTP 500",
        ),
    ],
)
async def test_api_errors_are_wrapped_safely(error, expected):
    stream = FakeMessageStream(["partial ", error])
    runtime = ClaudeAgentRuntime(settings(), client=FakeClaudeClient(stream))

    reply = runtime.stream_reply(({"role": "user", "content": "hi"},))
    assert await reply.__anext__() == "partial "
    with pytest.raises(AgentRuntimeError, match=expected) as excinfo:
        await reply.__anext__()

    assert "test-key-not-real" not in str(excinfo.value)


@pytest.mark.anyio
async def test_refusal_stop_reason_is_surfaced_as_safe_error():
    stream = FakeMessageStream([], stop_reason="refusal")
    runtime = ClaudeAgentRuntime(settings(), client=FakeClaudeClient(stream))

    with pytest.raises(AgentRuntimeError, match="declined"):
        await runtime.stream_reply(({"role": "user", "content": "hi"},)).__anext__()


@pytest.mark.anyio
async def test_close_closes_the_client():
    client = FakeClaudeClient(FakeMessageStream([]))
    runtime = ClaudeAgentRuntime(settings(), client=client)

    await runtime.close()

    assert client.closed


def test_provider_switch_selects_the_right_runtime():
    claude = create_agent_runtime(
        settings(agent_provider="claude", anthropic_api_key="")
    )
    ollama = create_agent_runtime(settings(agent_provider="ollama"))

    assert isinstance(claude, ClaudeAgentRuntime)
    assert claude.provider == "claude"
    assert claude.model == "claude-fable-5"
    assert claude.configured is False
    assert isinstance(ollama, OllamaAgentRuntime)
    assert ollama.provider == "ollama"
    assert ollama.model == "test-model"
