from __future__ import annotations

import asyncio
from dataclasses import dataclass, field
from datetime import UTC, datetime

from .contracts import ChatMessage


@dataclass(slots=True)
class CameraFrameMetadata:
    mime_type: str
    byte_count: int
    received_at: str = field(default_factory=lambda: datetime.now(UTC).isoformat())


@dataclass(slots=True)
class CoachSession:
    session_id: str
    history: list[ChatMessage] = field(default_factory=list)
    latest_camera_frame: CameraFrameMetadata | None = None
    response_task: asyncio.Task[None] | None = None
    generation: int = 0

    async def interrupt(self) -> bool:
        self.generation += 1
        task = self.response_task
        if task is None or task.done():
            return False
        task.cancel()
        try:
            await task
        except asyncio.CancelledError:
            pass
        finally:
            if self.response_task is task:
                self.response_task = None
        return True
