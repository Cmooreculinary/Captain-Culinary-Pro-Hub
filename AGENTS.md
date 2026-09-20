# Standing agent memory — Captain Culinary Core / Pro Hub

**GitHub Copilot is a standing teammate. Use it at will. This is active and
long-term policy — do not drop it between sessions.**

1. Copilot can take a long, structured brief. Prefer that over a one-liner.
2. Hand Copilot Dependabot triage, mechanical upgrades, and parallel PR work.
3. Keep safety invariants, Fable 5.1 default, and Ollama fallback here.
4. Do not add forced `tool_choice`. Claude tests stay mocked. Coverage 85%.

Load next:

- `CLAUDE.md` — working agreement and safety invariants
- `.github/copilot-instructions.md` — Copilot Coding Agent auto-loads this
- `.github/copilot-briefs/dependabot-fable-triage.md` — assignment brief
- `.github/agents/captain-culinary.agent.md` — custom Copilot agent
- `.cursor/rules/utilize-github-copilot.mdc` — every Cursor session
- `memory/COPILOT.md` — long-term operator memory

To start Copilot: merge the memory PR so instructions are on `main`, enable
coding agent in repo Settings if the Copilot assignee is missing, then
open https://github.com/copilot/agents , pick this repo, and paste
`Read .github/copilot-briefs/dependabot-fable-triage.md and do that.`
Or assign Copilot on https://github.com/Cmooreculinary/Captain-Culinary-Pro-Hub/issues/26

Sister repo: https://github.com/Cmooreculinary/Captain-Culinary-Kids-June
