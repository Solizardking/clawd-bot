# pkg/zerolib

Vendored Zero (Gitlawb/zero) libraries used by monorepo helper CLIs under
`cmd/zero-*`.

Go forbids importing another module's `internal/` packages even when that
module is present as a `replace` sibling. The clawdbot monorepo therefore
keeps a buildable copy of the helper libraries here:

| Package | Upstream source | Used by |
|---------|-----------------|---------|
| `review` | `zero-main/internal/review` | `cmd/zero-pr-review` |
| `release` | `zero-main/internal/release` | `cmd/zero-release` |
| `perfbench` | `zero-main/internal/perfbench` | `cmd/zero-perf-bench` |
| `sandbox` | `zero-main/internal/sandbox` | `cmd/zero-linux-sandbox`, `cmd/zero-seccomp`, `cmd/zero-windows-*` |
| `redaction` | `zero-main/internal/redaction` | sandbox grants |

Import path:

```go
import "github.com/8bitlabs/clawdbot/pkg/zerolib/sandbox"
```

When updating from upstream Zero, re-copy the matching `zero-main/internal/*`
trees and rewrite imports:

```text
github.com/Gitlawb/zero/internal/ → github.com/8bitlabs/clawdbot/pkg/zerolib/
```

Keep `release.BuildLdflags` pointed at `github.com/Gitlawb/zero/internal/cli.version`
so binaries built against the `zero-main` tree still stamp the correct version
symbol.
