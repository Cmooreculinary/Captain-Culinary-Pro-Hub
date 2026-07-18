#!/usr/bin/env bash
set -euo pipefail

REMOTE_NAME="open-llm-vtuber"
UPSTREAM_URL="https://github.com/Open-LLM-VTuber/Open-LLM-VTuber.git"
PINNED_COMMIT="992309c0aa19845960228f880013d4685fde93b5"

REPO_ROOT="$(git rev-parse --show-toplevel)"
cd "$REPO_ROOT"

if git remote get-url "$REMOTE_NAME" >/dev/null 2>&1; then
  CURRENT_URL="$(git remote get-url "$REMOTE_NAME")"
  if [[ "$CURRENT_URL" != "$UPSTREAM_URL" ]]; then
    echo "Refusing to overwrite remote '$REMOTE_NAME' with unexpected URL: $CURRENT_URL" >&2
    exit 1
  fi
else
  git remote add "$REMOTE_NAME" "$UPSTREAM_URL"
fi

git fetch --filter=blob:none --no-tags "$REMOTE_NAME" "$PINNED_COMMIT"
FETCHED_COMMIT="$(git rev-parse FETCH_HEAD)"

if [[ "$FETCHED_COMMIT" != "$PINNED_COMMIT" ]]; then
  echo "Pinned commit verification failed" >&2
  exit 1
fi

echo "Verified $REMOTE_NAME at $FETCHED_COMMIT. No upstream files were checked out."
