# Security Policy

`zk-primitives` covers on-chain nullifiers, Groth16 proof preparation, and Light
Protocol compressed state for Clawd / ZK Shark agents.

## Reporting a vulnerability

**Do not open a public issue for security vulnerabilities.**

Report privately via GitHub Security Advisories on the repository, or open an
issue that only asks for a private contact channel.

Please include:

- Component (`programs/clawd-zk`, `client`, `agent`, configs/docs)
- Commit or tag
- Impact (nullifier collision, proof bypass, key material leak, etc.)
- Minimal reproduction with **redacted** RPC keys and keypairs

## Secrets handling

- RPC URLs may embed API keys — never commit them; use env vars
  (`ZK_SHARK_RPC_URL`, `CLAWD_ZK_RPC_URL`, `ZK_SHARK_API_KEY`, …).
- Signing keypairs (`ZK_SHARK_KEYPAIR` path) stay local and gitignored.
- Example configs under `configs/*.example.json` must remain free of live secrets.
- Use `.env.example` only; real values go in ignored `.env` / `.env.local`.

## Trust gates

Catalog and agent surfaces default to observer / dry-run. Sign-and-send remains
delegated and must not be auto-armed by discovery metadata.
