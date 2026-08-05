// RPCClient is the typed Solana JSON-RPC surface used by ClawdBot.
//
// It wraps github.com/gagliardetto/solana-go/rpc — the same Go module published
// from the Solana Foundation host https://github.com/solana-foundation/solana-go
// (module path remains github.com/gagliardetto/solana-go for Go module
// compatibility). Prefer this client for standard Solana RPC methods
// (balance, slot, blockhash). Helius-only DAS / enhanced APIs stay on the
// hand-rolled JSON path in clients.go.
package solana

import (
	"context"
	"fmt"
	"time"

	solanago "github.com/gagliardetto/solana-go"
	"github.com/gagliardetto/solana-go/rpc"
)

// Default commitment for core RPC reads in this package.
const defaultCommitment = rpc.CommitmentConfirmed

// RPCClient wraps the Foundation-hosted solana-go JSON-RPC client.
type RPCClient struct {
	// RPC is the underlying solana-go client. Safe for concurrent use.
	RPC *rpc.Client
	// Endpoint is the JSON-RPC HTTP URL (may include api-key query params).
	Endpoint string
	// Timeout is the per-request HTTP timeout applied when the client was built.
	Timeout time.Duration
}

// NewRPCClient connects to endpoint with a 20s timeout and confirmed commitment.
func NewRPCClient(endpoint string) *RPCClient {
	return NewRPCClientWithTimeout(endpoint, 20*time.Second)
}

// NewRPCClientWithTimeout connects to endpoint with the given HTTP timeout.
// Zero or negative timeout defaults to 20s.
func NewRPCClientWithTimeout(endpoint string, timeout time.Duration) *RPCClient {
	if timeout <= 0 {
		timeout = 20 * time.Second
	}
	return &RPCClient{
		RPC:      rpc.NewWithTimeoutAndCommitment(endpoint, timeout, defaultCommitment),
		Endpoint: endpoint,
		Timeout:  timeout,
	}
}

// Close releases resources held by the underlying HTTP client.
func (c *RPCClient) Close() {
	if c == nil || c.RPC == nil {
		return
	}
	c.RPC.Close()
}

// GetBalance returns the SOL balance for a base58 public key.
func (c *RPCClient) GetBalance(ctx context.Context, pubkey string) (*AccountBalance, error) {
	if c == nil || c.RPC == nil {
		return nil, fmt.Errorf("rpc client is nil")
	}
	pubKey, err := solanago.PublicKeyFromBase58(pubkey)
	if err != nil {
		return nil, fmt.Errorf("invalid pubkey %q: %w", pubkey, err)
	}

	out, err := c.RPC.GetBalance(ctx, pubKey, defaultCommitment)
	if err != nil {
		return nil, fmt.Errorf("getBalance: %w", err)
	}
	if out == nil {
		return nil, fmt.Errorf("getBalance: empty response")
	}

	return &AccountBalance{
		SOL:      LamportsToSOL(out.Value),
		Lamports: out.Value,
	}, nil
}

// GetSlot returns the current slot at confirmed commitment.
func (c *RPCClient) GetSlot(ctx context.Context) (uint64, error) {
	if c == nil || c.RPC == nil {
		return 0, fmt.Errorf("rpc client is nil")
	}
	slot, err := c.RPC.GetSlot(ctx, defaultCommitment)
	if err != nil {
		return 0, fmt.Errorf("getSlot: %w", err)
	}
	return slot, nil
}

// GetLatestBlockhash returns the latest confirmed blockhash as base58.
func (c *RPCClient) GetLatestBlockhash(ctx context.Context) (string, error) {
	if c == nil || c.RPC == nil {
		return "", fmt.Errorf("rpc client is nil")
	}
	out, err := c.RPC.GetLatestBlockhash(ctx, defaultCommitment)
	if err != nil {
		return "", fmt.Errorf("getLatestBlockhash: %w", err)
	}
	if out == nil || out.Value == nil {
		return "", fmt.Errorf("getLatestBlockhash: empty response")
	}
	return out.Value.Blockhash.String(), nil
}

// LamportsPerSOL is the number of lamports in one SOL (from solana-go).
const LamportsPerSOL = solanago.LAMPORTS_PER_SOL

// LamportsToSOL converts lamports to a SOL amount.
func LamportsToSOL(lamports uint64) float64 {
	return float64(lamports) / float64(LamportsPerSOL)
}

// SOLToLamports converts a SOL amount to lamports (truncates fractional dust).
func SOLToLamports(sol float64) uint64 {
	if sol <= 0 {
		return 0
	}
	return uint64(sol * float64(LamportsPerSOL))
}
