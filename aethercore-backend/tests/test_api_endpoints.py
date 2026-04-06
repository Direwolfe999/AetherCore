"""Integration tests for API endpoints."""

import pytest
from fastapi.testclient import TestClient

from main import app


@pytest.fixture
def client() -> TestClient:
    return TestClient(app)


@pytest.mark.integration
def test_health_check(client: TestClient) -> None:
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "AetherCore Backend Nominal"


@pytest.mark.integration
def test_mojo_health_check(client: TestClient) -> None:
    response = client.get("/health/mojo")
    assert response.status_code == 200
    data = response.json()
    assert "binary_path" in data
    assert "status" in data


@pytest.mark.integration
def test_metrics_endpoint(client: TestClient) -> None:
    response = client.get("/metrics")
    assert response.status_code == 200


@pytest.mark.integration
def test_sync_google_requires_auth(client: TestClient) -> None:
    response = client.post("/api/sync/google", json={"auth0_token": "x"})
    assert response.status_code in (401, 403)


@pytest.mark.integration
def test_jobs_endpoint_requires_auth(client: TestClient) -> None:
    response = client.post("/api/jobs/sync")
    assert response.status_code in (401, 403)


@pytest.mark.integration
def test_rate_limit_enforced_on_protected_route(client: TestClient) -> None:
    seen_429 = False
    for _ in range(150):
        response = client.post("/api/jobs/sync")
        if response.status_code == 429:
            seen_429 = True
            break
    assert seen_429 is True
