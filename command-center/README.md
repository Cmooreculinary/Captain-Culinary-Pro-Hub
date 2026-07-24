# Captain Culinary Command Center

Captain Culinary Command Center is an additive control boundary over Captain
Culinary Core. It does not rename, replace, or absorb Captain Culinary Kids,
Captain Culinary Pro Hub, or Core.

The first version establishes one versioned contract that every Captain
Culinary application can inspect before opening a live session:

- `GET /command/v1/manifest` reports the protocol version, active runtime,
  endpoints, safety boundary, and capabilities that are actually operational.
- `GET /health` reports Core health.
- `WS /ws/coach/{session_id}` provides streamed text, immediate interruption,
  and validated camera transport without retention.
- `sdk/typescript` provides the shared browser client used by Captain Culinary
  application interfaces.

Version 1.1 adds provider-neutral `SpeechInputAdapter` and
`SpeechOutputAdapter` contracts. Applications can use the same microphone,
transcript, speech, and interruption interface while the underlying provider
remains replaceable. No provider implementation or credential is embedded in
the SDK.

## Current capability boundary

Operational now:

- streamed text interaction;
- interruption;
- JPEG, PNG, and WebP camera-frame validation and transport;
- zero camera-frame retention; and
- explicit reporting of the active Claude or Ollama runtime.

Not represented as complete:

- audio input or output until configured adapters are supplied;
- camera-based vision reasoning;
- avatar rendering;
- automatic cloud-to-local handoff; or
- application-specific consent, session, curriculum, progress, or tool policy.

Each product continues to own its product-specific rules. The Command Center
publishes the shared transport and immutable safety boundary.

## Browser SDK

```bash
cd command-center/sdk/typescript
npm install
npm run build
```

The package uses the browser's native `fetch` and `WebSocket` implementations
and contains no secrets or provider credentials.
