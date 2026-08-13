// Clawd Bot desktop entrypoint for the macOS .app / DMG bundle.
package main

import (
	"context"
	"fmt"
	"os"
	"os/signal"
	"syscall"

	"github.com/8bitlabs/clawdbot/pkg/desktop"
	"github.com/8bitlabs/clawdbot/pkg/identity"
)

func main() {
	addr := envOr("CLAWD_DESKTOP_ADDR", "127.0.0.1:18810")
	opts := desktop.Options{
		Addr:        addr,
		UIDir:       os.Getenv("CLAWD_DESKTOP_UI"),
		IdentityDir: os.Getenv(identity.EnvIdentityDir),
		OpenBrowser: true,
	}
	s, err := desktop.New(opts, desktop.BundledUI())
	if err != nil {
		fmt.Fprintf(os.Stderr, "clawdbot-desktop: %v\n", err)
		os.Exit(1)
	}
	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()
	fmt.Fprintf(os.Stderr, "🦞 %s → http://%s\n", identity.ProductName, opts.Addr)
	if err := s.ListenAndServe(ctx); err != nil {
		fmt.Fprintf(os.Stderr, "clawdbot-desktop: %v\n", err)
		os.Exit(1)
	}
}

func envOr(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}
