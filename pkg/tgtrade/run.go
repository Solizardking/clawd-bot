package tgtrade

import (
	"context"
	"fmt"
	"log/slog"
	"os"
	"strconv"
	"strings"

	"github.com/8bitlabs/clawdbot/pkg/dflow"
	"github.com/8bitlabs/clawdbot/pkg/privy"
	"github.com/8bitlabs/clawdbot/pkg/telegram"
	"github.com/8bitlabs/clawdbot/pkg/xai"
)

// Config is assembled from environment variables. Tokens are never logged.
type Config struct {
	TelegramToken string
	AllowFrom     []string
	ClaimURL      string
}

func ConfigFromEnv() Config {
	allow := splitCSV(os.Getenv("TELEGRAM_ALLOW_FROM"))
	if v := strings.TrimSpace(os.Getenv("TELEGRAM_CHAT_ID")); v != "" {
		allow = append(allow, v)
	}
	if v := strings.TrimSpace(os.Getenv("TELEGRAM_ALLOWED_CHATS")); v != "" {
		allow = append(allow, splitCSV(v)...)
	}
	return Config{
		TelegramToken: strings.TrimSpace(firstEnv("TELEGRAM_BOT_TOKEN", "TELEGRAM_TOKEN")),
		AllowFrom:     allow,
		ClaimURL:      strings.TrimSpace(os.Getenv("TELEGRAM_CLAIM_URL")),
	}
}

// Run long-polls Telegram until ctx is cancelled.
func Run(ctx context.Context, log *slog.Logger) error {
	if log == nil {
		log = slog.Default()
	}
	cfg := ConfigFromEnv()
	_, tg, err := Build(cfg, log)
	if err != nil {
		return err
	}
	log.Info("telegram trading bot starting")
	if err := tg.Start(ctx); err != nil {
		return err
	}
	<-ctx.Done()
	return tg.Stop(context.WithoutCancel(ctx))
}

// Build wires Privy, DFlow, optional Grok, and the Telegram adapter.
func Build(cfg Config, log *slog.Logger) (*Bot, *telegram.Bot, error) {
	if log == nil {
		log = slog.Default()
	}
	if strings.TrimSpace(cfg.TelegramToken) == "" {
		return nil, nil, telegram.ErrNotConfigured
	}

	trade := New(WithClaimURL(cfg.ClaimURL))
	if dc, err := dflow.NewFromEnv(); err == nil {
		trade.dflow = dc
		log.Info("dflow attached", "url", dc.Health()["base_url"])
	} else {
		log.Warn("dflow unavailable", "err", err)
	}
	if pc, err := privy.NewFromEnv(); err == nil {
		trade.privy = pc
		log.Info("privy attached", "signer", pc.SignerID() != "")
	} else {
		log.Info("privy not configured; /start will stay quote-only")
	}
	if ask := makeAsk(log); ask != nil {
		trade.ask = ask
	}

	var tg *telegram.Bot
	var err error
	tg, err = telegram.New(cfg.TelegramToken,
		telegram.WithAllowFrom(cfg.AllowFrom...),
		telegram.WithHandler(func(ctx context.Context, upd telegram.Update) error {
			reply, herr := trade.HandleUpdate(ctx, upd)
			if herr != nil {
				log.Error("telegram handler", "err", herr)
				reply = "error: " + herr.Error()
			}
			if reply == "" || upd.Message == nil || tg == nil {
				return nil
			}
			return tg.SendText(ctx, strconv.FormatInt(upd.Message.Chat.ID, 10), reply)
		}),
	)
	if err != nil {
		return nil, nil, err
	}
	return trade, tg, nil
}

func makeAsk(log *slog.Logger) AskFunc {
	xc, err := xai.NewFromEnv(xai.WithServiceTier(xai.ServiceTierPriority))
	if err != nil {
		return nil
	}
	log.Info("grok attached for natural-language telegram turns")
	return func(ctx context.Context, telegramUserID int64, prompt string) (string, error) {
		resp, err := xc.Create(ctx, xai.CreateRequest{
			Input: xai.Input{Text: "You are Clawd's Telegram trading bot on Solana. Be concise. Do not claim a trade landed unless a signature is present.\nUser: " + prompt},
		})
		if err != nil {
			return "", err
		}
		if resp == nil || resp.OutputText == "" {
			return "", fmt.Errorf("empty grok response")
		}
		return resp.OutputText, nil
	}
}

func splitCSV(s string) []string {
	s = strings.TrimSpace(s)
	if s == "" {
		return nil
	}
	var out []string
	for _, p := range strings.Split(s, ",") {
		p = strings.TrimSpace(p)
		if p != "" {
			out = append(out, p)
		}
	}
	return out
}

func firstEnv(keys ...string) string {
	for _, k := range keys {
		if v := strings.TrimSpace(os.Getenv(k)); v != "" {
			return v
		}
	}
	return ""
}
