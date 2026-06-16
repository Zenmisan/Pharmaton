# Authentication

## Summary

Real auth: signup/login with bcrypt-hashed passwords, JWT bearer tokens, role fixed at signup. No mock "role switcher" — switching role means signing out and signing in (or signing up) as a different account, which mirrors how a real multi-tenant app would behave.

## Signup / Login

- `POST /api/auth/signup` — `{ email, password, name, role, orgName?, location?, licenseNumber? }`. Password hashed with `bcryptjs` (`bcrypt.hashSync(password, 10)`). `role` is validated against `patient | pharmacist | hospital | supplier`. Duplicate email → `409`.
- `POST /api/auth/login` — `{ email, password }`. Compares with `bcrypt.compareSync`. Wrong credentials → `401` (no distinction between "no such email" and "wrong password", to avoid leaking which emails are registered).
- Both return `{ token, user }`. `user` never includes `password_hash`.

## Tokens

- Signed with `jsonwebtoken`, payload `{ id, role, email }`, expiry `7d`.
- Secret: `process.env.JWT_SECRET`, falls back to `'dev-secret-change-me'` if unset — **set a real secret in `server/.env` before any non-local deployment.**
- Client stores the token in `localStorage` (`pc_token`, see `src/lib/api.js`'s `setToken`/`getToken`), sent as `Authorization: Bearer <token>` on every request via `apiFetch`.

## Session restore

On app load, `AuthProvider` (`src/lib/auth.jsx`) calls `api.me()` using whatever token is in `localStorage`. If it resolves, the user is considered signed in; if it rejects (expired/invalid/missing token), the user lands on the landing page. This is how "stay signed in across refresh" works — there's no separate "remember me" flag, the token's 7-day expiry is the only session lifetime control.

## Authorization middleware

`requireAuth` (`server/routes/auth.js`) verifies the JWT and attaches `req.user = { id, role, email }`. Mounted on every router in `server/index.js` except `/api/auth` itself and `/api/health`. Route handlers use `req.user.id`/`req.user.role` to scope queries (e.g. inventory routes only ever touch the pharmacy owned by `req.user.id`; supplier vs. buyer order visibility is decided by `req.user.role`).

## Role model

Role is set once at signup and stored on the `users` row — it is not a UI toggle. The four roles (`patient`, `pharmacist`, `hospital`, `supplier`) map directly to which page tree `App.jsx` renders and which dashboard/data each backend route scopes to.

## Known limitations (see [ROADMAP.md](ROADMAP.md))

- No password reset flow.
- No email verification.
- No refresh tokens — once the 7-day JWT expires, the user must log in again.
- `JWT_SECRET` default fallback is intentionally insecure to fail loudly in dev; production deploys must override it.
