// zero-solana is a small standalone CLI built on internal/solanasdk — the
// vendored, trimmed clawd-go Solana SDK. It exists to give that package a
// real caller: zero-config balance checks and a throwaway devnet wallet,
// with no API key required to get started.
//
// Usage:
//
//	zero-solana balance <pubkey> [--rpc-url URL] [--cluster mainnet|devnet|testnet]
//	zero-solana wallet new
//	zero-solana airdrop <pubkey> <sol> [--cluster devnet|testnet]
package main

import (
	"context"
	"flag"
	"fmt"
	"io"
	"os"
	"time"

	"github.com/Gitlawb/zero/internal/solanasdk"
	"github.com/gagliardetto/solana-go"
)

func main() {
	os.Exit(run(os.Args[1:], os.Getenv, os.Stdout, os.Stderr))
}

func run(args []string, getenv func(string) string, stdout, stderr io.Writer) int {
	if len(args) == 0 {
		printUsage(stderr)
		return 2
	}

	switch args[0] {
	case "balance":
		return runBalance(args[1:], getenv, stdout, stderr)
	case "wallet":
		return runWallet(args[1:], stdout, stderr)
	case "airdrop":
		return runAirdrop(args[1:], stdout, stderr)
	case "-h", "--help", "help":
		printUsage(stdout)
		return 0
	default:
		fmt.Fprintf(stderr, "zero-solana: unknown command %q\n", args[0])
		printUsage(stderr)
		return 2
	}
}

func printUsage(w io.Writer) {
	fmt.Fprint(w, `zero-solana — zero-config Solana CLI (internal/solanasdk)

Usage:
  zero-solana balance <pubkey> [--rpc-url URL] [--cluster mainnet|devnet|testnet]
  zero-solana wallet new
  zero-solana airdrop <pubkey> <sol> [--cluster devnet|testnet]

With no --rpc-url, balance/airdrop default to RPC_URL / HELIUS_RPC_URL /
SOLANA_RPC_URL from the environment, falling back to the public cluster
endpoint for the requested --cluster (default: mainnet). No API key needed
to get started.
`)
}

func clientForCluster(cluster, rpcURL string, getenv func(string) string) *solanasdk.Client {
	if rpcURL != "" {
		return solanasdk.NewClientWithEndpoint("custom", rpcURL)
	}
	switch cluster {
	case "devnet":
		return solanasdk.NewClient(solanasdk.DevNet)
	case "testnet":
		return solanasdk.NewClient(solanasdk.TestNet)
	default:
		return solanasdk.NewDefault(getenv)
	}
}

func runBalance(args []string, getenv func(string) string, stdout, stderr io.Writer) int {
	fs := flag.NewFlagSet("balance", flag.ContinueOnError)
	fs.SetOutput(stderr)
	rpcURL := fs.String("rpc-url", "", "RPC endpoint (overrides env + --cluster)")
	cluster := fs.String("cluster", "mainnet", "mainnet|devnet|testnet (used when --rpc-url is unset)")
	if err := fs.Parse(args); err != nil {
		return 2
	}
	if fs.NArg() != 1 {
		fmt.Fprintln(stderr, "zero-solana balance: expected exactly one <pubkey> argument")
		return 2
	}

	pubKey, err := solana.PublicKeyFromBase58(fs.Arg(0))
	if err != nil {
		fmt.Fprintf(stderr, "zero-solana balance: invalid pubkey: %v\n", err)
		return 1
	}

	client := clientForCluster(*cluster, *rpcURL, getenv)
	ctx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
	defer cancel()

	lamports, err := client.GetBalance(ctx, pubKey)
	if err != nil {
		fmt.Fprintf(stderr, "zero-solana balance: %v\n", err)
		return 1
	}

	fmt.Fprintf(stdout, "%s  %.9f SOL  (%d lamports)  [%s]\n",
		pubKey.String(), solanasdk.LamportsToSOL(lamports), lamports, client.Cluster.Name)
	return 0
}

func runWallet(args []string, stdout, stderr io.Writer) int {
	if len(args) != 1 || args[0] != "new" {
		fmt.Fprintln(stderr, "zero-solana wallet: expected subcommand \"new\"")
		return 2
	}

	w, err := solanasdk.NewWallet()
	if err != nil {
		fmt.Fprintf(stderr, "zero-solana wallet new: %v\n", err)
		return 1
	}

	fmt.Fprintf(stdout, "address:     %s\n", w.PublicKeyBase58())
	fmt.Fprintf(stdout, "private key: %s\n", w.PrivateKeyBase58())
	fmt.Fprintln(stderr, "\nWARNING: the private key above can spend this wallet's funds. Do not paste it anywhere, do not commit it, and do not fund this wallet beyond what you can afford to lose in a demo.")
	return 0
}

func runAirdrop(args []string, stdout, stderr io.Writer) int {
	fs := flag.NewFlagSet("airdrop", flag.ContinueOnError)
	fs.SetOutput(stderr)
	cluster := fs.String("cluster", "devnet", "devnet|testnet (mainnet has no faucet)")
	if err := fs.Parse(args); err != nil {
		return 2
	}
	if fs.NArg() != 2 {
		fmt.Fprintln(stderr, "zero-solana airdrop: expected <pubkey> <sol>")
		return 2
	}
	if *cluster == "mainnet" {
		fmt.Fprintln(stderr, "zero-solana airdrop: mainnet has no faucet; use --cluster devnet or testnet")
		return 2
	}

	pubKey, err := solana.PublicKeyFromBase58(fs.Arg(0))
	if err != nil {
		fmt.Fprintf(stderr, "zero-solana airdrop: invalid pubkey: %v\n", err)
		return 1
	}
	var solAmount float64
	if _, err := fmt.Sscanf(fs.Arg(1), "%f", &solAmount); err != nil || solAmount <= 0 {
		fmt.Fprintln(stderr, "zero-solana airdrop: <sol> must be a positive number")
		return 2
	}

	client := solanasdk.NewClient(map[string]solanasdk.Cluster{
		"devnet":  solanasdk.DevNet,
		"testnet": solanasdk.TestNet,
	}[*cluster])

	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	sig, err := client.RequestAirdrop(ctx, pubKey, solanasdk.SOLToLamports(solAmount))
	if err != nil {
		fmt.Fprintf(stderr, "zero-solana airdrop: %v\n", err)
		return 1
	}
	fmt.Fprintf(stdout, "requested %.9f SOL for %s on %s\nsignature: %s\n", solAmount, pubKey.String(), *cluster, sig.String())
	return 0
}
