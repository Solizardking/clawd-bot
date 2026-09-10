#!/usr/bin/env bash
# Build a macOS .app + DMG for Clawd Bot (Grok-desktop-style drag-to-Applications).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
VERSION="${VERSION:-$(git -C "$ROOT" describe --tags --always --dirty 2>/dev/null || echo dev)}"
STAGE="$ROOT/build/dmg-stage"
APP="$STAGE/Clawd Bot.app"
CONTENTS="$APP/Contents"
MACOS="$CONTENTS/MacOS"
RES="$CONTENTS/Resources"
DMG="$ROOT/build/ClawdBot-${VERSION}.dmg"

rm -rf "$STAGE"
mkdir -p "$MACOS" "$RES/identity" "$RES/ui" "$RES/skills"

echo "🦞 Building Clawd Bot desktop binaries…"
mkdir -p "$ROOT/build"
( cd "$ROOT" && go build -trimpath -ldflags "-s -w" -o "$MACOS/clawdbot-desktop" ./cmd/clawdbot-desktop )
( cd "$ROOT" && go build -trimpath -ldflags "-s -w" -o "$MACOS/clawdbot" ./cmd/clawdbot )

cat > "$MACOS/Clawd Bot" << 'LAUNCH'
#!/bin/bash
DIR="$(cd "$(dirname "$0")" && pwd)"
export CLAWDBOT_IDENTITY_DIR="${CLAWDBOT_IDENTITY_DIR:-$DIR/../Resources/identity}"
export CLAWD_DESKTOP_UI="${CLAWD_DESKTOP_UI:-$DIR/../Resources/ui}"
export CLAWDBOT_CORE_AI_DIR="${CLAWDBOT_CORE_AI_DIR:-$DIR/../Resources/core-ai}"
exec "$DIR/clawdbot-desktop"
LAUNCH
chmod +x "$MACOS/Clawd Bot" "$MACOS/clawdbot" "$MACOS/clawdbot-desktop"

cp "$ROOT/desktop/Info.plist" "$CONTENTS/Info.plist"

for f in CLAWD.md CONSTITUTION.md SOUL.md IDENTITY.md six-laws.md strategy.md program.md schema.sql install.sh start.sh CLAWDBOT.md; do
  if [[ -f "$ROOT/$f" ]]; then
    cp "$ROOT/$f" "$RES/identity/"
  fi
done
cp "$ROOT/pkg/desktop/ui/index.html" "$RES/ui/index.html"

if [[ -d "${CLAWDBOT_CORE_AI_DIR:-}" ]]; then
  mkdir -p "$RES/core-ai"
  for pkg in helius-cli helius-cursor helius-mcp helius-plugin helius-skills knowledge mcp-server solana-mcp v3 scripts; do
    if [[ -d "$CLAWDBOT_CORE_AI_DIR/$pkg" ]]; then
      cp -R "$CLAWDBOT_CORE_AI_DIR/$pkg" "$RES/core-ai/"
    fi
  done
fi

if command -v node >/dev/null 2>&1; then
  node "$ROOT/scripts/bundle-skills.mjs" --out "$RES/skills/catalog.json" || true
fi

ln -s /Applications "$STAGE/Applications"

echo "📦 Creating DMG…"
rm -f "$DMG"
hdiutil create -volname "Clawd Bot" -srcfolder "$STAGE" -ov -format UDZO "$DMG" >/dev/null
echo "✓ $DMG"
ls -lh "$DMG"
