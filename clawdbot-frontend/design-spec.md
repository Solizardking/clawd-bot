# Clawdbot Front End · 设计 Spec（三方向共同输入）

## 产品 / 项目是什么
Clawdbot —— Solana 交易与发布的 AI 伴侣（Vibe-bot monorepo 内的 agent 运行时）。现有交互面包括 Telegram bot、CLI、Web Control UI、Mobile。本次设计目标：**Clawdbot 的 Web 前端（Control UI）**——即浏览器里控制整个 agent 系统的主界面。它不是营销落地页，而是一个**操作真实系统的控制面板/指挥台**：能看状态、切页面、管 agents/channels/sessions/cron/skills、看日志调试。

## 目标受众与使用场景
- 使用者：Clawdbot / Vibe-bot 的**运营者与高级用户**（不是小白消费者）。熟悉终端、懂 Solana、可能同时开着 Telegram 和 CLI。
- 场景：深夜开着一排终端管 bot；早上打开 dashboard 看昨晚 agents 干了什么；上线新 skill；排查节点/渠道状态。
- 情感基调：**专业、可信、有技术密度感**，但不冷冰冰——品牌有明确的「深夜驾驶舱 / 龙虾船长」人格（CLI banner 就是 🦞）。允许一点点玩味，但绝不让它变成玩具感。

## 核心信息与内容要点（主要板块，来自真实代码）
- **状态总览（Overview）**：gateway 状态（本地 loopback · ws://127.0.0.1:18789 · reachable 44ms）、agents 数（2）、sessions（4，default kimi-k2-0905-preview 256k ctx）、channels（Telegram ON……）、skills（95 eligible / 11 missing）、security audit（0 critical）
- **Chat**：与 agent 对话
- **Channels**：Telegram 等渠道开关与状态
- **Agents / Sessions**：agent 列表、会话、模型
- **Cron / Skills / Nodes / Config / Debug / Logs**：基础设施与设置
- 导航结构（现有 Sidebar）：Chat / Control（Overview·Channels·Agents·Sessions·Cron）/ Infrastructure（Skills·Nodes）/ Settings（Config·Debug·Logs）

## 情感基调与气质关键词
专业 · 深夜驾驶舱 · 技术密度 · Solana 原生（紫/绿）· 龙虾人格 · 「像高端终端工具，不像 SaaS 模板」

## 输出格式与尺寸（必填）
- **纯 HTML/CSS 单文件原型 ×3**（file:// 双击即开，无构建）
- 桌面 Web 界面，视口 1440×900，主题 dark
- 交付路径：`clawdbot-frontend/design-demos/[方向名].html`
- 截图：1440×900 PNG

## 已知约束（品牌 token，来自仓库 tailwind.config.js）
- 色：purple `#9945FF` / purple-light `#B67FFF` / purple-dark `#7B35CC`；green `#14F195` / green-light `#4FF5B3` / green-dark `#0FC77A`
- 底：`#0A0B0D` / secondary `#12141A` / tertiary `#1A1D24` / card `rgba(26,29,36,0.7)`
- border：`rgba(153,69,255,0.2)` / active 0.5 / glow `rgba(20,241,149,0.3)`
- 渐变：135deg purple→green；radial purple 0.15；glass gradient
- glow：`0 0 40px rgba(153,69,255,.3), 0 0 80px rgba(20,241,149,.1)`
- 字体：Inter（UI）/ JetBrains Mono（数字、命令）
- 现有元素：玻璃拟态侧栏、背景 gradient orbs、active 导航紫色+左渐变条、渐变 logo 方块+白色小方块

## 图片需求（Phase 3.5 判断）
工具/控制台类，图片**非内容必需** → 不取图。装饰一律 CSS 几何/排版解决（虚线网格、光束、投影），不生成 AI 图，不手画 SVG 人物/产品。品牌 mark 用「渐变方块+🦞」既有 lockup 的 CSS 化（诚实，不发明新 logo）。

## 视觉母题假设（form 推导第五问，三版共同精神）
- **母题 = 「驾驶舱 / 控制台」**：这个产品独有的结构是「一排状态通道 + 一个主视窗」，像夜航仪表盘。三版都从「指挥/监控」这个母题长出来，绝不做成通用 marketing page。
- 叙事角色：Overview 是 hero；其余页是工具。
- 观众距离：笔记本 1m（正文 14px+，关键数据可大）。

## 三方向差异定位（骨架必须互异）
| 方向 | 逻辑 | 骨架 | 气质 |
|---|---|---|---|
| A「终端舱」 | 秒数轮盘风格 | 极窄竖排 mono 导航 + 终端视图 | 把 dashboard 做成一个活的终端会话 |
| B「指挥舱」 | 现实参照（Linear 精密 SaaS）+ 现有 token | 经典三栏 glass dashboard | 可落地的专业 SaaS，重打磨现有 UI |
| C「夜航志」 | 顶级设计师（editorial 暗场叙事） | 居中排版驱动 + 不对称网格 | 品牌叙事感的「夜间驾驶舱杂志」 |

三版共用真实数据（gateway 18789 · kimi-k2 · agents 2 · sessions 4 · Telegram ON · skills 95/11 · security 0c），共用品牌 token，仅设计诠释不同。