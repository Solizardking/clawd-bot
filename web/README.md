# ClawdBot Web Console

Web dashboard and control plane for ClawdBot OS.

| Path | Role |
|------|------|
| `backend/` | Go HTTP server (default port **18800**) — config, health, vault, connectors |
| `frontend/` | Vite + React 19 UI |

## Quick start

```bash
# From this directory
make frontend   # npm install + production build into frontend/dist
make backend    # go build -o ../build/clawdbot-web ./backend/

# Dev (Vite HMR + go run)
make dev
# Frontend: http://localhost:5173
# Backend:  http://localhost:18800
```

```bash
# Or run the backend against a config file
go run ./backend/ -port 18800 [config.json]
```

## Configuration

Copy `.env.example` to `.env` (gitignored) and set only the keys you need.
Never commit real API keys or wallet material.

## Security

See `SECURITY.md`. Vault and key-export endpoints are intended for local /
operator use only.

## License

MIT — see `LICENSE`.
