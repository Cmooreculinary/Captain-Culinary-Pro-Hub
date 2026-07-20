from __future__ import annotations

from collections.abc import AsyncIterator, Sequence
from typing import Protocol, TypedDict


class ChatMessage(TypedDict):
    role: str
    content: str


class AgentRuntimeAdapter(Protocol):
    @property
    def provider(self) -> str: ...

    @property
    def model(self) -> str: ...

    @property
    def configured(self) -> bool: ...

    async def stream_reply(self, messages: Sequence[ChatMessage]) -> AsyncIterator[str]: ...

    async def close(self) -> None: ...
