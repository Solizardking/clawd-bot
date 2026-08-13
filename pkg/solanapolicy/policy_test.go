package solanapolicy_test

import (
	"testing"

	"github.com/8bitlabs/clawdbot/pkg/solanapolicy"
)

func TestDefaultPolicyAllowsSwapShape(t *testing.T) {
	t.Parallel()
	doc := solanapolicy.DefaultTradingPolicy()
	if solanapolicy.OverrideRisk(doc) {
		t.Fatal("default policy has the Transfer-name override anti-pattern")
	}

	req := solanapolicy.Request{
		Method: solanapolicy.MethodSignAndSend,
		Instructions: []solanapolicy.Instruction{
			{ProgramID: solanapolicy.ComputeBudgetProgram, Name: "SetComputeUnitLimit"},
			{ProgramID: solanapolicy.JupiterV6Program, Name: "Route"},
			{ProgramID: solanapolicy.SystemProgram, Name: "Transfer", Lamports: 100_000_000},
			{ProgramID: solanapolicy.TokenProgram, Name: "TransferChecked", TokenMint: solanapolicy.USDCMint, TokenAmount: 1_000_000},
			{ProgramID: solanapolicy.SystemProgram, Name: "Create"},
		},
	}
	got := solanapolicy.Evaluate(doc, req)
	if !got.Allow {
		t.Fatalf("swap shape denied: %s", got)
	}
}

func TestEvaluateTable(t *testing.T) {
	t.Parallel()
	doc := solanapolicy.DefaultTradingPolicy()

	cases := []struct {
		name  string
		req   solanapolicy.Request
		allow bool
	}{
		{
			name: "oversized SOL transfer",
			req: solanapolicy.Request{
				Method: solanapolicy.MethodSignAndSend,
				Instructions: []solanapolicy.Instruction{
					{ProgramID: solanapolicy.SystemProgram, Name: "Transfer", Lamports: 2_000_000_000},
				},
			},
		},
		{
			name: "unknown program",
			req: solanapolicy.Request{
				Method: solanapolicy.MethodSignAndSend,
				Instructions: []solanapolicy.Instruction{
					{ProgramID: "NoSuchProgram111111111111111111111111111", Name: "Mystery"},
				},
			},
		},
		{
			name: "export private key denied",
			req:  solanapolicy.Request{Method: solanapolicy.MethodExportKey},
		},
		{
			name: "ownership proof message",
			req: solanapolicy.Request{
				Method:  solanapolicy.MethodSignMessage,
				Message: &solanapolicy.Message{Content: solanapolicy.OwnershipProofPrefix + " abc", ByteLength: 40},
			},
			allow: true,
		},
		{
			name: "random message denied",
			req: solanapolicy.Request{
				Method:  solanapolicy.MethodSignMessage,
				Message: &solanapolicy.Message{Content: "please sign this airdrop", ByteLength: 24},
			},
		},
		{
			name: "compute budget only",
			req: solanapolicy.Request{
				Method: solanapolicy.MethodSignAndSend,
				Instructions: []solanapolicy.Instruction{
					{ProgramID: solanapolicy.ComputeBudgetProgram},
				},
			},
			allow: true,
		},
	}

	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {
			t.Parallel()
			got := solanapolicy.Evaluate(doc, tc.req)
			if got.Allow != tc.allow {
				t.Fatalf("allow=%v want=%v (%s)", got.Allow, tc.allow, got)
			}
		})
	}
}

func TestRecipientAllowAndDeny(t *testing.T) {
	t.Parallel()
	recipient := "4tFqt2qzaNsnZqcpjPiyqYw9LdRzxaZdX2ewPncYEWLA"
	allowDoc := solanapolicy.Document{
		Version:   "1.0",
		Name:      "allow recipient",
		ChainType: "solana",
		Rules: []solanapolicy.Rule{{
			Name:   "cap and allowlist",
			Method: solanapolicy.MethodSignAndSend,
			Conditions: []solanapolicy.Condition{
				{FieldSource: solanapolicy.SourceSystem, Field: "Transfer.lamports", Operator: "lte", Value: "1000000000"},
				{FieldSource: solanapolicy.SourceSystem, Field: "Transfer.to", Operator: "in", Value: []any{recipient}},
			},
			Action: solanapolicy.ActionAllow,
		}},
	}
	denyDoc := solanapolicy.Document{
		Version:   "1.0",
		Name:      "deny recipient",
		ChainType: "solana",
		Rules: []solanapolicy.Rule{{
			Name:   "denylist",
			Method: solanapolicy.MethodSignAndSend,
			Conditions: []solanapolicy.Condition{
				{FieldSource: solanapolicy.SourceSystem, Field: "Transfer.to", Operator: "in", Value: []any{recipient}},
			},
			Action: solanapolicy.ActionDeny,
		}, {
			Name:   "allow other transfers",
			Method: solanapolicy.MethodSignAndSend,
			Conditions: []solanapolicy.Condition{
				{FieldSource: solanapolicy.SourceSystem, Field: "Transfer.lamports", Operator: "lte", Value: "1000000000"},
			},
			Action: solanapolicy.ActionAllow,
		}},
	}

	ix := solanapolicy.Instruction{
		ProgramID:  solanapolicy.SystemProgram,
		Name:       "Transfer",
		Lamports:   1,
		TransferTo: recipient,
	}
	req := solanapolicy.Request{Method: solanapolicy.MethodSignAndSend, Instructions: []solanapolicy.Instruction{ix}}

	if got := solanapolicy.Evaluate(allowDoc, req); !got.Allow {
		t.Fatalf("allowlist denied: %s", got)
	}
	if got := solanapolicy.Evaluate(denyDoc, req); got.Allow {
		t.Fatal("denylist allowed blocked recipient")
	}

	other := req
	other.Instructions = []solanapolicy.Instruction{{
		ProgramID:  solanapolicy.SystemProgram,
		Name:       "Transfer",
		Lamports:   1,
		TransferTo: "11111111111111111111111111111112",
	}}
	if got := solanapolicy.Evaluate(allowDoc, other); got.Allow {
		t.Fatal("allowlist accepted unknown recipient")
	}
	if got := solanapolicy.Evaluate(denyDoc, other); !got.Allow {
		t.Fatalf("denylist blocked other recipient: %s", got)
	}

	alt := solanapolicy.Evaluate(allowDoc, solanapolicy.Request{
		Method: solanapolicy.MethodSignAndSend,
		Instructions: []solanapolicy.Instruction{{
			ProgramID:      solanapolicy.SystemProgram,
			Name:           "Transfer",
			Lamports:       1,
			TransferTo:     recipient,
			AddressFromALT: true,
		}},
	})
	if alt.Allow {
		t.Fatal("address-based policy must fail closed for ALT-only addresses")
	}
}

func TestTimeWindow(t *testing.T) {
	t.Parallel()
	doc := solanapolicy.Document{
		Version:   "1.0",
		Name:      "september 2025",
		ChainType: "solana",
		Rules: []solanapolicy.Rule{{
			Name:   "window",
			Method: solanapolicy.MethodSignAndSend,
			Conditions: []solanapolicy.Condition{
				{FieldSource: solanapolicy.SourceClock, Field: "current_unix_timestamp", Operator: "gte", Value: "1756699200"},
				{FieldSource: solanapolicy.SourceClock, Field: "current_unix_timestamp", Operator: "lt", Value: "1759291200"},
			},
			Action: solanapolicy.ActionAllow,
		}},
	}
	ix := []solanapolicy.Instruction{{ProgramID: solanapolicy.ComputeBudgetProgram}}
	inside := solanapolicy.Evaluate(doc, solanapolicy.Request{
		Method: solanapolicy.MethodSignAndSend, Instructions: ix, UnixTime: 1756700000,
	})
	if !inside.Allow {
		t.Fatalf("inside window denied: %s", inside)
	}
	outside := solanapolicy.Evaluate(doc, solanapolicy.Request{
		Method: solanapolicy.MethodSignAndSend, Instructions: ix, UnixTime: 1700000000,
	})
	if outside.Allow {
		t.Fatal("outside window allowed")
	}
}

func TestOverrideRisk(t *testing.T) {
	t.Parallel()
	doc := solanapolicy.Document{
		Rules: []solanapolicy.Rule{
			{
				Name:   "cap",
				Method: solanapolicy.MethodSignAndSend,
				Conditions: []solanapolicy.Condition{
					{FieldSource: solanapolicy.SourceSystem, Field: "Transfer.lamports", Operator: "lte", Value: "1000000000"},
				},
				Action: solanapolicy.ActionAllow,
			},
			{
				Name:   "override",
				Method: solanapolicy.MethodSignAndSend,
				Conditions: []solanapolicy.Condition{
					{FieldSource: solanapolicy.SourceSystem, Field: "instructionName", Operator: "eq", Value: "Transfer"},
				},
				Action: solanapolicy.ActionAllow,
			},
		},
	}
	if !solanapolicy.OverrideRisk(doc) {
		t.Fatal("expected override risk")
	}
	req := solanapolicy.Request{
		Method: solanapolicy.MethodSignAndSend,
		Instructions: []solanapolicy.Instruction{
			{ProgramID: solanapolicy.SystemProgram, Name: "Transfer", Lamports: 9_000_000_000},
		},
	}
	got := solanapolicy.Evaluate(doc, req)
	if !got.Allow {
		t.Fatal("anti-pattern should allow oversized transfer via the name rule")
	}
}

func TestExportDenyWinsOverStarAllow(t *testing.T) {
	t.Parallel()
	doc := solanapolicy.Document{
		Rules: []solanapolicy.Rule{
			{Name: "block export", Method: solanapolicy.MethodExportKey, Action: solanapolicy.ActionDeny},
			{Name: "allow rest", Method: solanapolicy.MethodAny, Action: solanapolicy.ActionAllow},
		},
	}
	if got := solanapolicy.Evaluate(doc, solanapolicy.Request{Method: solanapolicy.MethodExportKey}); got.Allow {
		t.Fatal("export should stay denied")
	}
	if got := solanapolicy.Evaluate(doc, solanapolicy.Request{Method: "signTransaction"}); !got.Allow {
		t.Fatalf("other methods should allow: %s", got)
	}
}
