# Project instructions — Captain Culinary Core / Pro Hub

Shared source of truth for **Cursor**, **GitHub Copilot**, and humans.
GitHub is the shared project: code, issues, PRs, and these instructions.
Do not rely on chat memory across tools.

**GitHub Copilot is a standing teammate. Use it at will. This is active and
long-term policy — do not drop it between sessions.**

1. Copilot can take a long, structured brief. Prefer that over a one-liner.
2. Hand Copilot Dependabot triage, mechanical upgrades, and parallel PR work.
3. Keep safety invariants, Fable 5.1 default, and Ollama fallback here.
4. Do not add forced `tool_choice`. Claude tests stay mocked. Coverage 85%.

Sister product: https://github.com/Cmooreculinary/Captain-Culinary-Kids-June

## Who does what

| Tool | Role |
|---|---|
| **Cursor** | Local coding, navigation, tests, rapid iteration on a feature branch |
| **GitHub Copilot** | Repo-level review, issue/PR context, Dependabot triage, architecture questions |
| **GitHub** | Canonical code, history, issues, pull requests |
| **MCP** | Shared tools (GitHub, docs, deploy). Same servers in Cursor and Copilot; minimum permissions |

Do **not** have Cursor and Copilot edit the same branch at the same time.

## Load next

- `CLAUDE.md` — working agreement and safety invariants
- `.github/copilot-instructions.md` — Copilot Coding Agent auto-loads this
- `.github/copilot-briefs/dependabot-fable-triage.md` — assignment brief
- `.github/agents/captain-culinary.agent.md` — custom Copilot agent
- `.github/workflows/copilot-setup-steps.yml` — Copilot environment on `main`
- `.cursor/rules/utilize-github-copilot.mdc` — every Cursor session
- `memory/COPILOT.md` — long-term operator memory

## Workflow

1. Explain the plan before making significant changes.
2. Work on a feature branch off `main`. Never commit straight to `main`.
3. Run the relevant tests after edits.
4. Do not modify unrelated files.
5. Commit, push, open a PR. Ask Copilot (or a human) to review the branch.
6. Apply review fixes on the **same** branch; push; ask for review again.

### Cursor handoff (paste at the start of a Cursor session)

```
Work on the current feature branch.

First inspect:
- README.md
- CLAUDE.md
- AGENTS.md
- .github/copilot-instructions.md
- the relevant source files
- existing tests

Before editing, summarize:
1. The problem
2. The files you plan to change
3. The tests you will run

After editing:
1. Run the relevant tests
2. Show the test results
3. Summarize every changed file
4. Identify anything that still needs review
```

### Copilot handoff (after Cursor pushes)

```
Review the changes on branch <feature-name> against the default branch.
Focus on correctness, safety invariants, Fable 5.1, regressions, test
coverage, and whether the implementation follows AGENTS.md and CLAUDE.md.
```

### Start Copilot Coding Agent (human click)

Enable Copilot coding agent in repo Settings if the Copilot assignee is
missing. Memory PR #24 is already on `main`. Open
https://github.com/copilot/agents , pick this repo, and paste:

`Read .github/copilot-briefs/dependabot-fable-triage.md and do that. Open a pull request. Then stop.`

Or assign Copilot on https://github.com/Cmooreculinary/Captain-Culinary-Pro-Hub/issues/26

This public Hub repo does not yet show `copilot-swe-agent/copilot` (Kids does).

## Product

Shared engine for Captain Culinary Kids and Pro Hub. FastAPI WebSocket
coaching runtime with provider-neutral `AgentRuntimeAdapter`
(`backend/app/contracts.py`). Default brain is Claude Fable 5.1
(`CLAUDE_MODEL=claude-fable-5-1`). Ollama is the offline fallback.
Frontend is Vite + React. Command Center SDK: `command-center/sdk/typescript`.

## Tests (run these)

```bash
cd backend && pytest
cd frontend && npm audit --audit-level=high && npm run build
cd command-center/sdk/typescript && npm ci && npm run build
```

Health/docs must still be able to report `claude / claude-fable-5-1`.

## Hard nos

- No secrets in git, logs, or PR bodies.
- No wildcard CORS.
- Do not weaken `backend/tests/test_safety_invariants.py`.
- Do not claim food is safe / allergen-free / cooked from a camera frame.
- Camera frames stay metadata only, never written to disk.
- Do not revert `claude-fable-5-1`. Do not add forced `tool_choice`.
- Do not lower the 85% coverage gate. Keep Ollama working.

## Dependabot

Classify every bump: **land** / **adapt** / **hold**.

- ADAPT OR HOLD: anthropic 0.x → 1.x (#17) in `backend/app/agent.py`
  (CI green is not proof — Claude tests are mocked)
- HOLD TypeScript 5 → 7 (#14) unless you want that major after re-reading
  the SDK changelog (command-sdk CI is currently green)
- LAND if CI green: frontend npm group #32 (react 19.3 + react-dom 19.3 +
  plugin-react; superseded closed #16/#19/#23), pytest-cov #30,
  gh-aw-actions #31, dnspython #20, uvicorn #18, setup-node #11,
  setup-python #12

#2 (Cloudflare Workers) is merged on main (`wrangler.jsonc`). Do not revert it.

## MCP

If you add MCP servers, configure the **same** servers in Cursor and in
Copilot, with the minimum scopes needed. Do not store API keys in this repo.

## Operator

The operator is not a professional coder. Plain-English PR descriptions.
One focused PR. Stop after the asked work; do not start a new epic.
