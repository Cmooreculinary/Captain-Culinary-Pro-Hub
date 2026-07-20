import pytest

from app.config import Settings, _parse_origins


def test_provider_defaults_to_claude_fable_5(monkeypatch: pytest.MonkeyPatch) -> None:
    for name in ("AGENT_PROVIDER", "ANTHROPIC_API_KEY", "CLAUDE_MODEL"):
        monkeypatch.delenv(name, raising=False)
    settings = Settings.from_env()
    assert settings.agent_provider == "claude"
    assert settings.claude_model == "claude-fable-5"
    assert settings.anthropic_api_key == ""


def test_provider_can_switch_to_ollama(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("AGENT_PROVIDER", "ollama")
    assert Settings.from_env().agent_provider == "ollama"


def test_unknown_provider_is_rejected(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("AGENT_PROVIDER", "gpt")
    with pytest.raises(ValueError, match="AGENT_PROVIDER"):
        Settings.from_env()


def test_explicit_origins_are_normalized() -> None:
    assert _parse_origins("http://localhost:5173/, https://example.com") == (
        "http://localhost:5173",
        "https://example.com",
    )


def test_wildcard_origin_is_rejected() -> None:
    with pytest.raises(ValueError, match="Wildcard"):
        _parse_origins("*")
