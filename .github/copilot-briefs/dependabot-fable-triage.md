# Copilot assignment brief — Dependabot + Fable 5.1 follow-through

Assign GitHub Copilot Coding Agent to this file’s checklist (open an issue,
paste this body, assign Copilot). Copilot should read
`.github/copilot-instructions.md` first, then execute this brief.

## Repos

- https://github.com/Cmooreculinary/Captain-Culinary-Pro-Hub  (this repo)
- https://github.com/Cmooreculinary/Captain-Culinary-Kids-June

## Mission

Keep Core mergeable and audited. Cap stays on `claude-fable-5-1`.
Ollama fallback stays working. 85% coverage gate stays. Claude tests stay mocked.

## Highest priority

Adapt or hold `anthropic` 0.x → 1.x (#17). Read the SDK changelog. Update
`backend/app/agent.py` `ClaudeAgentRuntime` and
`backend/tests/test_claude_runtime.py` if `messages.stream` changed.
If the coaching loop must be rewritten, HOLD and explain. Never force-merge.
CI green on #17 is not proof — Claude tests are mocked.

Then land safe patch/minors if CI is still green:
- frontend npm-patch-minor group #32 (react 19.3 + react-dom 19.3 +
  `@vitejs/plugin-react` together; this replaced closed #16 / #19 / #23)
- pytest-cov #30
- github/gh-aw-actions/setup #31
- dnspython #20, uvicorn #18
- actions/setup-node #11, actions/setup-python #12

HOLD TypeScript 7 (#14) unless you re-read the SDK changelog and want that
major. `command-center/sdk/typescript` CI is currently green.

Do not revert `CLAUDE_MODEL` default. Do not add forced `tool_choice`.
#2 (Cloudflare Workers) is merged on main (`wrangler.jsonc`). Do not revert it.
Memory PR #24 is already on `main`. Do not redo it.

## Verify

```bash
cd backend && pytest
cd frontend && npm audit --audit-level=high && npm run build
cd command-center/sdk/typescript && npm ci && npm run build
```

Health/docs must still be able to report `claude / claude-fable-5-1`.

## Stop condition

One or two focused PRs. PR body lists landed vs held. Then stop and wait
for a human merge.
