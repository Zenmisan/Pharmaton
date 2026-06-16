# PharmaConnect AI

AI-powered medicine availability platform for Nigeria — connects patients, community pharmacists, hospital pharmacists, and suppliers/distributors through real-time inventory visibility, AI-assisted medicine search, and emergency sourcing.

## Stack

- **Frontend**: React 19 + Vite, Tailwind CSS v4, GSAP, lucide-react, MUI icons
- **Backend**: Node.js + Express 5, SQLite (better-sqlite3)
- **Auth**: JWT (signup/login), bcrypt password hashing
- **AI**: Anthropic Claude, proxied through a backend endpoint (`/api/ai`) so the API key never reaches the browser

## Project Structure

```
src/
  components/   shared UI (Card, Btn, Badge, Nav, Logo, AlertMeta)
  pages/         one file per route (SearchPage, MapPage, dashboards, etc.)
  lib/           api client, auth context, AI helper, gradients, utils
  App.jsx        routing/auth shell
server/
  db/            schema.sql, sqlite bootstrap, seed data
  routes/        auth, inventory, orders, supplier-requests, alerts,
                 hospital-needs, pharmacies, search, ai
  index.js       Express app entrypoint
```

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure the backend

```bash
cp server/.env.example server/.env
```

Edit `server/.env`:

```
PORT=4000
JWT_SECRET=replace-with-a-long-random-string
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

`ANTHROPIC_API_KEY` is optional for browsing the app — without it, AI features return a graceful "AI unavailable" message instead of crashing.

### 3. Run client + server together

```bash
npm run dev:all
```

This starts Vite on `http://localhost:5173` and the Express API on `http://localhost:4000`. The Vite dev server proxies `/api/*` to the backend, so the frontend just calls relative paths.

On first run, the SQLite database is created at `server/db/pharmaconnect.db` and seeded automatically with demo data (see below). Delete that file to reseed from scratch.

To run them separately:

```bash
npm run server   # Express API only
npm run dev      # Vite only
```

### 4. Build for production

```bash
npm run build
```

## Demo Accounts

All seeded accounts use the password `password123`:

| Role | Email | Notes |
|---|---|---|
| Patient | `amara@example.com` | Search medicines, browse map, view alerts |
| Community Pharmacist | `grace@example.com` | Manages "Grace Pharmacy" inventory |
| Hospital Pharmacist | `emeka@example.com` | "General Hospital Lagos" — critical needs, emergency sourcing |
| Supplier/Distributor | `medisupply@example.com` | "MediSupply Wholesalers" — incoming requests, stock |

You can also sign up a new account for any role from the landing page.

## Features

- **AI medicine search** — drug info, alternatives, safety notes, multilingual responses (English, Yoruba, Hausa, Igbo, French)
- **Real-time pharmacy search** — results pulled from actual seeded inventory across multiple pharmacies, not a fixed mock list
- **Interactive pharmacy map** — pharmacies plotted from real lat/lng with working Directions (Google Maps) and Call (`tel:`) links
- **Pharmacist dashboard** — live inventory stats, AI demand insights, inventory management (add/update medicines)
- **Hospital dashboard** — critical needs tracking, emergency AI sourcing assistant, verified supplier count
- **Supplier dashboard** — incoming pharmacy/hospital requests with accept/decline, stock management, order tracking
- **Order tracking** — end-to-end order lifecycle (Processing → Confirmed → In Transit → Delivered)
- **Safety alerts** — NAFDAC recall/shortage/safety notices with mark-as-read
- **Real authentication** — JWT-based signup/login per role, persisted sessions

See [docs/](docs/) for architecture, API reference, AI integration details, auth design, and roadmap.
