import logging

from fastapi import Depends, FastAPI, HTTPException, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

from config import get_settings
from security.auth import AuthenticatedUser, require_auth
from engine.models import SyncRequest, ThreatAnalysisResponse
from logging_config import configure_logging
from middleware import RequestContextMiddleware
from services.vault_service import VaultService
from services.sync_engine import SyncEngine

settings = get_settings()
configure_logging(settings.log_level)

logger = logging.getLogger(__name__)

app = FastAPI(title=settings.app_name)

app.add_middleware(RequestContextMiddleware)

# Setup CORS for the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.resolved_cors_origins(),
    allow_credentials=settings.cors_allow_credentials,
    allow_methods=settings.cors_allow_methods,
    allow_headers=settings.cors_allow_headers,
)

vault_service = VaultService()
sync_engine = SyncEngine()


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    logger.warning(
        "http_exception",
        extra={
            "request_id": getattr(request.state, "request_id", None),
            "path": request.url.path,
            "status_code": exc.status_code,
        },
    )
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": exc.detail, "status_code": exc.status_code},
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    logger.info(
        "request_validation_failed",
        extra={
            "request_id": getattr(request.state, "request_id", None),
            "path": request.url.path,
            "status_code": status.HTTP_422_UNPROCESSABLE_ENTITY,
        },
    )
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"error": "Validation failed", "details": exc.errors()},
    )


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    logger.exception(
        "unhandled_exception",
        extra={
            "request_id": getattr(request.state, "request_id", None),
            "path": request.url.path,
            "status_code": status.HTTP_500_INTERNAL_SERVER_ERROR,
        },
    )
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"error": "Internal server error"},
    )

@app.get("/health")
def health_check():
    return {
        "status": "AetherCore Backend Nominal",
        "environment": settings.app_env,
    }

@app.post("/api/sync/google")
async def sync_google(
    request: SyncRequest | None = None,
    current_user: AuthenticatedUser = Depends(
        require_auth(required_scopes={"sync:write"}, required_roles={"Admin", "Guardian"})
    ),
):
    """
    Validates User's JWT, trades it for a Google Access Token from Auth0 Vault,
    and runs the sync_engine.
    """
    # 1. Fetch real tokens from Token Vault
    google_token = await vault_service.exchange_token_for_google(current_user.access_token)
    
    # 2. Sync Google data & run Mojo Analysis
    analysis_result = await sync_engine.sync_google_data(google_token)
    
    return {"status": "sync_complete", "analysis": analysis_result}

@app.get("/api/security/reasoning", response_model=ThreatAnalysisResponse)
async def get_reasoning(
    current_user: AuthenticatedUser = Depends(
        require_auth(required_scopes={"analysis:read"}, required_roles={"Admin", "Guardian", "Analyst"})
    ),
):
    """
    Returns the reasoning chain and confidence scored by the Mojo engine.
    """
    # Triggering the analysis (could also be stored and retrieved)
    analysis = await sync_engine.run_mojo_analysis()
    return analysis
