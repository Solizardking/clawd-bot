# Clawdbot · Brand Spec（从仓库资产提取 · 2026-08-10）

## 来源
- `packages/web/ui/tailwind.config.js`（权威色板/字体/投影 token）
- `packages/web/ui/src/components/layout/Sidebar.tsx`（logo lockup、导航结构、active 样式）
- `packages/web/ui/src/App.tsx`（布局、背景 orbs）
- `packages/web/ui/index.html`（title: "Clawdbot Control" · Inter + JetBrains Mono）
- CLI banner（🦞 ASCII 龙虾 + "I speak fluent bash, mild sarcasm, and aggressive tab-completion energy"）
- `clawdbot status` 输出（真实运行数据，供三版共用）

## Logo / Wordmark
- 仓库内**无官方 logo 资产**（仅 binary favicon.ico）。既有 lockup = CSS 渐变方块（`bg-solana-gradient` + 内嵌白色小方块）+ "Clawdbot" 字标（Inter bold tracking-tight）。
- 品牌人格符号：🦞（CLI banner、packaging、终端语言）。
- 三版共用此 lockup 的 CSS 化版本，**不发明新 logo**。

## 色板（Solana 原生）
| Token | 值 |
|---|---|
| solana.purple | `#9945FF` |
| purple-light | `#B67FFF` |
| purple-dark | `#7B35CC` |
| solana.green | `#14F195` |
| green-light | `#4FF5B3` |
| green-dark | `#0FC77A` |
| background | `#0A0B0D` |
| background.secondary | `#12141A` |
| background.tertiary | `#1A1D24` |
| card | `rgba(26,29,36,.7)` |
| border | `rgba(153,69,255,.2)` |
| border.active | `rgba(153,69,255,.5)` |
| border.glow | `rgba(20,241,149,.3)` |
| text.primary | `#FFFFFF` |
| text.secondary | `#A0A3B1` |
| text.muted | `#6B7084` |

## 渐变 / 投影
- `solana-gradient`: linear-gradient(135deg, #9945FF 0%, #14F195 100%)
- `solana-radial`: radial-gradient(ellipse, rgba(153,69,255,.15), transparent 70%)
- `solana-glow`: `0 0 40px rgba(153,69,255,.3), 0 0 80px rgba(20,241,149,.1)`
- `solana-glow-sm`: `0 0 20px rgba(153,69,255,.2)`

## 字型
- Sans: Inter（300–700）· display 也用 Inter（tracking-tight）
- Mono: JetBrains Mono（400/500）—— 数字、命令、状态、日志

## 固有界面元素
- 玻璃拟态侧栏（`glass` + border-r）
- 背景双 orbs（purple 左上 / green 右下 blur-100）
- active nav = purple 10% 底 + 左侧渐变竖条（rounded-r-full）
- 渐变 logo 方块 + 白色内嵌小方块
- 状态 dot / badge 语义：green = 健康，purple = 主色，muted = 待定

## 语境气质（禁区 → 采用）
- ❌ 不做明亮渐变营销页 / 紫色 emoji 堆砌 / 圆角卡片+左彩色 accent 烂大街组合（反 slop）
- ✅ 深夜驾驶舱深色基调 · 紫绿做信号光 · mono 数字密度 · 留一处 120% 签名细节
- 文案性格：终端口吻（"reachable 44ms" 这类真实输出直接当 UI 文案），中文界面点缀 🦞 人格，不堆 emoji

## 真实数据快照（三版共用）
- Gateway: local · ws://127.0.0.1:18789 · reachable 44ms · auth token
- Model: moonshot/kimi-k2-0905-preview · 256k ctx
- Agents: 2（main active 1m ago / solana）· Sessions: 4
- Channels: Telegram ON (token config) · 其他未配置
- Skills: 95 eligible · 11 missing requirements
- Security audit: 0 critical · 1 warn · 1 info
- Heartbeat: 30m (main) · disabled (solana)
- Node: node 24.15.0 · macOS arm64 · Tailscale off