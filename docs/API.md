# API Reference

Base URL (dev): `http://localhost:4000/api` (or just `/api` from the frontend, proxied by Vite).

All endpoints except `POST /auth/signup`, `POST /auth/login`, and `GET /health` require:

```
Authorization: Bearer <jwt>
```

Missing/invalid tokens return `401 { "error": "Missing token" }` or `401 { "error": "Invalid or expired token" }`.

## Auth

### `POST /auth/signup`
Body: `{ email, password, name, role, orgName?, location?, licenseNumber? }`
`role` must be one of `patient | pharmacist | hospital | supplier`.
Returns `{ token, user }`. `409` if email already registered.

### `POST /auth/login`
Body: `{ email, password }`
Returns `{ token, user }`. `401` on bad credentials.

### `GET /auth/me`
Returns `{ user }` for the current token.

`user` shape: `{ id, email, name, role, org_name, location, license_number, created_at }` (no `password_hash`).

## Search

### `GET /search?q=<term>`
Real per-pharmacy results — SQL join of `inventory` × `pharmacies` (`type = 'pharmacy'`), `name LIKE %q%`, ordered by stock descending.
Returns `{ pharmacies: [{ id, name, location, lat, lng, phone, nafdac_verified, rating, medicine, stock, price, status }] }`.

## Inventory (pharmacist's own pharmacy)

### `GET /inventory`
Returns `{ items, stats }` where `stats = { total, inStock, lowStock, outOfStock }`, computed live from the caller's pharmacy rows.

### `PATCH /inventory/:id`
Body: any of `{ stock, price, expiry, status }`. Returns `{ item }`.

### `POST /inventory`
Body: `{ name, stock?, price?, expiry?, status? }`. Returns `{ item }`. `400` if no pharmacy is linked to the account.

## Orders

### `GET /orders`
Suppliers see orders where they're `supplier_id`; everyone else sees orders where they're `buyer_id`. Joined with buyer/supplier names.
Returns `{ orders: [{ id, order_code, buyer_id, supplier_id, medicine, qty, status, eta, value, created_at, supplier_name, supplier_org, buyer_name, buyer_org }] }`.

### `POST /orders`
Body: `{ supplierId?, medicine, qty, value? }`. Generates an `order_code` (`ORD-XXXXX`), status starts at `Processing`. Returns `{ order }`.

### `PATCH /orders/:id`
Body: `{ status }` — one of `Processing | Confirmed | In Transit | Delivered`. Returns `{ order }`.

## Supplier requests

### `GET /supplier-requests`
Returns `{ requests, pendingCount }` for the current supplier.

### `PATCH /supplier-requests/:id`
Body: `{ status }` — `pending | accepted | declined`. Returns `{ request }`.

## Alerts

### `GET /alerts`
Returns `{ alerts: [{ id, type, title, body, tag, read, created_at }] }`.

### `POST /alerts/mark-all-read`
Marks every alert `read = 1`.

## Hospital needs

### `GET /hospital-needs`
Returns `{ needs, stats: { critical, total } }` for the current hospital account.

### `PATCH /hospital-needs/:id`
Body: `{ status }`. Returns `{ need }`.

### `POST /hospital-needs`
Body: `{ name, qty, priority }` (`priority` one of `CRITICAL | HIGH | MEDIUM`). Returns `{ need }`.

## Pharmacies / suppliers / hospitals directory

### `GET /pharmacies?type=<pharmacy|hospital|supplier>`
Returns `{ pharmacies }`, each with a computed `status` field (`In Stock | Low Stock | Out of Stock`) derived from that location's inventory.

### `GET /pharmacies/:id`
Returns `{ pharmacy, inventory }` — full detail + that location's stock list.

## AI proxy

### `POST /ai`
Body: `{ system, user }` — forwarded as Anthropic `system` + a single user message.
Returns `{ result: "<assistant text>" }`. If `ANTHROPIC_API_KEY` is unset or the call fails, returns a graceful fallback string instead of an error, so the UI never breaks on missing AI.

## Health

### `GET /health`
No auth required. Returns `{ ok: true }`.
