// Command zero-windows-sandbox-setup prepares the Windows sandbox environment
// (ACLs, helper discovery) for Zero's restricted-token backend.
//
// Monorepo note: implementation is pkg/zerolib/sandbox (vendored from
// zero-main/internal/sandbox) so this builds inside the clawdbot module.
package main

import (
	"os"

	"github.com/8bitlabs/clawdbot/pkg/zerolib/sandbox"
)

func main() {
	os.Exit(sandbox.RunWindowsSandboxSetup(os.Args[1:], os.Stderr))
}
