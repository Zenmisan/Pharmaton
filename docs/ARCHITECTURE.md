# Architecture

## Overview

PharmaConnect AI is a two-tier app: a React SPA talking to an Express + SQLite API over JSON, with a single server-side proxy endpoint for AI calls.

```
┌─────────────────┐        /api/*  (proxied in dev by Vite)        ┌──────────────────┐
│  React (Vite)    │ ───────────────────────────────────────────▶ │  Express API      │
│  src/pages/*      │ ◀─────────────────────────────────────────── │  server/routes/*   │
│  src/lib/api.js   │              JSON over HTTP, JWT bearer       │  better-sqlite3    │
└─────────────────┘                                                └──────────────────┘
                                                                              │
                                                                              ▼
                                                                  server/db/pharmaconnect.db
                                                                              │
                                                                              ▼
                                                                   Anthropic API (server-side
                                                                   only, via /api/ai)
```

## Frontend

- `src/App.jsx` — top-level router/auth shell. Holds `page` state (string-keyed, no router library), renders `Landing` / `ChooseRole` / `AuthScreen` when signed out, or the role-specific page tree when signed in.
- `src/lib/auth.jsx` — `AuthProvider`/`useAuth()`. On mount, calls `api.me()` to restore a session from the JWT in `localStorage`. Exposes `login`, `signup`, `signOut`.
- `src/lib/api.js` — single fetch wrapper (`apiFetch`) plus an `api` object with one method per backend endpoint. Attaches `Authorization: Bearer <token>` automatically.
- `src/lib/ai.js` — `callAI(system, user)` calls `api.ai(...)`, which hits the backend AI proxy. Every page that needs an AI response calls this — never the Anthropic API directly.
- `src/components/` — shared UI primitives (`Card`, `Btn`, `Badge`, `Nav`, `Logo`) and small shared helpers (`AlertMeta.js`).
- `src/pages/` — one file per route. Each owns its own data fetching via `useEffect` + `api.*`.

No client-side router is used; navigation is a `page` string passed down and a `setPage` callback, matching the original single-file prototype's structure (kept intentionally simple — see [ROADMAP.md](ROADMAP.md) for if/when this should change).

## Backend

- `server/index.js` — Express app. Mounts one router per resource under `/api/*`. Everything except `/api/auth` and `/api/health` requires `requireAuth` (JWT verification middleware from `server/routes/auth.js`).
- `server/db/schema.sql` — table definitions (see [API.md](API.md) for the data shapes each route returns).
- `server/db/index.js` — opens the SQLite file at `server/db/pharmaconnect.db` (WAL mode, foreign keys on), runs the schema, and seeds demo data on first creation only.
- `server/db/seed.js` — inserts 4 demo users (one per role), several pharmacy/hospital/supplier locations, jittered inventory across 5 locations × 12 medicines, sample orders/requests/alerts/hospital needs.
- `server/routes/*.js` — one file per resource. Stats (inventory counts, pending orders, etc.) are computed from real rows via SQL/JS filters at request time — never hardcoded.

## Data flow example: medicine search

1. User types a query on `SearchPage` and hits search.
2. Two requests fire in parallel: `callAI(...)` (drug info/alternatives) and `api.search(q)` (real per-pharmacy stock).
3. `server/routes/search.js` runs a SQL join between `inventory` and `pharmacies` (`type = 'pharmacy'`), filtering by `LIKE`, ordered by stock — so results genuinely vary by pharmacy and query, not a fixed mock array.
4. Both responses render independently — if the AI call fails (e.g. no API key configured), the pharmacy results still show.

## Why no separate "client" and "server" repos

Single repo, single `npm install`, single `npm run dev:all` — appropriate for the current scale (one team, one deployable unit). See [ROADMAP.md](ROADMAP.md) for when this would change.
