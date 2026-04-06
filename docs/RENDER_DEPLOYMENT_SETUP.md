# Render Deployment Setup (Backend First)

This guide sets Render backend as the primary runtime target while keeping localhost as fallback.

## 1. Architecture Target

- Frontend: Vercel at https://aethercore-ai.vercel.app
- Backend API: Render Web Service at https://<your-backend>.onrender.com
- Worker queue: Redis + Celery (Render Redis + Worker service)
- Scheduled sync: cron-job.org calling your backend endpoint

## 2. Render Backend Service

Create a new Render Web Service from this repository.

- Root Directory: aethercore-backend
- Runtime: Python 3.11+
- Build Command: pip install -r requirements.txt
- Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT
- Health Check Path: /health

### Required Environment Variables (Render Web Service)

- APP_ENV=production
- LOG_LEVEL=INFO
- FRONTEND_URL=https://aethercore-ai.vercel.app
- DATABASE_URL=<your managed postgres url>
- REDIS_URL=<your render redis url>
- CELERY_RESULT_BACKEND=<same redis url or dedicated backend>
- AUTH0_DOMAIN=<tenant domain without protocol, or leave empty if issuer is set>
- AUTH0_ISSUER_BASE_URL=https://<tenant>.us.auth0.com
- AUTH0_AUDIENCE=<your backend api audience>
- AUTH0_CLIENT_ID=<auth0 client id>
- AUTH0_CLIENT_SECRET=<auth0 client secret>
- AUTH0_M2M_CLIENT_ID=<m2m client id>
- AUTH0_M2M_CLIENT_SECRET=<m2m client secret>
- AUTH0_ROLES_CLAIM=https://aethercore.ai/roles
- AUTH0_PERMISSIONS_CLAIM=permissions
- MOJO_BINARY_PATH=./engine/analyzer
- MOJO_TIMEOUT_SECONDS=30
- MAX_REQUEST_BODY_BYTES=1048576
- RATE_LIMIT_REQUESTS_PER_WINDOW=120
- RATE_LIMIT_WINDOW_SECONDS=60
- CORS_ORIGINS=https://aethercore-ai.vercel.app,http://localhost:3000

### Environment Variables Explained (where each comes from)

Use this table when filling Render environment variables.

| Variable | What it does | Where to get it | Example |
|---|---|---|---|
| APP_ENV | Tells backend to run in production mode. | You set this manually. | production |
| LOG_LEVEL | Controls how much backend logs. Use INFO for production. | You set this manually. | INFO |
| FRONTEND_URL | Trusted frontend origin used by backend CORS helper. | Your Vercel site URL. | https://aethercore-ai.vercel.app |
| DATABASE_URL | Main backend database connection string. | Render PostgreSQL instance info page. | postgresql://user:pass@host:5432/db |
| REDIS_URL | Queue broker URL for Celery jobs. | Render Redis service info page. | redis://red-xxxx:6379 |
| CELERY_RESULT_BACKEND | Where Celery stores task results. Usually same as REDIS_URL. | Use REDIS_URL unless you provision separate backend. | redis://red-xxxx:6379 |
| AUTH0_DOMAIN | Auth0 tenant domain without protocol. Optional if issuer is set. | Auth0 Dashboard -> Tenant Settings -> Domain. | aethercore-ai.uk.auth0.com |
| AUTH0_ISSUER_BASE_URL | Token issuer URL used for JWT validation. | Auth0 Dashboard -> Applications/API settings. | https://aethercore-ai.uk.auth0.com |
| AUTH0_AUDIENCE | API identifier expected in access tokens. | Auth0 Dashboard -> APIs -> your API -> Identifier. | https://aethercore.ai/api |
| AUTH0_CLIENT_ID | Backend app client id used for Auth0 integrations. | Auth0 Dashboard -> Applications -> Credentials. | abc123 |
| AUTH0_CLIENT_SECRET | Backend app client secret. Keep private. | Auth0 Dashboard -> Applications -> Credentials. | super-secret-value |
| AUTH0_M2M_CLIENT_ID | Machine-to-machine app client id for token exchange. | Auth0 Dashboard -> M2M Application -> Credentials. | m2m-client-id |
| AUTH0_M2M_CLIENT_SECRET | M2M app client secret. Keep private. | Auth0 Dashboard -> M2M Application -> Credentials. | m2m-client-secret |
| AUTH0_ROLES_CLAIM | Claim namespace where roles are read. | Keep repo default unless you changed token claims. | https://aethercore.ai/roles |
| AUTH0_PERMISSIONS_CLAIM | Claim key for permissions array. | Keep repo default unless custom claim mapping is used. | permissions |
| MOJO_BINARY_PATH | Path to compiled Mojo analyzer binary in backend container. | Usually repository default. | ./engine/analyzer |
| MOJO_TIMEOUT_SECONDS | Max time allowed for Mojo run before fallback. | You set this manually. | 30 |
| MAX_REQUEST_BODY_BYTES | Request size protection limit. | You set this manually. | 1048576 |
| RATE_LIMIT_REQUESTS_PER_WINDOW | Number of requests allowed per client per window. | You set this manually. | 120 |
| RATE_LIMIT_WINDOW_SECONDS | Window duration for rate limit. | You set this manually. | 60 |
| CORS_ORIGINS | Allowed browser origins to call backend. Comma-separated. | Include production frontend and localhost. | https://aethercore-ai.vercel.app,http://localhost:3000 |

Recommended setup order:

1. Fill required URLs first: FRONTEND_URL, DATABASE_URL, REDIS_URL.
2. Fill Auth0 values from dashboard exactly as shown there.
3. Keep defaults for roles/permissions/mojo/rate limits unless you have a reason to change them.
4. Deploy and verify /health and /api/status/overview before wiring cron.

### Exact Click Path: AUTH0_M2M_CLIENT_ID and AUTH0_M2M_CLIENT_SECRET

If you do not already have a machine-to-machine app:

1. Open Auth0 Dashboard.
2. Go to Applications -> Applications.
3. Click Create Application.
4. Name it something like AetherCore Backend M2M.
5. Select Machine to Machine Applications.
6. Click Create.
7. Select the API your backend uses, then click Authorize.

Now copy the two values:

1. In Applications -> Applications, open your new M2M app.
2. Open the Settings tab.
3. Copy Client ID -> this is AUTH0_M2M_CLIENT_ID.
4. Copy Client Secret -> this is AUTH0_M2M_CLIENT_SECRET.
5. Save both in Render environment variables for backend and worker.

Important:

- Keep M2M secret private and never expose it in frontend env vars.
- If you rotate the secret in Auth0, update Render values immediately.

### Exact Click Path: DATABASE_URL on Render

1. Open Render Dashboard.
2. Create or open your PostgreSQL service.
3. Open the Connect tab (or Connection section).
4. Copy the Internal Database URL for Render-to-Render traffic.
5. Set that full URL as DATABASE_URL in backend service env vars.

Notes:

- The URL usually looks like postgresql://user:password@host:5432/dbname.
- Use internal URL when backend runs on Render. Use external URL only for local admin tools.

### Exact Click Path: REDIS_URL and CELERY_RESULT_BACKEND on Render

1. Open Render Dashboard.
2. Create or open your Redis service.
3. Open the Connect tab.
4. Copy Redis Internal URL.
5. Set REDIS_URL to that value.
6. Set CELERY_RESULT_BACKEND to the same value unless you are using a separate result store.

Notes:

- The URL may start with redis:// or rediss:// depending on your Render setup.
- If rediss:// is provided, use it as-is.

### Why you could not set permissions before

Auth0 permissions are attached to an API, not directly to an application.
If no API exists, permissions UI is limited and role permission assignment appears blocked.

Fix sequence:

1. Go to Applications -> APIs.
2. Click Create API.
3. Name: AetherCore Backend API.
4. Identifier: use the exact audience string you want your backend to validate. This is not the Render URL.
5. A good choice is a stable URL-like identifier under your own domain, for example https://aethercore.ai/api or https://aethercore.ai/aethercore-backend.
6. Copy that exact value into AUTH0_AUDIENCE in the backend and frontend env vars.
7. If you already started with a different audience string, keep it and use that same value everywhere. Do not mix values.
8. Signing Algorithm: RS256.
9. Create.
10. In the API settings, enable RBAC.
11. Enable Add Permissions in the Access Token.
12. Under Machine to Machine Applications or Applications -> your M2M app -> APIs, authorize the app for this API.
13. Open Permissions tab for this API and add permissions such as sync:write and analysis:read.
14. Go to User Management -> Roles, create roles such as Admin, Guardian, Analyst.
15. Assign those API permissions to each role.
16. Assign roles to users in User Management -> Users -> user -> Roles.

Access policy guidance:

- Use Allow via client-grant for the backend API.
- This lets only the M2M app(s) you authorize use client credentials.
- Do not use Allow any app unless you explicitly want any application to request permissions.
- Do not use Deny if you need cron-job.org or a backend M2M flow to obtain tokens for this API.

### Where AUTH0_ROLES_CLAIM value comes from

AUTH0_ROLES_CLAIM is not auto-generated by Auth0. You define it.
Use a stable namespace string, for example https://aethercore.ai/roles.

To include roles in tokens using that claim:

1. Go to Auth0 Dashboard -> Actions -> Library.
2. Create Action -> Post Login.
3. Add logic to place user roles into your custom claim namespace.
4. Deploy the action.
5. Attach it in Actions -> Flows -> Login.

If you keep AUTH0_ROLES_CLAIM as https://aethercore.ai/roles in backend env, your action must write roles to that same claim key.

Suggested Post Login Action pattern:

1. Read the user roles from Auth0 Management API or assign them as app metadata/role claim source.
2. Set the custom claim on the access token with the exact namespace you configured.
3. Use the same string in backend config, for example https://aethercore.ai/roles.

Example shape:

```js
exports.onExecutePostLogin = async (event, api) => {
  const roles = event.authorization?.roles || [];
  api.accessToken.setCustomClaim('https://aethercore.ai/roles', roles);
};
```

## 3. Render Worker Service (Celery)

Create a second Render service for workers.

- Type: Background Worker
- Root Directory: aethercore-backend
- Build Command: pip install -r requirements.txt
- Start Command: celery -A workers.celery_app.celery_app worker --loglevel=info

Use the same env vars as backend for Redis/Auth0/Mojo where applicable.

## 4. cron-job.org Setup (after backend is healthy)

Use cron-job.org to trigger your backend sync endpoint on a schedule.

Create a new job in cron-job.org:

- URL: https://<your-backend>.onrender.com/api/jobs/sync
- Request method: POST
- Schedule example: every 15 minutes
- Timeout: at least 30 seconds

Headers:

- Authorization: Bearer <service-token>
- Content-Type: application/json

Body:

```json
{}
```

Important:

- /api/jobs/sync currently requires valid Auth0 scope/role authorization.
- The bearer token used by cron-job.org must be valid for your backend audience and carry required permissions.
- If you prefer simpler service-to-service auth, add a dedicated cron endpoint protected by a static secret header and keep it separate from user-auth routes.

## 5. Frontend Configuration (Vercel)

In Vercel project environment variables:

- AUTH0_SECRET=<random 32+ bytes>
- AUTH0_BASE_URL=https://aethercore-ai.vercel.app
- APP_BASE_URL=https://aethercore-ai.vercel.app
- AUTH0_ISSUER_BASE_URL=https://<tenant>.us.auth0.com
- AUTH0_CLIENT_ID=<frontend client id>
- AUTH0_CLIENT_SECRET=<frontend client secret>
- AUTH0_AUDIENCE=<backend api audience>
- BACKEND_URL=https://<your-backend>.onrender.com
- RENDER_BACKEND_URL=https://<your-backend>.onrender.com
- NEXT_PUBLIC_API_URL=https://<your-backend>.onrender.com

### Copy-Paste Frontend Env Block (Production)

Use this exact block in Vercel (or your frontend host), replacing only values marked CHANGE_ME.

```env
# Frontend auth session settings
AUTH0_SECRET=CHANGE_ME_GENERATE_32_BYTE_SECRET
AUTH0_BASE_URL=https://aethercore-ai.vercel.app
APP_BASE_URL=https://aethercore-ai.vercel.app

# Auth0 tenant/app settings
AUTH0_ISSUER_BASE_URL=https://aethercore-ai.uk.auth0.com
AUTH0_CLIENT_ID=CHANGE_ME_FRONTEND_CLIENT_ID
AUTH0_CLIENT_SECRET=CHANGE_ME_FRONTEND_CLIENT_SECRET
AUTH0_AUDIENCE=https://aethercore.ai/api

# Backend routing targets (server-side proxy priority uses BACKEND_URL first)
BACKEND_URL=https://aethercore-backend.onrender.com
RENDER_BACKEND_URL=https://aethercore-backend.onrender.com
NEXT_PUBLIC_API_URL=https://aethercore-backend.onrender.com
```

### Copy-Paste Frontend Env Block (Local Frontend Dev)

Use this for local frontend testing with your deployed backend.

```env
AUTH0_SECRET=CHANGE_ME_GENERATE_32_BYTE_SECRET
AUTH0_BASE_URL=http://localhost:3000
APP_BASE_URL=http://localhost:3000

AUTH0_ISSUER_BASE_URL=https://aethercore-ai.uk.auth0.com
AUTH0_CLIENT_ID=CHANGE_ME_FRONTEND_CLIENT_ID
AUTH0_CLIENT_SECRET=CHANGE_ME_FRONTEND_CLIENT_SECRET
AUTH0_AUDIENCE=https://aethercore.ai/api

BACKEND_URL=https://aethercore-backend.onrender.com
RENDER_BACKEND_URL=https://aethercore-backend.onrender.com
NEXT_PUBLIC_API_URL=https://aethercore-backend.onrender.com
```

Generate AUTH0_SECRET quickly:

```bash
openssl rand -hex 32
```

After updating env vars in Vercel, redeploy the frontend so the new backend URL is used.

Notes:

- Server proxy priority is BACKEND_URL, then RENDER_BACKEND_URL, then NEXT_PUBLIC_API_URL, then localhost fallback.
- You only need one of those three backend URL vars; keep the others if you want compatibility.

## 6. Auth0 Callback and Logout URLs

In Auth0 application settings:

- Allowed Callback URLs:
  - https://aethercore-ai.vercel.app/api/auth/callback
  - http://localhost:3000/api/auth/callback
- Allowed Logout URLs:
  - https://aethercore-ai.vercel.app
  - http://localhost:3000
- Allowed Web Origins:
  - https://aethercore-ai.vercel.app
  - http://localhost:3000

## 7. URL Validation Checklist

Run these after backend deployment is live.

### Backend health and readiness

```bash
curl -i https://<your-backend>.onrender.com/health
curl -i https://<your-backend>.onrender.com/health/mojo
curl -i https://<your-backend>.onrender.com/api/status/overview
curl -i https://<your-backend>.onrender.com/metrics
```

Expected:

- /health returns 200
- /health/mojo returns 200 with runtime status fields
- /api/status/overview returns 200 JSON
- /metrics returns Prometheus text

### Frontend and auth routes

```bash
curl -I https://aethercore-ai.vercel.app
curl -I https://aethercore-ai.vercel.app/api/auth/login
curl -I https://aethercore-ai.vercel.app/api/auth/callback
curl -I https://aethercore-ai.vercel.app/api/auth/logout
curl -I https://aethercore-ai.vercel.app/api/auth/me
```

Expected:

- / returns 200
- /api/auth/login returns 302 redirect to Auth0
- /api/auth/callback returns 400/302 depending on presence of authorization code
- /api/auth/logout returns 302
- /api/auth/me returns 401 when not logged in, 200 when logged in

### Frontend to backend proxy checks

```bash
curl -i https://aethercore-ai.vercel.app/api/backend/health
curl -i https://aethercore-ai.vercel.app/api/backend/api/status/overview
```

Expected:

- Proxy endpoints return backend responses without CORS issues

## 8. Localhost Fallback Behavior

If BACKEND_URL, RENDER_BACKEND_URL, and NEXT_PUBLIC_API_URL are all unset, the proxy uses:

- http://localhost:8000

This keeps local development working while production points to Render.

## 9. Pre-Go-Live Gate

Proceed to cron-job.org automation only after all are true:

- Render backend health endpoints are stable for at least 15 minutes
- Frontend login/callback/logout works in browser
- Protected backend endpoints return 401 without token and 200 with valid token
- Vercel frontend pages load backend data through /api/backend proxy
- Mobile checks pass on both local and production URLs
