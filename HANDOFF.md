# Handoff — PharmaConnect AI

Read this first if picking up this project cold. Last touched: 2026-06-16.

## What this is

AI-powered medicine availability platform for Nigeria. Four roles — patient, community pharmacist, hospital pharmacist, supplier/distributor — share one app, each with a tailored dashboard. Core value: real-time medicine search across pharmacies, AI drug info/alternatives, emergency sourcing for hospitals, inventory/order management for pharmacists and suppliers.

Originally a single-file React mockup (`App.jsx`, all hardcoded data, dead buttons, client-exposed AI key). This session turned it into a real, working MVP: real Express+SQLite backend, real auth, every page wired to real data, AI calls proxied securely, codebase split into proper files, README + docs written, backend smoke-tested end to end.

**User's explicit standing instruction** (do not regress on this without asking): *"there is time for anything dont skip on the premise that there isnt time do everything that needs to be done fot this to be fully shippped as an mvp"* — i.e. don't suggest mock/shortcut approaches to save time; do it properly.

## Current state — what's done

- **Backend**: `server/` — Express 5 + better-sqlite3. Schema: `users, pharmacies, inventory, orders, supplier_requests, alerts, hospital_needs`. Auto-seeds demo data on first run (4 demo accounts, password `password123`: `amara@example.com` patient, `grace@example.com` pharmacist, `emeka@example.com` hospital, `medisupply@example.com` supplier).
- **Auth**: custom JWT (jsonwebtoken) + bcryptjs, 7-day tokens, `requireAuth` middleware on every route except `/api/auth` and `/api/health`.
- **AI**: `POST /api/ai` proxies to Anthropic (`claude-sonnet-4-5`). Key lives only in `server/.env` (`ANTHROPIC_API_KEY`) — currently a placeholder, not a real key. Without a real key, AI features return a graceful fallback string (tested, works).
- **Frontend**: `src/App.jsx` is now just the routing/auth shell (122 lines). Everything else split into `src/pages/*.jsx` (one per route), `src/components/*` (Card, Btn, Badge, Nav, Logo, AlertMeta), `src/lib/*` (api client, auth context, ai helper, gradients, utils).
- Every page that used to have hardcoded mock arrays or dead buttons now calls the real API: SearchPage, MapPage, PatientHome, PharmacistDashboard, InventoryPage, HospitalDashboard, OrdersPage, SupplierDashboard, EmergencyPage, StockPage, SourcingPage, ProfilePage, AlertsPage.
- **Docs**: `README.md` (setup, demo accounts, feature list) + `docs/ARCHITECTURE.md`, `docs/API.md`, `docs/AI_INTEGRATION.md`, `docs/AUTH.md`, `docs/ROADMAP.md`. Read `docs/API.md` before touching any route — it documents every endpoint's exact request/response shape.
- **Verified working** (via curl, this session): login for all 4 roles, inventory GET/PATCH, orders GET, search with real per-pharmacy results, pharmacies directory, alerts, hospital-needs, supplier-requests, AI fallback message. `npx vite build` passes clean. Vite dev server + `/api` proxy confirmed working.
- **Not yet verified**: actual browser click-through. All testing so far is curl/API-level — nobody has opened this in a browser and clicked every button yet.

## Decisions already made (don't re-litigate without reason)

- Backend stack: Node/Express + SQLite (better-sqlite3) — user-confirmed, not my guess.
- Auth: real auth, not a role-switcher — user-confirmed.
- AI key handling: backend proxy, never client-exposed — user-confirmed.
- File split: pages/components/lib structure, no client-side router (kept the existing `page` string + `setPage` callback pattern intentionally — see `docs/ARCHITECTURE.md` "Why" section).

## What's left — in priority order

1. **Browser click-through test** — never done. Run `npm run dev:all`, log in as each of the 4 demo roles, click every button on every page. This is the highest-value next step before calling it truly done.
2. **Set a real `ANTHROPIC_API_KEY`** in `server/.env` so AI features actually respond instead of showing the fallback message.
3. **Set a real `JWT_SECRET`** in `server/.env` before any non-local deploy (currently placeholder `replace-with-a-long-random-string`).
4. **Firebase Auth migration** — user wants to swap the custom JWT auth for Firebase Authentication (Spark/free plan supports this, no Blaze needed for Auth itself). Not started yet. Scope:
   - Frontend: replace `AuthScreen`'s calls to `api.login`/`api.signup` with Firebase Auth SDK (`signInWithEmailAndPassword`, `createUserWithEmailAndPassword`).
   - Backend: replace `requireAuth` in `server/routes/auth.js` (currently `jwt.verify`) with Firebase Admin SDK's `admin.auth().verifyIdToken(idToken)`.
   - Role/org_name/location/license_number (custom signup fields) need a home — either Firebase custom claims, or keep them in the existing SQLite `users` table keyed by Firebase UID instead of bcrypt password hash + auto-increment id.
   - Remove `bcryptjs`/`jsonwebtoken` deps and `password_hash` column once cut over.
5. **Backend hosting decision** — user wants Firebase Hosting (Spark, free) for the static frontend, but Spark can't run the Express+SQLite backend (no Node runtime on Spark Hosting; Functions/Cloud Run need Blaze). Recommended: **Fly.io** (free allowance, persistent volume so SQLite survives restarts, needs a card on file but $0 charge in free tier). Not started. Scope:
   - Write a `Dockerfile` for `server/` (doesn't exist yet).
   - Create a Fly volume, mount at `server/db/` so the SQLite file persists across deploys.
   - Set `JWT_SECRET`/`ANTHROPIC_API_KEY` as Fly secrets, not `.env` in prod.
   - Frontend needs a prod API base URL (something like `VITE_API_URL`) since Vite's dev proxy only works in `npm run dev` — production build must point at the Fly app's real URL instead of relative `/api/...`. Check `src/lib/api.js`'s `BASE` constant — currently hardcoded to `/api`, will need to become env-aware.
   - Alternative considered and rejected for now: Render free tier — no card needed but ephemeral disk wipes the SQLite file on every restart/redeploy. Acceptable for a demo, not for real user data, so Fly.io was the recommendation. Final call is the user's to make if priorities shift.

## Deferred by design — not bugs, documented in `docs/ROADMAP.md`

Password reset, email verification, refresh tokens, pagination on list endpoints, real map tiles (current map is SVG with real lat/lng plotted on it, not an actual map provider), supplier_requests → orders proper handoff (currently creates orders directly, skipping the request-acceptance step), ProfilePage settings panels are informational-only (no real backing logic for notification prefs/security/billing), no WebSockets (alerts/orders are poll-on-load).

## How to run it right now

```bash
npm install
cp server/.env.example server/.env   # then edit in real ANTHROPIC_API_KEY / JWT_SECRET if available
npm run dev:all                       # client on :5173, server on :4000, Vite proxies /api -> :4000
```

First run auto-creates and seeds `server/db/pharmaconnect.db`. Delete that file to reseed from scratch.

## Where things are (quick map)

```
src/App.jsx              — routing/auth shell only
src/pages/*.jsx           — one file per route, each fetches its own data
src/components/*          — Card, Btn, Badge, Nav, Logo, AlertMeta
src/lib/api.js            — fetch wrapper + api.* methods (one per backend endpoint)
src/lib/auth.jsx          — AuthProvider/useAuth — will need rework for Firebase Auth swap
src/lib/ai.js             — callAI(system, user) -> api.ai(...)
server/index.js           — Express app, route mounting, requireAuth gate
server/routes/auth.js     — signup/login/me + requireAuth middleware — will need rework for Firebase Auth swap
server/routes/*.js        — one per resource, see docs/API.md for exact shapes
server/db/schema.sql      — table defs
server/db/seed.js         — demo data, 4 accounts + sample inventory/orders/alerts
docs/                      — ARCHITECTURE, API, AI_INTEGRATION, AUTH, ROADMAP
```

Unrelated loose end from this session: user ran `firebase deploy --only hosting:pharmaton` against project `zentribe-e8ba2`, hit a transient network error, said "never mind, network issue" — not investigated further, likely not blocking.
