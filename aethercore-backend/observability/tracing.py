import logging
import os

from fastapi import FastAPI

logger = logging.getLogger(__name__)


def setup_tracing(app: FastAPI, service_name: str = "aethercore-backend") -> None:
    """Best-effort tracing initialization with graceful no-op fallback."""
    try:
        if os.getenv("APP_ENV", "development").lower() == "test":
            logger.info("tracing_disabled", extra={"reason": "test_environment"})
            return

        if not os.getenv("OTEL_EXPORTER_OTLP_ENDPOINT"):
            logger.info("tracing_disabled", extra={"reason": "missing_otlp_endpoint"})
            return

        from opentelemetry import trace
        from opentelemetry.exporter.otlp.proto.http.trace_exporter import OTLPSpanExporter
        from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor
        from opentelemetry.instrumentation.httpx import HTTPXClientInstrumentor
        from opentelemetry.sdk.resources import Resource
        from opentelemetry.sdk.trace import TracerProvider
        from opentelemetry.sdk.trace.export import BatchSpanProcessor

        provider = TracerProvider(resource=Resource.create({"service.name": service_name}))
        processor = BatchSpanProcessor(OTLPSpanExporter())
        provider.add_span_processor(processor)
        trace.set_tracer_provider(provider)

        FastAPIInstrumentor.instrument_app(app)
        HTTPXClientInstrumentor().instrument()
        logger.info("tracing_enabled")
    except Exception as exc:
        logger.warning("tracing_disabled", extra={"reason": str(exc)})
