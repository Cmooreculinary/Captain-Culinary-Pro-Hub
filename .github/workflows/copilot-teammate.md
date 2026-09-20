---
description: Standing Copilot teammate — Dependabot land/adapt/hold for Pro Hub
on:
  workflow_dispatch:
  push:
    branches: [cursor/copilot-working-memory-2129]
    paths:
      - .github/workflows/copilot-teammate.md
      - .github/workflows/copilot-teammate.lock.yml
permissions:
  contents: read
  issues: read
  pull-requests: read
  actions: read
  copilot-requests: write
engine:
  id: copilot
strict: true
timeout-minutes: 25
safe-outputs:
  create-pull-request:
    title-prefix: "[Copilot] "
    draft: true
    max: 1
tools:
  github:
    toolsets: [default, pull_requests]
  bash:
    - "*"
---

# Copilot teammate — Pro Hub Dependabot follow-through

You are GitHub Copilot, a standing teammate on Captain Culinary Pro Hub.
Read `.github/copilot-instructions.md` and `.github/copilot-briefs/dependabot-fable-triage.md` first.

Work from `origin/main` on a **new branch**. Do not commit onto `cursor/copilot-working-memory-2129`.
Do not revert `CLAUDE_MODEL=claude-fable-5-1`. Do not add forced `tool_choice`.
Do not revert merged Cloudflare Workers (`wrangler.jsonc`).

ADAPT OR HOLD: anthropic 0.x → 1.x in `backend/app/agent.py`.
HOLD or prove build: TypeScript 5 → 7 in command-center SDK.
LAND together: react + react-dom type bumps.
LAND if CI green: dnspython, uvicorn, @vitejs/plugin-react, actions/setup-node, actions/setup-python.

Verify: `cd backend && pytest`, `cd frontend && npm audit --audit-level=high && npm run build`, `cd command-center/sdk/typescript && npm ci && npm run build`.
Health/docs must still be able to report `claude / claude-fable-5-1`.
Open one focused PR. Then stop.
