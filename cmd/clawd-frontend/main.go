// Clawdbot Grok control deck — grok-4.6 via the xAI Responses API.
//
//	go run ./cmd/clawd-frontend -addr 127.0.0.1:18810
//
// Requires XAI_API_KEY. Optional: XAI_MODEL, XAI_MCP_URL, PUMP_GROK_URL.
package main

import (
	"context"
	"flag"
	"fmt"
	"log/slog"
	"os"
	"os/signal"
	"syscall"

	"github.com/8bitlabs/clawdbot/clawdbot-frontend"
	"github.com/8bitlabs/clawdbot/pkg/xai"
)

func main() {
	addr := flag.String("addr", envOr("CLAWD_FRONTEND_ADDR", "127.0.0.1:18810"), "listen address")
	flag.Parse()

	log := slog.New(slog.NewTextHandler(os.Stderr, nil))
	client, err := xai.NewFromEnv(xai.WithServiceTier(xai.ServiceTierPriority))
	if err != nil {
		fmt.Fprintf(os.Stderr, "clawd-frontend: %v\n", err)
		os.Exit(1)
	}

	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	srv := frontend.NewServer(client, log)
	if err := srv.ListenAndServe(ctx, *addr); err != nil {
		fmt.Fprintf(os.Stderr, "clawd-frontend: %v\n", err)
		os.Exit(1)
	}
}

func envOr(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}
