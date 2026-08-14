package main

import (
	"context"
	"fmt"
	"os"
	"os/signal"
	"syscall"

	"github.com/spf13/cobra"

	"github.com/8bitlabs/clawdbot/pkg/desktop"
	"github.com/8bitlabs/clawdbot/pkg/identity"
)

func NewDesktopCommand() *cobra.Command {
	var addr, uiDir, identityDir, selection string
	var open bool

	cmd := &cobra.Command{
		Use:           "desktop",
		Aliases:       []string{"app", "dmg"},
		Short:         "Start the Clawd Bot desktop (skills picker + identity + zero services)",
		SilenceUsage:  true,
		SilenceErrors: false,
		Long: `Clawd Bot desktop host.

Serves the Grok-inspired control deck locally so users can choose which
Core AI skills and zero services to enable. Identity is loaded from
CLAWD.md, CONSTITUTION.md, SOUL.md, and the rest of the spawn canon.`,
		RunE: func(cmd *cobra.Command, args []string) error {
			opts := desktop.Options{
				Addr:          addr,
				UIDir:         uiDir,
				IdentityDir:   identityDir,
				SelectionPath: selection,
				OpenBrowser:   open,
			}
			s, err := desktop.New(opts, desktop.BundledUI())
			if err != nil {
				return err
			}
			fmt.Fprintf(cmd.ErrOrStderr(), "🦞 %s → http://%s\n", identity.ProductName, opts.Addr)
			ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
			defer stop()
			return s.ListenAndServe(ctx)
		},
	}
	cmd.Flags().StringVar(&addr, "addr", "127.0.0.1:18810", "listen address")
	cmd.Flags().StringVar(&uiDir, "ui", "", "override UI directory (defaults to bundled)")
	cmd.Flags().StringVar(&identityDir, "identity", "", "canonical identity directory")
	cmd.Flags().StringVar(&selection, "selection", "", "selected-skills.json path")
	cmd.Flags().BoolVar(&open, "open", true, "open a browser window")
	return cmd
}
