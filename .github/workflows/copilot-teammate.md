---
description: Standing Copilot teammate — Dependabot land/adapt/hold for Pro Hub
on:
  workflow_dispatch:
  push:
    branches: [cursor/copilot-working-memory-2129]
    paths:
      - .github/workflows/copilot-teammate.md
      - .github/workflows/copilot-teammate.lock.yml
  bots: [cursor]
  roles: all
permissions:
  contents: read
  issues: read
  pull-requests: read
  actions: read
  copilot-requests: write
engine:
  id: copilot
  model: gpt-4.1
max-turns: 15
strict: true
timeout-minutes: 20
safe-outputs:
  create-pull-request:
    title-prefix: "[Copilot] "
    draft: true
    max: 1
tools:
  github:
    toolsets: [default, pull_requests]
  bash:
    - gh *
    - git *
    - pytest *
    - npm *
---

# Copilot teammate — Pro Hub Dependabot follow-through

Standing teammate. Inventory with `gh pr list --state open --limit 30` only.
Do not cat lockfiles.

Do not revert `CLAUDE_MODEL=claude-fable-5-1`, forced `tool_choice`, or `wrangler.jsonc`.
HOLD: anthropic 1.x (#17) unless you can adapt `ClaudeAgentRuntime` with tests.
HOLD: TypeScript 7 (#14) unless `command-center/sdk/typescript` still builds.
If you land anything, land at most one focused group (react+react-dom together, or a pip patch).
Work from origin/main on a new branch. Then stop.
