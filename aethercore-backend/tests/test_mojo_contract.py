"""Contract tests for Mojo JSON interface."""

import json

import pytest

from engine.models import MojoAnalysisInput, MojoAnalysisOutput


@pytest.mark.contract
def test_mojo_input_schema_serialization() -> None:
    inp = MojoAnalysisInput(
        calendar_event_count=3,
        unknown_attendee_count=1,
        suspicious_domains=["phishing.com", "scam.net"],
        repo_count=15,
        recent_deployments=4,
        access_pattern_anomalies=["login_from_tor"],
    )

    serialized = inp.model_dump_json()
    deserialized = json.loads(serialized)

    assert deserialized["calendar_event_count"] == 3
    assert deserialized["unknown_attendee_count"] == 1
    assert len(deserialized["suspicious_domains"]) == 2
    assert deserialized["repo_count"] == 15


@pytest.mark.contract
def test_mojo_output_schema_deserialization() -> None:
    output = MojoAnalysisOutput(
        confidence_score=87.5,
        action_taken="Quarantine suspicious access",
        chain_of_thought=[
            "Detected unknown attendees",
            "Analyzed repositories",
            "No major anomalies",
        ],
        analysis_status="ok",
        engine="mojo-binary",
    )

    assert output.confidence_score == 87.5
    assert output.analysis_status == "ok"
    assert len(output.chain_of_thought) == 3


@pytest.mark.contract
def test_mojo_contract_bidirectional() -> None:
    original = MojoAnalysisOutput(
        confidence_score=73.2,
        action_taken="Enable monitoring",
        chain_of_thought=["Checked calendar", "Checked repos", "Assessed risk"],
        analysis_status="ok",
        engine="mojo-binary",
    )

    serialized = original.model_dump_json()
    deserialized = MojoAnalysisOutput.model_validate_json(serialized)

    assert deserialized.confidence_score == original.confidence_score
    assert deserialized.action_taken == original.action_taken
    assert deserialized.analysis_status == original.analysis_status
    assert deserialized.engine == original.engine
