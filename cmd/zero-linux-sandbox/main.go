//go:build linux

// Command zero-linux-sandbox is the bubblewrap/landlock helper for Zero's
// Linux sandbox. Built as a sibling of the zero binary and invoked by the
// sandbox engine when wrapping host commands.
//
// Monorepo note: sources live under pkg/zerolib/sandbox (vendored from
// zero-main/internal/sandbox) so this package builds inside the clawdbot
// module without crossing Go's internal/ import boundary.
package main

import (
	"os"

	"github.com/8bitlabs/clawdbot/pkg/zerolib/sandbox"
)

func main() {
	os.Exit(sandbox.RunLinuxSandboxHelper(os.Args[1:], os.Stderr))
}
