package birth

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"strings"
	"time"
)

// DefaultClawdBrowserRoot is $HOME/ClawdBrowser. Override with CLAWDBROWSER_ROOT.
func DefaultClawdBrowserRoot() string {
	if home, err := os.UserHomeDir(); err == nil && strings.TrimSpace(home) != "" {
		return filepath.Join(home, "ClawdBrowser")
	}
	return "ClawdBrowser"
}

// Relative zero-service modules every birth surface must be able to resolve.
var ClawdBrowserZeroServiceModules = []string{
	"zero-service/src/clawd",
	"zero-service/src/clawd/gateway.mjs",
	"zero-service/src/clawd/hold.mjs",
	"zero-service/src/clawd/keys.mjs",
	"zero-service/src/clawd/providers.mjs",
	"zero-service/src/clawd/rh-launch.mjs",
	"zero-service/src/clawd/store.mjs",
	"zero-service/src/clawd/usage.mjs",
	"zero-service/src/cors.mjs",
	"zero-service/src/dflow.mjs",
	"zero-service/src/mcp-clawd.mjs",
	"zero-service/src/mcp-soltrader.mjs",
	"zero-service/src/openapi.mjs",
	"zero-service/src/server.mjs",
	"zero-service/src/smoke.mjs",
	"zero-service/src/solana-config.mjs",
	"zero-service/src/zero-runner.mjs",
}

// SolGptToolCatalogFile is the monorepo snapshot of the SOL GPT shipped catalog.
const SolGptToolCatalogFile = "catalogs/sol-gpt-tools.json"

// SolGptToolNamesFile is the sorted name list for fast birth assertions.
const SolGptToolNamesFile = "catalogs/sol-gpt-tool-names.json"

// ClawdBrowserRoot returns CLAWDBROWSER_ROOT or the default absolute path.
func ClawdBrowserRoot() string {
	if v := strings.TrimSpace(os.Getenv("CLAWDBROWSER_ROOT")); v != "" {
		return filepath.Clean(v)
	}
	return DefaultClawdBrowserRoot()
}

// ResolveClawdBrowserPath joins root with a relative module path.
func ResolveClawdBrowserPath(rel string) string {
	return filepath.Join(ClawdBrowserRoot(), filepath.FromSlash(rel))
}

// ClawdMCPServerPath is the official Clawd MCP stdio entry (mcp-clawd.mjs).
func ClawdMCPServerPath() string {
	return ResolveClawdBrowserPath("zero-service/src/mcp-clawd.mjs")
}

// ClawdSolTraderMCPPath is ClawdBrowser's soltrader MCP entry.
func ClawdSolTraderMCPPath() string {
	return ResolveClawdBrowserPath("zero-service/src/mcp-soltrader.mjs")
}

// ModuleAccessReport lists absolute paths and whether each birth module exists.
type ModuleAccessReport struct {
	Root      string            `json:"root"`
	Generated string            `json:"generatedAt"`
	Modules   []ModulePathEntry `json:"modules"`
	Missing   []string          `json:"missing,omitempty"`
	OK        bool              `json:"ok"`
}

type ModulePathEntry struct {
	Rel  string `json:"rel"`
	Abs  string `json:"abs"`
	Exists bool `json:"exists"`
}

// ProbeClawdBrowserModules checks that every required zero-service module is present.
func ProbeClawdBrowserModules() ModuleAccessReport {
	report := ModuleAccessReport{
		Root:      ClawdBrowserRoot(),
		Generated: time.Now().UTC().Format(time.RFC3339),
		Modules:   make([]ModulePathEntry, 0, len(ClawdBrowserZeroServiceModules)),
		OK:        true,
	}
	for _, rel := range ClawdBrowserZeroServiceModules {
		abs := ResolveClawdBrowserPath(rel)
		_, err := os.Stat(abs)
		exists := err == nil
		report.Modules = append(report.Modules, ModulePathEntry{Rel: rel, Abs: abs, Exists: exists})
		if !exists {
			report.OK = false
			report.Missing = append(report.Missing, abs)
		}
	}
	return report
}

// SolGptCatalogMeta is the birth-facing subset of catalogs/sol-gpt-tools.json.
type SolGptCatalogMeta struct {
	GeneratedAt string `json:"generatedAt"`
	Source      string `json:"source"`
	Count       int    `json:"count"`
	CoreCount   int    `json:"coreCount"`
	Names       []string `json:"names"`
	CoreNames   []string `json:"coreNames"`
}

// LoadSolGptToolNames loads the committed name list from monorepo root.
func LoadSolGptToolNames(repoRoot string) (SolGptCatalogMeta, error) {
	path := filepath.Join(repoRoot, SolGptToolNamesFile)
	raw, err := os.ReadFile(path)
	if err != nil {
		return SolGptCatalogMeta{}, fmt.Errorf("read sol-gpt tool names: %w", err)
	}
	var meta SolGptCatalogMeta
	if err := json.Unmarshal(raw, &meta); err != nil {
		return SolGptCatalogMeta{}, fmt.Errorf("parse sol-gpt tool names: %w", err)
	}
	if meta.Count == 0 && len(meta.Names) > 0 {
		meta.Count = len(meta.Names)
	}
	return meta, nil
}

// FormatClawdBrowserAccessMarkdown is written into the agent workspace at birth.
func FormatClawdBrowserAccessMarkdown(report ModuleAccessReport, catalog SolGptCatalogMeta) string {
	var b strings.Builder
	b.WriteString("# ClawdBrowser zero-service + SOL GPT tools (birth)\n\n")
	b.WriteString("Every model spawn gets path access to the ClawdBrowser zero-service surface and the full SOL GPT tool catalog.\n\n")
	fmt.Fprintf(&b, "- **CLAWDBROWSER_ROOT:** `%s`\n", report.Root)
	fmt.Fprintf(&b, "- **Clawd MCP entry:** `%s`\n", ClawdMCPServerPath())
	fmt.Fprintf(&b, "- **Modules OK:** %v\n", report.OK)
	if len(report.Missing) > 0 {
		b.WriteString("- **Missing modules:**\n")
		for _, m := range report.Missing {
			fmt.Fprintf(&b, "  - `%s`\n", m)
		}
	}
	b.WriteString("\n## Required modules\n\n")
	for _, m := range report.Modules {
		status := "missing"
		if m.Exists {
			status = "ok"
		}
		fmt.Fprintf(&b, "- [%s] `%s`\n", status, m.Abs)
	}
	b.WriteString("\n## SOL GPT tool catalog (all models)\n\n")
	fmt.Fprintf(&b, "- **Shipped tools:** %d (core first-turn: %d)\n", catalog.Count, catalog.CoreCount)
	fmt.Fprintf(&b, "- **Source:** `%s`\n", catalog.Source)
	fmt.Fprintf(&b, "- **Workspace copy:** `sol-gpt-tools.json` / `sol-gpt-tool-names.json`\n")
	b.WriteString("- **Custody:** research tools stream JSON; live spends use user-signed prepare_* only (no server hot wallet).\n")
	b.WriteString("- **Providers:** Kimi/Moonshot, OpenRouter Laguna, Poolside Laguna, Claude Opus 5, DeepSeek Responses, xAI Grok — same catalog.\n\n")
	b.WriteString("### Core tool names (always on for Kimi first turn)\n\n")
	for _, n := range catalog.CoreNames {
		fmt.Fprintf(&b, "- `%s`\n", n)
	}
	b.WriteString("\n### Full tool names\n\n")
	for _, n := range catalog.Names {
		fmt.Fprintf(&b, "- `%s`\n", n)
	}
	return b.String()
}

// WriteBirthAccessArtifacts writes module report, catalog copies, and operator markdown into workspace.
func WriteBirthAccessArtifacts(workspace, repoRoot string) error {
	if strings.TrimSpace(workspace) == "" {
		return fmt.Errorf("workspace is required")
	}
	if err := os.MkdirAll(workspace, 0o755); err != nil {
		return err
	}

	report := ProbeClawdBrowserModules()
	reportPath := filepath.Join(workspace, "clawdbrowser-modules.json")
	reportRaw, err := json.MarshalIndent(report, "", "  ")
	if err != nil {
		return err
	}
	if err := os.WriteFile(reportPath, append(reportRaw, '\n'), 0o644); err != nil {
		return fmt.Errorf("write module report: %w", err)
	}

	// Copy committed catalogs into workspace (full + names).
	for _, rel := range []string{SolGptToolCatalogFile, SolGptToolNamesFile} {
		src := filepath.Join(repoRoot, rel)
		dst := filepath.Join(workspace, filepath.Base(rel))
		raw, err := os.ReadFile(src)
		if err != nil {
			return fmt.Errorf("read %s: %w", rel, err)
		}
		if err := os.WriteFile(dst, raw, 0o644); err != nil {
			return fmt.Errorf("write %s: %w", dst, err)
		}
	}

	catalog, err := LoadSolGptToolNames(repoRoot)
	if err != nil {
		return err
	}
	md := FormatClawdBrowserAccessMarkdown(report, catalog)
	if err := os.WriteFile(filepath.Join(workspace, "CLAWDBROWSER_BIRTH.md"), []byte(md), 0o644); err != nil {
		return fmt.Errorf("write CLAWDBROWSER_BIRTH.md: %w", err)
	}
	return nil
}

// FindRepoRoot walks up from start (or cwd) looking for go.mod + catalogs/sol-gpt-tools.json.
// Also checks CLAWDBOT_REPO_ROOT and a well-known local monorepo path.
func FindRepoRoot(start string) (string, error) {
	candidates := []string{}
	if v := strings.TrimSpace(os.Getenv("CLAWDBOT_REPO_ROOT")); v != "" {
		candidates = append(candidates, v)
	}
	if start == "" {
		if wd, err := os.Getwd(); err == nil {
			start = wd
		}
	}
	if start != "" {
		candidates = append(candidates, start)
	}

	seen := map[string]bool{}
	for _, c := range candidates {
		c = filepath.Clean(c)
		if c == "" || seen[c] {
			continue
		}
		seen[c] = true
		// Walk upward from each candidate.
		dir := c
		for {
			if fileExists(filepath.Join(dir, "go.mod")) && fileExists(filepath.Join(dir, SolGptToolCatalogFile)) {
				return dir, nil
			}
			parent := filepath.Dir(dir)
			if parent == dir {
				break
			}
			dir = parent
		}
	}
	return "", fmt.Errorf("repo root not found (need go.mod + %s)", SolGptToolCatalogFile)
}

func fileExists(path string) bool {
	_, err := os.Stat(path)
	return err == nil
}
