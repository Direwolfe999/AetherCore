from pydantic import BaseModel
from typing import List

class ThreatAnalysisResponse(BaseModel):
    chain_of_thought: List[str]
    confidence_score: float
    action_taken: str

class SyncRequest(BaseModel):
    auth0_token: str
