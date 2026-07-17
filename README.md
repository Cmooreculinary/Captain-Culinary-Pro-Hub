# Captain Culinary Pro Hub

Captain Culinary Pro Hub is the BCA-owned application surface for a live chef avatar, private-chef support, and professional instruction.

This first controlled spike validates four interaction patterns informed by Open-LLM-VTuber without importing its application, frontend, memory model, or character assets:

- streamed local Ollama conversation;
- immediate interruption while a response is streaming;
- camera-frame transport without retention;
- a provider-neutral agent boundary owned by BCA.

The spike is not the production Live Avatar Agent Engine. Architecture, avatar licensing, persistent memory, tool permissions, and Continuity Mode synchronization remain governed through Conrad/EXPO.

## Repository layout

```text
backend/    FastAPI and WebSocket coaching runtime
frontend/   React and Vite Trench Design control surface
research/   Pinned upstream evaluation record
scripts/    Reproducible upstream-reference attachment
```

## Run locally

Requirements: Python 3.11+, Node.js 20.19+ (or 22.12+), and a running Ollama installation with a locally available model.

1. Create the backend environment.

   ```bash
   cd backend
   python -m venv .venv
   source .venv/bin/activate
   python -m pip install -r requirements.txt
   cp .env.example .env
   ```

2. Set `OLLAMA_MODEL` in `backend/.env` to the exact local model name returned by `ollama list`.

3. Start the backend.

   ```bash
   set -a
   source .env
   set +a
   uvicorn app.main:app --host 127.0.0.1 --port 8000
   ```

4. Start the frontend in a second terminal.

   ```bash
   cd frontend
   npm install
   cp .env.example .env.local
   npm run dev
   ```

5. Open `http://localhost:5173`, choose **Connect**, then choose **Start the egg test**.

## Verify

```bash
cd backend
pytest

cd ../frontend
npm run build
```

## Safety and data boundary

This evaluation has no authentication, tenant isolation, persistent memory, progress records, tool execution, or safety certification. It binds to localhost in the documented command. Camera frames are held only as per-session metadata and are never written to disk. Do not expose this spike publicly or use it for CapKids, allergen decisions, or production culinary-safety guidance.

## Upstream relationship

Open-LLM-VTuber is pinned as a read-only research reference at commit `992309c0aa19845960228f880013d4685fde93b5`. Run `scripts/attach_upstream_reference.sh` from this repository to add and verify the local Git remote without checking out third-party source or character assets.

See `research/open-llm-vtuber-evaluation/UPSTREAM.md` for the exact boundary and license record.
