package birth

import (
	"encoding/json"
	"os"
	"path/filepath"
	"strings"
	"testing"
)

func TestClawdBrowserModulesListIncludesRequiredPaths(t *testing.T) {
	needles := []string{
		"zero-service/src/clawd",
		"zero-service/src/mcp-clawd.mjs",
		"zero-service/src/mcp-soltrader.mjs",
		"zero-service/src/zero-runner.mjs",
		"zero-service/src/server.mjs",
		"zero-service/src/clawd/providers.mjs",
		"zero-service/src/clawd/rh-launch.mjs",
	}
	joined := strings.Join(ClawdBrowserZeroServiceModules, "\n")
	for _, n := range needles {
		if !strings.Contains(joined, n) {
			t.Fatalf("module list missing %q", n)
		}
	}
}

func TestProbeClawdBrowserModulesOnThisMachine(t *testing.T) {
	// Default root is the developer's ClawdBrowser checkout.
	report := ProbeClawdBrowserModules()
	if report.Root == "" {
		t.Fatal("empty root")
	}
	// If the tree is present, every module must resolve; if not, Missing is non-empty.
	if report.OK {
		for _, m := range report.Modules {
			if !m.Exists {
				t.Fatalf("OK=true but missing %s", m.Abs)
			}
			if !strings.HasPrefix(m.Abs, report.Root) {
				t.Fatalf("abs path not under root: %s", m.Abs)
			}
		}
	} else if len(report.Missing) == 0 {
		t.Fatal("OK=false but no missing list")
	}
}

func TestLoadSolGptToolNamesFromRepo(t *testing.T) {
	root, err := FindRepoRoot("")
	if err != nil {
		// try relative from package dir
		root, err = FindRepoRoot("../..")
		if err != nil {
			t.Fatalf("FindRepoRoot: %v", err)
		}
	}
	meta, err := LoadSolGptToolNames(root)
	if err != nil {
		t.Fatal(err)
	}
	if meta.Count < 171 {
		t.Fatalf("tool count %d < 171 (expected full SOL GPT catalog)", meta.Count)
	}
	if meta.CoreCount < 100 {
		t.Fatalf("core count %d too low", meta.CoreCount)
	}
	if len(meta.Names) != meta.Count {
		t.Fatalf("names len %d != count %d", len(meta.Names), meta.Count)
	}
	// Spot-check critical non-custodial + research tools
	set := map[string]bool{}
	for _, n := range meta.Names {
		set[n] = true
	}
	for _, n := range []string{
		"search_tools",
		"get_price",
		"prepare_user_swap",
		"prepare_user_transfer",
		"get_net_worth",
		"browse_web",
	} {
		if !set[n] {
			t.Fatalf("catalog missing required tool %q", n)
		}
	}
}

func TestWriteBirthAccessArtifacts(t *testing.T) {
	root, err := FindRepoRoot("../..")
	if err != nil {
		root, err = FindRepoRoot("")
		if err != nil {
			t.Fatalf("repo root: %v", err)
		}
	}
	ws := t.TempDir()
	if err := WriteBirthAccessArtifacts(ws, root); err != nil {
		t.Fatal(err)
	}
	for _, name := range []string{
		"clawdbrowser-modules.json",
		"sol-gpt-tools.json",
		"sol-gpt-tool-names.json",
		"CLAWDBROWSER_BIRTH.md",
	} {
		p := filepath.Join(ws, name)
		if _, err := os.Stat(p); err != nil {
			t.Fatalf("missing birth artifact %s: %v", name, err)
		}
	}
	md, err := os.ReadFile(filepath.Join(ws, "CLAWDBROWSER_BIRTH.md"))
	if err != nil {
		t.Fatal(err)
	}
	for _, needle := range []string{
		"mcp-clawd.mjs",
		"SOL GPT",
		"prepare_user_swap",
		ClawdBrowserRoot(),
	} {
		if !strings.Contains(string(md), needle) {
			t.Fatalf("birth md missing %q", needle)
		}
	}
	var report ModuleAccessReport
	raw, _ := os.ReadFile(filepath.Join(ws, "clawdbrowser-modules.json"))
	if err := json.Unmarshal(raw, &report); err != nil {
		t.Fatal(err)
	}
	if len(report.Modules) != len(ClawdBrowserZeroServiceModules) {
		t.Fatalf("module count %d want %d", len(report.Modules), len(ClawdBrowserZeroServiceModules))
	}
}
