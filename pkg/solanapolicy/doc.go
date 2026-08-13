// Package solanapolicy evaluates Privy-style Solana wallet policies (JSON
// schema version 1.0, chain_type solana).
//
// Evaluation is instruction-level for signAndSendTransaction: every
// instruction must match at least one ALLOW rule, and no instruction may
// match a DENY rule. DENY is always checked first. Conditions inside a
// single rule are AND; ALLOW rules are OR.
//
// Do not add a blanket ALLOW on System Program Transfer.instructionName
// after a Transfer.lamports cap — the broader rule overrides the cap.
// Address-based conditions fail closed when the address lives only in an
// Address Lookup Table (Privy does not resolve ALTs).
package solanapolicy
