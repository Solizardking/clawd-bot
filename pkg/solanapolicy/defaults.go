package solanapolicy

import (
	"os"
	"strconv"
	"strings"
)

const (
	// DefaultMaxSOLLamports is 0.5 SOL — matches MAX_SWAP_INPUT_AMOUNT.
	DefaultMaxSOLLamports uint64 = 500_000_000
	// DefaultMaxUSDCAmount is 500 USDC (6 decimals).
	DefaultMaxUSDCAmount uint64 = 500_000_000
	OwnershipProofPrefix        = "Sign to prove ownership of"
)

// DefaultTradingPolicy is the Clawd Telegram-bot signer policy.
//
// System Program is intentionally not in the program allowlist. Unlimited
// System instructions would override Transfer.lamports. Transfers are allowed
// only through the lamports cap rule. Create is allowed separately so wrapping
// SOL / ATA setup still works. exportPrivateKey is denied. There is no
// method=* ALLOW — that would bypass program and amount gates.
func DefaultTradingPolicy() Document {
	maxSOL := DefaultMaxSOLLamports
	if v := strings.TrimSpace(os.Getenv("POLICY_MAX_SOL_LAMPORTS")); v != "" {
		if n, err := strconv.ParseUint(v, 10, 64); err == nil && n > 0 {
			maxSOL = n
		}
	}
	maxUSDC := DefaultMaxUSDCAmount
	if v := strings.TrimSpace(os.Getenv("POLICY_MAX_USDC_AMOUNT")); v != "" {
		if n, err := strconv.ParseUint(v, 10, 64); err == nil && n > 0 {
			maxUSDC = n
		}
	}
	programs := []any{
		ComputeBudgetProgram,
		TokenProgram,
		Token2022Program,
		ATAProgram,
		JupiterV6Program,
	}
	if extra := strings.TrimSpace(os.Getenv("POLICY_EXTRA_PROGRAMS")); extra != "" {
		for _, p := range strings.Split(extra, ",") {
			p = strings.TrimSpace(p)
			if p != "" {
				programs = append(programs, p)
			}
		}
	}

	return Document{
		Version:   "1.0",
		Name:      "Clawd Telegram trading",
		ChainType: "solana",
		Rules: []Rule{
			{
				Name:       "Block private key exports",
				Method:     MethodExportKey,
				Conditions: []Condition{},
				Action:     ActionDeny,
			},
			{
				Name:   "Allow ownership-proof messages",
				Method: MethodSignMessage,
				Conditions: []Condition{
					{
						FieldSource: SourceMessage,
						Field:       "content",
						Operator:    "starts_with",
						Value:       OwnershipProofPrefix,
					},
				},
				Action: ActionAllow,
			},
			{
				Name:   "Allowlist swap programs",
				Method: MethodSignAndSend,
				Conditions: []Condition{
					{
						FieldSource: SourceProgram,
						Field:       "programId",
						Operator:    "in",
						Value:       programs,
					},
				},
				Action: ActionAllow,
			},
			{
				Name:   "Allow System Create",
				Method: MethodSignAndSend,
				Conditions: []Condition{
					{
						FieldSource: SourceSystem,
						Field:       "instructionName",
						Operator:    "eq",
						Value:       "Create",
					},
				},
				Action: ActionAllow,
			},
			{
				Name:   "Restrict SOL transfers",
				Method: MethodSignAndSend,
				Conditions: []Condition{
					{
						FieldSource: SourceSystem,
						Field:       "Transfer.lamports",
						Operator:    "lte",
						Value:       strconv.FormatUint(maxSOL, 10),
					},
				},
				Action: ActionAllow,
			},
			{
				Name:   "Restrict USDC TransferChecked",
				Method: MethodSignAndSend,
				Conditions: []Condition{
					{
						FieldSource: SourceToken,
						Field:       "TransferChecked.mint",
						Operator:    "eq",
						Value:       USDCMint,
					},
					{
						FieldSource: SourceToken,
						Field:       "TransferChecked.amount",
						Operator:    "lte",
						Value:       strconv.FormatUint(maxUSDC, 10),
					},
				},
				Action: ActionAllow,
			},
			{
				Name:   "Allowlist Token instructions",
				Method: MethodSignAndSend,
				Conditions: []Condition{
					{
						FieldSource: SourceToken,
						Field:       "instructionName",
						Operator:    "in",
						Value:       []any{"CloseAccount", "SyncNative", "InitializeAccount", "InitializeAccount3"},
					},
				},
				Action: ActionAllow,
			},
		},
	}
}
