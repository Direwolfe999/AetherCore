import logging
import uuid

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response


logger = logging.getLogger(__name__)


class RequestContextMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next) -> Response:
        request_id = request.headers.get("x-request-id") or str(uuid.uuid4())
        request.state.request_id = request_id

        logger.info(
            "request_started",
            extra={
                "request_id": request_id,
                "path": request.url.path,
            },
        )

        response = await call_next(request)
        response.headers["x-request-id"] = request_id

        logger.info(
            "request_completed",
            extra={
                "request_id": request_id,
                "path": request.url.path,
                "status_code": response.status_code,
            },
        )
        return response