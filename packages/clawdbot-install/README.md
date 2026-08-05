# clawdbot-install

One-shot npm/npx installer for **ClawdBot Go** — the same surface as:

```bash
curl -fsSL https://cheshireterminal.ai/install | bash
curl -fsSL https://install.onchainai.fund | bash
curl -fsSL https://raw.githubusercontent.com/Solizardking/clawdbot-go/main/install.sh | bash
```

## Install

```bash
npx clawdbot-install
# or
npm i -g clawdbot-install && clawdbot-install
```

### Dry-run (no `$HOME` mutation, no network install)

```bash
npx clawdbot-install --dry-run
# or
CLAWDBOT_INSTALL_DRY_RUN=1 npx clawdbot-install
```

Prints a JSON plan with `primaryUrl`, `fallbackUrl`, `env`, and the equivalent curl command. The plan always references the real installer upstream (`cheshireterminal.ai/install` and/or raw `install.sh`).

### Full stack

```bash
npx clawdbot-install --complete
# equivalent:
curl -fsSL https://cheshireterminal.ai/install | bash
```

## Options

| Flag | Meaning |
|------|---------|
| `--dry-run`, `-n` | Resolve plan only |
| `--complete` | `CLAWDBOT_INSTALL_COMPLETE=1` |
| `--core-ai` | `CLAWDBOT_INSTALL_CORE_AI=1` |
| `--prefer-edge` | Use `https://cheshireterminal.ai/install` (default) |
| `--prefer-raw` | Use raw GitHub `install.sh` |
| `--dir <path>` | Install home |
| `--ref <ref>` | Git/archive ref (default `main`) |

## Publish

```bash
cd packages/clawdbot-install
npm test
npm pack
npm publish --access public
```

## License

MIT — see [LICENSE](./LICENSE).
