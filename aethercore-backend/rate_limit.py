import asyncio
import time
from collections import defaultdict, deque
from dataclasses import dataclass

from fastapi import status
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response


@dataclass
class RateLimitConfig:
    requests_per_window: int
    window_seconds: int
    exempt_paths: set[str]


class RateLimitMiddleware(BaseHTTPMiddleware):
    """Simple per-client fixed-window limiter for abuse protection."""

    def __init__(self, app, config: RateLimitConfig):
        super().__init__(app)
        self.config = config
        self._hits: dict[str, deque[float]] = defaultdict(deque)
        self._lock = asyncio.Lock()

    async def dispatch(self, request: Request, call_next) -> Response:
        path = request.url.path
        if path in self.config.exempt_paths:
            return await call_next(request)

        client_host = request.client.host if request.client else "unknown"
        key = f"{client_host}:{path}"
        now = time.time()
        oldest_allowed = now - self.config.window_seconds

        async with self._lock:
            queue = self._hits[key]
            while queue and queue[0] < oldest_allowed:
                queue.popleft()

            if len(queue) >= self.config.requests_per_window:
                retry_after = max(1, int(self.config.window_seconds - (now - queue[0])))
                return JSONResponse(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    content={
                        "error": "Rate limit exceeded",
                        "status_code": status.HTTP_429_TOO_MANY_REQUESTS,
                    },
                    headers={"Retry-After": str(retry_after)},
                )

            queue.append(now)

        return await call_next(request)


class PayloadSizeLimitMiddleware(BaseHTTPMiddleware):
    """Reject requests with oversized payloads before route handlers run."""

    def __init__(self, app, max_body_bytes: int):
        super().__init__(app)
        self.max_body_bytes = max_body_bytes

    async def dispatch(self, request: Request, call_next) -> Response:
        content_length = request.headers.get("content-length")
        if content_length is not None:
            try:
                if int(content_length) > self.max_body_bytes:
                    return JSONResponse(
                        status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                        content={
                            "error": "Payload too large",
                            "status_code": status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                            "max_body_bytes": self.max_body_bytes,
                        },
                    )
            except ValueError:
                return JSONResponse(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    content={
                        "error": "Invalid Content-Length header",
                        "status_code": status.HTTP_400_BAD_REQUEST,
                    },
                )

        return await call_next(request)
