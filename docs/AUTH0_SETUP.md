# Auth0 Setup

This project uses the `@auth0/nextjs-auth0` SDK in the Next.js App Router.

## Required environment variables

Create a local `.env.local` with these values:

```bash
AUTH0_SECRET=generate-a-long-random-string-at-least-32-bytes
AUTH0_BASE_URL=http://localhost:3000
AUTH0_ISSUER_BASE_URL=https://your-tenant.us.auth0.com
AUTH0_CLIENT_ID=your_auth0_client_id
AUTH0_CLIENT_SECRET=your_auth0_client_secret
```

For production, set `AUTH0_BASE_URL` to your deployed app URL.

## Auth0 dashboard settings

In your Auth0 application, configure these URLs:

- Allowed Callback URLs: `http://localhost:3000/api/auth/callback`, plus your production callback URL
- Allowed Logout URLs: `http://localhost:3000`, plus your production base URL
- Allowed Web Origins: `http://localhost:3000`, plus your production base URL

If you use a custom domain, use that domain everywhere consistently.

## Route wiring

The App Router auth handler lives at `src/app/api/auth/[auth0]/route.ts` and uses `handleAuth()` directly. That gives you the standard routes:

- `/api/auth/login`
- `/api/auth/callback`
- `/api/auth/logout`
- `/api/auth/me`

## Frontend wiring

The app wraps the tree with `UserProvider` in `src/app/layout.tsx`, and the client hook in `src/hooks/use-auth-state.ts` reads the session with `useUser()`.

## Optional production settings

If you want stricter security, also review:

- `AUTH0_AUDIENCE` for the backend API identifier that your access tokens must target
- `AUTH0_ROLES_CLAIM` for the custom namespace used to carry roles in access tokens
- `AUTH0_PERMISSIONS_CLAIM` if you store permissions in a custom claim
- `AUTH0_SCOPE` if you need custom token scopes
- `AUTH0_SESSION_ROLLING` and `AUTH0_SESSION_ABSOLUTE_DURATION` for session policy
- `AUTH0_IDP_LOGOUT` if you want logout to end the upstream IdP session

## Backend API protection

The FastAPI backend now requires a valid Auth0 bearer access token for protected routes.

- Send backend requests with `Authorization: Bearer <access_token>`
- The access token must be issued for the backend `AUTH0_AUDIENCE`
- The backend checks scopes such as `sync:write` and `analysis:read`
- The backend also recognizes roles from the custom claim defined by `AUTH0_ROLES_CLAIM`
- Recommended roles for production are `Admin`, `Guardian`, and `Analyst`

## Verification checklist

After setting the variables, verify that:

1. `/api/auth/login` redirects to Auth0
2. Auth0 returns to `/api/auth/callback`
3. `/api/auth/me` returns the active user after login
4. Logout returns to the configured base URL
5. Protected backend routes reject requests without a valid bearer access token