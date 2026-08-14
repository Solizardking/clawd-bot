# clawd-bot

npm launcher for **Clawd Bot** — the Solana-native agent desktop and CLI.

```bash
npx clawd-bot
npx clawd-bot desktop
```

If the Go binary is not on PATH:

```bash
npx clawdbot-install --complete
curl -fsSL https://install.cheshireterminal.ai | bash
```

Identity is the spawn canon: `CLAWD.md`, `CONSTITUTION.md`, `SOUL.md`, `six-laws.md`. The desktop lets users choose Core AI skills (Helius, Solana MCP, v3, …) and zero services.

## Publish

```bash
cd packages/clawd-bot
npm test
npm pack
npm publish --access public
```

## License

MIT
