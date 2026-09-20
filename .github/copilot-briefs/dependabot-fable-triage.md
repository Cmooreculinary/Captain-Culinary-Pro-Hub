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

Adapt or hold `anthropic` 0.x → 1.x. Read the SDK changelog. Update
`backend/app/agent.py` `ClaudeAgentRuntime` and
`backend/tests/test_claude_runtime.py` if `messages.stream` changed.
If the coaching loop must be rewritten, HOLD and explain. Never force-merge.

Then land safe patch/minors (dnspython, uvicorn, plugin-react, Actions).
Land react and react-dom bumps together. Hold TypeScript 7 in the SDK unless
`command-center/sdk/typescript` still builds.

Do not revert `CLAUDE_MODEL` default. Do not add forced `tool_choice`.
Do not mix PR #2 (Cloudflare Workers) unless a bump breaks it.

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
