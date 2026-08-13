# MIGRATE.md

> One-shot move from **OpenClaw**, **Hermes Agent**, **Grok bot / xAI CLI**, and other personal-agent stacks into **ClawdBot** (this repo: [clawdbot-go](https://github.com/Solizardking/clawdbot-go)).
>
> Fresh install with no prior agent? Skip this file and use [README.md](README.md#️-quick-start).

Clawd is Grok-first, Solana-native, and bound by the six-law harness. Your persona, memory, skills, MCP servers, and API keys come with you. Live wallets, channel logins, and SQLite session DBs do **not** get copied blindly.

## One shot

Stop the old gateway. Install Clawd. Import the source tree. Verify. Do not delete the old home until `clawdbot doctor` is green.

```bash
# 1. Stop the source (pick the one you actually run)
openclaw gateway stop 2>/dev/null || true
hermes gateway stop 2>/dev/null || true

# 2. Snapshot the source (encrypted disk / 700 dir — this tree has secrets)
mkdir -p ~/Backups/clawd-migrate
tar -czf ~/Backups/clawd-migrate/source-$(date -u +%Y%m%dT%H%M%SZ).tar.gz \
  -C "$HOME" .openclaw .hermes .grok .moltbot .clawdbot .agents 2>/dev/null || true

# 3. Install Clawd (complete stack: core-ai MCP + Vulcan)
curl -fsSL https://install.onchainai.fund | CLAWDBOT_INSTALL_COMPLETE=1 bash
# aliases:
#   curl -fsSL https://install.cheshireterminal.ai | CLAWDBOT_INSTALL_COMPLETE=1 bash
#   npx clawdbot-install --complete

# 4. Import (preview, then apply)
IMPORT=~/.clawdbot/src/scripts/migrate-into-clawd.sh
# from a git checkout instead: IMPORT=./scripts/migrate-into-clawd.sh
bash "$IMPORT" --dry-run
bash "$IMPORT" --apply --overwrite-persona          # add --migrate-secrets to copy API keys

# 5. Verify
source ~/.clawdbot/.env
clawdbot version
clawdbot doctor
clawdbot catalog
clawdbot dna show
clawdbot agent -m "who are you and what laws bind you"
```

Install writes the runtime under `~/.clawdbot/src`. If you cloned this repo instead, run `scripts/migrate-into-clawd.sh` from the checkout. Flags: `--source DIR`, `--overwrite-persona`, `--migrate-secrets`.

---

## What you land on

| Clawd surface | Path / command | Role |
|---|---|---|
| Home | `~/.clawdbot` (`CLAWDBOT_HOME`) | Config, `.env`, MCP seed, core-ai sidecar |
| Workspace | `~/.clawdbot/workspace/` | Persona, memory, skills, DNA, ClawVault |
| Config | `~/.clawdbot/config.json` | Runtime schema (`pkg/migrate` versions it) |
| MCP seed | `~/.clawdbot/core-ai.mcp.json` | Helius, pump, zkcompression, Robinhood Agentic, ClawdBrowser |
| Skills catalog | `CLAWDBOT_SKILLS_DIR` (default `~/skills/skills`) | Local skill discovery |
| Agents catalog | `CLAWDBOT_AGENTS_DIR` (default `~/agents/agents/src`) | Agent JSON defs |
| Grok CLI seed | `./.grok/config.toml` in a checkout | xAI / Robinhood connector |
| REPL | `clawdbot agent` | Free via zkrouter, or your `XAI_API_KEY` |
| Grok deck | `go run ./cmd/clawd-frontend` | grok-4.6 command deck (replaces grok.com chat for this stack) |
| Zero engine | `clawdbot zero {run\|ask\|verify}` | Flat-loop attested runs — [docs/ZERO.md](docs/ZERO.md) |
| Paper trading | `clawdbot ooda --sim` | Default until you arm live gates |
| Terminal | https://cheshireterminal.ai | Public surface |
| Gateway | https://zk.x402.wtf | x402 + zk + public RPC |

Spawn still inherits `CONSTITUTION.md`, `six-laws.md`, `three-laws.md`, `CLAWD.md`. Imported `SOUL.md` / `IDENTITY.md` / `USER.md` sit **under** those laws, they do not replace them.

---

## Detect the source

The importer checks these homes in order. Override with `--source`.

| Origin | Default home | Config | Persona |
|---|---|---|---|
| **OpenClaw** | `~/.openclaw` (`OPENCLAW_STATE_DIR`) | `openclaw.json` | `workspace/{SOUL,IDENTITY,USER,MEMORY,TOOLS,AGENTS}.md` |
| **Hermes Agent** | `~/.hermes` | `config.yaml` + `.env` | `SOUL.md`, `memories/{MEMORY,USER}.md` |
| **Grok / xAI CLI** | `~/.grok` | `config.toml` | (no SOUL — keys + MCP only) |
| **Legacy Clawdbot / Moltbot** | `~/.clawdbot` or `~/.moltbot` | `clawdbot.json` / `moltbot.json` | same workspace files as OpenClaw |
| **Claude Code / Codex / Cursor** | `~/.claude`, `~/.codex`, project `.agents/` | MCP JSON / `config.toml` | skills under `.claude/skills`, `.agents/skills` |
| **elizaOS** | project `characters/` | `character.json` | map into `IDENTITY.md` + catalog JSON |
| **Telegram / Discord bot** | bot process env | `BOT_TOKEN` | channels only |

Profiles: OpenClaw `--profile work` uses `~/.openclaw-work/` (or `OPENCLAW_STATE_DIR`). Pass `--source` at that path. Recent OpenClaw may use `workspace-main/` or `workspace-{agentId}/` instead of `workspace/` — the importer tries all three.

---

## What maps where

### OpenClaw → Clawd

| What | Source | Destination |
|---|---|---|
| Persona | `workspace/SOUL.md` | `~/.clawdbot/workspace/SOUL.md` |
| Identity | `workspace/IDENTITY.md` | `~/.clawdbot/workspace/IDENTITY.md` |
| User profile | `workspace/USER.md` | `~/.clawdbot/workspace/USER.md` |
| Tool notes | `workspace/TOOLS.md` | `~/.clawdbot/workspace/TOOLS.md` |
| Long-term memory | `workspace/MEMORY.md` | `~/.clawdbot/workspace/memory/MEMORY.md` |
| Daily memory | `workspace/memory/*.md` | `~/.clawdbot/workspace/memory/` |
| Workspace skills | `workspace/skills/` | `~/.clawdbot/workspace/skills/imports/` |
| Managed skills | `~/.openclaw/skills/` | `~/.clawdbot/workspace/skills/imports/` |
| Cross-project skills | `~/.agents/skills/` | left in place; set `CLAWDBOT_SKILLS_DIR` if you want them discovered |
| MCP servers | `openclaw.json` → `mcp.servers` | archived to `workspace/state/openclaw.json` — copy extra servers into `core-ai.mcp.json` by hand; do not clobber `robinhood-trading` |
| Allowlisted API keys | `~/.openclaw/.env` | append to `~/.clawdbot/.env` if you pass `--migrate-secrets` |
| Telegram / Discord / Slack tokens | `channels.*.botToken` / `.token` | same `.env` keys (`TELEGRAM_BOT_TOKEN`, …) |
| Cron | `cron/` | copy into `~/.clawdbot/workspace/cron/` (review before enabling) |
| Auth profiles | `agents/*/agent/auth-profiles.json` | archive only — re-auth providers in Clawd |
| Sessions SQLite | `agents/*/sessions/`, `*.sqlite` | **not copied** (corrupt if live; start a new Clawd session) |
| WhatsApp / Signal pairing | `credentials/` | **not copied** — re-pair |
| Gateway token | `gateway.auth.token` | **not copied** — Clawd does not reuse OpenClaw gateway auth |

OpenClaw `SKILL.md` files with `openclaw:` frontmatter already load in this repo (Vulcan and others ship that key). Drop them under `workspace/skills/imports/<name>/SKILL.md`.

### Hermes → Clawd

| What | Source | Destination |
|---|---|---|
| Persona | `~/.hermes/SOUL.md` | `~/.clawdbot/workspace/SOUL.md` |
| Memory | `~/.hermes/memories/MEMORY.md` | `~/.clawdbot/workspace/memory/MEMORY.md` |
| User | `~/.hermes/memories/USER.md` | `~/.clawdbot/workspace/USER.md` |
| Skills | `~/.hermes/skills/` (skip `openclaw-imports` duplicates if you already came from OpenClaw) | `~/.clawdbot/workspace/skills/imports/` |
| Config | `~/.hermes/config.yaml` | archive to `~/.clawdbot/workspace/state/hermes-config.yaml` — map `model` → `XAI_MODEL` / Grok-first default |
| Secrets | `~/.hermes/.env` | append allowlisted keys into `~/.clawdbot/.env` |
| MCP | `config.yaml` → `mcp_servers` | archived in `workspace/state/hermes-config.yaml` — copy extra servers into `core-ai.mcp.json` by hand |
| Cron | `~/.hermes/cron/` | `~/.clawdbot/workspace/cron/` |
| OAuth | `~/.hermes/auth.json` | **not copied** — re-login |
| Nous Portal | Hermes-only | use Clawd zkrouter (free) or `XAI_API_KEY` (Grok-first) |

Hermes is the common “I left OpenClaw” hop. If both `~/.openclaw` and `~/.hermes` exist, the importer prefers **Hermes** (newer) unless you pass `--source ~/.openclaw`.

### Grok bot / xAI CLI → Clawd

You do not get grok.com / X chat history. You do get the key, the model, and a Solana-native deck.

| What | Source | Destination |
|---|---|---|
| API key | `XAI_API_KEY` in the environment, `~/.grok/.env`, or xAI console | `~/.clawdbot/.env` → `XAI_API_KEY` |
| Model | `~/.grok/config.toml` / `XAI_MODEL` | `XAI_MODEL=grok-4.6` (Clawd default). Code harness still understands `~/.grok/config.toml` |
| MCP connectors | `[mcp_servers.*]` in `config.toml` | archived to `workspace/state/grok-config.toml`; checkout still uses `./.grok/config.toml` |
| Telegram Grok bot | bot token in the old process env | `TELEGRAM_BOT_TOKEN` |
| Chat UI | grok.com | `go run ./cmd/clawd-frontend -addr 127.0.0.1:18810` ([clawdbot-frontend](clawdbot-frontend/README.md)) |
| Trading Grok | — | `zero-service` grok-4.6 loop + `cmd/pump-grok` sidecar |

Clawd Code / REPL / trade defaults are Grok (`AGENTS.md`). After import:

```bash
export XAI_API_KEY=...          # already in ~/.clawdbot/.env after apply
source ~/.clawdbot/.env
go run ./cmd/clawd-frontend     # control deck
# or the SSE bridge:
cd zero-service && npm start    # grok-4.6 + trading tools on :8787
```

No key? zkrouter still serves `clawdbot agent` for free.

### Legacy Clawdbot / Moltbot → this ClawdBot

Hermes already treats `~/.clawdbot` and `~/.moltbot` as OpenClaw lineage (`clawdbot.json`, `moltbot.json`). This installer **also** uses `~/.clawdbot`.

If that directory is an **old** moltbot/clawdbot home:

1. Rename it before install: `mv ~/.clawdbot ~/.clawdbot-pre-migrate`
2. Run the installer (creates a fresh Clawd home)
3. Import with `--source ~/.clawdbot-pre-migrate`

If it is **already this** ClawdBot (has `install.json` + `src/cmd/clawdbot`), skip install and only import from OpenClaw/Hermes/Grok.

### Beyond

| Origin | Bring | Leave |
|---|---|---|
| **Claude Code** | `.claude/skills/**/SKILL.md`, `.mcp.json` servers | Claude OAuth; point MCP at Clawd seeds instead |
| **OpenAI Codex** | `~/.codex/config.toml` MCP, skills | Codex login |
| **Cursor** | project `.cursor/mcp.json` HTTP servers | editor-only settings |
| **elizaOS** | `character.json` → keep as catalog overlay; copy bio into `IDENTITY.md` / `SOUL.md`. Premiere reference: [`agent/eliza/eliZERO`](agent/eliza/eliZERO/README.md) | eliza runtime — Clawd Zero replaces the loop |
| **Gitlawb/zero** | nothing required — Clawd Zero is the in-tree engine (`pkg/zero`, `docs/ZERO.md`) | nested-loop Zero |
| **Telegram userbots / other Grok bots** | `BOT_TOKEN`, allowlists | session strings, userbot stacks |

Skills stay [Agent Skills](https://agentskills.io) `SKILL.md`. Clawd discovers them via `clawdbot catalog skills` and `CLAWDBOT_SKILLS_DIR`.

---

## Secrets policy

Copied **only** when you pass `--migrate-secrets` (off by default):

```
XAI_API_KEY
OPENROUTER_API_KEY
OPENAI_API_KEY
ANTHROPIC_API_KEY
HELIUS_API_KEY
BIRDEYE_API_KEY
DFLOW_API_KEY
GEMINI_API_KEY
DEEPSEEK_API_KEY
TELEGRAM_BOT_TOKEN
DISCORD_BOT_TOKEN
SLACK_BOT_TOKEN
SLACK_APP_TOKEN
```

Never auto-copied:

- Solana keypairs, `WALLET_PRIVATE_KEY`, treasury files, seed phrases
- OAuth refresh tokens, WhatsApp/Signal session stores
- OpenClaw `credentials/`, Hermes `auth.json`
- Gateway auth tokens from the old stack

Clawd install already created a **new** agent wallet at `~/.clawdbot/workspace/agent-wallet.json`. Keep using that, or import a keypair yourself with `clawdbot solana wallet` after you understand the trust gate (Observer → Dry-Run → Delegated). Default trading is paper: `clawdbot ooda --sim`.

Rotate any key that lived in an unencrypted tarball or a world-readable copy.

---

## MCP merge rules

Birth seed always keeps these servers (install + `pkg/mcp.EnsureCoreAIMCPConfig`):

- `robinhood-trading` → `https://agent.robinhood.com/mcp/trading` (Agentic account only; desktop OAuth)
- `zkcompression` → `https://www.zkcompression.com/mcp`
- `helius`, `pump-mcp` (stdio via core-ai sidecar)
- `clawd`, `clawd-soltrader` (ClawdBrowser zero-service)

The importer archives the old MCP config under `workspace/state/` and does not rewrite `core-ai.mcp.json`. Copy extra servers in by hand. Name collisions: use `<name>-imported`. Do not clobber Robinhood.

---

## After import

```bash
source ~/.clawdbot/.env
clawdbot doctor
clawdbot catalog skills
clawdbot catalog agents
clawdbot catalog zk
clawdbot dna show
clawdbot ooda --sim          # paper loop — do this before any live gate
clawdbot web                 # console :18800
```

Optional Grok deck + PumpFun sidecar:

```bash
export XAI_API_KEY
go run ./cmd/pump-grok -addr 127.0.0.1:8788
PUMP_GROK_URL=http://127.0.0.1:8788 go run ./cmd/clawd-frontend -addr 127.0.0.1:18810
```

Dual-run until you trust it. Then rename the old home so nothing accidentally boots the previous gateway:

```bash
mv ~/.openclaw ~/.openclaw.pre-clawd
mv ~/.hermes ~/.hermes.pre-clawd
```

---

## Pitfalls

| Symptom | Cause | Fix |
|---|---|---|
| Install skipped `.env` | `~/.clawdbot/.env` already existed | Importer only **appends missing** keys; edit by hand if a value is stale |
| Blank persona after install | `EnsureDefaults` wrote Clawd templates because import ran first / files existed | Re-run importer with `--overwrite-persona` |
| Skills missing | Copied to the wrong tree, or execute bits lost on a restore | `clawdbot catalog skills`; reinstall skill packs with `clawdbot skills birth --install` |
| Doctor red on RPC | Old Helius key / no RPC | Installer default is public `SOLANA_RPC_URL` via zk.x402.wtf — keep it unless you have a better key |
| “Already ~/.clawdbot” | Migrating from legacy moltbot that used the same path | Rename old home, install, `--source` the rename |
| WhatsApp logged out | Pairing is device-local | Re-pair; do not copy `credentials/` |
| Grok 401 | Key never imported (`--migrate-secrets` off) | Paste `XAI_API_KEY` into `~/.clawdbot/.env` |
| Live trade fired | You armed live gates | Stay on `--sim` until cockpit is green: `clawdbot trade cockpit` |

---

## Importer

The runnable importer is [`scripts/migrate-into-clawd.sh`](scripts/migrate-into-clawd.sh). After `install.sh` it also lives at `~/.clawdbot/src/scripts/migrate-into-clawd.sh`.

```bash
bash scripts/migrate-into-clawd.sh --dry-run
bash scripts/migrate-into-clawd.sh --apply --overwrite-persona
bash scripts/migrate-into-clawd.sh --apply --overwrite-persona --migrate-secrets
bash scripts/migrate-into-clawd.sh --source ~/.openclaw --apply --overwrite-persona
```

`--apply` without `--overwrite-persona` keeps Clawd templates if install already wrote them. Migrating a living OpenClaw/Hermes soul almost always wants `--overwrite-persona`. Secrets stay off until you pass `--migrate-secrets` (allowlisted keys only — see above).

---

## Surfaces

| | |
|---|---|
| Runtime | https://github.com/Solizardking/clawdbot-go |
| Hub | https://github.com/solizardking/solana-clawd |
| Install | `curl -fsSL https://install.onchainai.fund \| bash` |
| Terminal | https://cheshireterminal.ai |
| x402 / zk | https://zk.x402.wtf |
| Laws | [six-laws.md](six-laws.md) · [CONSTITUTION.md](CONSTITUTION.md) · [three-laws.md](three-laws.md) |
| Zero engine | [docs/ZERO.md](docs/ZERO.md) |
| Security | [SECURITY.md](SECURITY.md) |

🦞 \$CLAWD · Droids Lead The Way
