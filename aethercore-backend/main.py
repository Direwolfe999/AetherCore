from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict

from engine.models import SyncRequest, ThreatAnalysisResponse
from services.vault_service import VaultService
from services.sync_engine import SyncEngine

app = FastAPI(title="AetherCore Backend API")

# Setup CORS for the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

vault_service = VaultService()
sync_engine = SyncEngine()

@app.get("/health")
def health_check():
    return {"status": "AetherCore Backend Nominal"}

@app.post("/api/sync/google")
async def sync_google(request: SyncRequest):
    """
    Validates User's JWT, trades it for a Google Access Token from Auth0 Vault,
    and runs the sync_engine.
    """
    if not request.auth0_token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing Auth0 Token")
    
    # 1. Fetch real tokens from Token Vault
    google_token = await vault_service.exchange_token_for_google(request.auth0_token)
    
    # 2. Sync Google data & run Mojo Analysis
    analysis_result = await sync_engine.sync_google_data(google_token)
    
    return {"status": "sync_complete", "analysis": analysis_result}

@app.get("/api/security/reasoning", response_model=ThreatAnalysisResponse)
async def get_reasoning():
    """
    Returns the reasoning chain and confidence scored by the Mojo engine.
    """
    # Triggering the analysis (could also be stored and retrieved)
    analysis = sync_engine.run_mojo_analysis()
    return analysis
