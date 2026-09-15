# Launch audit — 15 September 2026

Status: **NOT READY for public production launch.**

Target: `codex/launch-audit-2026-09-15` → `main`.
Audited base: `737c053b9573ee986305ba88f7dd5193825fcbe0`.

## Verified scope

The repository calls itself Captain Culinary Core and explicitly restricts this implementation to a local controlled coaching prototype. It does not implement the complete professional product. README and GOVERNANCE remain authoritative for this checkout; no new platform architecture was chosen.

The former URL `https://livechef5.vercel.app` returned `404 DEPLOYMENT_NOT_FOUND` during direct browser inspection. The connected Vercel team returned an empty project list. No replacement deployment or production backend was identified.

## Fixes in this branch

- Malformed JSON and non-object WebSocket messages receive a recoverable error rather than terminating the session.
- Non-string coaching inputs are rejected rather than coerced into model requests.
- Response tasks are cancelled on every socket exit.
- Raw Ollama error payloads are no longer echoed to clients.
- Browser speech uses the current toggle preference after connection.
- Duplicate connections and overlapping UI submissions are blocked; provider errors clear unfinished output and allow retry.
- Camera capture has an explicit shutdown control that releases tracks.
- UI regressions run in CI.

## Verification

- Backend: **51 passed**, **92.04% coverage**, including permanent safety invariants and mocked Claude/Ollama adapters.
- Frontend: **4 passed** in jsdom, covering connection → send → streamed response → completion, current voice preference, interrupt, malformed responses, provider failure, duplicate connection suppression, and camera shutdown.
- Production TypeScript/Vite build: passed.
- No real provider credentials were used. A configured model name or health response does not prove provider availability.
- Local browser navigation was blocked by the environment (`ERR_BLOCKED_BY_CLIENT`). UI component tests are not a substitute for real browser/device acceptance.

## Remaining launch gates

1. **ARCHITECTURE-LEVEL — route through Conrad/EXPO:** identify the actual production Pro Hub source/deployment and approve its relationship to this shared prototype. Do not deploy the unauthenticated Core publicly.
2. **ARCHITECTURE-LEVEL — route through Conrad/EXPO:** authentication, session ownership, tenant boundaries, abuse controls, and any persistent product records are absent. No substitute identity system was invented.
3. Verify the configured model identifier against the real account and execute a real provider exchange. `claude-fable-5` is a repository default, not an independently verified available model.
4. Supply the approved BCA avatar asset and accepted speech-input/output implementation if required for the launch scope; the manifest currently disables those adapters. Camera transport does not perform visual reasoning.
5. After approved implementation, deploy a restricted staging instance; test provider failure, disconnect/reconnect, immediate interruption, explicit CORS, permission denial, camera release, and Safari/Chrome device behavior.
6. Establish the production domain/backend mapping and operational monitoring, then perform release acceptance on the deployed commit.

## Deployment notes

No production deployment, merge, credentials change, or architectural decision was made. Review and merge the bounded fixes separately from approval to launch. Frontend development dependencies changed for UI tests; a Render build consuming them must clear its build cache. No environment variables changed; any future Vercel environment change requires a redeploy without cache.
