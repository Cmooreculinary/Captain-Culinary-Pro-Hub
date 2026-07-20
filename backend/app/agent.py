from __future__ import annotations

import json
from collections.abc import AsyncIterator, Sequence

import anthropic
import httpx

from .config import PROTOTYPE_SYSTEM_PROMPT, Settings
from .contracts import AgentRuntimeAdapter, ChatMessage


CLAUDE_MAX_REPLY_TOKENS = 4096


class AgentRuntimeError(RuntimeError):
    """A safe client-facing failure from the local agent runtime."""


class ClaudeAgentRuntime:
    provider = "claude"

    def __init__(self, settings: Settings, client: anthropic.AsyncAnthropic | None = None) -> None:
        self._settings = settings
        if client is not None:
            self._client = client
        elif settings.anthropic_api_key:
            self._client = anthropic.AsyncAnthropic(api_key=settings.anthropic_api_key)
        else:
            self._client = None

    @property
    def model(self) -> str:
        return self._settings.claude_model

    @property
    def configured(self) -> bool:
        return bool(self._settings.anthropic_api_key)

    async def stream_reply(self, messages: Sequence[ChatMessage]) -> AsyncIterator[str]:
        if not self.configured:
            raise AgentRuntimeError("ANTHROPIC_API_KEY is not configured on the backend")

        try:
            async with self._client.messages.stream(
                model=self._settings.claude_model,
                max_tokens=CLAUDE_MAX_REPLY_TOKENS,
                system=PROTOTYPE_SYSTEM_PROMPT,
                messages=[dict(message) for message in messages],
            ) as stream:
                async for text in stream.text_stream:
                    if text:
                        yield text
                final = await stream.get_final_message()
                if final.stop_reason == "refusal":
                    raise AgentRuntimeError(
                        "Claude declined this request; rephrase and try again"
                    )
        except anthropic.APITimeoutError as exc:
            raise AgentRuntimeError("The Claude API request timed out") from exc
        except anthropic.APIConnectionError as exc:
            raise AgentRuntimeError("Cannot reach the Claude API") from exc
        except anthropic.AuthenticationError as exc:
            raise AgentRuntimeError("The Claude API rejected the configured API key") from exc
        except anthropic.RateLimitError as exc:
            raise AgentRuntimeError("The Claude API is rate limiting requests; try again shortly") from exc
        except anthropic.APIStatusError as exc:
            raise AgentRuntimeError(f"The Claude API returned HTTP {exc.status_code}") from exc

    async def close(self) -> None:
        if self._client is not None:
            await self._client.close()


def create_agent_runtime(settings: Settings) -> AgentRuntimeAdapter:
    if settings.agent_provider == "ollama":
        return OllamaAgentRuntime(settings)
    return ClaudeAgentRuntime(settings)


class OllamaAgentRuntime:
    provider = "ollama"

    def __init__(self, settings: Settings) -> None:
        self._settings = settings
        self._client = httpx.AsyncClient(
            base_url=settings.ollama_base_url,
            timeout=httpx.Timeout(settings.ollama_timeout_seconds),
            trust_env=False,
        )

    @property
    def model(self) -> str:
        return self._settings.ollama_model

    @property
    def configured(self) -> bool:
        return bool(self._settings.ollama_model)

    async def stream_reply(self, messages: Sequence[ChatMessage]) -> AsyncIterator[str]:
        if not self.configured:
            raise AgentRuntimeError("OLLAMA_MODEL is not configured on the backend")

        payload = {
            "model": self._settings.ollama_model,
            "stream": True,
            "think": self._settings.ollama_think,
            "options": {"num_ctx": self._settings.ollama_context_tokens},
            "messages": [
                {"role": "system", "content": PROTOTYPE_SYSTEM_PROMPT},
                *messages,
            ],
        }

        try:
            async with self._client.stream("POST", "/api/chat", json=payload) as response:
                response.raise_for_status()
                async for line in response.aiter_lines():
                    if not line:
                        continue
                    try:
                        event = json.loads(line)
                    except json.JSONDecodeError as exc:
                        raise AgentRuntimeError("Ollama returned invalid streaming JSON") from exc
                    if event.get("error"):
                        raise AgentRuntimeError(str(event["error"]))
                    content = event.get("message", {}).get("content", "")
                    if content:
                        yield str(content)
                    if event.get("done"):
                        break
        except httpx.ConnectError as exc:
            raise AgentRuntimeError("Cannot reach the local Ollama service") from exc
        except httpx.TimeoutException as exc:
            raise AgentRuntimeError("The local Ollama request timed out") from exc
        except httpx.HTTPStatusError as exc:
            raise AgentRuntimeError(f"Ollama returned HTTP {exc.response.status_code}") from exc

    async def close(self) -> None:
        await self._client.aclose()
