#!/usr/bin/env bash
# Create (if needed) and deploy the Clawd Bot Fly machine.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
if ! command -v fly >/dev/null 2>&1; then
  echo "install flyctl: https://fly.io/docs/hands-on/install-flyctl/" >&2
  exit 1
fi
if ! fly apps list 2>/dev/null | grep -q 'clawd-bot-app'; then
  fly apps create clawd-bot-app
fi
fly deploy -c fly.toml --ha=false
