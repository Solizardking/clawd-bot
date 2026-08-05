# Contributing — ClawdBot Web Console

Thanks for helping improve the web console (`web/backend` + `web/frontend`).

## Issue first

1. Open an issue describing the bug or feature with reproduction steps.
2. Wait for maintainer approval before large pull requests.
3. Keep PRs focused: one concern per PR (UI, API, docs, tests).

## Local development

```bash
cd web
make frontend   # npm install + vite build
make backend    # go build → ../build/clawdbot-web
make dev        # frontend :5173 + backend :18800
```

## Secrets

- Never commit `.env`, wallets, or vault files.
- Use `web/.env.example` for documented variable names only.
- Tests must use fake placeholders (see `backend/main_test.go`).

## Tests

```bash
cd web/backend && go test ./...
```

## Code of conduct

Be respectful. Security reports follow `SECURITY.md` (private disclosure).
