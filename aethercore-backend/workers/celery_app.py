from celery import Celery

from config import get_settings

settings = get_settings()

celery_app = Celery(
    "aethercore_worker",
    broker=settings.redis_url,
    backend=settings.resolved_celery_result_backend(),
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_acks_late=True,
    worker_prefetch_multiplier=1,
)
