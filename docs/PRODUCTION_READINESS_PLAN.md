# AetherCore Production Readiness Plan

## Current State Snapshot

- Frontend: polished and functional, now improved for mobile typography and overflow handling across all tab pages.
- Backend: FastAPI + Mojo scaffold, but still mostly MVP skeleton with mocked integrations.
- Auth: Frontend Auth0 flow has been migrated to SDK v4 and is Next.js 16 compatible.

## Required Backend Integrations

### 1. Identity and Access (Auth0)

- Validate JWT access tokens server-side (signature, issuer, audience, exp, nbf).
- Use Auth0 JWKS caching for key rotation safety.
- Enforce authorization scopes/roles per endpoint.
- Add service-to-service M2M token flow for backend jobs.
- Add correlation between Auth0 user id and internal user record.

Implement in:
- aethercore-backend/main.py
- new file: aethercore-backend/security/auth.py
- new file: aethercore-backend/security/permissions.py

### 2. Persistence Layer

- Add PostgreSQL as the source of truth.
- Add SQLAlchemy models for user, token metadata, threat events, audit logs, sync jobs.
- Add Alembic migrations.
- Add repository/service patterns to isolate DB logic.

Add files:
- aethercore-backend/db/database.py
- aethercore-backend/db/models.py
- aethercore-backend/db/repositories/*.py
- aethercore-backend/alembic.ini
- aethercore-backend/alembic/

### 3. Token Vault / Secrets Security

- Replace VaultService mock token exchange with real flow.
- Encrypt stored external provider refresh/access tokens (envelope encryption with KMS key).
- Rotate encryption keys and support key versioning.
- Add token refresh job and revocation handling.

Implement in:
- aethercore-backend/services/vault_service.py
- new file: aethercore-backend/security/crypto.py

### 4. Sync Engine (Google, GitHub, Others)

- Implement provider clients with retries and rate-limit handling.
- Add idempotent sync jobs and checkpointing.
- Add normalized event schema before Mojo analysis.

Implement in:
- aethercore-backend/services/sync_engine.py
- new file: aethercore-backend/integrations/google_client.py
- new file: aethercore-backend/integrations/github_client.py

### 5. Mojo Runtime Integration

- Stop calling .mojo source directly at runtime; compile analyzer binary during build.
- Define a stable JSON schema contract between Python and Mojo output.
- Add runtime health checks and fallback behavior with explicit status.

Implement in:
- aethercore-backend/engine/analyzer.mojo
- aethercore-backend/services/sync_engine.py
- aethercore-backend/Dockerfile

### 6. Async Jobs and Backpressure

- Add Redis + task queue (Celery or RQ) for long-running sync and analysis.
- Keep API requests quick and return job ids for polling or websocket updates.

Add files:
- aethercore-backend/workers/celery_app.py
- aethercore-backend/workers/tasks.py

### 7. Observability and Reliability

- Structured logging (JSON logs), request ids, user ids, job ids.
- Metrics with Prometheus/OpenTelemetry.
- Tracing across frontend request -> FastAPI -> provider -> Mojo.
- Standardized exception handlers and error envelopes.

Add files:
- aethercore-backend/observability/logging.py
- aethercore-backend/observability/metrics.py
- aethercore-backend/observability/tracing.py

### 8. Security Hardening

- Restrict CORS to explicit frontend domains.
- Add rate limiting and abuse controls.
- Add strict request validation and payload size limits.
- Add dependency and container vulnerability scanning in CI.

Implement in:
- aethercore-backend/main.py
- new file: aethercore-backend/middleware/rate_limit.py

### 9. Testing and CI/CD

- Unit tests for services and validators.
- Integration tests for API endpoints and auth behavior.
- Contract tests for Mojo JSON interface.
- CI pipeline: lint, type check, tests, build image, security scan.

Add:
- aethercore-backend/tests/
- .github/workflows/backend-ci.yml

### 10. Deployment Configuration

- Production container build with compiled Mojo binary.
- Separate environments (dev/staging/prod).
- Secrets from platform secret manager, never from committed env files.
- Health and readiness endpoints for orchestrator.

Implement in:
- aethercore-backend/Dockerfile
- aethercore-backend/.dockerignore
- deployment manifests (platform-specific)

## Missing or Incomplete Areas in Current Backend

- CORS currently allows all origins in production-sensitive API path.
- JWT validation is not implemented in endpoint flow.
- Vault token exchange currently returns mocked token.
- Mojo execution path is tied to source file invocation and no strict schema guard.
- No DB or migrations currently exist.
- No queueing or retry orchestration for external integrations.

## Environment Variables to Standardize

Backend:
- APP_ENV
- APP_PORT
- LOG_LEVEL
- DATABASE_URL
- REDIS_URL
- AUTH0_DOMAIN
- AUTH0_AUDIENCE
- AUTH0_ISSUER
- AUTH0_M2M_CLIENT_ID
- AUTH0_M2M_CLIENT_SECRET
- TOKEN_ENCRYPTION_KEY_ID
- GOOGLE_CLIENT_ID
- GOOGLE_CLIENT_SECRET
- GOOGLE_REDIRECT_URI

Frontend:
- NEXT_PUBLIC_API_URL
- AUTH0_DOMAIN
- AUTH0_CLIENT_ID
- AUTH0_CLIENT_SECRET
- AUTH0_SECRET
- APP_BASE_URL

## 30-Day Delivery Sequence

Week 1:
- DB + migrations + auth middleware + CORS hardening.

Week 2:
- Real VaultService, provider clients, and sync retries.

Week 3:
- Mojo binary integration contract, worker queue, and async jobs.

Week 4:
- Observability, full test suite, CI/CD, and production deployment hardening.

## Definition of Production Ready

- Zero mock token paths remaining.
- Auth validation and authorization policies enforced for all protected endpoints.
- All critical paths covered by tests.
- Structured logs, metrics, and traces visible in monitoring stack.
- Successful load test at expected concurrency with graceful degradation.
- Security review checklist completed (secrets, CORS, dependency scan, rate limiting).
