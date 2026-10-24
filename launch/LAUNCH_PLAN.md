# Pro Hub — Launch Plan

Lead: Claude (Claude Code). Last updated: 2026-10-24.

## Where we stand

| Area | State | Launch-ready? |
|---|---|---|
| Backend tests | 7 suites pass, 92% coverage (85% floor) | Yes |
| Frontend build | Builds clean (Vite, 337 kB JS) | Yes |
| Coach (Claude + Ollama) | Works locally; safety suite pinned | Yes, locally |
| Screens (Stitch redesign, 16 routes) | Done | Mostly |
| **Login** | Fake — name saved in browser only, password ignored | **No** |
| **Payment** | Fake — hand-built card form, no charge | **No — must remove** |
| **Backend hosting** | None. README says "do not expose publicly" | **No** |
| **Backend abuse guard** | Origin check only. No login, no rate limit, no spend cap | **No** |
| **Cloudflare config** | `wrangler.jsonc` serves `frontend/` (source), not `frontend/dist`; no SPA fallback | **No** |
| **Terms / Privacy** | 3-line placeholders | **No** |
| Coach URL | Defaults to `ws://localhost:8000` | **No** |
| Open PRs | 1 Dependabot (fastapi #47) | Copilot |
| Stale issues | #25–#29, #34 (old Copilot runs) | Copilot |

### Why the card form must go

The payment screen asks for real card numbers in our own form. Even though
it sends nothing, a live app must never collect card data itself. Card entry
moves to a hosted checkout page (Stripe Checkout), so card numbers never
touch our code.

## Phases (one at a time, STOP + "go" between each)

| # | Phase | Owner | Needs operator? |
|---|---|---|---|
| 0 | This plan + agent briefs | Claude | No |
| 1 | Fix Cloudflare config, coach URL from env, remove card form | Claude | No |
| 2 | Real sign-in (hosted auth) + session token on the coach socket | Claude | Pick provider (one question) |
| 3 | Real payment: Stripe Checkout + webhook unlocks the program | Claude | Stripe account + connect Stripe |
| 4 | Host backend: rate limit, per-user daily spend cap, explicit origins | Claude | Pick host |
| 5 | Real Terms / Privacy / Refund / AI disclaimer | ChatGPT drafts, Claude wires in | **Lawyer review** |
| 6 | Second-opinion audit (security + launch readiness) | Gemini | No |
| 7 | Screen-by-screen UX + accessibility review | Astra | No |
| 8 | Launch marketing + social plan | Grok | Approve posts |
| — | Dependabot + stale issue cleanup (parallel) | Copilot | No |

Safety invariants in `CLAUDE.md` stay untouched in every phase.

## Agent briefs

Paste each file into its agent as-is. Bring results back to Claude for
checking before anything is merged or published.

- `briefs/chatgpt-legal.md` — Terms, Privacy, Refund, AI disclaimer drafts
- `briefs/gemini-audit.md` — independent security + launch audit
- `briefs/astra-ux.md` — screen-by-screen UX and accessibility review
- `briefs/grok-launch.md` — launch marketing, social, competitor pulse
- `briefs/copilot-cleanup.md` — Dependabot #47 + stale issues
