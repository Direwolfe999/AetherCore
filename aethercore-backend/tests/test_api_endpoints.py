"""Integration tests for API endpoints.""""""Integration tests for API endpoints."""




































































































    assert "error" in response.json()    assert response.status_code == 422    )        json={"invalid_field": "value"}        "/api/sync/google",    response = client.post(    """Test that validation errors return 422."""def test_validation_error_returns_422(client):@pytest.mark.integration    assert response.status_code != 200    response = client.post("/api/sync/google")    mock_require_auth.side_effect = Exception("Auth required")    """Test that sync endpoint requires authentication."""def test_sync_google_requires_auth(mock_require_auth, client):@patch("main.require_auth")@pytest.mark.integration    assert response.status_code in (401, 413)    # Should either reject with 413 or 401 (auth failure), not process    )        headers={"Content-Length": str(2 * 1024 * 1024)}        json={"auth0_token": large_payload},        "/api/sync/google",    response = client.post(    large_payload = "x" * (2 * 1024 * 1024)  # 2MB payload    """Test request payload size enforcement."""def test_payload_size_limit(client):@pytest.mark.integration    pytest.fail("Rate limit was not enforced after 130 requests")                return            assert "Retry-After" in response.headers            assert response.json()["status_code"] == 429        if response.status_code == 429:        response = client.get("/health")    for i in range(130):    # Make requests until limit is hit    """Test rate limit enforcement."""def test_rate_limit_exceeded(client):@pytest.mark.integration    assert "text/plain" in response.headers.get("content-type", "")    assert response.status_code == 200    response = client.get("/metrics")    """Test Prometheus metrics endpoint."""def test_metrics_endpoint(client):@pytest.mark.integration    assert "status" in data    assert "binary_path" in data    data = response.json()    assert response.status_code == 200    response = client.get("/health/mojo")    """Test Mojo health endpoint."""def test_mojo_health_check(client):@pytest.mark.integration    assert response.json()["status"] == "AetherCore Backend Nominal"    assert response.status_code == 200    response = client.get("/health")    """Test health check endpoint."""def test_health_check(client):@pytest.mark.integration    )        access_token="test_token_xyz"        roles={"Admin"},        scopes={"sync:write", "analysis:read"},        email="test@example.com",        iss="https://test.auth0.com/",        aud="https://aethercore.api",        sub="user_123",    return AuthenticatedUser(    """Create mock authenticated user."""def mock_auth_user():@pytest.fixture    return TestClient(app)    """Create test client."""def client():@pytest.fixturefrom security.auth import AuthenticatedUserfrom main import appfrom unittest.mock import AsyncMock, MagicMock, patchfrom fastapi.testclient import TestClientimport pytestimport pytest
from fastapi.testclient import TestClient
from unittest.mock import AsyncMock, MagicMock, patch

from main import app
from security.auth import AuthenticatedUser


@pytest.fixture
def client():
    """Create test client."""
    return TestClient(app)


@pytest.fixture
def mock_auth_user():
    """Create mock authenticated user."""
    return AuthenticatedUser(
        sub="user_123",
        aud="https://aethercore.api",
        iss="https://test.auth0.com/",
        email="test@example.com",
        scopes={"sync:write", "analysis:read"},
        roles={"Admin"},
        access_token="test_token_xyz"
    )


def test_health_check(client):
    """Test health check endpoint."""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "AetherCore Backend Nominal"


def test_mojo_health_check(client):
    """Test Mojo health endpoint."""
    response = client.get("/health/mojo")
    assert response.status_code == 200
    data = response.json()
    assert "binary_path" in data
    assert "status" in data


def test_metrics_endpoint(client):
    """Test Prometheus metrics endpoint."""
    response = client.get("/metrics")
    assert response.status_code == 200
    assert "text/plain" in response.headers.get("content-type", "")


def test_rate_limit_exceeded(client):
    """Test rate limit enforcement."""
    # Make requests until limit is hit
    for i in range(130):
        response = client.get("/health")
        if response.status_code == 429:
            assert response.json()["status_code"] == 429
            assert "Retry-After" in response.headers
            return
    
    pytest.fail("Rate limit was not enforced after 130 requests")


def test_payload_size_limit(client):
    """Test request payload size enforcement."""
    large_payload = "x" * (2 * 1024 * 1024)  # 2MB payload
    response = client.post(
        "/api/sync/google",
        json={"auth0_token": large_payload},
        headers={"Content-Length": str(2 * 1024 * 1024)}
    )
    # Should either reject with 413 or 401 (auth failure), not process
    assert response.status_code in (401, 413)


@patch("main.require_auth")
def test_sync_google_requires_auth(mock_require_auth, client):
    """Test that sync endpoint requires authentication."""
    mock_require_auth.side_effect = Exception("Auth required")
    response = client.post("/api/sync/google")
    assert response.status_code != 200


def test_validation_error_returns_422(client):
    """Test that validation errors return 422."""
    response = client.post(
        "/api/sync/google",
        json={"invalid_field": "value"}
    )
    assert response.status_code == 422
    assert "error" in response.json()
