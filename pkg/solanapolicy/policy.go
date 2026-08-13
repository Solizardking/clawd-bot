package solanapolicy

import (
	"encoding/json"
	"fmt"
	"strconv"
	"strings"
)

// Well-known Solana program IDs and mints used by Clawd trading policies.
const (
	ComputeBudgetProgram = "ComputeBudget111111111111111111111111111111"
	SystemProgram        = "11111111111111111111111111111111"
	TokenProgram         = "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
	Token2022Program     = "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
	ATAProgram           = "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
	JupiterV6Program     = "JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4"
	USDCMint             = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
	WSOLMint             = "So11111111111111111111111111111111111111112"

	MethodSignAndSend = "signAndSendTransaction"
	MethodSignMessage = "signMessage"
	MethodExportKey   = "exportPrivateKey"
	MethodAny         = "*"

	ActionAllow = "ALLOW"
	ActionDeny  = "DENY"

	SourceProgram = "solana_program_instruction"
	SourceSystem  = "solana_system_program_instruction"
	SourceToken   = "solana_token_program_instruction"
	SourceMessage = "message"
	SourceClock   = "system"
)

// Document is a Privy policy JSON document.
type Document struct {
	Version   string `json:"version"`
	Name      string `json:"name"`
	ChainType string `json:"chain_type"`
	Rules     []Rule `json:"rules"`
}

// Rule is one ALLOW or DENY clause.
type Rule struct {
	Name       string      `json:"name"`
	Method     string      `json:"method"`
	Conditions []Condition `json:"conditions"`
	Action     string      `json:"action"`
}

// Condition is one field comparison. Value may be a string or a string array.
type Condition struct {
	FieldSource string `json:"field_source"`
	Field       string `json:"field"`
	Operator    string `json:"operator"`
	Value       any    `json:"value"`
}

// Instruction is the local view of one compiled Solana instruction.
// AddressFromALT must be true when Transfer.to / Transfer.from were resolved
// only from an Address Lookup Table — evaluation then fails closed.
type Instruction struct {
	ProgramID      string
	Name           string
	Lamports       uint64
	TransferFrom   string
	TransferTo     string
	TokenMint      string
	TokenAmount    uint64
	AddressFromALT bool
}

// Message is a signMessage payload.
type Message struct {
	Content    string
	ByteLength int
}

// Request is one wallet action to evaluate.
type Request struct {
	Method       string
	Instructions []Instruction
	Message      *Message
	UnixTime     int64
}

// Decision is the evaluation result.
type Decision struct {
	Allow  bool
	Rule   string
	Reason string
}

func (d Decision) String() string {
	if d.Allow {
		return "allow"
	}
	if d.Reason == "" {
		return "deny"
	}
	return "deny: " + d.Reason
}

// Parse unmarshals a Privy policy document.
func Parse(raw []byte) (Document, error) {
	var doc Document
	if err := json.Unmarshal(raw, &doc); err != nil {
		return Document{}, fmt.Errorf("solanapolicy: parse: %w", err)
	}
	if strings.TrimSpace(doc.Version) == "" {
		doc.Version = "1.0"
	}
	if strings.TrimSpace(doc.ChainType) == "" {
		doc.ChainType = "solana"
	}
	return doc, nil
}

func (c Condition) stringValue() string {
	switch v := c.Value.(type) {
	case string:
		return v
	case json.Number:
		return v.String()
	case float64:
		return strconv.FormatInt(int64(v), 10)
	case int:
		return strconv.Itoa(v)
	case int64:
		return strconv.FormatInt(v, 10)
	case uint64:
		return strconv.FormatUint(v, 10)
	default:
		return fmt.Sprint(v)
	}
}

func (c Condition) stringList() []string {
	switch v := c.Value.(type) {
	case []string:
		return v
	case []any:
		out := make([]string, 0, len(v))
		for _, item := range v {
			out = append(out, fmt.Sprint(item))
		}
		return out
	case string:
		return []string{v}
	default:
		s := c.stringValue()
		if s == "" || s == "<nil>" {
			return nil
		}
		return []string{s}
	}
}

func (c Condition) uintValue() (uint64, bool) {
	switch v := c.Value.(type) {
	case uint64:
		return v, true
	case int64:
		if v < 0 {
			return 0, false
		}
		return uint64(v), true
	case float64:
		if v < 0 {
			return 0, false
		}
		return uint64(v), true
	case json.Number:
		n, err := v.Int64()
		if err != nil || n < 0 {
			return 0, false
		}
		return uint64(n), true
	case string:
		n, err := strconv.ParseUint(strings.TrimSpace(v), 10, 64)
		if err != nil {
			return 0, false
		}
		return n, true
	default:
		n, err := strconv.ParseUint(strings.TrimSpace(fmt.Sprint(v)), 10, 64)
		if err != nil {
			return 0, false
		}
		return n, true
	}
}
