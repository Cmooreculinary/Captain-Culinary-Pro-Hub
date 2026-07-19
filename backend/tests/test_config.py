import pytest

from app.config import Settings, _parse_origins


def test_explicit_origins_are_normalized() -> None:
    assert _parse_origins("http://localhost:5173/, https://example.com") == (
        "http://localhost:5173",
        "https://example.com",
    )


def test_wildcard_origin_is_rejected() -> None:
    with pytest.raises(ValueError, match="Wildcard"):
        _parse_origins("*")


def test_continuity_model_defaults(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.delenv("OLLAMA_MODEL", raising=False)
    monkeypatch.delenv("OLLAMA_CONTEXT_TOKENS", raising=False)
    monkeypatch.delenv("OLLAMA_THINK", raising=False)

    settings = Settings.from_env()

    assert settings.ollama_model == "qwen3:1.7b"
    assert settings.ollama_context_tokens == 4096
    assert settings.ollama_think is False
