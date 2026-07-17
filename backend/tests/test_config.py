import pytest

from app.config import _parse_origins


def test_explicit_origins_are_normalized() -> None:
    assert _parse_origins("http://localhost:5173/, https://example.com") == (
        "http://localhost:5173",
        "https://example.com",
    )


def test_wildcard_origin_is_rejected() -> None:
    with pytest.raises(ValueError, match="Wildcard"):
        _parse_origins("*")
