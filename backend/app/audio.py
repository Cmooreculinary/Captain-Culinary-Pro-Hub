from __future__ import annotations

from collections.abc import AsyncIterator
from dataclasses import dataclass
from typing import Protocol


@dataclass(frozen=True, slots=True)
class AudioChunk:
    payload: bytes
    mime_type: str
    sequence: int


@dataclass(frozen=True, slots=True)
class TranscriptEvent:
    text: str
    final: bool


class SpeechInputAdapter(Protocol):
    @property
    def provider(self) -> str: ...

    @property
    def model(self) -> str: ...

    @property
    def configured(self) -> bool: ...

    @property
    def accepted_mime_types(self) -> tuple[str, ...]: ...

    def stream_transcript(
        self,
        chunks: AsyncIterator[AudioChunk],
    ) -> AsyncIterator[TranscriptEvent]: ...

    async def close(self) -> None: ...


class SpeechOutputAdapter(Protocol):
    @property
    def provider(self) -> str: ...

    @property
    def model(self) -> str: ...

    @property
    def configured(self) -> bool: ...

    @property
    def output_mime_type(self) -> str: ...

    def stream_audio(self, text: str) -> AsyncIterator[AudioChunk]: ...

    async def close(self) -> None: ...
