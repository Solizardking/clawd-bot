# Direction Approved · Clawdbot 单页静态站

## 用户指示（原话摘要）
> Use the design-demos in this repo (`c3-motion-design.html`, `hero-animation-v10-en.html`, `w1-brand-protocol-en.html`, `c5-infographic-en.html`, `c1-ios-prototype-en.html`)
> as inspiration for a **Clawdbot one-page static site**.

## 判定
用户在本次会话明确指定输出形态（单页静态站）+ 指定灵感来源（5 个 demos）= 方向已选定。
依据 skill「唯一豁免」情形（用户明说直接做/指定方向），视为选定方向，不再重复三方向门。
落档本文件 → 进入主干执行（Junior → Full pass）。

## 设计要点（从 5 个灵感文件提取后固化）
- 把各 demo 的标志性语言迁移到 Clawdbot 语境（hero 动效 / 品牌协议 / 信息图密度 / motion 节奏 / 终端人格）。
- 内容 100% 来自本仓库：README 特性表、packages、命令、环境变量、CLI banner 人格（🦞 "I speak fluent bash, mild sarcasm, and aggressive tab-completion energy"）、真实 status 数据。
- 单文件 HTML，file:// 双击即开；桌面 1440 基准；品牌 token 沿用 solana 紫/绿。

## 状态
- [x] env:check ✅
- [x] inventory:check ✅
- [ ] pack:check（运行中，预期通过——web/.env.example 已补）
- [x] 方向落档
- [ ] 读取 5 个灵感文件提取设计语言
- [ ] 读取仓库内容（README/docs/命令/特性）
- [ ] 实现单页静态站 HTML
- [ ] 截图验证 + 交付