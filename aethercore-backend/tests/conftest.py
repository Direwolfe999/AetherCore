"""Test configuration and fixtures."""
import asyncio
import pytest


@pytest.fixture(scope="session")
def event_loop():
    """Create event loop for async tests."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest.fixture
def mock_settings(monkeypatch):
    """Mock settings for testing."""
    monkeypatch.setenv("APP_ENV", "test")
    monkeypatch.setenv("LOG_LEVEL", "DEBUG")
    monkeypatch.setenv("AUTH0_DOMAIN", "test.auth0.com")
    monkeypatch.setenv("AUTH0_AUDIENCE", "https://aethercore.api")
    monkeypatch.setenv("AUTH0_CLIENT_ID", "test_client_id")
    monkeypatch.setenv("AUTH0_CLIENT_SECRET", "test_client_secret")
    monkeypatch.setenv("AUTH0_M2M_CLIENT_ID", "test_m2m_id")
    monkeypatch.setenv("AUTH0_M2M_CLIENT_SECRET", "test_m2m_secret")
    monkeypatch.setenv("DATABASE_URL", "sqlite:///:memory:")
    monkeypatch.setenv("FRONTEND_URL", "http://localhost:3000")
