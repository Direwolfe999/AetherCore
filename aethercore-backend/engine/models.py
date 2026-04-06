from pydantic import BaseModel
from typing import List


class MojoAnalysisInput(BaseModel):
    calendar_event_count: int = 0
    unknown_attendee_count: int = 0
    suspicious_domains: List[str] = []
    repo_count: int = 0
    recent_deployments: int = 0
    access_pattern_anomalies: List[str] = []


class ThreatAnalysisResponse(BaseModel):
    chain_of_thought: List[str]
    confidence_score: float
    action_taken: str
    analysis_status: str = "ok"
    engine: str = "mojo-binary"


class MojoAnalysisOutput(ThreatAnalysisResponse):
    pass


class SyncRequest(BaseModel):
    auth0_token: str | None = None
