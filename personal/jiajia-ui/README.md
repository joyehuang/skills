# jiajia-ui

夹夹（jiajia.fun / qqbot dashboard-ui）的 UI/UX 设计系统：**安静、可读、有一点可爱**——暖纸印刷骨架 + Filo 配色 + 大圆角 shadcn/Tailwind 语义类。

设计规范见 [SKILL.md](SKILL.md)（tokens / 组件速查 / Do·Don't / 落地流程）。本 README 说明何时启用、如何安装，以及 **18 组静态示例** 的截图画廊与规则映射。

## 何时使用

- 为夹夹做新页面、组件或改版，或用户说「按夹夹站内风格」「jiajia 同款」
- 需要 Filo 配色、EntryCard、StateView、SiteHeader 等站点原语时
- **不要**用于 joyehuang.dev 手绘风（用 [handdrawn-ui](../handdrawn-ui/)）或用户指定其他品牌

权威实现位于私有仓库 Joye-Co/qqbot 的 `dashboard-ui/`（skill 只描述风格，不外贴源码）。

## 安装

`personal/` 技能默认不进 `npx skills add joyehuang/skills` 根目录包，按需拷贝或 symlink：

```bash
# Cursor（项目级）
ln -s "$(pwd)/personal/jiajia-ui" .cursor/skills/jiajia-ui

# Claude Code / pi（全局）
ln -s ~/dev/skills/personal/jiajia-ui ~/.claude/skills/jiajia-ui
# 或 ~/.agents/skills/jiajia-ui
```

Agent 匹配 SKILL.md frontmatter 的 `description` 即可加载正文；做 UI 前让 agent 读 `examples/` 与 `assets/` 画廊对照。

## 验证方法

- **18 组页面形态**，每组单文件 HTML（`examples/*.html` + `shared.css`），仅依据 SKILL.md，无 qqbot 源码、无 PII
- 每组在视口 **1280** 与 **390** 各截图一张（JPEG q≈82），存于 `assets/`
- 复拍：`cd personal/jiajia-ui/scripts && npm install && npx playwright install chromium && node capture-screenshots.mjs`

## 案例画廊

每组：**桌面 1280** | **移动 390**（全页高度随内容变化）

### 公开页与导航

| 形态 | 1280 | 390 | SKILL.md 规则 |
| --- | --- | --- | --- |
| 落地 Hero | ![landing 1280](assets/landing-1280.jpg) | ![landing 390](assets/landing-390.jpg) | 暖纸底、墨蓝字、Eyebrow、mark 高亮、无阴影、font-heading、page-frame |
| EntryCard 列表 | ![card-list 1280](assets/card-list-1280.jpg) | ![card-list 390](assets/card-list-390.jpg) | EntryCard 20px 圆角、TypeChip 配色、mono 日期、推荐 coral-ink、hover sky 边框 |
| 长文阅读 | ![article 1280](assets/article-longread-1280.jpg) | ![article 390](assets/article-longread-390.jpg) | leading-7、mark、全角标点「」、muted 次要信息 |
| 方案对比 | ![pricing 1280](assets/pricing-1280.jpg) | ![pricing 390](assets/pricing-390.jpg) | 卡片仅边框、sky-soft 推荐档、default/outline 按钮、无渐变按钮 |
| 移动 NavDrawer | ![mobile 1280](assets/mobile-nav-1280.jpg) | ![mobile 390](assets/mobile-nav-390.jpg) | ≤767 单列、58px topbar、44px hit-area、NavDrawer、品牌 text-sm |

### 功能与后台

| 形态 | 1280 | 390 | SKILL.md 规则 |
| --- | --- | --- | --- |
| 登录表单 | ![form 1280](assets/form-login-1280.jpg) | ![form 390](assets/form-login-390.jpg) | Input 边框、3px sky focus ring、destructive 错误文案、primary 墨蓝底 |
| 问答聊天 | ![qa 1280](assets/qa-chat-1280.jpg) | ![qa 390](assets/qa-chat-390.jpg) | 第三人称口吻、accent 用户气泡、mark、栅格 ≤767 单列 |
| 搜索 results | ![search 1280](assets/search-results-1280.jpg) | ![search 390](assets/search-results-390.jpg) | mark 命中高亮、muted 摘要、Eyebrow + page-intro |
| 数据仪表盘 | ![dash 1280](assets/dashboard-1280.jpg) | ![dash 390](assets/dashboard-390.jpg) | 后台壳侧栏 230px、stat 卡 IBM Plex Mono、chart-1/2/3 色 |
| 数据表格 | ![table 1280](assets/data-table-1280.jpg) | ![table 390](assets/data-table-390.jpg) | 1px 边框表格、hover accent、TypeChip 列、mono 日期 |
| 设置 | ![settings 1280](assets/settings-1280.jpg) | ![settings 390](assets/settings-390.jpg) | CSS 变量主题、reduced-motion、44px 开关触控 |

### 状态、反馈与 Filo

| 形态 | 1280 | 390 | SKILL.md 规则 |
| --- | --- | --- | --- |
| 空/加载/错误 | ![states 1280](assets/states-1280.jpg) | ![states 390](assets/states-390.jpg) | StateView 112px 表情、think/puzzled/sleepy、平实文案 + 下一步 |
| Filo 表情板 | ![filo 1280](assets/filo-expressions-1280.jpg) | ![filo 390](assets/filo-expressions-390.jpg) | 每状态一表情映射、占位非 SVG 素材、mascot.ts 降级 |
| 通知 + Toast | ![toast 1280](assets/notifications-toasts-1280.jpg) | ![toast 390](assets/notifications-toasts-390.jpg) | 卡片+边框反馈、destructive 标题、coral dot 列表点 |
| Modal + Drawer | ![modal 1280](assets/modal-drawer-1280.jpg) | ![modal 390](assets/modal-drawer-390.jpg) | 居中 modal、sheet 抽屉、filter-chip accent 选中 |

### 列表、引导与个人

| 形态 | 1280 | 390 | SKILL.md 规则 |
| --- | --- | --- | --- |
| 标签与筛选 | ![tags 1280](assets/tags-filters-1280.jpg) | ![tags 390](assets/tags-filters-390.jpg) | 全套 TypeChip AA 配色、filter-chip is-on = accent + sky 边 |
| 新手指引 | ![onboard 1280](assets/onboarding-1280.jpg) | ![onboard 390](assets/onboarding-390.jpg) | 分步条、短动效、reduced-motion 说明 |
| 个人主页 | ![profile 1280](assets/profile-home-1280.jpg) | ![profile 390](assets/profile-home-390.jpg) | 公开页卡片、rounded-full 头像、quick actions 44px 按钮 |

## 结论

- **SKILL.md + 画廊** 足以在公开页、后台、状态与营销场景复现夹夹视觉，而不依赖私有 qqbot  checkout。
- 示例 Filo 为 CSS 占位；生产环境使用 `mascot.ts` + 品牌 SVG 及降级路径。
- 验收清单仍适用：1280/390 截图、墨蓝非纯黑、珊瑚仅点缀、标题 font-heading、`.dark` 不写死 hex。
