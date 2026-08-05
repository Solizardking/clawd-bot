# Open Source Readiness Checklist

Scope: the six trees prepared for public release

| Tree | Role | License |
|------|------|---------|
| `web/` | ClawdBot web console (Makefile + docs) | MIT |
| `web/backend/` | Go dashboard / control API | MIT (via `web/`) |
| `web/frontend/` | Vite + React UI | MIT |
| `zero-main/` | Zero coding agent (CLI / TUI / exec) | MIT |
| `zk-primitives/` | ZK program + TS client + agent | **Apache-2.0** |
| `zero-service/` | Headless Zero + Solana MCP bridge | MIT |

Run the automated gate from the repo root:

```bash
node scripts/oss-readiness-check.mjs
```

---

## 1. Secrets audit (status)

| Check | Status | Notes |
|-------|--------|-------|
| Tracked `.env` / keypairs | **PASS** | `zero-service/.env` and `zk-primitives/agent/.env.local` exist **locally only** and are gitignored |
| Git history of those env files | **PASS** | No commits found for `zero-service/.env` or `agent/.env.local` |
| High-risk key shapes in tracked sources | **PASS** | Matches are test fixtures only (`sk-ant-…`, `ghp_…`, `AKIA…EXAMPLE`) |
| Personal absolute paths | **FIXED** | Removed `/Users/8bit/…` from `zk-primitives/MANIFEST.json` and `docs/INTEGRATION.md` |
| Frontend `dist/` secret scan | **PASS** | No private-key / API-key patterns in prebuilt assets |
| Docker image | **PASS** | `zero-service/Dockerfile` does not `COPY` `.env` |

### Operator machine warning (not in git)

If you have a local `zero-service/.env`, treat any values there as **compromised if this machine or backup was ever shared**. Typical high-value keys:

- `OPENAI_API_KEY` / other provider keys
- `WALLET_PRIVATE_KEY` (base58 secret key)
- `DFLOW_API_KEY`
- RPC URLs that embed API keys

Before a public launch, **rotate** those credentials and drain / replace any hot wallet that ever held mainnet funds under a local env file. Do **not** commit or attach `.env` to issues.

Also re-check local env for mis-typed fields: Solana **addresses** are ~32–44 base58 characters; **secret keys** are ~87–88. Fee-account fields should never hold secret keys.

---

## 2. OSS docs & license matrix

| Artifact | web | zero-main | zk-primitives | zero-service |
|----------|-----|-----------|---------------|--------------|
| `LICENSE` | ✅ | ✅ | ✅ Apache-2.0 | ✅ |
| `SECURITY.md` | ✅ | ✅ | ✅ | ✅ |
| `CONTRIBUTING.md` | ✅ | ✅ | ✅ | ✅ |
| `README.md` | ✅ | ✅ | ✅ | ✅ |
| `.env.example` | ✅ | ✅ | ✅ | ✅ |
| `.gitignore` (local) | ✅ | ✅ | ✅ | ✅ |

Monorepo root also has MIT `LICENSE` + hardened `.gitignore` (Clawd Guard patterns).

**License note:** `zk-primitives` packages declare Apache-2.0; other trees are MIT. Keep that split in release notes and `package.json` `license` fields.

---

## 3. Pre-publish checklist (manual)

### A. Repository hygiene

- [ ] `node scripts/oss-readiness-check.mjs` exits 0
- [ ] `git status` shows no accidental `.env` / `wallet.json` / `*.pem`
- [ ] No private submodule or private dependency URLs
- [ ] Decide whether `web/frontend/dist/` stays committed (convenience bundle) or is build-only
- [ ] Strip or rewrite any remaining internal-only docs outside these six trees before whole-repo publish

### B. Credential rotation (if this tree was ever private-only with shared clones)

- [ ] Rotate OpenAI / Anthropic / xAI / OpenRouter keys used in local `.env`
- [ ] Rotate Helius / RPC provider keys
- [ ] Rotate DFlow API keys
- [ ] Replace agent hot wallets; never reuse a key that sat in an env file on a shared disk
- [ ] Revoke any `ZERO_SERVICE_TOKEN` or install admin tokens used in staging

### C. Runtime defaults for public clones

- [ ] `zero-service`: paper / sim default; live requires `LIVE_TRADING` + `OPERATOR_CONFIRMED`
- [ ] `ZERO_SERVICE_TOKEN` required for any internet-exposed `/chat`
- [ ] Web console vault endpoints remain localhost / token gated
- [ ] Document that `clawdbot-free` is a **public free-tier id string**, not a secret (`web/backend` default for `ZKROUTER_API_KEY`)

### D. Legal / community

- [ ] Confirm copyright holders on MIT vs Apache files match intent
- [ ] Enable GitHub private vulnerability reporting
- [ ] Add issue / PR templates if accepting community work
- [ ] `CODE_OF_CONDUCT.md` present for `zero-main`; consider pointing other trees at it

### E. Build smoke (public clone simulation)

```bash
# Web
cd web && make frontend && cd backend && go test ./...

# Zero agent
cd zero-main && go test ./internal/secrets/... ./internal/redaction/...

# ZK
cd zk-primitives/client && npm test
cd zk-primitives/agent && npm test

# zero-service static
cd zero-service && node --check src/server.mjs && node --check src/dflow.mjs
node ../scripts/oss-readiness-check.mjs
```

---

## 4. Residual risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| Local `.env` with live trading + wallet on operator disk | High (local) | Rotate keys; keep gitignored; never `docker build` with secrets as build-args |
| Prebuilt `web/frontend/dist` can drift from source | Low | CI rebuild on release, or stop tracking dist |
| Default `ZKROUTER_API_KEY=clawdbot-free` | Low | Documented public free tier; override via env for paid tiers |
| Placeholder program ids in ZK configs | Low | Operators must set real `ZK_SHARK_PROGRAM_ID` before mainnet send |
| Monorepo also contains paths outside these six trees | Medium | Scope public release or audit the rest the same way |

---

## 5. What was fixed in this pass

1. Sanitized personal paths in `zk-primitives/MANIFEST.json` and `docs/INTEGRATION.md`
2. Added `LICENSE`, `SECURITY.md`, `CONTRIBUTING.md`, `.env.example`, and package-local `.gitignore` where missing
3. Added `web/README.md` and `zero-main/.env.example`
4. Hardened root `.gitignore` with Clawd Guard secret patterns
5. Added `scripts/oss-readiness-check.mjs` automated gate
6. Set `license: MIT` on `zero-service/package.json`
7. Isolated TypeScript `typeRoots` in `zk-primitives/{client,agent}` so public clones do not pick up global `@types/*` pollution

---

## 6. Sign-off

| Role | Criterion | Done when |
|------|-----------|-----------|
| Security | No secrets in git; env templates empty; report path documented | `oss-readiness-check` green + this doc §1 |
| Legal | LICENSE present and matches package metadata | §2 matrix |
| Maintainers | CONTRIBUTING + SECURITY published | §2 matrix |
| Release | Public clone builds / tests smoke | §3.E |

*Last audit: 2026-08-04 — six-tree scope only.*
