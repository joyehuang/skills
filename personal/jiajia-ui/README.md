# jiajia-ui

夹夹（jiajia.fun）公开站 UI 设计系统：**安静、可读、有一点可爱**——暖纸印刷骨架 + Filo 配色 + 大圆角 shadcn 语义。

设计规范见 [SKILL.md](SKILL.md)（tokens / 原语 / Do·Don't / 检查清单）。本 README 是实战验证记录与案例画廊。

> **校准门禁（已完成）**：在 r1/r2/r3 之前，曾用线上一页一型截图（`/tmp`，不入库）重写 SKILL，并用泛化页 `calibration-neighborhood-tools.html` 对照线上气质；该校准页**不进入**下方画廊（与 handdrawn-ui 一致，画廊仅含三轮验证产物）。

## 验证方法

三轮测试，共 **20 个案例** × **1280 / 390** 截图（JPEG q≈82，`examples/` 内 `*.jpg` 与 `*-390.jpg`），全部由「**只读 SKILL.md、零 qqbot 源码、零口头指导**」的编码 agent 产出（HTML + `shared.css`）：

- **第一轮 · 模型矩阵**（5 个）：同一任务（**DeskFlow 会议室预约偏好面板**，非夹夹产品）× 5 个模型——**Claude Opus 5.5**、**GPT-5.6-Sol**、**Composer 2.5**、**Gemini 4 Argon**、**Cursor Grok 4.6**。
- **第二轮 · 页面形态**（5 个）：表单+错误+toast / 落地+FAQ / 后台仪表盘 / 内容列表+chip / 异常状态合集——易翻车的功能 UI。
- **第三轮 · 行业语境**（10 个）：宠物医院、独立书店、小时天气、银行账单、儿童课程、植物养护、租房、公益招募、博物馆、社区药房——**与 handdrawn-ui 第三轮行业零重叠**，且非夹夹业务。

每份产物按 **8 条硬性约束**检查：暖纸底+墨蓝字（非纯黑）、卡片 **仅 1px 边框无 drop-shadow**、EntryCard **`rounded-[20px]`**、primary **墨蓝底**（非天蓝主按钮）、天空蓝 focus/hover、TypeChip AA 配色、三字体分工（Nunito+站酷 / Noto Sans SC / IBM Plex Mono）、`prefers-reduced-motion` 兜底。

**结果：20/20 HTML 通过；40/40 截图入库。** 每页含 hero、Filo 视觉、统计、多段内容（表格/图表/FAQ/评价等）与 FooterCta，**无** meta 免责声明。

复拍：`cd personal/jiajia-ui/scripts && npm install && npx playwright install chromium && node build-rich-pages.mjs && node capture-screenshots.mjs`

## 案例画廊

画廊表内为 **1280** 视口全页图；对应 **390** 文件名为 `*-390.jpg`（见仓库 `examples/`）。

### 第一轮 · 同一任务 × 五个模型

| 模型 | 产出（1280） |
| --- | --- |
| Claude Opus 5.5 | ![opus](examples/r1-opus.jpg) |
| GPT-5.6-Sol | ![codex](examples/r1-codex.jpg) |
| Composer 2.5 | ![composer](examples/r1-composer.jpg) |
| Gemini 4 Argon | ![gemini](examples/r1-gemini.jpg) |
| Cursor Grok 4.6 | ![grok](examples/r1-grok.jpg) |

> 五模型只靠一份 SKILL.md，同一任务下布局细节不同，但 token、边框分层、墨蓝 primary 一致——跨模型可执行性成立。Opus/Codex 版信息分区最完整；部分模型需靠 SKILL 里 **SegControl / PromoBanner** 条目才会加 sky 提示条。

### 第二轮 · 功能 UI 形态

| 形态 | 产出（1280） |
| --- | --- |
| 表单（校验错误 + toast） | ![form](examples/r2-form.jpg) |
| 落地页（hero + FAQ） | ![landing](examples/r2-landing.jpg) |
| 数据仪表盘（侧栏 + 表 + 条图） | ![dashboard](examples/r2-dashboard.jpg) |
| 内容列表（chip + 卡片流 + 分页） | ![list](examples/r2-list.jpg) |
| 异常状态（加载/空/404/失败） | ![states](examples/r2-states.jpg) |

> 表单与后台壳是雷区：这一轮验证了 **destructive 文案、filter-chip 选中态、shell-sidebar** 在暖纸面上仍可读。

### 第三轮 · 跨行业语境

| 行业 | 产出（1280） |
| --- | --- |
| 宠物医院预约 | ![vet](examples/r3-vet.jpg) |
| 独立书店 | ![bookstore](examples/r3-bookstore.jpg) |
| 小时天气 | ![weather](examples/r3-weather.jpg) |
| 银行账单 | ![billing](examples/r3-billing.jpg) |
| 儿童课程 | ![education](examples/r3-education.jpg) |
| 植物养护 | ![plants](examples/r3-plants.jpg) |
| 租房列表 | ![rental](examples/r3-rental.jpg) |
| 公益招募 | ![volunteer](examples/r3-volunteer.jpg) |
| 博物馆展览 | ![museum](examples/r3-museum.jpg) |
| 社区药房 | ![pharmacy](examples/r3-pharmacy.jpg) |

> 行业差异靠 **PageIntro / entry-grid / footer-cta / data-table** 组合表达，未引入夹夹 EntryCard 文案或 qqbot 路由。

## 结论

- **skill 即规范**：tokens + 原语 + 8 条硬约束足以在任意形态、任意泛化行业复现夹夹公开站视觉；**20/20** 案例零「纯黑+重阴影+天蓝主按钮」翻车。
- **模型常忽略的（已在 SKILL.md 加粗）**：卡片 `box-shadow`、primary 误用 `--filo-sky`、纯 `#000` 正文、EntryCard 圆角不够（应用 20px）、跳过 `font-heading`、TypeChip 随机色、**页面过短**（仅标题+两三卡）——需补 stats/表格/FAQ/FooterCta 才达 handdrawn-ui 密度。
- **稳定项**：暖纸/白卡/1px 边框、墨蓝 primary、sky focus ring、宽行距正文、Filo 占位与 StateView 结构。
- **执行建议**：要快且稳用 **Claude Opus 5.5**；要布局多样性用 **GPT-5.6-Sol**；本仓库 r1 HTML 由上述五模型族各一稿（见 `examples/r1-*.html`）。
- **权威实现**：Joye-Co/qqbot `dashboard-ui/`（私有）；线上参照 jiajia.fun 公开路由。

## 安装

```bash
ln -s "$(pwd)/personal/jiajia-ui" .cursor/skills/jiajia-ui
```
