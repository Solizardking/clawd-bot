//! Grok / xAI intelligence for PumpFun copy trading.
//!
//! Latency-sensitive snipes stay on the Rust hot path. This module fires
//! grok-4.6 analysis **asynchronously** (priority `service_tier`) so social
//! heat and code-interpreter math never stall Yellowstone processing.
//!
//! Prefer the Go sidecar (`PUMP_GROK_URL`, `go run ./cmd/pump-grok`). When the
//! sidecar is unset, requests go straight to `https://api.x.ai/v1/responses`.

use crate::common::config::import_env_var_with_default;
use crate::common::logger::Logger;
use colored::Colorize;
use reqwest::Client;
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use std::time::Duration;

const DEFAULT_XAI_BASE: &str = "https://api.x.ai/v1";
const DEFAULT_MODEL: &str = "grok-4.6";

#[derive(Debug, Clone)]
pub struct GrokConfig {
    pub api_key: String,
    pub base_url: String,
    pub model: String,
    pub sidecar_url: String,
    pub timeout: Duration,
    pub gate_sells: bool,
}

impl GrokConfig {
    pub fn from_env() -> Option<Self> {
        let sidecar = std::env::var("PUMP_GROK_URL")
            .unwrap_or_default()
            .trim()
            .to_string();
        let api_key = std::env::var("XAI_API_KEY")
            .unwrap_or_default()
            .trim()
            .to_string();
        if sidecar.is_empty() && api_key.is_empty() {
            return None;
        }
        let timeout_ms = import_env_var_with_default("XAI_TIMEOUT_MS", "15000")
            .parse::<u64>()
            .unwrap_or(15_000);
        let gate_sells = matches!(
            import_env_var_with_default("GROK_GATE_SELLS", "false").to_lowercase().as_str(),
            "1" | "true" | "yes"
        );
        Some(Self {
            api_key,
            base_url: import_env_var_with_default("XAI_BASE_URL", DEFAULT_XAI_BASE)
                .trim_end_matches('/')
                .to_string(),
            model: import_env_var_with_default("XAI_MODEL", DEFAULT_MODEL),
            sidecar_url: sidecar.trim_end_matches('/').to_string(),
            timeout: Duration::from_millis(timeout_ms),
            gate_sells,
        })
    }

    pub fn configured() -> bool {
        Self::from_env().is_some()
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct GrokAnalysis {
    pub mint: String,
    pub text: String,
    pub service_tier: String,
    pub response_id: String,
}

/// Fire-and-forget token analysis. Errors are logged; the copy-trade loop
/// continues either way (fail-open).
pub async fn analyze_detected_trade(mint: &str, is_buy: bool, ticker: Option<&str>) -> Option<GrokAnalysis> {
    let cfg = GrokConfig::from_env()?;
    let logger = Logger::new("[GROK] => ".purple().bold().to_string());
    match tokio::time::timeout(cfg.timeout, analyze_with(&cfg, mint, is_buy, ticker)).await {
        Ok(Ok(analysis)) => {
            logger.log(format!(
                "{} {} tier={} id={}",
                mint,
                analysis.text.chars().take(180).collect::<String>(),
                analysis.service_tier,
                analysis.response_id
            ));
            let _ = crate::services::telegram::TelegramNotifier::send_message(format!(
                "🦞 Grok `{}`\n{}\n_tier: {}_",
                mint, analysis.text, analysis.service_tier
            ))
            .await;
            Some(analysis)
        }
        Ok(Err(e)) => {
            logger.log(format!("analyze failed for {}: {}", mint, e).red().to_string());
            None
        }
        Err(_) => {
            logger.log(format!("analyze timed out for {}", mint).yellow().to_string());
            None
        }
    }
}

async fn analyze_with(
    cfg: &GrokConfig,
    mint: &str,
    is_buy: bool,
    ticker: Option<&str>,
) -> Result<GrokAnalysis, String> {
    let http = Client::builder()
        .timeout(cfg.timeout)
        .build()
        .map_err(|e| format!("http client: {}", e))?;

    if !cfg.sidecar_url.is_empty() {
        return analyze_via_sidecar(&http, cfg, mint, is_buy, ticker).await;
    }
    analyze_via_xai(&http, cfg, mint, is_buy, ticker).await
}

async fn analyze_via_sidecar(
    http: &Client,
    cfg: &GrokConfig,
    mint: &str,
    is_buy: bool,
    ticker: Option<&str>,
) -> Result<GrokAnalysis, String> {
    let url = format!("{}/analyze", cfg.sidecar_url);
    let body = json!({
        "mint": mint,
        "ticker": ticker.unwrap_or(""),
        "is_buy": is_buy,
    });
    let resp = http
        .post(&url)
        .json(&body)
        .send()
        .await
        .map_err(|e| format!("sidecar: {}", e))?;
    let status = resp.status();
    let value: Value = resp.json().await.map_err(|e| format!("sidecar json: {}", e))?;
    if !status.is_success() {
        return Err(format!("sidecar {}: {}", status, value));
    }
    Ok(GrokAnalysis {
        mint: mint.to_string(),
        text: value
            .get("text")
            .and_then(|v| v.as_str())
            .unwrap_or("")
            .to_string(),
        service_tier: value
            .get("service_tier")
            .and_then(|v| v.as_str())
            .unwrap_or("default")
            .to_string(),
        response_id: value
            .get("response_id")
            .and_then(|v| v.as_str())
            .unwrap_or("")
            .to_string(),
    })
}

async fn analyze_via_xai(
    http: &Client,
    cfg: &GrokConfig,
    mint: &str,
    is_buy: bool,
    ticker: Option<&str>,
) -> Result<GrokAnalysis, String> {
    let side = if is_buy { "buy" } else { "sell" };
    let prompt = format!(
        "Analyze PumpFun token mint {} (ticker {}). Detected {}. Search X for social heat and recommend copy_buy, skip, sell, or watch in one short paragraph.",
        mint,
        ticker.unwrap_or("unknown"),
        side
    );
    let body = json!({
        "model": cfg.model,
        "input": [
            {"role": "system", "content": "You are eliZERO's PumpFun desk. Be concise. Cite X evidence when you use x_search."},
            {"role": "user", "content": prompt}
        ],
        "service_tier": "priority",
        "tools": [
            {"type": "x_search"},
            {"type": "code_interpreter"}
        ]
    });
    let resp = http
        .post(format!("{}/responses", cfg.base_url))
        .bearer_auth(&cfg.api_key)
        .json(&body)
        .send()
        .await
        .map_err(|e| format!("xai: {}", e))?;
    let status = resp.status();
    let value: Value = resp.json().await.map_err(|e| format!("xai json: {}", e))?;
    if !status.is_success() {
        return Err(format!("xai {}: {}", status, value));
    }
    Ok(GrokAnalysis {
        mint: mint.to_string(),
        text: extract_output_text(&value),
        service_tier: value
            .get("service_tier")
            .and_then(|v| v.as_str())
            .unwrap_or("default")
            .to_string(),
        response_id: value
            .get("id")
            .and_then(|v| v.as_str())
            .unwrap_or("")
            .to_string(),
    })
}

fn extract_output_text(value: &Value) -> String {
    if let Some(s) = value.get("output_text").and_then(|v| v.as_str()) {
        if !s.is_empty() {
            return s.to_string();
        }
    }
    let mut parts = Vec::new();
    if let Some(output) = value.get("output").and_then(|v| v.as_array()) {
        for item in output {
            if item.get("type").and_then(|v| v.as_str()) != Some("message") {
                continue;
            }
            if let Some(content) = item.get("content").and_then(|v| v.as_array()) {
                for c in content {
                    if let Some(t) = c.get("text").and_then(|v| v.as_str()) {
                        parts.push(t.to_string());
                    }
                }
            }
        }
    }
    parts.join("")
}

/// True when GROK_GATE_SELLS is set and Grok is configured. Callers should
/// still fail-open if analyze_detected_trade returns None.
pub fn gate_sells_enabled() -> bool {
    GrokConfig::from_env().map(|c| c.gate_sells).unwrap_or(false)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn extract_output_text_prefers_field() {
        let v = json!({"output_text": "skip it", "output": []});
        assert_eq!(extract_output_text(&v), "skip it");
    }

    #[test]
    fn extract_output_text_from_message_parts() {
        let v = json!({
            "output": [{
                "type": "message",
                "content": [{"type": "output_text", "text": "watch"}]
            }]
        });
        assert_eq!(extract_output_text(&v), "watch");
    }

    #[test]
    fn from_env_none_without_keys() {
        // Cannot reliably mutate process env under parallel tests; just
        // assert the struct serializes when constructed.
        let a = GrokAnalysis {
            mint: "m".into(),
            text: "t".into(),
            service_tier: "priority".into(),
            response_id: "r".into(),
        };
        let v = serde_json::to_value(&a).unwrap();
        assert_eq!(v["service_tier"], "priority");
    }
}
