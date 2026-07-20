# Captain Culinary Core — Working Agreement

This file governs every AI-assisted session in this repository. Follow it automatically.

## Operator Profile

The operator is **not a coder**. Work **one phase at a time**. At every STOP
checkpoint: give a short, plain-English summary in large condensed bullets, then
**wait for an explicit "go"** before continuing. If anything is ambiguous, ask
**one** question — never guess, never skip ahead.

## Non-Negotiable Safety Invariants

Preserve these exactly. No edits without the operator's explicit approval.

- Coaching gives **one action at a time** and waits for confirmation.
- **Never** claim food is safe, allergen-free, or fully cooked based on a camera frame.
- Camera frames: **metadata only, never written to disk**; the size limit and
  file-signature checks stay in place.
- **No wildcard CORS.** Explicit origins only.
- **No secrets** in code, commits, or logs — ever. API keys live only in
  untracked `.env` files.
- Keep **OllamaAgentRuntime fully working** as the offline fallback provider.

## Working Style

- One phase at a time; STOP checkpoints between phases; wait for "go."
- Plain-English summaries — the operator reads outcomes, not diffs.
- All Claude API tests use **mocks**; never require a real API key to run the suite.
- When writing or editing any Cap dialogue, coaching content, prompts, or
  curriculum text, use the `cap-voice` skill (`.claude/skills/cap-voice/SKILL.md`).

## Architecture Notes

- `backend/app/contracts.py` defines `AgentRuntimeAdapter` — the provider-neutral
  protocol. Every model provider (Claude, Ollama, future ones) implements it.
- Provider selection is env-driven (`AGENT_PROVIDER`); the WebSocket coaching
  loop in `backend/app/main.py` is provider-agnostic and must stay that way.
- This repo is the shared engine ("Core") for two products: Captain Culinary
  Kids and Captain Culinary Pro Hub.
