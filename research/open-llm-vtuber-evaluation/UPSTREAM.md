# Open-LLM-VTuber upstream record

## Verified source

- Repository: `https://github.com/Open-LLM-VTuber/Open-LLM-VTuber.git`
- Pinned commit: `992309c0aa19845960228f880013d4685fde93b5`
- Commit date: 2026-05-15
- Version declared at the pinned commit: `1.2.1`
- Backend license at the pinned commit: MIT, excluding separately governed Live2D sample models

## BCA usage boundary

The upstream repository is a research reference, not Captain Culinary Pro Hub's source of truth and not a runtime dependency of this spike.

Patterns evaluated here:

- per-session service context;
- message-type WebSocket routing;
- streamed model output;
- interruption signals;
- image transport;
- replaceable agent providers.

Items intentionally excluded:

- the upstream web or Electron frontend;
- Live2D sample models or character assets;
- local JSON history as BCA memory;
- upstream MCP permissions;
- production authentication, tenancy, persistence, or synchronization decisions.

The upstream maintainers state that v2 is planned as a complete rewrite while v1 remains in maintenance. BCA therefore owns the contracts in this repository and does not couple them to upstream internal module paths.

## Refresh procedure

Do not silently advance the pinned commit. Review upstream license files, security posture, protocol changes, and asset terms first. Any change to the repository import strategy, engine boundary, memory ownership, permissions, or Continuity Mode synchronization is architecture-level and must route through Conrad/EXPO.
