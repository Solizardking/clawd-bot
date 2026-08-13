package dflow_test

import (
	"context"
	"io"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/8bitlabs/clawdbot/pkg/dflow"
)

func TestOrderIncludesUserAndKey(t *testing.T) {
	t.Parallel()
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/order" {
			t.Errorf("path=%s", r.URL.Path)
		}
		if r.Header.Get("x-api-key") != "k1" {
			t.Errorf("missing api key")
		}
		q := r.URL.Query()
		if q.Get("userPublicKey") != "User111" {
			t.Errorf("user=%s", q.Get("userPublicKey"))
		}
		if q.Get("amount") != "10000000" {
			t.Errorf("amount=%s", q.Get("amount"))
		}
		w.Header().Set("Content-Type", "application/json")
		_, _ = io.WriteString(w, `{
			"inputMint":"So11111111111111111111111111111111111111112",
			"inAmount":"10000000",
			"outputMint":"EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
			"outAmount":"1500000",
			"otherAmountThreshold":"1490000",
			"minOutAmount":"1490000",
			"slippageBps":50,
			"priceImpactPct":"0.01",
			"contextSlot":1,
			"executionMode":"sync",
			"transaction":"AQID"
		}`)
	}))
	t.Cleanup(srv.Close)

	c, err := dflow.New(
		dflow.WithBaseURL(srv.URL),
		dflow.WithAPIKey("k1"),
		dflow.WithHTTPClient(srv.Client()),
	)
	if err != nil {
		t.Fatal(err)
	}
	got, err := c.Order(context.Background(), dflow.OrderRequest{
		Amount:        10_000_000,
		SlippageBps:   50,
		UserPublicKey: "User111",
	})
	if err != nil {
		t.Fatal(err)
	}
	if got.OutAmount != "1500000" || got.Transaction != "AQID" {
		t.Fatalf("%+v", got)
	}
}

func TestHumanToRaw(t *testing.T) {
	t.Parallel()
	cases := []struct {
		in      string
		dec     int
		want    uint64
		wantErr bool
	}{
		{"0.01", 9, 10_000_000, false},
		{"1", 9, 1_000_000_000, false},
		{"0.5", 9, 500_000_000, false},
		{"5", 6, 5_000_000, false},
		{"0", 9, 0, true},
		{"-1", 9, 0, true},
	}
	for _, tc := range cases {
		t.Run(tc.in, func(t *testing.T) {
			t.Parallel()
			got, err := dflow.HumanToRaw(tc.in, tc.dec)
			if tc.wantErr {
				if err == nil {
					t.Fatal("expected error")
				}
				return
			}
			if err != nil {
				t.Fatal(err)
			}
			if got != tc.want {
				t.Fatalf("got %d want %d", got, tc.want)
			}
		})
	}
}
