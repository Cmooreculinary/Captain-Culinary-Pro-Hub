---
description: Standing Copilot teammate — Dependabot land/adapt/hold for Pro Hub
on:
  workflow_dispatch:
  push:
    branches: [cursor/copilot-hub-brief-refresh-2129]
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
max-turns: 20
strict: true
timeout-minutes: 20
network:
  allowed:
    - defaults
    - github
    - copilot
    - node
    - python
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
---

# Copilot teammate — Pro Hub Dependabot follow-through

Bash only allows `gh` and `git`. `ls`, `cat`, and `find` are blocked. Do not retry them.

Do exactly this, then stop:

1. `gh pr list --state open --limit 20 --json number,title,mergeable,mergeStateStatus`
2. Write `memory/COPILOT-LAST-RUN.md` with a land/hold table:
   - HOLD: anthropic #17, TypeScript 7 #14
   - LAND (already CI-green): frontend group #32, pytest-cov #30, gh-aw-actions #31, dnspython #20, uvicorn #18, setup-node #11, setup-python #12
   - Closed, do not reopen: #16 #19 #23
   - Cap stays `claude-fable-5-1`. Do not revert `wrangler.jsonc`.
3. Call `create_pull_request`. Title: `[Copilot] Dependabot land/hold inventory`. Then stop.

Do not checkout other PRs. Do not edit application code.
