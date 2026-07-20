#!/usr/bin/env bash
set -euo pipefail

MODEL="qwen3:1.7b"
MIN_MACOS_MAJOR=14
MIN_MEMORY_BYTES=7516192768

if [[ "$(uname -s)" == "Darwin" ]]; then
  MACOS_VERSION="$(sw_vers -productVersion)"
  MACOS_MAJOR="${MACOS_VERSION%%.*}"
  if (( MACOS_MAJOR < MIN_MACOS_MAJOR )); then
    echo "BLOCKED: Ollama requires macOS Sonoma 14 or newer; this Mac reports ${MACOS_VERSION}." >&2
    echo "Do not bypass this gate with an unsupported Ollama build." >&2
    exit 2
  fi

  MEMORY_BYTES="$(sysctl -n hw.memsize)"
  if (( MEMORY_BYTES < MIN_MEMORY_BYTES )); then
    echo "BLOCKED: Captain Culinary Continuity Mode requires at least 7 GiB of physical memory." >&2
    exit 3
  fi
fi

if ! command -v ollama >/dev/null 2>&1; then
  echo "BLOCKED: Ollama is not installed or its CLI is not in PATH." >&2
  echo "Install the current release from https://ollama.com/download, open the app, then rerun this script." >&2
  exit 4
fi

echo "Downloading Captain Culinary Continuity Mode model: ${MODEL}"
ollama pull "${MODEL}"
ollama show "${MODEL}" >/dev/null

if ! ollama list | awk 'NR > 1 {print $1}' | grep -Fxq "${MODEL}"; then
  echo "Model verification failed: ${MODEL} is not listed by Ollama." >&2
  exit 5
fi

echo "READY: ${MODEL} is installed and verified for Captain Culinary Pro Hub."
