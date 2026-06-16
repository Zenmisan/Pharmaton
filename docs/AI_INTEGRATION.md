# AI Integration

## Why a backend proxy, not a client-side API key

Earlier versions of this prototype called the Anthropic API directly from the browser with the API key embedded in client code — anyone could open devtools and steal the key. This is fixed: the key now lives only in `server/.env` (`ANTHROPIC_API_KEY`), and the frontend talks to `POST /api/ai` instead.

```
Frontend                         Backend                          Anthropic
─────────                        ───────                          ─────────
callAI(system, user)  ────────▶  POST /api/ai  ────────────────▶  POST /v1/messages
  (src/lib/ai.js)                (server/routes/ai.js)             model: claude-sonnet-4-5
                       ◀────────  { result: "<text>" }  ◀────────
```

The frontend never sees the API key, never sees raw Anthropic response shapes (errors are normalized into `{ result: "..." }` strings), and the call signature (`callAI(system, user)` → string) is identical to the old direct-call version, so no page component needed to change when this moved server-side.

## Model

`claude-sonnet-4-5`, `max_tokens: 1000`, single-turn (`system` + one `user` message — no conversation history is sent). Every AI feature in the app is a one-shot prompt, not a chat thread.

## Where AI is used

| Page | Purpose | Prompt style |
|---|---|---|
| `SearchPage` | Drug info, alternatives, safety notes, multilingual | Asks for strict JSON, parsed client-side; falls back to a plain-text summary if parsing fails |
| `PharmacistDashboard` | Demand insight / sourcing advice | Free-text, 2-3 sentences |
| `InsightsPage` | Market intelligence (pharmacist or supplier framing) | Free-text, 3-4 sentences |
| `HospitalDashboard` / `EmergencyPage` | Emergency sourcing — alternatives, supplier types, safety notes | Free-text, numbered/clinical tone |
| `SourcingPage` | Supplier-finding advice | Free-text, 4 sentences max |

## Multilingual responses

`SearchPage` passes the user's selected language (English, Yoruba, Hausa, Igbo, French) into both the `system` prompt ("Respond in `<lang>`") and the `user` message, so the AI's JSON field values (uses, safetyNote, etc.) come back in the requested language rather than just being labeled differently.

## Failure handling

- No `ANTHROPIC_API_KEY` set → server returns `{ result: "AI features require ANTHROPIC_API_KEY to be set in server/.env" }` with a `200`, so the UI shows a message instead of breaking.
- Anthropic returns an error → forwarded as `{ result: "AI error: <message>" }`.
- Network/fetch failure → `502` with `{ result: "AI unavailable..." }`.
- `src/lib/ai.js`'s `callAI` wraps the whole call in try/catch too, so even a thrown network error on the client side degrades to a string the page can render, never an unhandled exception.

## Setting it up

```bash
cp server/.env.example server/.env
# edit server/.env and set ANTHROPIC_API_KEY=sk-ant-...
```

No key is required to run or demo the rest of the app — only AI-dependent panels show the fallback message.
