"""Unit tests for engine models and validation.""""""Unit tests for engine models and validation."""






































































    assert isinstance(output, ThreatAnalysisResponse)    )        action_taken="flag"        confidence_score=72.0,        chain_of_thought=["analyzed"],    output = MojoAnalysisOutput(    """Test that MojoAnalysisOutput is ThreatAnalysisResponse."""def test_mojo_analysis_output_inherits_response():@pytest.mark.unit    assert resp.engine == "mojo-binary"    assert resp.analysis_status == "ok"    assert resp.action_taken == "quarantine"    assert resp.confidence_score == 85.5    assert resp.chain_of_thought == ["step1", "step2"]    )        action_taken="quarantine"        confidence_score=85.5,        chain_of_thought=["step1", "step2"],    resp = ThreatAnalysisResponse(    """Test ThreatAnalysisResponse validation."""def test_threat_analysis_response_required_fields():@pytest.mark.unit    assert inp.suspicious_domains == ["evil.com"]    assert inp.unknown_attendee_count == 3    assert inp.calendar_event_count == 5    )        access_pattern_anomalies=["unusual_time"]        recent_deployments=2,        repo_count=10,        suspicious_domains=["evil.com"],        unknown_attendee_count=3,        calendar_event_count=5,    inp = MojoAnalysisInput(    """Test MojoAnalysisInput with custom values."""def test_mojo_analysis_input_custom_values():@pytest.mark.unit    assert inp.access_pattern_anomalies == []    assert inp.suspicious_domains == []    assert inp.calendar_event_count == 0    inp = MojoAnalysisInput()    """Test MojoAnalysisInput with default values."""def test_mojo_analysis_input_defaults():@pytest.mark.unit    assert "unknown" in str(exc_info.value).lower()        SyncRequest(auth0_token="test", unknown_field="value")    with pytest.raises(ValidationError) as exc_info:    """Test that unknown fields are rejected."""def test_sync_request_forbids_unknown_fields():@pytest.mark.unit    assert req.auth0_token == "test_token"    req = SyncRequest(auth0_token="test_token")    """Test valid sync request."""def test_sync_request_valid():@pytest.mark.unitfrom pydantic import ValidationErrorfrom engine.models import MojoAnalysisInput, MojoAnalysisOutput, SyncRequest, ThreatAnalysisResponseimport pytestimport pytest
from engine.models import MojoAnalysisInput, MojoAnalysisOutput, SyncRequest, ThreatAnalysisResponse
from pydantic import ValidationError


def test_sync_request_valid():
    """Test valid sync request."""
    req = SyncRequest(auth0_token="test_token")
    assert req.auth0_token == "test_token"


def test_sync_request_forbids_unknown_fields():
    """Test that unknown fields are rejected."""
    with pytest.raises(ValidationError) as exc_info:
        SyncRequest(auth0_token="test", unknown_field="value")
    assert "unknown" in str(exc_info.value).lower()


def test_mojo_analysis_input_defaults():
    """Test MojoAnalysisInput with default values."""
    inp = MojoAnalysisInput()
    assert inp.calendar_event_count == 0
    assert inp.suspicious_domains == []
    assert inp.access_pattern_anomalies == []


def test_mojo_analysis_input_custom_values():
    """Test MojoAnalysisInput with custom values."""
    inp = MojoAnalysisInput(
        calendar_event_count=5,
        unknown_attendee_count=3,
        suspicious_domains=["evil.com"],
        repo_count=10,
        recent_deployments=2,
        access_pattern_anomalies=["unusual_time"]
    )
    assert inp.calendar_event_count == 5
    assert inp.unknown_attendee_count == 3
    assert inp.suspicious_domains == ["evil.com"]


def test_threat_analysis_response_required_fields():
    """Test ThreatAnalysisResponse validation."""
    resp = ThreatAnalysisResponse(
        chain_of_thought=["step1", "step2"],
        confidence_score=85.5,
        action_taken="quarantine"
    )
    assert resp.chain_of_thought == ["step1", "step2"]
    assert resp.confidence_score == 85.5
    assert resp.action_taken == "quarantine"
    assert resp.analysis_status == "ok"
    assert resp.engine == "mojo-binary"


def test_mojo_analysis_output_inherits_response():
    """Test that MojoAnalysisOutput is ThreatAnalysisResponse."""
    output = MojoAnalysisOutput(
        chain_of_thought=["analyzed"],
        confidence_score=72.0,
        action_taken="flag"
    )
    assert isinstance(output, ThreatAnalysisResponse)
