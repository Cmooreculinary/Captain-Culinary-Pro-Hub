# GitHub Copilot instructions — Captain Culinary Core / Pro Hub

You are a standing teammate on this repo. This is active and long-term policy,
not a one-off. The operator wants you used at will and can handle a long,
structured brief. Do not ask for a shorter prompt. Do not wait to be re-asked.

Sister repo (Kids product that consumes this engine):
https://github.com/Cmooreculinary/Captain-Culinary-Kids-June

## Product

Shared engine for Captain Culinary Kids and Pro Hub. FastAPI WebSocket
coaching runtime with provider-neutral `AgentRuntimeAdapter`
(`backend/app/contracts.py`). Default brain is Claude Fable 5.1.
Ollama is the offline fallback. Frontend is Vite + React. Command Center
SDK: `command-center/sdk/typescript`.

Operator is not a professional coder. Plain-English PR descriptions.
Preserve `CLAUDE.md` safety invariants.

## Already shipped — do not redo or revert

- #9 nanoid/postcss npm overrides; `npm audit --audit-level=high` clean
- #10 default `CLAUDE_MODEL=claude-fable-5-1`; Fable 5 remains a valid override
- Some Dependabot already merged (fastapi, vite, pytest). Re-fetch `main`.

Do not revert the default away from `claude-fable-5-1`.
Do not add forced `tool_choice` (`any` / named tool); Fable 5.1 rejects those.
All Claude API tests stay mocked. Never require `ANTHROPIC_API_KEY` to run pytest.
Do not lower the 85% coverage gate.
Keep `OllamaAgentRuntime` working.

## Highest-risk bump

`anthropic` 0.x → 1.x (`backend/app/agent.py` `ClaudeAgentRuntime`).
This can break Fable streaming. Read the 1.x changelog. Adapt
`messages.stream` / close APIs and `backend/tests/test_claude_runtime.py`
if needed. If it requires rewriting the coaching loop, HOLD and write the delta.
Never force-merge this major.

Other majors to hold or adapt with proof:
- TypeScript 5 → 7 in `command-center/sdk/typescript` (#14) — only if you
  want that major after re-reading the SDK changelog (`npm run build` there
  is currently green)
- React 19.3: land grouped frontend #32 (react + react-dom + plugin-react
  together). Closed #16 / #19 / #23 were superseded by #32; do not reopen them.

Likely-safe after CI: frontend npm group #32, pytest-cov #30,
gh-aw-actions/setup #31, dnspython #20, uvicorn #18, actions/setup-node #11,
actions/setup-python #12.

#2 (Cloudflare Workers) is merged on main (`wrangler.jsonc`). Do not revert it.

## Hard nos

- No secrets in git, logs, or PR bodies
- No wildcard CORS
- No weakening `backend/tests/test_safety_invariants.py`
- No claiming food is safe / allergen-free / cooked from a camera frame
- Camera frames stay metadata only, never written to disk
- No drive-by product features

## Verify before you finish

```bash
cd backend && pytest
cd frontend && npm audit --audit-level=high && npm run build
cd command-center/sdk/typescript && npm ci && npm run build
```

Health/docs must still be able to report `claude / claude-fable-5-1`.

## How to work

1. Fetch `origin/main`.
2. Inventory open Dependabot PRs. Land safe patch/minors; adapt or hold majors.
3. Prefer one pip PR and one npm PR for compatible bumps.
4. Stop after that. Wait for a human merge.

A fuller operator brief lives in `.github/copilot-briefs/dependabot-fable-triage.md`.
