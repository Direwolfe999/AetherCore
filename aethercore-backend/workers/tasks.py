import asyncio
import logging
from datetime import datetime, timezone
from typing import Any, Dict

from observability.metrics import record_sync_job
from services.sync_engine import SyncEngine
from services.vault_service import VaultService
from workers.celery_app import celery_app

logger = logging.getLogger(__name__)


@celery_app.task(name="aethercore.sync_and_analyze", bind=True)
def sync_and_analyze_job(self, auth0_token: str, user_sub: str) -> Dict[str, Any]:
    """Queue task that exchanges provider tokens, runs sync, and executes analysis."""
    job_id = self.request.id

    async def _runner() -> Dict[str, Any]:
        vault_service = VaultService()
        sync_engine = SyncEngine()

        logger.info("sync_job_started", extra={"job_id": job_id, "user_id": user_sub})

        google_token = await vault_service.exchange_token_for_google(auth0_token)
        github_token = await vault_service.exchange_token_for_github(auth0_token)

        result = await sync_engine.run_full_sync_and_analysis(google_token, github_token)
        result["job_id"] = job_id
        result["user_sub"] = user_sub
        result["completed_at"] = datetime.now(timezone.utc).isoformat()
        return result

    try:
        record_sync_job("full", "queued")
        payload = asyncio.run(_runner())
        record_sync_job("full", "succeeded")
        logger.info("sync_job_completed", extra={"job_id": job_id, "user_id": user_sub})
        return payload
    except Exception as exc:
        record_sync_job("full", "failed")
        logger.exception("sync_job_failed", extra={"job_id": job_id, "user_id": user_sub})
        return {
            "job_id": job_id,
            "user_sub": user_sub,
            "status": "failed",
            "error": str(exc),
            "failed_at": datetime.now(timezone.utc).isoformat(),
        }
