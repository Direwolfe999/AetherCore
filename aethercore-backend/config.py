from functools import lru_cache
from typing import List

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env.local",
        env_file_encoding="utf-8",
        extra="ignore",
        populate_by_name=True,
    )

    app_name: str = "AetherCore Backend API"
    app_env: str = Field(default="development", alias="APP_ENV")
    log_level: str = Field(default="INFO", alias="LOG_LEVEL")
    frontend_url: str | None = Field(default=None, alias="FRONTEND_URL")
    database_url: str = Field(default="sqlite:///./aethercore.db", alias="DATABASE_URL")
    auth0_domain: str = Field(default="", alias="AUTH0_DOMAIN")
    auth0_issuer_base_url: str = Field(default="", alias="AUTH0_ISSUER_BASE_URL")
    auth0_audience: str = Field(default="", alias="AUTH0_AUDIENCE")
    auth0_roles_claim: str = Field(default="https://aethercore.ai/roles", alias="AUTH0_ROLES_CLAIM")
    auth0_permissions_claim: str = Field(default="permissions", alias="AUTH0_PERMISSIONS_CLAIM")
    auth0_client_id: str = Field(default="", alias="AUTH0_CLIENT_ID")
    auth0_client_secret: str = Field(default="", alias="AUTH0_CLIENT_SECRET")
    auth0_m2m_client_id: str = Field(default="", alias="AUTH0_M2M_CLIENT_ID")
    auth0_m2m_client_secret: str = Field(default="", alias="AUTH0_M2M_CLIENT_SECRET")
    google_client_id: str = Field(default="", alias="GOOGLE_CLIENT_ID")
    google_client_secret: str = Field(default="", alias="GOOGLE_CLIENT_SECRET")
    google_redirect_uri: str = Field(default="http://localhost:3000/api/oauth/google/callback", alias="GOOGLE_REDIRECT_URI")
    github_client_id: str = Field(default="", alias="GITHUB_CLIENT_ID")
    github_client_secret: str = Field(default="", alias="GITHUB_CLIENT_SECRET")
    github_redirect_uri: str = Field(default="http://localhost:3000/api/oauth/github/callback", alias="GITHUB_REDIRECT_URI")
    redis_url: str = Field(default="redis://localhost:6379/0", alias="REDIS_URL")
    celery_result_backend: str | None = Field(default=None, alias="CELERY_RESULT_BACKEND")
    mojo_binary_path: str = Field(default="./engine/analyzer", alias="MOJO_BINARY_PATH")
    mojo_timeout_seconds: float = Field(default=30.0, alias="MOJO_TIMEOUT_SECONDS")
    max_request_body_bytes: int = Field(default=1_048_576, alias="MAX_REQUEST_BODY_BYTES")
    rate_limit_requests_per_window: int = Field(default=120, alias="RATE_LIMIT_REQUESTS_PER_WINDOW")
    rate_limit_window_seconds: int = Field(default=60, alias="RATE_LIMIT_WINDOW_SECONDS")
    rate_limit_exempt_paths: List[str] = Field(default_factory=lambda: [
        "/health",
        "/metrics",
    ], alias="RATE_LIMIT_EXEMPT_PATHS")
    cors_origins: List[str] = Field(default_factory=lambda: [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ], alias="CORS_ORIGINS")
    cors_allow_credentials: bool = True
    cors_allow_methods: List[str] = Field(default_factory=lambda: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"])
    cors_allow_headers: List[str] = Field(default_factory=lambda: ["Authorization", "Content-Type", "Accept", "Origin", "X-Requested-With"])

    @field_validator("cors_origins", mode="before")
    @classmethod
    def parse_cors_origins(cls, value: object) -> List[str]:
        if value is None:
            return [
                "http://localhost:3000",
                "http://127.0.0.1:3000",
            ]

        if isinstance(value, str):
            return [origin.strip() for origin in value.split(",") if origin.strip()]

        if isinstance(value, list):
            return [str(origin).strip() for origin in value if str(origin).strip()]

        return [str(value).strip()]

    def resolved_cors_origins(self) -> List[str]:
        origins = [origin for origin in dict.fromkeys(self.cors_origins) if origin != "*"]

        if self.frontend_url and self.frontend_url not in origins:
            origins.append(self.frontend_url)

        return origins

    def resolved_auth0_issuer(self) -> str:
        issuer = self.auth0_issuer_base_url.strip() if self.auth0_issuer_base_url else ""

        if not issuer and self.auth0_domain.strip():
            issuer = f"https://{self.auth0_domain.strip().removeprefix('https://').removeprefix('http://')}"

        return issuer.rstrip("/")

    def resolved_auth0_jwks_url(self) -> str:
        return f"{self.resolved_auth0_issuer()}/.well-known/jwks.json"

    def resolved_m2m_client_id(self) -> str:
        return self.auth0_m2m_client_id or self.auth0_client_id

    def resolved_m2m_client_secret(self) -> str:
        return self.auth0_m2m_client_secret or self.auth0_client_secret

    def resolved_celery_result_backend(self) -> str:
        return self.celery_result_backend or self.redis_url

    def is_sqlite(self) -> bool:
        return self.database_url.startswith("sqlite")


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()