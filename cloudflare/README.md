# ClawdBot Cloudflare Installer

This directory contains the Cloudflare Worker that turns the canonical GitHub
installer into branded install and catalog-discovery surfaces:

Primary public install surface (Worker custom domain on the Cheshire Terminal zone):

```bash
curl -fsSL https://install.cheshireterminal.ai | bash
```

> **Why not `cheshireterminal.ai/install`?** The apex SPA is served by Fly.
> Cloudflare Worker *path* routes only apply when the hostname is proxied
> through Cloudflare. Use the dedicated `install.cheshireterminal.ai` host
> (same pattern as `install.onchainai.fund`).
>
> **Bot Fight / Super Bot Fight:** if `curl -fsSL https://install.cheshireterminal.ai`
> returns **HTTP 403** with `cf-mitigated: challenge`, add a **Configuration Rule**
> on the `cheshireterminal.ai` zone:
>
> 1. Cloudflare Dashboard → **Rules** → **Configuration Rules** → Create  
> 2. When hostname equals `install.cheshireterminal.ai`  
> 3. Then: **Security** → *Disable Super Bot Fight Mode* / skip Bot Fight  
> 4. (Optional) Security Level: *Essentially Off* for this hostname only  
>
> Until that rule is active, use the legacy host (same Worker, no challenge):
> `curl -fsSL https://install.onchainai.fund | bash`. The npm package
> (`npx clawdbot-install`) automatically falls back.

Legacy Cloudflare custom-domain host (same Worker):

```bash
curl -fsSL https://install.onchainai.fund | bash
```

The `x402.wtf` aliases below only resolve once their DNS records and Worker
routes are provisioned in Cloudflare (see **Cloudflare Setup**). Until then
`install.x402.wtf` fails DNS resolution and the `*/clawdbot` paths fall through
to Vercel with a 404:

```bash
curl -fsSL https://install.x402.wtf | bash        # requires DNS + route
curl -fsSL https://x402.wtf/clawdbot | bash        # requires Worker route
curl -fsSL https://zk.x402.wtf/clawdbot | bash     # requires Worker route
```


`/` serves a tiny wrapper that sets `CLAWDBOT_INSTALL_COMPLETE=1` and runs the
canonical GitHub installer. `/install.sh` proxies the raw installer without
forcing complete mode. The JSON routes expose the same install metadata plus the
local `zk-primitives/` surface used by `clawdbot catalog zk`.

## Files

| File | Purpose |
| --- | --- |
| `install-worker.js` | Module Worker that serves install wrappers, raw installer proxying, health checks, and JSON metadata. |
| `install-worker.test.mjs` | Local Node test for route, metadata, wrapper, and proxy behavior. |
| `README.md` | Operator deployment, smoke-test, route, and ZK integration notes. |
| `../wrangler.toml` | Cloudflare Worker name, compatibility date, vars, and route bindings. |

## Deploy

```bash
npx wrangler deploy
```

The route configuration lives in `../wrangler.toml`.

## Cloudflare Setup

1. Put `onchainai.fund` and `x402.wtf` on Cloudflare.
2. Deploy the Worker with `npx wrangler deploy`.
3. Use a Worker custom domain for the exact `onchainai.fund` install host:

```text
install.onchainai.fund
```

3b. Bind the primary install host on the Cheshire Terminal zone:

```text
install.cheshireterminal.ai   (Worker custom domain)
```

3c. Optional path aliases (only if the apex is Cloudflare-proxied):

```text
cheshireterminal.ai/install*
www.cheshireterminal.ai/install*
```

4. Use Worker routes for `x402.wtf` installs while existing Vercel DNS records
   are present:

```text
install.x402.wtf/*
x402.wtf/clawdbot*
zk.x402.wtf/clawdbot*
```

For the `x402.wtf` routes, make sure the DNS records for `install.x402.wtf`,
`x402.wtf`, and `zk.x402.wtf` exist in Cloudflare, are proxied, and are not
blocked by a Cloudflare challenge rule. To convert `install.x402.wtf` into a
Worker custom domain, delete or replace its existing externally managed DNS
record first.

## Worker Vars

`../wrangler.toml` sets non-secret defaults:

| Var | Purpose |
| --- | --- |
| `UPSTREAM_INSTALL_URL` | Canonical raw GitHub installer URL. |
| `DEFAULT_COMPLETE` | Default wrapper mode for `/`, `/complete`, and `/full`. |
| `DEFAULT_ZK_PRIMITIVES_DIR` | Optional installer export for `CLAWDBOT_ZK_PRIMITIVES_DIR`. |
| `PROJECT_REPO` | Runtime repo shown in metadata. |
| `ECOSYSTEM_HUB` | Ecosystem hub shown in metadata. |
| `X402_GATEWAY` | Public x402 gateway shown in metadata. |
| `TERMINAL_URL` | Terminal surface shown in metadata. |
| `ZK_AGENT_PACKAGE` | Agent package advertised by ZK metadata. |
| `ZK_CLIENT_PACKAGE` | Client SDK package advertised by ZK metadata. |
| `ZK_PROGRAM_ID` | Current `clawd-zk` program id or placeholder. |

Do not put API keys, Solana keypairs, or Cloudflare tokens in Worker vars. Use
Wrangler secrets only if a future route needs private credentials.

## Smoke Tests

```bash
# Primary — install.cheshireterminal.ai
curl -fsSL https://install.cheshireterminal.ai/healthz
curl -fsSL https://install.cheshireterminal.ai/.well-known/clawdbot-install.json
curl -fsSL https://install.cheshireterminal.ai/.well-known/clawdbot-zk.json
curl -fsSL https://install.cheshireterminal.ai/routes
curl -fsSL https://install.cheshireterminal.ai | bash -n

# Legacy host
curl -fsSL https://install.onchainai.fund/healthz
curl -fsSL https://install.onchainai.fund/.well-known/clawdbot-install.json
curl -fsSL https://install.onchainai.fund/.well-known/clawdbot-zk.json
curl -fsSL https://install.onchainai.fund/routes
curl -fsSL https://install.onchainai.fund/install.sh | bash -n
curl -fsSL https://install.onchainai.fund | bash
```

Local validation without deploying:

```bash
node --test cloudflare/install-worker.test.mjs
```

## Routes

| Path | Behavior |
| --- | --- |
| `/` | Complete install wrapper |
| `/complete` | Complete install wrapper |
| `/full` | Complete install wrapper |
| `/core-ai` | Installer wrapper with `CLAWDBOT_INSTALL_CORE_AI=1` |
| `/install.sh` | Raw upstream installer proxy |
| `/raw` | Raw upstream installer proxy |
| `/lite` | Raw upstream installer proxy |
| `/healthz` | Plain health check |
| `/.well-known/clawdbot-install.json` | Installer metadata |
| `/.well-known/clawdbot-zk.json` | ZK primitive metadata |
| `/.well-known/zk-primitives.json` | ZK primitive metadata alias |
| `/zk` | ZK primitive metadata alias |
| `/zk.json` | ZK primitive metadata alias |
| `/metadata.json` | Combined installer and ZK metadata |
| `/catalog` | Combined installer and ZK metadata alias |
| `/routes` | Machine-readable route table |

All JSON routes allow `GET`, `HEAD`, and `OPTIONS` and include permissive CORS
headers so CLI tools, docs pages, and web consoles can read metadata directly.

## ZK Primitive Inclusion

The Worker does not ship local ZK source files. It advertises the repo-backed
ZK surface that the installer and Go runtime know how to locate:

| Surface | Path or package |
| --- | --- |
| Local root | `CLAWDBOT_ZK_PRIMITIVES_DIR` / `./zk-primitives` |
| Manifest | `zk-primitives/MANIFEST.json` |
| Agent package | `@clawd/zk-shark-agent` |
| Client package | `@clawd/zk-client` |
| Program | `zk-primitives/programs/clawd-zk` |
| Runtime command | `clawdbot catalog zk` |

The metadata endpoint intentionally stays read-only. It can tell a caller which
ZK operations exist (`publish_attestation`, `consume_attestation`,
`commit_encrypted_state`, `verify_proof`, `compute_nullifier`), but it does not
sign transactions, fetch private proofs, or execute on-chain writes.

## Operational Checklist

1. Run `node --test cloudflare/install-worker.test.mjs`.
2. Run `npx wrangler deploy --dry-run` when Wrangler dependencies are present.
3. Deploy with `npx wrangler deploy`.
4. Verify `/healthz`, installer metadata, ZK metadata, and `/install.sh | bash -n`.
5. From an installed runtime, run `clawdbot catalog zk` and `clawdbot doctor`.
