"""Unit tests for engine models and validation."""

import pytest
from pydantic import ValidationError

from engine.models import MojoAnalysisInput, MojoAnalysisOutput, SyncRequest, ThreatAnalysisResponse


@pytest.mark.unit
def test_sync_request_valid() -> None:
    req = SyncRequest(auth0_token="test_token")
    assert req.auth0_token == "test_token"


@pytest.mark.unit
def test_sync_request_forbids_unknown_fields() -> None:
    with pytest.raises(ValidationError):
        SyncRequest(auth0_token="test", unknown_field="value")


@pytest.mark.unit
def test_mojo_analysis_input_defaults() -> None:
    inp = MojoAnalysisInput()
    assert inp.calendar_event_count == 0
    assert inp.suspicious_domains == []
    assert inp.access_pattern_anomalies == []


@pytest.mark.unit
def test_threat_analysis_response_defaults() -> None:
    resp = ThreatAnalysisResponse(
        chain_of_thought=["step1"],
        confidence_score=85.5,
        action_taken="quarantine",
    )
    assert resp.analysis_status == "ok"
    assert resp.engine == "mojo-binary"


@pytest.mark.unit
def test_mojo_output_inherits_response() -> None:
    output = MojoAnalysisOutput(
        chain_of_thought=["analyzed"],
        confidence_score=72.0,
        action_taken="flag",
    )
    assert isinstance(output, ThreatAnalysisResponse)
