from __future__ import annotations

import json
from collections.abc import AsyncIterator, Sequence

import httpx

from .config import PROTOTYPE_SYSTEM_PROMPT, Settings
from .contracts import ChatMessage


class AgentRuntimeError(RuntimeError):
    """A safe client-facing failure from the local agent runtime."""


class OllamaAgentRuntime:
    def __init__(self, settings: Settings) -> None:
        self._settings = settings
        self._client = httpx.AsyncClient(
            base_url=settings.ollama_base_url,
            timeout=httpx.Timeout(settings.ollama_timeout_seconds),
            trust_env=False,
        )

    @property
    def configured(self) -> bool:
        return bool(self._settings.ollama_model)

    async def stream_reply(self, messages: Sequence[ChatMessage]) -> AsyncIterator[str]:
        if not self.configured:
            raise AgentRuntimeError("OLLAMA_MODEL is not configured on the backend")

        payload = {
            "model": self._settings.ollama_model,
            "stream": True,
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
