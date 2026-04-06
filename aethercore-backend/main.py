import logging

from fastapi import Depends, FastAPI, HTTPException, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from celery.result import AsyncResult

from config import get_settings
from security.auth import AuthenticatedUser, require_auth
from engine.models import SyncRequest, ThreatAnalysisResponse
from observability.logging import configure_logging
from observability.metrics import MetricsMiddleware, metrics_response, record_sync_job
from observability.tracing import setup_tracing
from middleware import RequestContextMiddleware
from rate_limit import PayloadSizeLimitMiddleware, RateLimitConfig, RateLimitMiddleware
from services.vault_service import VaultService
from services.sync_engine import SyncEngine
from workers.celery_app import celery_app
from workers.tasks import sync_and_analyze_job

settings = get_settings()
configure_logging(settings.log_level)

logger = logging.getLogger(__name__)

app = FastAPI(title=settings.app_name)
setup_tracing(app)

app.add_middleware(RequestContextMiddleware)
app.add_middleware(MetricsMiddleware)
app.add_middleware(PayloadSizeLimitMiddleware, max_body_bytes=settings.max_request_body_bytes)
app.add_middleware(
    RateLimitMiddleware,
    config=RateLimitConfig(
        requests_per_window=settings.rate_limit_requests_per_window,
        window_seconds=settings.rate_limit_window_seconds,
        exempt_paths=set(settings.rate_limit_exempt_paths),
    ),
)

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


def error_envelope(message: str, status_code: int, request: Request, details: dict | None = None) -> dict:
    payload = {
        "error": message,
        "status_code": status_code,
        "request_id": getattr(request.state, "request_id", None),
    }
    if details:
        payload["details"] = details
    return payload


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
        content=error_envelope(str(exc.detail), exc.status_code, request),
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
        content=error_envelope(
            "Validation failed",
            status.HTTP_422_UNPROCESSABLE_ENTITY,
            request,
            details={"validation_errors": exc.errors()},
        ),
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
        content=error_envelope("Internal server error", status.HTTP_500_INTERNAL_SERVER_ERROR, request),
    )


@app.get("/health")
def health_check():
    return {
        "status": "AetherCore Backend Nominal",
        "environment": settings.app_env,
    }


@app.get("/health/mojo")
async def mojo_health_check():
    return await sync_engine.mojo_runtime_health()


@app.get("/metrics")
def metrics():
    return metrics_response()

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
    github_token = await vault_service.exchange_token_for_github(current_user.access_token)
    
    # 2. Run full provider sync and threat analysis.
    analysis_result = await sync_engine.run_full_sync_and_analysis(google_token, github_token)
    record_sync_job("full", "completed")
    logger.info("sync_completed", extra={"user_id": current_user.sub})
    
    return {"status": "sync_complete", "analysis": analysis_result, "user_sub": current_user.sub}


@app.post("/api/jobs/sync")
async def queue_sync_job(
    current_user: AuthenticatedUser = Depends(
        require_auth(required_scopes={"sync:write"}, required_roles={"Admin", "Guardian"})
    ),
):
    """Queue long-running provider sync + analysis and return a job id."""
    try:
        job = sync_and_analyze_job.delay(current_user.access_token, current_user.sub)
        logger.info("sync_job_queued", extra={"user_id": current_user.sub, "job_id": job.id})
        return {"status": "queued", "job_id": job.id}
    except Exception as exc:
        logger.exception("sync_job_queue_failed", extra={"user_id": current_user.sub})
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=f"Unable to queue job: {exc}")


@app.get("/api/jobs/{job_id}")
async def get_sync_job(job_id: str):
    result = AsyncResult(job_id, app=celery_app)
    payload = {
        "job_id": job_id,
        "state": result.state,
    }

    if result.state == "FAILURE":
        payload["error"] = str(result.result)
    elif result.state == "SUCCESS":
        payload["result"] = result.result

    return payload

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
    analysis = await sync_engine.run_mojo_analysis({})
    return analysis
