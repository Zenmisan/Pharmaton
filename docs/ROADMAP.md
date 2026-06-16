# Roadmap

Status as of this MVP: every page is wired to the real backend (no hardcoded/mock data left in the UI), real auth, AI calls proxied securely. What's intentionally deferred:

## Near-term (post-MVP polish)

- **Password reset / email verification** — not implemented; signup/login only.
- **Refresh tokens** — JWTs are 7-day, non-renewing; users must re-login after expiry.
- **Pagination** — all list endpoints (`/orders`, `/alerts`, `/inventory`, etc.) return full result sets. Fine at demo/seed scale, will need limits + cursors at real scale.
- **Order → supplier_requests linkage** — `EmergencyPage`/`SourcingPage`'s "Request Supply" currently creates an `orders` row directly; a real flow would create a `supplier_requests` row that the supplier accepts/declines, which *then* creates the order.
- **Real map / geocoding** — `MapPage` plots seeded `lat`/`lng` on a hand-drawn SVG "mock map" background, not an actual map tile provider. Directions/Call links are real (Google Maps search + `tel:`), but there's no live map rendering, routing, or distance calculation.

## Medium-term

- **Notifications/Security/Language/Billing panels on `ProfilePage`** — currently lightweight, real-content expandable panels (not fake settings UIs), but none of them have actual backing functionality yet (e.g. there's no real password-change endpoint, no real notification preferences table).
- **Client-side router** — navigation is currently a `page` string + `setPage` callback threaded through `App.jsx`, not React Router. Fine for this size of app; would need revisiting if the page count grows much further or deep-linking/back-button support becomes a requirement.
- **Multi-location pharmacies** — schema assumes one `pharmacies` row per owner account; real pharmacy chains would need a many-to-many owner↔location model.

## Long-term / scale

- **Move off SQLite** — `better-sqlite3` is great for single-instance deployment but doesn't support concurrent writers across multiple server processes. Postgres (or similar) would be needed before horizontally scaling the API.
- **Split into separate deployable services** — currently one repo, one process model (`npm run dev:all` runs client+server together). At larger team size, splitting client/server into separate deploy pipelines may be worth the added complexity.
- **Conversation memory for AI features** — every AI call today is single-turn (no chat history). A persistent "ask follow-up" experience would need session-scoped conversation state.
- **Real-time updates** — alerts/orders/requests are all poll-on-load; no websockets/SSE. A live "new request just came in" badge would need a push mechanism.

## Explicitly out of scope for this MVP (by design, not oversight)

- Payments/billing — accounts are free during the pilot; no Stripe/payment integration exists or is planned for v1.
- Native mobile apps — web-only, responsive layout.
