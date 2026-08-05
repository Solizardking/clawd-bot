# Contributing — zero-service

`zero-service` bridges the headless Zero agent to Solana trading MCP tools.

## Development setup

```bash
# Build Zero binary
cd ../zero-main && make build && cd ../zero-service

npm install
cp .env.example .env   # empty placeholders only — never commit .env

# Read-only smoke (no trade)
ZERO_BIN=../zero-main/zero npm run smoke

# Unit-ish health start (requires configured model key for full chat)
ZERO_BIN=../zero-main/zero npm start
```

## Pull requests

- Prefer issue-linked PRs with a short risk note (spot / perps / auth).
- Do not lower default risk caps without an explicit issue and docs update.
- Keep secrets out of commits, Docker build args, and README snippets.

## Tests

```bash
# Static readiness / secrets hygiene (from repo root)
./scripts/oss-readiness-check.sh

# Optional: smoke against a built zero binary (read-only prompt)
ZERO_BIN=../zero-main/zero node src/smoke.mjs "health check only"
```

## Security

See `SECURITY.md`. Live trading and wallet keys are out of scope for casual
drive-by contributions.
