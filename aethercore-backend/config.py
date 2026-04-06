from functools import lru_cache
from typing import List

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env.local",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    app_name: str = "AetherCore Backend API"
    app_env: str = Field(default="development", alias="APP_ENV")
    log_level: str = Field(default="INFO", alias="LOG_LEVEL")
    frontend_url: str | None = Field(default=None, alias="FRONTEND_URL")
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
        origins = list(dict.fromkeys(self.cors_origins))

        if self.frontend_url and self.frontend_url not in origins:
            origins.append(self.frontend_url)

        return origins


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()