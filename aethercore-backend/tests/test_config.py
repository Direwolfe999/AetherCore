"""Unit tests for backend settings and helpers."""

import pytest

from config import Settings


@pytest.mark.unit
def test_config_cors_origins_single() -> None:
    settings = Settings(cors_origins="http://localhost:3000,http://example.com")
    origins = settings.resolved_cors_origins()
    assert "http://localhost:3000" in origins
    assert "http://example.com" in origins


@pytest.mark.unit
def test_config_cors_filters_wildcard() -> None:
    settings = Settings(cors_origins=["*", "http://localhost:3000"])
    origins = settings.resolved_cors_origins()
    assert "*" not in origins
    assert "http://localhost:3000" in origins


@pytest.mark.unit
def test_config_auth0_issuer_from_domain() -> None:
    settings = Settings(auth0_domain="mydomain.auth0.com")
    assert settings.resolved_auth0_issuer() == "https://mydomain.auth0.com"


@pytest.mark.unit
def test_config_m2m_fallback_to_regular_client() -> None:
    settings = Settings(auth0_client_id="regular_id", auth0_m2m_client_id="")
    assert settings.resolved_m2m_client_id() == "regular_id"


@pytest.mark.unit
def test_config_is_sqlite() -> None:
    settings = Settings(database_url="sqlite:///./test.db")
    assert settings.is_sqlite() is True


@pytest.mark.unit
def test_config_is_postgres() -> None:
    settings = Settings(database_url="postgresql://user:pass@localhost/db")
    assert settings.is_sqlite() is False
