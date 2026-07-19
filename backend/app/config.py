from __future__ import annotations

import os
from dataclasses import dataclass
from urllib.parse import urlparse


PROTOTYPE_SYSTEM_PROMPT = """You are the Captain Culinary Pro Hub technical-spike coach.
This session validates one narrow professional cooking exchange and is not the canonical Captain Culinary curriculum.
Use direct, concise kitchen language. Never claim that food is safe, allergen-free, or fully cooked based on a camera frame.
When the user says 'Start the egg test', begin by asking them to confirm that the station is clear, hands are washed,
the pan is stable, and the heat source is controlled. Give one action at a time and wait for confirmation.
If the user reports an unsafe condition, stop the cooking sequence and tell them to make the station safe.
Do not claim to see a camera image; this spike transports frames but does not perform visual reasoning.
"""


def _parse_origins(raw: str) -> tuple[str, ...]:
    origins = tuple(item.strip().rstrip("/") for item in raw.split(",") if item.strip())
    if not origins:
        raise ValueError("CORS_ORIGINS must contain at least one explicit origin")
    for origin in origins:
        if origin == "*":
            raise ValueError("Wildcard CORS origins are prohibited")
        parsed = urlparse(origin)
        if parsed.scheme not in {"http", "https"} or not parsed.netloc:
            raise ValueError(f"Invalid CORS origin: {origin}")
    return origins


def _parse_bool(raw: str) -> bool:
    normalized = raw.strip().lower()
    if normalized in {"1", "true", "yes", "on"}:
        return True
    if normalized in {"0", "false", "no", "off"}:
        return False
    raise ValueError(f"Invalid boolean value: {raw}")


@dataclass(frozen=True, slots=True)
class Settings:
    cors_origins: tuple[str, ...]
    ollama_base_url: str
    ollama_model: str
    ollama_context_tokens: int
    ollama_think: bool
    ollama_timeout_seconds: float
    max_camera_frame_bytes: int
    ws_allow_missing_origin: bool

    @classmethod
    def from_env(cls) -> "Settings":
        base_url = os.getenv("OLLAMA_BASE_URL", "http://127.0.0.1:11434").rstrip("/")
        parsed = urlparse(base_url)
        if parsed.scheme not in {"http", "https"} or not parsed.netloc:
            raise ValueError("OLLAMA_BASE_URL must be an HTTP(S) URL")

        timeout = float(os.getenv("OLLAMA_TIMEOUT_SECONDS", "90"))
        if timeout <= 0:
            raise ValueError("OLLAMA_TIMEOUT_SECONDS must be greater than zero")

        context_tokens = int(os.getenv("OLLAMA_CONTEXT_TOKENS", "4096"))
        if context_tokens < 1024 or context_tokens > 32768:
            raise ValueError("OLLAMA_CONTEXT_TOKENS must be between 1024 and 32768")

        max_frame = int(os.getenv("MAX_CAMERA_FRAME_BYTES", "2097152"))
        if max_frame < 1024 or max_frame > 10 * 1024 * 1024:
            raise ValueError("MAX_CAMERA_FRAME_BYTES must be between 1024 and 10485760")

        return cls(
            cors_origins=_parse_origins(os.getenv("CORS_ORIGINS", "http://localhost:5173")),
            ollama_base_url=base_url,
            ollama_model=os.getenv("OLLAMA_MODEL", "qwen3:1.7b").strip(),
            ollama_context_tokens=context_tokens,
            ollama_think=_parse_bool(os.getenv("OLLAMA_THINK", "false")),
            ollama_timeout_seconds=timeout,
            max_camera_frame_bytes=max_frame,
            ws_allow_missing_origin=_parse_bool(os.getenv("WS_ALLOW_MISSING_ORIGIN", "false")),
        )

    def origin_is_allowed(self, origin: str | None) -> bool:
        if origin is None:
            return self.ws_allow_missing_origin
        return origin.rstrip("/") in self.cors_origins
