package catalog

import (
	"os"
	"path/filepath"
	"sort"
)

const EnvZeroServiceDir = "CLAWDBOT_ZERO_SERVICE_DIR"

type zeroSpec struct {
	slug        string
	name        string
	kind        string
	category    string
	rel         string
	description string
	tags        []string
}

func zeroServiceSpecs() []zeroSpec {
	return []zeroSpec{
		{"zero-service", "Clawd Core AI service", "service", "Orchestration", "zero-service", "SSE bridge, Grok runner, MCP clawd + soltrader, Solana tools", []string{"zero", "mcp", "grok"}},
		{"clawd-frontend", "Clawd Bot control deck", "ui", "Orchestration", "clawdbot-frontend", "Grok-inspired command deck served same-origin", []string{"ui", "deck"}},
		{"pump-grok", "PumpFun Grok sidecar", "service", "Trading", "clawdbot-pumpfun", "Pump.fun analysis sidecar used by the control deck", []string{"pump", "grok"}},
		{"clawdbot", "Clawd Bot CLI", "cli", "Orchestration", "cmd/clawdbot", "Sovereign Solana agent CLI (OODA, catalog, laws, trade)", []string{"cli"}},
		{"clawdbot-tui", "Clawd Bot TUI", "cli", "Orchestration", "cmd/clawdbot-tui", "Terminal launcher for Clawd Bot", []string{"tui"}},
		{"clawd-frontend-cmd", "Clawd frontend server", "cli", "Orchestration", "cmd/clawd-frontend", "Go process that hosts the control deck", []string{"frontend"}},
	}
}

func defaultZeroServiceDir() string {
	if cwd, err := os.Getwd(); err == nil {
		for _, candidate := range walkCandidates(cwd, "zero-service") {
			if fileExists(candidate) {
				return filepath.Dir(candidate)
			}
		}
	}
	home, _ := os.UserHomeDir()
	return filepath.Join(home, ".clawdbot", "src")
}

// LoadZeroServices lists the zero-service and Clawd Bot runtimes users can enable.
func LoadZeroServices(repoRoot string) []PackageEntry {
	entries := make([]PackageEntry, 0, len(zeroServiceSpecs()))
	for _, spec := range zeroServiceSpecs() {
		dir := filepath.Join(repoRoot, spec.rel)
		entries = append(entries, PackageEntry{
			Slug:        spec.slug,
			Name:        spec.name,
			Description: spec.description,
			Category:    spec.category,
			Kind:        spec.kind,
			Source:      "zero-service",
			Dir:         dir,
			Present:     fileExists(dir),
			Selectable:  true,
			Tags:        append([]string{}, spec.tags...),
		})
	}
	sort.SliceStable(entries, func(i, j int) bool {
		return entries[i].Slug < entries[j].Slug
	})
	return entries
}
