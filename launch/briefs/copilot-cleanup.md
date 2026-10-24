# Brief for GitHub Copilot — Dependabot + stale issue cleanup

Repo: `Cmooreculinary/Captain-Culinary-Pro-Hub`. Read `AGENTS.md`,
`CLAUDE.md`, `.github/copilot-instructions.md` first. Safety invariants and
the Claude/Ollama runtime design are off-limits.

## Task 1 — PR #47 (fastapi `>=0.143.3,<1.0`)

1. Check out the PR branch. Run `cd backend && pytest` (85% coverage floor,
   all Claude tests mocked — no API key).
2. Read the FastAPI release notes from 0.141.1 to 0.143.3 for WebSocket,
   CORS, or Starlette changes. `backend/app/main.py` uses both.
3. If green and no breaking notes: approve with a 3-line summary.
   If red: push the minimal fix on the same branch, or comment exactly why.

## Task 2 — Close stale issues

Issues #25, #26, #28, #29 (old Copilot-run failures, Sept 2026) and the
inventory #34: if every Dependabot PR they mention is now merged or
closed, close each with `state_reason: completed` and a one-line note.
Leave #27 ("Detection Runs") open if the agentic workflow still writes to it.

## Do not

- Touch `backend/tests/test_safety_invariants.py`, CORS, or camera-frame code.
- Add forced `tool_choice`. Change the default model.
- Merge anything — approve/comment only. Claude or the operator merges.
