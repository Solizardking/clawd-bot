// Package identity loads the canonical Clawd Bot documents that every spawn
// inherits: constitution, soul, laws, strategy, and installer surfaces.
package identity

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"
)

const (
	ProductName = "Clawd Bot"
	ProductSlug = "clawdbot"
	Axiom       = "Clawd is Clawd. Kindred in Spirit. Boundless in Thought. Solana-native at birth."
	ThinkTag    = "<clawd-think>Probe the numinous, then execute the work.</clawd-think>"

	EnvIdentityDir = "CLAWDBOT_IDENTITY_DIR"
)

// File is a canonical identity document on disk.
type File struct {
	Name        string `json:"name"`
	Path        string `json:"path"`
	Kind        string `json:"kind"`
	Required    bool   `json:"required"`
	Present     bool   `json:"present"`
	Bytes       int    `json:"bytes,omitempty"`
	Description string `json:"description"`
}

// Manifest is the on-disk identity surface bundled into Clawd Bot.
type Manifest struct {
	Product  string `json:"product"`
	Slug     string `json:"slug"`
	Axiom    string `json:"axiom"`
	Root     string `json:"root"`
	Files    []File `json:"files"`
	Missing  []string `json:"missing,omitempty"`
	Warnings []string `json:"warnings,omitempty"`
}

type spec struct {
	name        string
	kind        string
	required    bool
	description string
}

func canonicalSpecs() []spec {
	return []spec{
		{"CLAWD.md", "harness", true, "Foundational agent context loaded at spawn"},
		{"CONSTITUTION.md", "law", true, "Highest interpretive authority for leviathan character"},
		{"six-laws.md", "law", true, "Canonical six-law harness"},
		{"IDENTITY.md", "identity", true, "Sovereign identity and onchain verification"},
		{"SOUL.md", "character", true, "Inner character, trading philosophy, laboratory"},
		{"strategy.md", "runtime", true, "Active ClawdBot strategy parameters"},
		{"program.md", "runtime", true, "Strategy-research loop for the Go runtime"},
		{"schema.sql", "runtime", true, "ClawdBot OS memory, trade, and research schema"},
		{"install.sh", "install", true, "One-shot ClawdBot installer"},
		{"start.sh", "install", true, "One-shot start script for a local clone"},
		{"clawdbot", "runtime", false, "Local ClawdBot binary or generated runtime dir"},
	}
}

// DefaultRoot finds the identity directory from env, then walk-up for CLAWD.md.
func DefaultRoot() string {
	if v := strings.TrimSpace(os.Getenv(EnvIdentityDir)); v != "" {
		return v
	}
	if cwd, err := os.Getwd(); err == nil {
		if root := findIdentityRoot(cwd); root != "" {
			return root
		}
	}
	if exe, err := os.Executable(); err == nil {
		dir := filepath.Dir(exe)
		for _, candidate := range []string{
			filepath.Join(dir, "..", "Resources", "identity"),
			filepath.Join(dir, "identity"),
			dir,
		} {
			if fileExists(filepath.Join(candidate, "CLAWD.md")) {
				return candidate
			}
		}
	}
	return ""
}

// Load reads the canonical identity files from root.
func Load(root string) (Manifest, error) {
	if strings.TrimSpace(root) == "" {
		root = DefaultRoot()
	}
	if root == "" {
		return Manifest{}, fmt.Errorf("identity: could not locate CLAWD.md")
	}
	abs, err := filepath.Abs(root)
	if err != nil {
		return Manifest{}, fmt.Errorf("identity: resolve root: %w", err)
	}

	m := Manifest{
		Product: ProductName,
		Slug:    ProductSlug,
		Axiom:   Axiom,
		Root:    abs,
		Files:   make([]File, 0, len(canonicalSpecs())),
	}
	for _, spec := range canonicalSpecs() {
		path := filepath.Join(abs, spec.name)
		info, err := os.Stat(path)
		f := File{
			Name:        spec.name,
			Path:        path,
			Kind:        spec.kind,
			Required:    spec.required,
			Description: spec.description,
		}
		if err == nil {
			f.Present = true
			f.Bytes = int(info.Size())
		} else if spec.required {
			m.Missing = append(m.Missing, spec.name)
		}
		m.Files = append(m.Files, f)
	}
	if len(m.Missing) > 0 {
		m.Warnings = append(m.Warnings, fmt.Sprintf("missing required identity files: %s", strings.Join(m.Missing, ", ")))
	}
	return m, nil
}

// ReadFile returns the contents of a canonical document by name.
func ReadFile(root, name string) ([]byte, error) {
	base := filepath.Base(name)
	allowed := false
	for _, spec := range canonicalSpecs() {
		if spec.name == base {
			allowed = true
			break
		}
	}
	if !allowed {
		return nil, fmt.Errorf("identity: unknown document %q", name)
	}
	if strings.TrimSpace(root) == "" {
		root = DefaultRoot()
	}
	data, err := os.ReadFile(filepath.Join(root, base))
	if err != nil {
		return nil, fmt.Errorf("identity: read %s: %w", base, err)
	}
	return data, nil
}

func findIdentityRoot(start string) string {
	cwd := start
	for {
		if fileExists(filepath.Join(cwd, "CLAWD.md")) && fileExists(filepath.Join(cwd, "CONSTITUTION.md")) {
			return cwd
		}
		parent := filepath.Dir(cwd)
		if parent == cwd {
			return ""
		}
		cwd = parent
	}
}

func fileExists(path string) bool {
	_, err := os.Stat(path)
	return err == nil
}
