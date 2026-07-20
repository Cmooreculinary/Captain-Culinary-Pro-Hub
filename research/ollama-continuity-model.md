# Captain Culinary Continuity Mode model selection

Decision date: 2026-07-19

## Selected model

`qwen3:1.7b`

Verified Ollama registry metadata at selection time:

- download size: 1.4 GB;
- actual parameter count: 2.03B;
- quantization: Q4_K_M;
- capabilities: tools and controllable thinking;
- license: Apache License 2.0.

## Target profile

This selection is for the known Captain Culinary continuity target: late-2014 Intel Mac mini, 8 GB non-upgradable memory, CPU-only inference, and mechanical USB storage.

The application sets:

- `OLLAMA_CONTEXT_TOKENS=4096` to constrain runtime memory;
- `OLLAMA_THINK=false` to reduce first-token latency and avoid long reasoning traces during live coaching;
- cloud routing for advanced reasoning, coding, image analysis, and other work beyond the continuity envelope.

## Rejected defaults

- 7B/8B models: too heavy for the 8 GB Intel target and incompatible with responsive live coaching.
- Gemma 3 1B: smaller, but the selected Qwen model provides a stronger agent and instruction-following envelope at a still-manageable download size.
- Llama 3.2 3B: capable, but its 2.0 GB package leaves less operating headroom and is expected to respond more slowly on the CPU-only target.

## Installation gate

Current Ollama system requirements specify macOS Sonoma 14 or newer. The known Mac currently runs Ventura 13 through OpenCore Legacy Patcher, so the installer must stop until the host is on a supported macOS release or an approved Linux continuity host is selected.

This model is the offline continuity engine, not BCA's cloud reasoning authority or Second Brain knowledge layer. Changing the shared Local Ollama Brain, cross-product routing, memory ownership, or synchronization design is architecture-level and routes through Conrad/EXPO.
