# Contributing — zk-primitives

Contributions to the Clawd ZK layer (Anchor program, TypeScript client, agent
wrapper, docs) are welcome after an issue is filed.

## Setup

```bash
cd zk-primitives
pnpm install   # or npm install in agent/ and client/

# Client unit tests (off-chain)
cd client && npm test

# Agent unit tests
cd ../agent && npm test
```

On-chain SBF tests require the Solana / Anchor toolchain; see
`programs/README.md` and `tests/README.md`.

## Guidelines

- Keep example configs and `.env.example` free of live API keys and keypairs.
- Do not hardcode developer home paths; use `$HOME` or env overrides.
- Prefer dry-run / observer defaults for new agent surfaces.
- Match the package license: **Apache-2.0** (see `LICENSE`).

## Security

Private disclosure only — see `SECURITY.md`.
