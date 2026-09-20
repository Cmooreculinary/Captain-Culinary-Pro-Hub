# ACTIVE + LONG-TERM MEMORY — GitHub Copilot

**Do not forget this between sessions.** The operator (Chris Moore) has GitHub
Copilot and wants it **used at will**. This is standing policy, not a one-off
request. Keep it in active session goals and in this file forever.

## Standing practice

1. Do not treat Copilot as unavailable. Do not wait to be re-asked.
2. Copilot can handle a long, complex brief. Prefer a structured prompt over a
   one-liner.
3. Hand Copilot Dependabot triage, mechanical upgrades, and parallel PR work.
4. Keep safety invariants, Fable/Ollama runtime design, and product judgment
   with the Cursor agent.
5. Cap stays on `claude-fable-5-1`. Do not add forced `tool_choice`.

## Where this is stored (load all of them)

| Surface | Who reads it |
| --- | --- |
| `AGENTS.md` | Copilot + Cursor |
| `CLAUDE.md` | Every AI session in this repo |
| `.github/copilot-instructions.md` | Copilot Coding Agent (auto-load) |
| `.github/agents/captain-culinary.agent.md` | Copilot custom agent picker |
| `.github/copilot-briefs/dependabot-fable-triage.md` | Paste into an issue |
| `.github/ISSUE_TEMPLATE/copilot-task.yml` | New issue → **Assign Copilot** |
| `.cursor/rules/utilize-github-copilot.mdc` | Every Cursor session (`alwaysApply`) |
| this file | Long-term operator memory |

Sister repo: https://github.com/Cmooreculinary/Captain-Culinary-Kids-June

## Copilot enablement (this repo)

This public Hub repo does **not** currently show GitHub’s
`copilot-swe-agent/copilot` dynamic workflow (Kids already does). Enable
Copilot coding agent for this repository while logged in as Chris:
repo **Settings → Copilot → coding agent**, then merge memory PR #24 so
`copilot-instructions.md`, the custom agent, and `copilot-setup-steps.yml`
land on `main`.

Cursor Cloud Agent tokens (`ghs_` GitHub App installs) **cannot assign**
Copilot. A one-shot Actions job using `GITHUB_TOKEN` also cannot: GraphQL
`suggestedActors(CAN_BE_ASSIGNED)` only returns `Cmooreculinary` (no
`copilot-swe-agent`), REST `agent_assignment` is 403, and Copilot PR review
requests 422 (not a collaborator). The agent-tasks API needs a user token
with a Copilot license. A human logged in as Chris, or a user PAT, can start
it.

## How to start a Copilot run (human click)

Do this while logged in as Chris:

1. Merge memory PR #24 so Copilot loads instructions from `main`.
2. Open https://github.com/copilot/agents
3. Choose **Captain-Culinary-Pro-Hub**
4. Paste: `Read .github/copilot-briefs/dependabot-fable-triage.md and do that. Open a pull request. Then stop.`
5. Start the task

Or assign **Copilot** on the already-briefed issue:
https://github.com/Cmooreculinary/Captain-Culinary-Pro-Hub/issues/26

Close stub https://github.com/Cmooreculinary/Captain-Culinary-Pro-Hub/issues/25
(body is only `probe`).

## Current Copilot brief (Pro Hub)

ADAPT OR HOLD: anthropic 0.x → 1.x (#17) in `backend/app/agent.py`.
HOLD or prove build: TypeScript 5 → 7 (#14) in command-center SDK.
LAND together: react + react-dom type bumps (#23 + #19).
LAND if CI green: dnspython, uvicorn, @vitejs/plugin-react, actions/setup-node 7,
actions/setup-python 7.
#2 (Cloudflare Workers) is merged on main (`wrangler.jsonc`). Do not revert it.
