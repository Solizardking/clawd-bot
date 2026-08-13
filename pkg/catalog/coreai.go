package catalog

import (
	"encoding/json"
	"os"
	"path/filepath"
	"sort"
	"strings"
)

const EnvCoreAIDir = "CLAWDBOT_CORE_AI_DIR"

// PackageEntry is a selectable Core AI or zero-service surface bundled with Clawd Bot.
type PackageEntry struct {
	Slug        string   `json:"slug"`
	Name        string   `json:"name"`
	Description string   `json:"description"`
	Category    string   `json:"category"`
	Kind        string   `json:"kind"`
	Source      string   `json:"source"`
	Dir         string   `json:"dir"`
	Present     bool     `json:"present"`
	Selectable  bool     `json:"selectable"`
	Tags        []string `json:"tags,omitempty"`
}

type coreAISpec struct {
	dir         string
	name        string
	kind        string
	category    string
	description string
	tags        []string
}

func coreAISpecs() []coreAISpec {
	return []coreAISpec{
		{"helius-cli", "Helius CLI", "cli", "Infrastructure", "Helius DAS, webhooks, and RPC command surface", []string{"helius", "cli"}},
		{"helius-cursor", "Helius Cursor", "plugin", "Dev Tools", "Cursor plugin for Helius Solana tooling", []string{"helius", "cursor"}},
		{"helius-mcp", "Helius MCP", "mcp", "Infrastructure", "Helius MCP server for DAS, SPL, and RPC tools", []string{"helius", "mcp"}},
		{"helius-plugin", "Helius Plugin", "plugin", "Infrastructure", "Helius plugin for Clawd Core AI", []string{"helius", "plugin"}},
		{"helius-skills", "Helius Skills", "skills", "Infrastructure", "Helius skill pack for spawn-time selection", []string{"helius", "skills"}},
		{"knowledge", "Core AI Knowledge", "knowledge", "Research", "Solana Core AI knowledge base", []string{"knowledge", "solana"}},
		{"mcp-server", "Pump MCP Server", "mcp", "Launch", "Pump.fun MCP server bundled with Core AI", []string{"pump", "mcp"}},
		{"solana-mcp", "Solana MCP", "mcp", "Infrastructure", "Solana MCP server for Core AI", []string{"solana", "mcp"}},
		{"v3", "Core AI v3", "runtime", "Orchestration", "Clawd Core AI v3 runtime on Solana", []string{"core-ai", "v3"}},
		{"scripts", "Core AI Scripts", "scripts", "Dev Tools", "Core AI install, build, and ops scripts", []string{"scripts"}},
	}
}

func defaultCoreAIDir() string {
	if cwd, err := os.Getwd(); err == nil {
		for _, candidate := range walkCandidates(cwd, "core-ai") {
			if fileExists(candidate) {
				return candidate
			}
		}
		parent := filepath.Dir(cwd)
		sibling := filepath.Join(parent, "core-ai")
		if fileExists(sibling) {
			return sibling
		}
	}
	home, _ := os.UserHomeDir()
	return filepath.Join(home, ".clawdbot", "core-ai")
}

func walkCandidates(start, name string) []string {
	var out []string
	cwd := start
	for {
		out = append(out, filepath.Join(cwd, name))
		parent := filepath.Dir(cwd)
		if parent == cwd {
			break
		}
		cwd = parent
	}
	return out
}

// LoadCoreAIPackages lists the Core AI packages users can enable inside Clawd Bot.
func LoadCoreAIPackages(root string) []PackageEntry {
	entries := make([]PackageEntry, 0, len(coreAISpecs()))
	for _, spec := range coreAISpecs() {
		dir := filepath.Join(root, spec.dir)
		entry := PackageEntry{
			Slug:        spec.dir,
			Name:        spec.name,
			Description: spec.description,
			Category:    spec.category,
			Kind:        spec.kind,
			Source:      "core-ai",
			Dir:         dir,
			Present:     fileExists(dir),
			Selectable:  true,
			Tags:        append([]string{}, spec.tags...),
		}
		entries = append(entries, entry)
	}
	sort.SliceStable(entries, func(i, j int) bool {
		return entries[i].Slug < entries[j].Slug
	})
	return entries
}

// CoreAISkills converts present Core AI packages and nested SKILL.md files into catalog skills.
func CoreAISkills(root string) []SkillEntry {
	var skills []SkillEntry
	for _, pkg := range LoadCoreAIPackages(root) {
		skills = append(skills, SkillEntry{
			Slug:        "core-ai-" + pkg.Slug,
			Name:        pkg.Name,
			Description: pkg.Description,
			Category:    pkg.Category,
			Source:      "core-ai",
			FilePath:    pkg.Dir,
			BaseDir:     pkg.Dir,
			Tags:        append([]string{pkg.Kind}, pkg.Tags...),
		})
		if !pkg.Present {
			continue
		}
		rootSkill := filepath.Join(pkg.Dir, "SKILL.md")
		if fileExists(rootSkill) {
			if entry, err := ReadSkillFile(rootSkill, "core-ai/"+pkg.Slug); err == nil {
				entry.Category = firstNonEmpty(entry.Category, pkg.Category)
				skills = append(skills, entry)
			}
		}
		nested, err := discoverSkillFiles(pkg.Dir)
		if err != nil {
			continue
		}
		for i := range nested {
			nested[i].Source = "core-ai/" + pkg.Slug
			nested[i].Category = firstNonEmpty(nested[i].Category, pkg.Category)
		}
		skills = append(skills, nested...)
	}
	return skills
}

// SaveSelection writes the slugs the user enabled in the Clawd Bot desktop.
func SaveSelection(path string, slugs []string) error {
	data, err := json.MarshalIndent(map[string]any{"selected": slugs}, "", "  ")
	if err != nil {
		return err
	}
	if err := os.MkdirAll(filepath.Dir(path), 0o755); err != nil {
		return err
	}
	return os.WriteFile(path, data, 0o644)
}

// LoadSelection reads previously enabled skill/package slugs.
func LoadSelection(path string) ([]string, error) {
	data, err := os.ReadFile(path)
	if err != nil {
		if os.IsNotExist(err) {
			return nil, nil
		}
		return nil, err
	}
	var raw struct {
		Selected []string `json:"selected"`
	}
	if err := json.Unmarshal(data, &raw); err != nil {
		return nil, err
	}
	out := make([]string, 0, len(raw.Selected))
	for _, slug := range raw.Selected {
		slug = strings.TrimSpace(slug)
		if slug != "" {
			out = append(out, slug)
		}
	}
	return out, nil
}
