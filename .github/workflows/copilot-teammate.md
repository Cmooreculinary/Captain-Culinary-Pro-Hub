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

First tool: `gh pr list --state open --limit 20`. Second: `gh pr checkout 32` (npm group: react+react-dom+plugin-react) or `gh pr checkout 20` (dnspython). Do not ls trees. Do not cat lockfiles.

HOLD: anthropic #17, TypeScript 7 #14.
LAND if green: #32 (react 19.3 + react-dom 19.3 + plugin-react together), pytest-cov #30, gh-aw-actions #31, dnspython #20, uvicorn #18, setup-node #11, setup-python #12.
Closed #16/#19/#23 were superseded by #32; do not reopen them.
If checkout+tests pass, open one draft PR from that work (or noop if the Dependabot PR is already merge-ready).
Do not revert Fable 5.1 or wrangler.jsonc. Then stop.
