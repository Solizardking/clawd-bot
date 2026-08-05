# Security Policy

The ClawdBot Web Console (`web/`) manages agent configuration, wallet vault
access, and optional trading connectors. Treat it as a privileged local control
plane.

## Reporting a vulnerability

**Do not open a public issue for security vulnerabilities.**

Report privately through GitHub's private vulnerability reporting:

1. Go to the repository **Security** tab → **Report a vulnerability**.
2. Describe the issue, affected path (`web/backend`, `web/frontend`), commit, and impact.

If private reporting is unavailable, open an issue that requests a private
channel only — no technical details.

## Secrets and configuration

- Never commit `.env`, wallet keypairs, or vault files.
- Use `web/.env.example` as a template with empty placeholder values only.
- API keys in config responses are redacted by the backend (`redactSecret`).
- Vault key export endpoints must stay localhost / token gated.

## Scope notes

- Findings that require an already-compromised local machine are generally out
  of scope, but please report anything you are unsure about.
- Live trading connectors and third-party RPC keys are operator-managed secrets;
  do not include real credentials in repro materials.
