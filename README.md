# Captain Culinary Core

Captain Culinary Core is the BCA-owned shared engine that powers two products:

- **Captain Culinary Kids** — guided cooking confidence for young chefs.
- **Captain Culinary Pro Hub** — a live chef avatar, private-chef support, and professional instruction.

Cap — the coach — runs on a provider-neutral brain. The engine validates four
interaction patterns: streamed conversation, immediate mid-sentence
interruption, camera-frame transport without retention, and a provider-neutral
agent boundary owned by BCA.

## Switching Cap's brain (one line)

The model provider is chosen by a single line in `backend/.env`:

```bash
AGENT_PROVIDER=claude   # Claude Fable 5 via the Anthropic API (default)
AGENT_PROVIDER=ollama   # fully offline local fallback
```

With `claude`, set `ANTHROPIC_API_KEY` in `backend/.env` and optionally
`CLAUDE_MODEL` (default `claude-fable-5`). With `ollama`, set `OLLAMA_MODEL`
to an exact local model name from `ollama list`. `GET /health` reports the
active provider and model. Both providers implement the same
`AgentRuntimeAdapter` protocol (`backend/app/contracts.py`), so the coaching
loop never knows or cares which brain is plugged in.

## Safety boundary — unchanged

The safety invariants are identical no matter which provider runs:

- Coaching gives one action at a time and waits for confirmation.
- Cap never claims food is safe, allergen-free, or fully cooked from a camera frame.
- Camera frames are metadata only, never written to disk; size and
  file-signature checks are enforced.
- No wildcard CORS; explicit origins only. No secrets in code, commits, or
  logs — API keys live only in untracked `.env` files.

See `CLAUDE.md` for the full working agreement that governs AI-assisted
sessions in this repository.

## Repository layout

```text
backend/    FastAPI and WebSocket coaching runtime (Claude + Ollama runtimes)
command-center/ Versioned shared command contract and browser SDK
frontend/   React and Vite control surface
research/   Pinned upstream evaluation record
scripts/    Reproducible upstream-reference attachment
.claude/    Project skills (cap-voice: Cap's coaching voice rules)
```

## Captain Culinary Command Center

Every Captain Culinary application can inspect
`GET /command/v1/manifest` before starting a session. The manifest reports the
shared protocol version, active runtime, immutable safety boundary, and only
the interaction capabilities that are operational. The reusable browser client
lives in `command-center/sdk/typescript`.

The Command Center is additive. Captain Culinary Kids, Captain Culinary Pro
Hub, and Core remain separate products and keep ownership of their
product-specific consent, curriculum, progress, session-limit, and tool rules.

The shared SDK also defines provider-neutral speech-input and speech-output
adapter contracts. The manifest continues to report both as disabled until
real adapters are configured and tested; no speech provider is hard-wired.

## LOCAL EGG TEST

Exact copy-paste steps to run Cap on your own machine with Claude Fable 5.
Requirements: Python 3.11+ and Node.js 20.19+ (or 22.12+).
Start in the Captain Culinary Core repository root—the folder containing this
README.

1. Set up the backend (first time only):

   ```bash
   cd backend
   python -m venv .venv
   source .venv/bin/activate
   python -m pip install -r requirements.txt
   cp .env.example .env
   ```

2. Open `backend/.env` in any text editor. Find this blank line, place the
   cursor immediately after the `=`, and paste your Anthropic API key. Do not
   add quotes or spaces.

   ```bash
   ANTHROPIC_API_KEY=
   ```

   Leave `AGENT_PROVIDER=claude` and `CLAUDE_MODEL=claude-fable-5` as they are.

3. Start the backend:

   ```bash
   source .venv/bin/activate
   set -a
   source .env
   set +a
   uvicorn app.main:app --host 127.0.0.1 --port 8000
   ```

4. Open a second terminal at the Captain Culinary Core repository root, then
   start the frontend:

   ```bash
   cd frontend
   npm install
   cp .env.example .env.local
   npm run dev
   ```

5. Open `http://localhost:5173`. The status note should read
   **"Coach online: claude / claude-fable-5."**

6. Click **CONNECT LOCAL COACH**, then **START THE EGG TEST**. Cap should ask
   you to confirm the station is safe — one step at a time.

7. **Prove interruption works:** while Cap is mid-sentence, click
   **STOP RESPONSE**. The text should stop instantly and the transcript should
   show "Response stopped." Then keep cooking.

To run fully offline instead, set `AGENT_PROVIDER=ollama` and `OLLAMA_MODEL`
in `backend/.env` and restart the backend.

### Offline Continuity Mode

Ollama is the fully offline fallback. Current Ollama for macOS requires Sonoma
14 or newer; Intel Macs run CPU-only.

1. From the repository root, download and verify the selected model:

   ```bash
   ./scripts/install_continuity_model.sh
   ```

2. In `backend/.env`, set `AGENT_PROVIDER=ollama` and keep
   `OLLAMA_MODEL=qwen3:1.7b`.

The selected model is Qwen3 1.7B (1.4 GB, Q4_K_M). The backend caps it at
4,096 context tokens and disables extended thinking to protect memory and
response time on the 8 GB Intel continuity target. Restart the backend after
changing providers.

## Verify

```bash
cd backend
pytest          # all Claude API tests use mocks — no API key required

cd ../frontend
npm run build
```

The backend run enforces a minimum of **85% coverage** and includes the
permanent safety-invariant suite (`backend/tests/test_safety_invariants.py`),
which pins the non-negotiable rules from `CLAUDE.md`. GitHub Actions runs the
backend tests, the frontend build, and weekly dependency audits on every push
and pull request.

## Future deliverables note

The `document-skills@anthropic-agent-skills` plugin (PDF/XLSX/PPTX/DOCX
generation for the future Recipe Vault and training deliverables) was not
available in the cloud sandbox's plugin catalog. Install it locally later
with: `/plugin install document-skills@anthropic-agent-skills`.

## Safety and data boundary

This engine has no authentication, tenant isolation, persistent memory,
progress records, tool execution, or safety certification. It binds to
localhost in the documented commands. Camera frames are held only as
per-session metadata and are never written to disk. Do not expose it publicly
or use it for allergen decisions or production culinary-safety guidance.

## Upstream relationship

Open-LLM-VTuber is pinned as a read-only research reference at commit
`992309c0aa19845960228f880013d4685fde93b5`. Run
`scripts/attach_upstream_reference.sh` to add and verify the local Git remote
without checking out third-party source or character assets.

See `research/open-llm-vtuber-evaluation/UPSTREAM.md` for the exact boundary
and license record.

The model decision and hardware limits are recorded in `research/ollama-continuity-model.md`.
