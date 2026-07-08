package solanasdk

import (
	"encoding/json"
	"fmt"
	"os"

	"github.com/gagliardetto/solana-go"
)

// Wallet wraps a Solana keypair.
type Wallet struct {
	PrivateKey solana.PrivateKey
}

// NewWallet generates a new random keypair.
func NewWallet() (*Wallet, error) {
	pk, err := solana.NewRandomPrivateKey()
	if err != nil {
		return nil, fmt.Errorf("generate keypair: %w", err)
	}
	return &Wallet{PrivateKey: pk}, nil
}

// WalletFromBase58 loads a wallet from a base58-encoded private key.
func WalletFromBase58(b58 string) (*Wallet, error) {
	pk, err := solana.PrivateKeyFromBase58(b58)
	if err != nil {
		return nil, fmt.Errorf("parse base58 private key: %w", err)
	}
	return &Wallet{PrivateKey: pk}, nil
}

// WalletFromKeygenFile loads a wallet from a solana-keygen JSON file
// (`solana-keygen new --outfile=<path>`).
func WalletFromKeygenFile(path string) (*Wallet, error) {
	pk, err := solana.PrivateKeyFromSolanaKeygenFile(path)
	if err != nil {
		return nil, fmt.Errorf("load keygen file %s: %w", path, err)
	}
	return &Wallet{PrivateKey: pk}, nil
}

// PublicKey returns the wallet's public key.
func (w *Wallet) PublicKey() solana.PublicKey {
	return w.PrivateKey.PublicKey()
}

// PublicKeyBase58 returns the base58-encoded public key (the wallet address).
func (w *Wallet) PublicKeyBase58() string {
	return w.PublicKey().String()
}

// PrivateKeyBase58 returns the base58-encoded private key. Treat this as a
// secret: anyone with it can spend from the wallet.
func (w *Wallet) PrivateKeyBase58() string {
	return w.PrivateKey.String()
}

// SaveToKeygenFile writes the wallet to a solana-keygen compatible JSON file
// with owner-only permissions.
func (w *Wallet) SaveToKeygenFile(path string) error {
	data, err := json.Marshal([]byte(w.PrivateKey))
	if err != nil {
		return fmt.Errorf("marshal key: %w", err)
	}
	if err := os.WriteFile(path, data, 0o600); err != nil {
		return fmt.Errorf("write key file: %w", err)
	}
	return nil
}
