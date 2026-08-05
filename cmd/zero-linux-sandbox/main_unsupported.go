//go:build !linux

// Non-Linux stub so monorepo `go build ./cmd/zero-linux-sandbox` succeeds
// on macOS/Windows developer machines. The real helper is Linux-only.
package main

import (
	"fmt"
	"os"
)

func main() {
	fmt.Fprintln(os.Stderr, "zero-linux-sandbox is only supported on Linux")
	os.Exit(2)
}
