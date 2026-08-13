// Clawd Telegram trading bot — Privy bot-first wallets, DFlow /order, Solana policies.
//
//	export TELEGRAM_BOT_TOKEN=...
//	go run ./cmd/clawd-telegram
package main

import (
	"context"
	"fmt"
	"log/slog"
	"os"
	"os/signal"
	"syscall"

	"github.com/8bitlabs/clawdbot/pkg/tgtrade"
)

func main() {
	log := slog.New(slog.NewTextHandler(os.Stderr, nil))
	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	if err := tgtrade.Run(ctx, log); err != nil {
		fmt.Fprintf(os.Stderr, "clawd-telegram: %v\n", err)
		os.Exit(1)
	}
}
