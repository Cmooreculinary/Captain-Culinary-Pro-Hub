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

## How to start a Copilot run (human click; this token cannot assign)

1. Merge the Copilot-memory PR if it is still open.
2. GitHub → Issues → New issue → **Assign Copilot** (or reuse issue #25).
3. Paste `.github/copilot-briefs/dependabot-fable-triage.md` into the body.
4. Assign **Copilot** as the assignee.

This Cursor cloud token **cannot** assign Copilot. GitHub requires a
user-to-server token with a Copilot license; `suggestedActors` for this
installation only returns `Cmooreculinary`, not `copilot-swe-agent`.

Briefed Hub issue (assign Copilot here):
https://github.com/Cmooreculinary/Captain-Culinary-Pro-Hub/issues/26

Stub to close (body is only "probe"):
https://github.com/Cmooreculinary/Captain-Culinary-Pro-Hub/issues/25

## Current Copilot brief (Pro Hub)

ADAPT OR HOLD: anthropic 0.x → 1.x (#17) in `backend/app/agent.py`.
HOLD or prove build: TypeScript 5 → 7 (#14) in command-center SDK.
LAND together: react + react-dom type bumps (#23 + #19).
LAND if CI green: dnspython, uvicorn, @vitejs/plugin-react, actions/setup-node 7,
actions/setup-python 7.
Do not mix PR #2 (Cloudflare Workers) unless a bump breaks it.
