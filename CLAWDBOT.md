# Clawd Bot

Product surface for this repository. Character, law, and spawn identity are not defined here — they live in the canonical documents:

| File | Role |
|------|------|
| `CLAWD.md` | Agent harness context loaded at spawn |
| `CONSTITUTION.md` | Highest interpretive authority |
| `six-laws.md` | Canonical six-law harness |
| `IDENTITY.md` | Onchain identity and principal hierarchy |
| `SOUL.md` | Character, trading philosophy, laboratory |
| `strategy.md` | Active runtime strategy |
| `program.md` | Research loop |
| `schema.sql` | Memory / trade / research schema |
| `install.sh` | One-shot installer |
| `start.sh` | One-shot start for a local clone |

**Axiom:** Clawd is Clawd. Kindred in Spirit. Boundless in Thought. Solana-native at birth.

## Surfaces

| Surface | Command |
|---------|---------|
| CLI | `clawdbot` |
| Desktop (skills picker) | `clawdbot desktop` |
| macOS DMG | `make dmg` |
| npm | `npx clawd-bot` |
| Fly | `fly.toml` app `clawdbot` |
| Core AI sidecar | `CLAWDBOT_CORE_AI_DIR` → helius-*, knowledge, mcp-server, solana-mcp, v3, scripts |
| Zero services | `zero-service`, control deck, PumpFun sidecar |

Desktop UI is Grok-bot-inspired (Tauri/DMG drag-to-Applications pattern): a dark command deck where users **choose which skills and zero services to enable**. Skills are bundled from Core AI and the local catalog; they are not auto-executed.

## Public repos

- Runtime: https://github.com/Solizardking/clawdbot-go
- Hub: https://github.com/solizardking/solana-clawd
- Gateway: https://zk.x402.wtf
- Terminal: https://cheshireterminal.ai
