from __future__ import annotations

import asyncio
import logging
import time
from dataclasses import dataclass, field
from typing import Any

import httpx
from fastapi import Depends, HTTPException, Request, Security, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import jwk, jwt
from jose.exceptions import JWTError

from config import get_settings
from permissions import (
    has_required_values,
    normalize_scope_string,
    normalize_string_collection,
)

logger = logging.getLogger(__name__)
bearer_scheme = HTTPBearer(auto_error=False)


@dataclass(slots=True)
class AuthenticatedUser:
    subject: str
    issuer: str
    audience: str | list[str] | None
    email: str | None
    name: str | None
    scopes: frozenset[str]
    permissions: frozenset[str]
    roles: frozenset[str]
    claims: dict[str, Any] = field(default_factory=dict)
    access_token: str = field(repr=False, compare=False, default="")


@dataclass(slots=True)
class JWKSCache:
    keys: list[dict[str, Any]] | None = None
    expires_at: float = 0.0


_jwks_cache = JWKSCache()
_jwks_lock = asyncio.Lock()


def _auth_error(detail: str, status_code: int = status.HTTP_401_UNAUTHORIZED) -> HTTPException:
    return HTTPException(status_code=status_code, detail=detail, headers={"WWW-Authenticate": "Bearer"})


async def _fetch_jwks() -> list[dict[str, Any]]:
    settings = get_settings()
    now = time.time()

    if _jwks_cache.keys is not None and _jwks_cache.expires_at > now:
        return _jwks_cache.keys

    async with _jwks_lock:
        if _jwks_cache.keys is not None and _jwks_cache.expires_at > time.time():
            return _jwks_cache.keys

        if not settings.resolved_auth0_issuer():
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Auth0 issuer is not configured",
            )

        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(settings.resolved_auth0_jwks_url())
                response.raise_for_status()
                payload = response.json()
        except httpx.HTTPError as exc:
            logger.exception("Failed to fetch Auth0 JWKS")
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Unable to fetch Auth0 signing keys",
            ) from exc

        keys = payload.get("keys", [])
        _jwks_cache.keys = keys
        _jwks_cache.expires_at = time.time() + 600
        return keys


def _extract_bearer_token(credentials: HTTPAuthorizationCredentials | None) -> str:
    if credentials is None or credentials.scheme.lower() != "bearer":
        raise _auth_error("Missing bearer token")

    token = credentials.credentials.strip()
    if not token:
        raise _auth_error("Missing bearer token")

    return token


def _build_authenticated_user(token: str, claims: dict[str, Any]) -> AuthenticatedUser:
    settings = get_settings()
    roles_claim = normalize_string_collection(claims.get(settings.auth0_roles_claim))
    permissions_claim = normalize_string_collection(claims.get(settings.auth0_permissions_claim))
    scopes_claim = normalize_scope_string(claims.get("scope"))

    if isinstance(claims.get("permissions"), list):
        permissions_claim |= normalize_string_collection(claims.get("permissions"))

    return AuthenticatedUser(
        subject=str(claims.get("sub", "")),
        issuer=str(claims.get("iss", "")),
        audience=claims.get("aud"),
        email=claims.get("email"),
        name=claims.get("name"),
        scopes=frozenset(scopes_claim),
        permissions=frozenset(permissions_claim),
        roles=frozenset(roles_claim),
        claims=claims,
        access_token=token,
    )


async def verify_auth0_token(token: str) -> AuthenticatedUser:
    settings = get_settings()
    issuer = settings.resolved_auth0_issuer()

    if not settings.auth0_audience.strip():
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Auth0 audience is not configured",
        )

    try:
        header = jwt.get_unverified_header(token)
        kid = header.get("kid")
        alg = header.get("alg", "RS256")
    except JWTError as exc:
        raise _auth_error("Invalid token header") from exc

    if not kid:
        raise _auth_error("Token is missing key identifier")

    keys = await _fetch_jwks()
    jwk_key = next((candidate for candidate in keys if candidate.get("kid") == kid), None)

    if jwk_key is None:
        raise _auth_error("Token signing key not found")

    try:
        public_key = jwk.construct(jwk_key, alg).to_pem().decode("utf-8")
        claims = jwt.decode(
            token,
            public_key,
            algorithms=[alg],
            audience=settings.auth0_audience,
            issuer=issuer,
            options={"verify_at_hash": False},
        )
    except JWTError as exc:
        raise _auth_error("Invalid or expired token") from exc

    return _build_authenticated_user(token, claims)


async def get_current_user(credentials: HTTPAuthorizationCredentials | None = Security(bearer_scheme)) -> AuthenticatedUser:
    token = _extract_bearer_token(credentials)
    return await verify_auth0_token(token)


def require_auth(*, required_scopes: set[str] | None = None, required_roles: set[str] | None = None):
    required_scopes = required_scopes or set()
    required_roles = required_roles or set()

    async def dependency(user: AuthenticatedUser = Depends(get_current_user)) -> AuthenticatedUser:
        scope_ok = not required_scopes or has_required_values(user.scopes | user.permissions, required_scopes)
        role_ok = not required_roles or has_required_values(set(user.roles), required_roles)

        if required_scopes and required_roles:
            if not (scope_ok or role_ok):
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Insufficient scope or role",
                )
        elif required_scopes and not scope_ok:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient scope",
            )
        elif required_roles and not role_ok:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient role",
            )

        return user

    return dependency