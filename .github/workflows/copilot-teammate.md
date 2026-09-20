---
description: Standing Copilot teammate — Dependabot land/adapt/hold for Pro Hub
on:
  workflow_dispatch:
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
max-turns: 40
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

First tool call: `gh pr list --state open --limit 20`. Do not list directories. Do not cat lockfiles.

HOLD: anthropic #17, TypeScript 7 #14.
Pick ONE land: react+#19 together, or dnspython #20, or uvicorn #18, or plugin-react #16, or setup-node #11 / setup-python #12.
Branch from origin/main. Do not revert Fable 5.1 or wrangler.jsonc.
Open one draft PR. Then stop.
