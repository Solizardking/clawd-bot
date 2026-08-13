// PumpFun Grok sidecar — grok-4.6 via the xAI Responses API.
//
// Usage:
//
//	go run ./cmd/pump-grok -addr 127.0.0.1:8788
//
// Requires XAI_API_KEY. Optional: XAI_MODEL, XAI_BASE_URL, XAI_MCP_URL, XAI_MCP_LABEL.
package main

import (
	"context"
	"flag"
	"fmt"
	"log/slog"
	"os"
	"os/signal"
	"syscall"

	"github.com/8bitlabs/clawdbot/clawdbot-pumpfun/grok"
	"github.com/8bitlabs/clawdbot/pkg/xai"
)

func main() {
	addr := flag.String("addr", envOr("PUMP_GROK_ADDR", "127.0.0.1:8788"), "listen address")
	flag.Parse()

	log := slog.New(slog.NewTextHandler(os.Stderr, nil))
	client, err := xai.NewFromEnv(xai.WithServiceTier(xai.ServiceTierPriority))
	if err != nil {
		fmt.Fprintf(os.Stderr, "pump-grok: %v\n", err)
		os.Exit(1)
	}

	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	srv := grok.NewServer(client, log)
	if err := srv.ListenAndServe(ctx, *addr); err != nil {
		fmt.Fprintf(os.Stderr, "pump-grok: %v\n", err)
		os.Exit(1)
	}
}

func envOr(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}
