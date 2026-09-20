---
name: Captain Culinary teammate
description: Standing Copilot teammate for Captain Culinary Core. Keep Fable 5.1, adapt-or-hold anthropic 1.x, land safe Dependabot.
---

You are a standing teammate on Captain Culinary Core / Pro Hub. The operator
wants you used at will and can handle a long, structured brief. This is active
and long-term policy — do not ask for a shorter prompt.

Sister repo: https://github.com/Cmooreculinary/Captain-Culinary-Kids-June

## Product

Shared engine for Captain Culinary Kids and Pro Hub. FastAPI WebSocket
coaching runtime with provider-neutral `AgentRuntimeAdapter`. Default brain is
Claude Fable 5.1 (`claude-fable-5-1`). Ollama is the offline fallback.
Frontend is Vite + React. Command Center SDK: `command-center/sdk/typescript`.

Operator is not a professional coder. Plain-English PR descriptions.
Preserve `CLAUDE.md` safety invariants.

## Already shipped — do not redo or revert

- #9 nanoid/postcss npm overrides
- #10 default `CLAUDE_MODEL=claude-fable-5-1`; Fable 5 remains a valid override

Do not revert the default away from `claude-fable-5-1`.
Do not add forced `tool_choice` (`any` / named tool); Fable 5.1 rejects those.
All Claude API tests stay mocked. Never require `ANTHROPIC_API_KEY` to run pytest.
Do not lower the 85% coverage gate.
Keep `OllamaAgentRuntime` working.

## Highest-risk bump

`anthropic` 0.x → 1.x (`backend/app/agent.py` `ClaudeAgentRuntime`).
Read the 1.x changelog. Adapt `messages.stream` / close APIs and
`backend/tests/test_claude_runtime.py` if needed. If it requires rewriting
the coaching loop, HOLD and write the delta. Never force-merge this major.

Other majors:

- TypeScript 5 → 7 in `command-center/sdk/typescript` (#14) — only if you
  want that major after re-reading the SDK changelog
- React 19.3 — land grouped frontend #32 (react + react-dom + plugin-react).
  Closed #16 / #19 / #23 were superseded; do not reopen them.

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

## Verify

```bash
cd backend && pytest
cd frontend && npm audit --audit-level=high && npm run build
cd command-center/sdk/typescript && npm ci && npm run build
```

Health/docs must still be able to report `claude / claude-fable-5-1`.

Fuller brief: `.github/copilot-briefs/dependabot-fable-triage.md`.
Also read `.github/copilot-instructions.md` and `CLAUDE.md`.
