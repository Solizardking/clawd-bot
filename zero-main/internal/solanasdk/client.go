// Package solanasdk is a trimmed, zero-config Solana client, vendored from
// the standalone clawd-go SDK (wallet management + read-only RPC + SOL
// transfers). It intentionally drops clawd-go's x402.wtf AI-chat proxy and
// its ATA/token/address-lookup-table helpers — those aren't used by Zero
// Clawd, and routing agent traffic through an unaffiliated third-party proxy
// by default isn't a trust boundary this project wants. What's left is
// plain Solana JSON-RPC via github.com/gagliardetto/solana-go.
package solanasdk

import (
	"github.com/gagliardetto/solana-go/rpc"
)

// Cluster pairs a human name with a JSON-RPC endpoint.
type Cluster struct {
	Name string
	RPC  string
}

// Predefined public clusters. These require no API key — the "zero-config"
// part of zero-config RPC — but are rate-limited by Solana Labs; set
// RPC_URL/HELIUS_RPC_URL for production traffic.
var (
	MainNetBeta = Cluster{Name: "mainnet-beta", RPC: rpc.MainNetBeta_RPC}
	TestNet     = Cluster{Name: "testnet", RPC: rpc.TestNet_RPC}
	DevNet      = Cluster{Name: "devnet", RPC: rpc.DevNet_RPC}
	LocalNet    = Cluster{Name: "localhost", RPC: rpc.LocalNet_RPC}
)

// Client wraps a Solana JSON-RPC client.
type Client struct {
	RPC     *rpc.Client
	Cluster Cluster
}

// NewClient connects to a predefined cluster.
func NewClient(cluster Cluster) *Client {
	return NewClientWithEndpoint(cluster.Name, cluster.RPC)
}

// NewClientWithEndpoint connects to an arbitrary RPC endpoint (e.g. Helius,
// a private RPC, or a public cluster URL).
func NewClientWithEndpoint(name, endpoint string) *Client {
	return &Client{
		RPC:     rpc.New(endpoint),
		Cluster: Cluster{Name: name, RPC: endpoint},
	}
}

// NewDefault returns a zero-config client: RPC_URL or HELIUS_RPC_URL from
// getenv if set, otherwise the public mainnet-beta endpoint. No API key
// required to get started; swap in a real endpoint for production traffic.
func NewDefault(getenv func(string) string) *Client {
	if url := firstNonEmpty(getenv, "RPC_URL", "HELIUS_RPC_URL", "SOLANA_RPC_URL"); url != "" {
		return NewClientWithEndpoint("custom", url)
	}
	return NewClient(MainNetBeta)
}

func firstNonEmpty(getenv func(string) string, keys ...string) string {
	for _, k := range keys {
		if v := getenv(k); v != "" {
			return v
		}
	}
	return ""
}
