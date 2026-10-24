# Brief for Gemini — Independent security + launch audit

You are a senior security engineer giving a **second opinion** on a launch.
Another AI (Claude) leads the build; your job is to find what it missed.
Be specific: file, line, problem, realistic attack or failure, fix.

## Repository

https://github.com/Cmooreculinary/Captain-Culinary-Pro-Hub (public). Read
`CLAUDE.md`, `README.md`, `backend/app/*.py`, `frontend/src/**`,
`wrangler.jsonc`, `.github/workflows/*`.

Stack: FastAPI + WebSocket coach (`backend/app/main.py`), provider adapters
for Claude and Ollama (`agent.py`, `contracts.py`), React 19 + Vite + Tailwind
frontend, Cloudflare Workers static hosting.

## Planned launch changes (audit these plans too)

1. Hosted auth; frontend gets a short-lived token; WebSocket requires it.
2. Stripe Checkout + signed webhook marks a user as paid.
3. Backend hosted publicly with per-user rate limit and daily AI spend cap.
4. Remove the hand-built card form in `PaymentScreen.tsx`.

## Check, in priority order

1. Can a stranger burn the Anthropic API budget? (WS auth, origin check
   `WS_ALLOW_MISSING_ORIGIN`, message size, session length, reconnect loops.)
2. Camera frame path: size limit + file-signature check — any bypass? Any
   path where a frame could reach disk or logs?
3. Secrets: anything in code, git history, CI logs, or the built JS bundle?
4. CORS + WebSocket origin handling — any wildcard or reflection?
5. Prompt injection: can user text or an image make Cap say food is safe /
   fully cooked / allergen-free, or skip "one step at a time"?
6. Frontend: XSS, unsafe `localStorage` trust (e.g. `paid: true` unlocking
   content), open redirects.
7. Cloudflare config: `wrangler.jsonc` assets dir and SPA routing.
8. CI/supply chain: pinned actions, Dependabot, lockfiles.

## Output

A table: `Severity (Critical/High/Medium/Low) | File:line | Problem | Fix`.
Then a "Launch blockers" list (Critical + High only). Do not pad with
generic advice; if something is fine, say so in one line.
