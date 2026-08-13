#!/usr/bin/env bash
# Import OpenClaw / Hermes Agent / Grok CLI / moltbot state into ~/.clawdbot.
# See MIGRATE.md. Preview with --dry-run; write with --apply.
set -euo pipefail

DEST="${CLAWDBOT_HOME:-$HOME/.clawdbot}"
WS="$DEST/workspace"
DRY=1
OVERWRITE_PERSONA=0
MIGRATE_SECRETS=0
SOURCE=""

usage() {
  cat <<EOF
Usage: $0 [--dry-run|--apply] [--source DIR] [--overwrite-persona] [--migrate-secrets]

Imports persona, memory, skills, and (optionally) allowlisted API keys from
OpenClaw (~/.openclaw), Hermes (~/.hermes), Grok (~/.grok), or legacy
moltbot/clawdbot into CLAWDBOT_HOME (default ~/.clawdbot).

Does not copy wallets, OAuth stores, SQLite sessions, or gateway auth.
Install Clawd first: curl -fsSL https://install.onchainai.fund | bash
EOF
  exit "${1:-0}"
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --dry-run) DRY=1 ;;
    --apply) DRY=0 ;;
    --source)
      SOURCE="${2:-}"
      [[ -n "$SOURCE" ]] || { echo "--source needs a directory" >&2; exit 1; }
      shift
      ;;
    --overwrite-persona) OVERWRITE_PERSONA=1 ;;
    --migrate-secrets) MIGRATE_SECRETS=1 ;;
    -h|--help) usage 0 ;;
    *) echo "unknown arg: $1" >&2; usage 1 ;;
  esac
  shift
done

log() { printf '  ▶ %s\n' "$*"; }
ok()  { printf '  ✓ %s\n' "$*"; }
warn(){ printf '  ⚠ %s\n' "$*" >&2; }

abs() {
  local p="$1"
  if command -v realpath >/dev/null 2>&1; then
    realpath "$p"
  else
    python3 -c 'import os,sys; print(os.path.realpath(sys.argv[1]))' "$p"
  fi
}

detect_source() {
  local d
  if [[ -n "$SOURCE" ]]; then
    [[ -d "$SOURCE" ]] || { echo "source not a directory: $SOURCE" >&2; exit 1; }
    printf '%s\n' "$SOURCE"
    return
  fi
  for d in "$HOME/.hermes" "$HOME/.openclaw" "$HOME/.clawdbot-pre-migrate" "$HOME/.moltbot" "$HOME/.grok"; do
    if [[ -d "$d" ]]; then
      printf '%s\n' "$d"
      return
    fi
  done
  echo "no source home found (looked at ~/.hermes ~/.openclaw ~/.clawdbot-pre-migrate ~/.moltbot ~/.grok)" >&2
  echo "pass --source DIR" >&2
  exit 1
}

kind_of() {
  local src="$1" base
  base="$(basename "$src")"
  if [[ -f "$src/config.yaml" && ( -d "$src/memories" || -f "$src/SOUL.md" ) ]]; then
    echo hermes
  elif [[ "$base" == ".grok" || ( -f "$src/config.toml" && ! -f "$src/openclaw.json" ) ]]; then
    echo grok
  elif [[ -f "$src/openclaw.json" || -f "$src/clawdbot.json" || -f "$src/moltbot.json" ]]; then
    echo openclaw
  else
    echo openclaw
  fi
}

workspace_of() {
  local src="$1" c
  for c in "$src/workspace" "$src/workspace-main" "$src/workspace.default"; do
    [[ -d "$c" ]] && { printf '%s\n' "$c"; return; }
  done
  local extra
  extra="$(find "$src" -maxdepth 1 -type d -name 'workspace-*' 2>/dev/null | head -1 || true)"
  if [[ -n "$extra" ]]; then
    printf '%s\n' "$extra"
    return
  fi
  printf '%s\n' "$src"
}

copy_file() {
  local from="$1" to="$2"
  [[ -f "$from" ]] || return 0
  if [[ "$DRY" == "1" ]]; then
    log "copy $from → $to"
    return
  fi
  mkdir -p "$(dirname "$to")"
  if [[ -f "$to" && "$OVERWRITE_PERSONA" != "1" ]]; then
    case "$to" in
      */SOUL.md|*/IDENTITY.md|*/USER.md|*/TOOLS.md)
        warn "keep existing $to (pass --overwrite-persona to replace)"
        return
        ;;
    esac
  fi
  cp "$from" "$to"
  ok "$to"
}

copy_tree() {
  local from="$1" to="$2"
  [[ -d "$from" ]] || return 0
  if [[ "$DRY" == "1" ]]; then
    log "tree $from → $to"
    return
  fi
  mkdir -p "$to"
  cp -R "$from"/. "$to"/
  ok "$to"
}

append_key() {
  local envfile="$1" key="$2" value="$3"
  [[ -n "$value" ]] || return 0
  if [[ "$DRY" == "1" ]]; then
    log "env $key (redacted)"
    return
  fi
  touch "$envfile"
  chmod 600 "$envfile"
  if grep -q "^${key}=" "$envfile"; then
    warn "skip $key — already set"
    return
  fi
  printf '%s=%s\n' "$key" "$value" >> "$envfile"
  ok "appended $key"
}

extract_env_value() {
  local file="$1" key="$2"
  [[ -f "$file" ]] || return 0
  grep -E "^${key}=" "$file" 2>/dev/null | tail -1 | sed -E "s/^${key}=//" | tr -d '"' | tr -d "'"
}

SRC="$(detect_source)"
KIND="$(kind_of "$SRC")"
SRC_WS="$(workspace_of "$SRC")"

if [[ -d "$DEST" ]]; then
  SRC_ABS="$(abs "$SRC")"
  DEST_ABS="$(abs "$DEST")"
  if [[ "$SRC_ABS" == "$DEST_ABS" ]]; then
    echo "source is the Clawd home itself ($DEST)." >&2
    echo "rename the old tree first: mv ~/.clawdbot ~/.clawdbot-pre-migrate" >&2
    echo "then install Clawd and re-run with --source ~/.clawdbot-pre-migrate" >&2
    exit 1
  fi
fi

echo
echo "  Clawd import"
echo "  source : $SRC ($KIND)"
echo "  dest   : $DEST"
echo "  mode   : $([[ "$DRY" == "1" ]] && echo DRY-RUN || echo APPLY)"
echo "  secrets: $([[ "$MIGRATE_SECRETS" == "1" ]] && echo yes || echo no)"
echo

[[ -d "$DEST" ]] || {
  echo "Clawd home missing. Install first:" >&2
  echo "  curl -fsSL https://install.onchainai.fund | bash" >&2
  exit 1
}

mkdir -p "$WS/memory" "$WS/skills/imports" "$WS/cron" "$WS/state" "$WS/vault"

if [[ "$KIND" == "hermes" ]]; then
  copy_file "$SRC/SOUL.md" "$WS/SOUL.md"
  copy_file "$SRC/memories/USER.md" "$WS/USER.md"
  copy_file "$SRC/memories/MEMORY.md" "$WS/memory/MEMORY.md"
  copy_tree "$SRC/skills" "$WS/skills/imports/hermes"
  copy_tree "$SRC/cron" "$WS/cron"
  copy_file "$SRC/config.yaml" "$WS/state/hermes-config.yaml"
elif [[ "$KIND" == "grok" ]]; then
  copy_file "$SRC/config.toml" "$WS/state/grok-config.toml"
else
  copy_file "$SRC_WS/SOUL.md" "$WS/SOUL.md"
  copy_file "$SRC_WS/IDENTITY.md" "$WS/IDENTITY.md"
  copy_file "$SRC_WS/USER.md" "$WS/USER.md"
  copy_file "$SRC_WS/TOOLS.md" "$WS/TOOLS.md"
  copy_file "$SRC_WS/AGENTS.md" "$WS/state/imported-AGENTS.md"
  copy_file "$SRC_WS/MEMORY.md" "$WS/memory/MEMORY.md"
  copy_tree "$SRC_WS/memory" "$WS/memory"
  copy_tree "$SRC_WS/skills" "$WS/skills/imports/workspace"
  copy_tree "$SRC/skills" "$WS/skills/imports/managed"
  copy_tree "$SRC/cron" "$WS/cron"
  for cfg in openclaw.json clawdbot.json moltbot.json; do
    copy_file "$SRC/$cfg" "$WS/state/$cfg"
  done
fi

if [[ "$KIND" != "grok" && -f "$HOME/.grok/config.toml" ]]; then
  copy_file "$HOME/.grok/config.toml" "$WS/state/grok-config.toml"
fi

if [[ "$MIGRATE_SECRETS" == "1" ]]; then
  KEYS=(XAI_API_KEY OPENROUTER_API_KEY OPENAI_API_KEY ANTHROPIC_API_KEY HELIUS_API_KEY BIRDEYE_API_KEY DFLOW_API_KEY GEMINI_API_KEY DEEPSEEK_API_KEY TELEGRAM_BOT_TOKEN DISCORD_BOT_TOKEN SLACK_BOT_TOKEN SLACK_APP_TOKEN)
  for key in "${KEYS[@]}"; do
    val=""
    for f in "$SRC/.env" "$HOME/.grok/.env"; do
      if [[ -z "$val" ]]; then
        val="$(extract_env_value "$f" "$key")"
      fi
    done
    append_key "$DEST/.env" "$key" "$val"
  done
else
  warn "secrets not imported (re-run with --migrate-secrets to append allowlisted keys)"
fi

echo
ok "done. next: source $DEST/.env && clawdbot doctor"
[[ "$DRY" == "1" ]] && echo "  (dry-run — nothing written)"
exit 0
