# Security Policy

`zero-service` is a headless bridge that can quote and execute Solana spot swaps
and Phoenix perpetuals through MCP tools. Misconfiguration can spend funds.

## Reporting a vulnerability

**Do not open a public issue for security vulnerabilities.**

Report privately through GitHub's private vulnerability reporting (Security tab →
Report a vulnerability), or request a private channel via a content-free issue.

Include: path under `zero-service/`, commit, minimal repro, and impact (e.g.
auth bypass on `/chat`, wallet key leakage in SSE, limit bypass).

## Operator safety rules

- Keep `WALLET_PRIVATE_KEY` / `AGENT_WALLET_PRIVATE_KEY` only in local env or a
  secret manager — never in git, Docker layers, or logs.
- Prefer paper / sim mode until limits are verified:
  - Spot: `MAX_SWAP_INPUT_AMOUNT`
  - Perps: `PERPS_MAX_NOTIONAL_USD`, `PERPS_MAX_LEVERAGE`
  - Live: require explicit `LIVE_TRADING=true` + `OPERATOR_CONFIRMED=true`
- Set `ZERO_SERVICE_TOKEN` in any non-local deployment so `/chat` requires a
  bearer token.
- Copy `.env.example` → `.env` and leave placeholders empty in the example.

## Out of scope (generally)

- Compromised host already holding the agent wallet.
- Intentionally disabled risk caps by the operator.
