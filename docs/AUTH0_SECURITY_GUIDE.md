# Auth0 Ultimate Security Checklist for AetherCore

This guide covers everything you need to activate in the Auth0 Dashboard to make your application bulletproof.

## 1. Disable Public Signups (Invite-Only System)
If you want to control who accesses AetherCore (which you usually want for an admin interface):
1. Go to **Authentication -> Database -> Username-Password-Authentication**.
2. Scroll to **Sign Up** and toggle *Disable Sign Ups* to **ON**.
*Result:* Users cannot randomly create accounts. You must invite them via the Auth0 dashboard.

## 2. Enforce Multi-Factor Authentication (MFA)
Protect against password leaks by forcing a second layer of verification:
1. Go to **Security -> Multi-Factor Auth**.
2. Enable **One-time Password (OTP)** (e.g., Google Authenticator).
3. Set **Require Multi-factor Auth** to **Always** (or *Use Adaptive MFA* if you have a paid tier).
*Result:* Every user logging in will need their phone app to get past the firewall.

## 3. Bot Detection & Attack Protection
Stop bots from bruteforcing your login screen:
1. Go to **Security -> Attack Protection**.
2. **Suspicious IP Throttling**: Turn ON (blocks IPs that try too many wrong passwords).
3. **Brute-force Protection**: Turn ON (locks an account if too many failed attempts happen against it).
4. **Bot Detection**: Turn ON (adds an invisible reCAPTCHA if behavior is suspicious).

## 4. Customize the Token Lifespan
Keep sessions short so old tokens cannot be exploited:
1. Go to **Applications -> Applications -> AetherCore**.
2. Scroll down to **Refresh Token Expiration**:
   - Set "Require refresh tokens to expire after a set period of inactivity" to **2592000** (30 days) or lower.
   - Set "Refresh Token Rotation" to **ON** (Highly recommended, ensures old tokens are wiped if they leak).

## 5. Enable Role-Based Access Control (RBAC)
If you ever want to have different "Levels" of users:
1. Go to **User Management -> Roles**.
2. Create a Role called `Admin` and another called `Viewer`.
3. Go to **User Management -> Users**, click your user, and assign them the `Admin` role.
*(Make sure to tell the Next.js API to check these roles in your code!)*

## 6. Force HTTPS on Auth0 Connections
1. Go to **Tenant Settings -> Advanced**.
2. Ensure **Enforce HTTPS** is absolutely enabled.

By following this list, AetherCore will be as secure as a banking application.
