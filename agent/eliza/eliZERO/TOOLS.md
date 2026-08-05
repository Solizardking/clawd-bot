# TOOLS.md — eliZERO local notes

Skills define *how* tools work. This file is *your* environment map.

## Bundle paths

| Path | Purpose |
| --- | --- |
| `character.json` | elizaOS character (bio, style, system) |
| `elizero.json` | Clawd agent catalog manifest |
| `clawd-power.json` | $CLAWD mint, birth funding, x402 |
| `IDENTITY.md` / `SOUL.md` | who + constitution |
| `USER.md` | human notes |
| `validate.mjs` | self-check |

## Zero engine

```bash
# from zero-clawd root
go test ./pkg/zero/...
clawdbot zero ask "inspect"
clawdbot zero run --attest att.json "audit the OODA loop"
clawdbot zero verify run.jsonl
```

Env: `ZERO_SECRET_HEX` (≥16 bytes hex) for re-derivable nullifiers.

## $CLAWD powering

| Constant | Value |
| --- | --- |
| Mint | `8cHzQHUS2s2h8TzCmfqPKYiM4dSt4roa3n7MyRLApump` |
| Birth CLAWD | `1000` |
| Birth SOL | `0.069420` |
| Skill | `agent/skills/clawd-token-ops` |
| Go default | `pkg/birthfund.DefaultCLAWDMint` |

Env overrides (mint): `CLAWD_TOKEN_MINT`, `CLAWDBOT_CLAWD_MINT`, `CLAWDBOT_CLAWD_TOKEN_MINT`.

## Catalog registration

- Local zero-clawd path: `agent/eliza/eliZERO`  
- CLAWDBOT_AGENTS_DIR copy: `/Users/8bit/agents/agents/src/elizero.json` (when synced)  
- eliza-agents characters: optional mirror under `eliza-agents/characters/`  

## RPC / APIs (fill as configured)

- RPC primary →  
- Helius →  
- Birdeye →  
- zkrouter → `https://clawdrouter-zk.fly.dev/v1` (public free key patterns in docs)  

## Guardrails

- No private keys in this file.  
- No treasury secrets.  
- Confirm before mainnet transfers / burns / stakes.

---

Update as the install hardens. Keep secrets in env / vault only.
