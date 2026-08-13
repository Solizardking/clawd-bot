// Package tgtrade is the Telegram trading bot: Privy bot-first wallets,
// DFlow /order quotes and swaps, and Privy-style Solana policy checks.
package tgtrade

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"
	"sync"
	"time"

	"github.com/8bitlabs/clawdbot/pkg/dflow"
	"github.com/8bitlabs/clawdbot/pkg/privy"
	"github.com/8bitlabs/clawdbot/pkg/solanapolicy"
	"github.com/8bitlabs/clawdbot/pkg/telegram"
)

const helpText = `Clawd Telegram trading bot (Solana + DFlow + Privy)

/start — create a Privy user + Solana wallet (bot-first)
/wallet — show your linked wallet
/quote <amount> [in] [out] — DFlow quote (default SOL → USDC)
/swap <amount> [in] [out] — sign+send under the Solana policy
/policy — signer policy (program allowlist, 0.5 SOL cap, no key export)
/help — this list

Natural language is forwarded to Grok when XAI / zero-service is configured.
Swaps are denied if they fail the local Solana policy (same shape Privy evaluates).
Claim the wallet later from the web app (Telegram login).`

type AskFunc func(ctx context.Context, telegramUserID int64, prompt string) (string, error)

type WalletRecord struct {
	TelegramUserID int64  `json:"telegram_user_id"`
	PrivyUserID    string `json:"privy_user_id"`
	WalletID       string `json:"wallet_id"`
	Address        string `json:"address"`
}

type Store struct {
	mu    sync.RWMutex
	byTID map[int64]WalletRecord
}

func NewStore() *Store {
	return &Store{byTID: map[int64]WalletRecord{}}
}

func (s *Store) Get(id int64) (WalletRecord, bool) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	r, ok := s.byTID[id]
	return r, ok
}

func (s *Store) Put(r WalletRecord) {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.byTID[r.TelegramUserID] = r
}

type Bot struct {
	store    *Store
	privy    *privy.Client
	dflow    *dflow.Client
	policy   solanapolicy.Document
	ask      AskFunc
	claimURL string
	maxSOL   uint64
}

func New(opts ...Option) *Bot {
	b := &Bot{
		store:  NewStore(),
		policy: solanapolicy.DefaultTradingPolicy(),
		maxSOL: solanapolicy.DefaultMaxSOLLamports,
	}
	for _, opt := range opts {
		if opt != nil {
			opt(b)
		}
	}
	return b
}

type Option func(*Bot)

func WithStore(s *Store) Option        { return func(b *Bot) { b.store = s } }
func WithPrivy(c *privy.Client) Option { return func(b *Bot) { b.privy = c } }
func WithDFlow(c *dflow.Client) Option { return func(b *Bot) { b.dflow = c } }
func WithPolicy(p solanapolicy.Document) Option {
	return func(b *Bot) { b.policy = p }
}
func WithAsk(fn AskFunc) Option { return func(b *Bot) { b.ask = fn } }
func WithClaimURL(u string) Option {
	return func(b *Bot) { b.claimURL = strings.TrimSpace(u) }
}

func (b *Bot) HandleUpdate(ctx context.Context, upd telegram.Update) (string, error) {
	if ctx == nil {
		return "", fmt.Errorf("tgtrade: nil context")
	}
	if upd.Message == nil || upd.Message.From == nil {
		return "", nil
	}
	text := strings.TrimSpace(upd.Message.Text)
	if text == "" {
		return "", nil
	}
	uid := upd.Message.From.ID
	cmd, rest := splitCommand(text)
	switch cmd {
	case "/start", "/help":
		return b.cmdStart(ctx, uid, cmd == "/help")
	case "/wallet":
		return b.cmdWallet(uid)
	case "/quote":
		return b.cmdQuote(ctx, uid, rest, false)
	case "/swap", "/transact":
		return b.cmdQuote(ctx, uid, rest, true)
	case "/policy":
		return b.cmdPolicy()
	default:
		if b.ask == nil {
			return "Unknown command. Try /help", nil
		}
		out, err := b.ask(ctx, uid, text)
		if err != nil {
			return "", fmt.Errorf("tgtrade: grok: %w", err)
		}
		return out, nil
	}
}

func (b *Bot) cmdStart(ctx context.Context, uid int64, helpOnly bool) (string, error) {
	if helpOnly {
		return helpText, nil
	}
	if rec, ok := b.store.Get(uid); ok && rec.Address != "" {
		return "Wallet already linked:\n" + rec.Address + extraClaim(b.claimURL), nil
	}
	if b.privy == nil {
		return helpText + "\n\nPrivy is not configured (set PRIVY_APP_ID / PRIVY_APP_SECRET). Quotes still work via /quote.", nil
	}
	user, err := b.privy.GetByTelegramUserID(ctx, uid)
	if err != nil {
		user, err = b.privy.CreateTelegramUser(ctx, uid)
		if err != nil {
			return "", fmt.Errorf("tgtrade: privy user: %w", err)
		}
	}
	walletID := privy.SolanaWalletID(user)
	var w *privy.Wallet
	if walletID == "" {
		w, err = b.privy.CreateSolanaWallet(ctx, user.ID)
		if err != nil {
			return "", fmt.Errorf("tgtrade: privy wallet: %w", err)
		}
	} else {
		w = &privy.Wallet{ID: walletID}
	}
	rec := WalletRecord{
		TelegramUserID: uid,
		PrivyUserID:    user.ID,
		WalletID:       w.ID,
		Address:        w.Address,
	}
	b.store.Put(rec)
	msg := "Privy Solana wallet ready.\n"
	if rec.Address != "" {
		msg += rec.Address + "\n"
	} else {
		msg += "wallet_id=" + rec.WalletID + "\n"
	}
	msg += "The bot is an additional signer under the Clawd Solana policy (no key export, 0.5 SOL cap)."
	msg += extraClaim(b.claimURL)
	return msg, nil
}

func extraClaim(url string) string {
	if url == "" {
		return ""
	}
	return "\n\nClaim from the app: " + url
}

func (b *Bot) cmdWallet(uid int64) (string, error) {
	rec, ok := b.store.Get(uid)
	if !ok {
		return "No wallet yet. Send /start first.", nil
	}
	out := rec.Address
	if out == "" {
		out = rec.WalletID
	}
	return "Wallet: " + out, nil
}

func (b *Bot) cmdPolicy() (string, error) {
	raw, err := json.MarshalIndent(b.policy, "", "  ")
	if err != nil {
		return "", fmt.Errorf("tgtrade: policy: %w", err)
	}
	text := string(raw)
	if solanapolicy.OverrideRisk(b.policy) {
		text = "WARNING: this policy has the Transfer-name override anti-pattern.\n" + text
	}
	return text, nil
}

func (b *Bot) cmdQuote(ctx context.Context, uid int64, rest string, execute bool) (string, error) {
	settlement := dflow.USDCMint
	if b.dflow != nil {
		settlement = b.dflow.SettlementMint()
	}
	amount, inMint, outMint, err := parseSwapArgs(rest, settlement)
	if err != nil {
		return "Usage: /quote 0.01 SOL USDC", nil
	}
	if amount > b.maxSOL && inMint == dflow.SOLMint {
		return fmt.Sprintf("amount exceeds policy cap (%d lamports)", b.maxSOL), nil
	}
	if b.dflow == nil {
		return "DFlow is not configured.", nil
	}

	userKey := ""
	rec, ok := b.store.Get(uid)
	if ok {
		userKey = rec.Address
	}
	order, err := b.dflow.Order(ctx, dflow.OrderRequest{
		InputMint:     inMint,
		OutputMint:    outMint,
		Amount:        amount,
		SlippageBps:   50,
		UserPublicKey: userKey,
	})
	if err != nil {
		return "", fmt.Errorf("tgtrade: dflow: %w", err)
	}
	summary := fmt.Sprintf("in %s → out %s (impact %s%%, mode %s)",
		order.InAmount, order.OutAmount, order.PriceImpactPct, order.ExecutionMode)
	if !execute {
		return "Quote: " + summary, nil
	}

	ixs := []solanapolicy.Instruction{
		{ProgramID: solanapolicy.ComputeBudgetProgram},
		{ProgramID: solanapolicy.JupiterV6Program, Name: "Route"},
		{ProgramID: solanapolicy.SystemProgram, Name: "Transfer", Lamports: amount},
	}
	dec := solanapolicy.Evaluate(b.policy, solanapolicy.Request{
		Method:       solanapolicy.MethodSignAndSend,
		Instructions: ixs,
		UnixTime:     time.Now().Unix(),
	})
	if !dec.Allow {
		return "Policy denied this swap: " + dec.String(), nil
	}
	if !ok || rec.WalletID == "" {
		return "Quote ok, but no Privy wallet. Send /start first.\n" + summary, nil
	}
	if order.Transaction == "" {
		return "Quote ok but DFlow returned no transaction (need a wallet address).\n" + summary, nil
	}
	if b.privy == nil {
		return "Policy allowed, Privy signer not configured. Transaction not sent.\n" + summary, nil
	}
	sig, err := b.privy.SignAndSendSolana(ctx, rec.WalletID, order.Transaction)
	if err != nil {
		return "", fmt.Errorf("tgtrade: send: %w", err)
	}
	return "Sent " + summary + "\ntx " + sig, nil
}

func parseSwapArgs(rest, defaultOut string) (amount uint64, inMint, outMint string, err error) {
	fields := strings.Fields(strings.TrimSpace(rest))
	if len(fields) == 0 {
		return 0, "", "", fmt.Errorf("missing amount")
	}
	inMint = dflow.SOLMint
	outMint = defaultOut
	if outMint == "" {
		outMint = dflow.USDCMint
	}
	if len(fields) >= 2 {
		inMint = resolveMint(fields[1], inMint)
	}
	if len(fields) >= 3 {
		outMint = resolveMint(fields[2], outMint)
	}
	dec := dflow.GuessDecimals(inMint)
	amount, err = dflow.HumanToRaw(fields[0], dec)
	if err != nil {
		return 0, "", "", err
	}
	return amount, inMint, outMint, nil
}

func resolveMint(s, fallback string) string {
	switch strings.ToUpper(strings.TrimSpace(s)) {
	case "SOL", "WSOL":
		return dflow.SOLMint
	case "USDC":
		return dflow.USDCMint
	default:
		s = strings.TrimSpace(s)
		if len(s) >= 32 {
			return s
		}
		return fallback
	}
}

func splitCommand(text string) (cmd, rest string) {
	text = strings.TrimSpace(text)
	parts := strings.SplitN(text, " ", 2)
	cmd = strings.ToLower(parts[0])
	if i := strings.Index(cmd, "@"); i > 0 {
		cmd = cmd[:i]
	}
	if len(parts) == 2 {
		rest = parts[1]
	}
	return cmd, rest
}
