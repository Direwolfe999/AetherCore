"""Test fixtures for backend suite."""

import pytest


@pytest.fixture
def base_env(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("APP_ENV", "test")
    monkeypatch.setenv("LOG_LEVEL", "DEBUG")
    monkeypatch.setenv("AUTH0_DOMAIN", "test.auth0.com")
    monkeypatch.setenv("AUTH0_AUDIENCE", "https://aethercore.api")
    monkeypatch.setenv("AUTH0_CLIENT_ID", "test_client_id")
    monkeypatch.setenv("AUTH0_CLIENT_SECRET", "test_client_secret")
    monkeypatch.setenv("AUTH0_M2M_CLIENT_ID", "test_m2m_id")
    monkeypatch.setenv("AUTH0_M2M_CLIENT_SECRET", "test_m2m_secret")
    monkeypatch.setenv("DATABASE_URL", "sqlite:///:memory:")
