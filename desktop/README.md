# Clawd Bot Desktop

Grok-bot-inspired macOS app: a dark command deck that hosts **Clawd Bot** with its constitution, Core AI skills, and zero services bundled so users can choose what to enable.

Identity is loaded from `CLAWD.md`, `CONSTITUTION.md`, `SOUL.md`, `IDENTITY.md`, `six-laws.md`, `strategy.md`, `program.md`, `schema.sql`, `install.sh`, and `start.sh`.

## Run locally

```bash
clawdbot desktop
# or
go run ./cmd/clawdbot-desktop
```

## DMG

```bash
make dmg
# → build/ClawdBot-<version>.dmg
```

Drag **Clawd Bot.app** into Applications. Unsigned local builds need Gatekeeper approval on first open (`xattr -cr "/Applications/Clawd Bot.app"`).

Core AI packages are copied into the bundle when `CLAWDBOT_CORE_AI_DIR` points at the Core AI tree (helius-cli, helius-mcp, v3, …).
