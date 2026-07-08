package solanasdk

import (
	"context"
	"fmt"

	"github.com/gagliardetto/solana-go"
	"github.com/gagliardetto/solana-go/programs/system"
	"github.com/gagliardetto/solana-go/rpc"
)

// LamportsPerSOL is the number of lamports in one SOL.
const LamportsPerSOL = solana.LAMPORTS_PER_SOL

// SOLToLamports converts a SOL amount to lamports.
func SOLToLamports(sol float64) uint64 {
	return uint64(sol * float64(LamportsPerSOL))
}

// LamportsToSOL converts lamports to a SOL amount.
func LamportsToSOL(lamports uint64) float64 {
	return float64(lamports) / float64(LamportsPerSOL)
}

// GetBalance returns the SOL balance, in lamports, for a public key.
func (c *Client) GetBalance(ctx context.Context, pubKey solana.PublicKey) (uint64, error) {
	out, err := c.RPC.GetBalance(ctx, pubKey, rpc.CommitmentConfirmed)
	if err != nil {
		return 0, fmt.Errorf("get balance: %w", err)
	}
	return out.Value, nil
}

// RequestAirdrop requests devnet/testnet lamports for a public key. Mainnet
// has no faucet and will return an RPC error.
func (c *Client) RequestAirdrop(ctx context.Context, to solana.PublicKey, lamports uint64) (solana.Signature, error) {
	sig, err := c.RPC.RequestAirdrop(ctx, to, lamports, rpc.CommitmentFinalized)
	if err != nil {
		return solana.Signature{}, fmt.Errorf("request airdrop: %w", err)
	}
	return sig, nil
}

// TransferSOL builds, signs, and submits a SOL transfer without waiting for
// confirmation (no WebSocket client required). Check the signature status
// separately to confirm it landed.
func (c *Client) TransferSOL(ctx context.Context, from *Wallet, to solana.PublicKey, lamports uint64) (solana.Signature, error) {
	recent, err := c.RPC.GetLatestBlockhash(ctx, rpc.CommitmentFinalized)
	if err != nil {
		return solana.Signature{}, fmt.Errorf("get latest blockhash: %w", err)
	}

	fromPubKey := from.PublicKey()
	tx, err := solana.NewTransaction(
		[]solana.Instruction{
			system.NewTransferInstruction(lamports, fromPubKey, to).Build(),
		},
		recent.Value.Blockhash,
		solana.TransactionPayer(fromPubKey),
	)
	if err != nil {
		return solana.Signature{}, fmt.Errorf("create transaction: %w", err)
	}

	if _, err := tx.Sign(from.Signer()); err != nil {
		return solana.Signature{}, fmt.Errorf("sign transaction: %w", err)
	}

	sig, err := c.RPC.SendTransactionWithOpts(ctx, tx, rpc.TransactionOpts{
		PreflightCommitment: rpc.CommitmentProcessed,
	})
	if err != nil {
		return solana.Signature{}, fmt.Errorf("send transaction: %w", err)
	}
	return sig, nil
}

// Signer returns a function compatible with solana.Transaction.Sign.
func (w *Wallet) Signer() func(key solana.PublicKey) *solana.PrivateKey {
	return func(key solana.PublicKey) *solana.PrivateKey {
		if w.PublicKey().Equals(key) {
			return &w.PrivateKey
		}
		return nil
	}
}
