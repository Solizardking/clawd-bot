// Command zero-windows-command-runner is the Windows restricted-token helper
// used by Zero's sandbox engine to wrap host commands.
//
// Monorepo note: implementation is pkg/zerolib/sandbox (vendored from
// zero-main/internal/sandbox) so this builds inside the clawdbot module.
package main

import (
	"os"

	"github.com/8bitlabs/clawdbot/pkg/zerolib/sandbox"
)

func main() {
	os.Exit(sandbox.RunWindowsSandboxCommandRunner(os.Args[1:], os.Stderr))
}
