---
name: jiajia-ui
description: 夹夹（jiajia.fun）公开站的 UI/UX 设计系统——暖纸印刷感 + Filo 配色 + 大圆角 shadcn 语义。当用户要为夹夹或「同款安静可读、一点可爱」的站点做页面/组件、说「按夹夹站内风格」「jiajia 同款」时使用。不要用于 joyehuang.dev 手绘风（用 handdrawn-ui）或用户指定其他品牌。权威实现见 Joye-Co/qqbot 的 dashboard-ui/（私有，skill 只写可执行规则，不外贴源码）。
---

# Jiajia UI（夹夹站设计系统）

**安静、可读、有一点可爱**。像一本摊在暖色桌面上的技术杂志：正文与栅格保持印刷感，可爱只来自 **圆润标题字** 和 **Filo 小插画**，不靠阴影、渐变、动效堆氛围。

## 权威源码（改设计先看这里，均在 Joye-Co/qqbot）

- `dashboard-ui/src/index.css` —— token（`:root` / `.dark` / `@theme inline`）、`page-frame` / `hit-area` / `.font-heading`
- `dashboard-ui/src/app.css` —— 公开顶栏、page-intro、eyebrow、断点、reduced-motion
- `dashboard-ui/src/fonts.css` —— 自托管字体（生产禁止 Google Fonts CDN）
- `dashboard-ui/src/components/ui/*` —— shadcn 原语
- `dashboard-ui/src/components/site/*` —— SiteHeader、EntryCard、StateView、Mascot…
- `dashboard-ui/src/site-presets.ts` —— 空/错/加载文案 + Filo 表情映射
- `dashboard-ui/src/mascot.ts` —— Filo SVG 与降级占位

线上公开页（首页 / 话题 / 答案 / 面经 / 关于）是验收参照；skill 验证用 `/tmp` 截图分析，**不要把线上截图提交进仓库**。

## 设计哲学（气质）

- **印刷优先**：宽行距、墨蓝字、1px 暖灰边框分区；信息密度中等，列表可扫读。
- **可爱有预算**：`font-heading`（Nunito + 站酷快乐）+ Filo 头像/空状态；正文不用卡通字，不用 emoji 当图标（用 lucide 或 inline SVG）。
- **层级靠边框不靠阴影**：白卡片浮在暖纸 `#fbf7ef` 上，靠 `1px #e6decf` 与留白分层；全站默认 **无卡片 drop-shadow**（仅 toast 等极少数可 1px 墨蓝描边式阴影）。
- **天空蓝 = 交互信号**：focus ring、hover 边框、accent 底；**primary 按钮是墨蓝底奶白字**，不是天蓝大色块。
- **珊瑚 = 小面积信号灯**：`#fe6544` 仅 Filo 圆点、图表第三色、极少量强调；文字级红用 `--coral-ink` / `--destructive`。

## 设计原则（Do / Don't）

- **字是墨蓝不是黑**：正文/标题 `#252d6e`，次要 `#62678f`；禁止 `#000` / `#111`
- **底是暖纸、卡是纯白**：页面 `#fbf7ef`，卡片 `#ffffff`，输入框/下拉同白底
- **大圆角一致**：全局 `--radius 0.875rem`；列表卡 `rounded-[20px]`，按钮/chip `rounded-lg` / `full`
- **顶栏粘顶、与页同底**：`border-bottom 1px`，无独立深色 nav（登录按钮除外）
- **当前导航 = 浅底 pill**：`background: muted` 或 `accent`，不是下划线主导
- **Eyebrow 标签**：11px 大写/字距 + 19px 短横线，墨蓝色，在 h1 上方
- **mark 高亮**：奶油底 `#f6e9d4` + 墨蓝字 + 3px 圆角，用于命中词/关键词
- **动效极短**：切页 cross-fade ~140ms；按钮 `active:translate-y-px`；必须写 `prefers-reduced-motion` 全局兜底
- **触控 44px**：图标/小链接加 `hit-area` 扩大点击区
- **暗色走变量**：不写死 hex，让 `.dark` 能接管（暗色调色板在源码里标注为暂定）
- Don't：毛玻璃、渐变 CTA、大面积珊瑚底、**卡片 drop-shadow / 大 blur 阴影**、**天蓝 `--filo-sky` 作主按钮底色**、手绘歪边框（handdrawn-ui）、生产环境外链字体、真实用户 PII/QQ 号/密钥
- **验证常见失误（r1/r2/r3 实测）**：模型爱写 `#000` 正文、给 `.card` 加 `box-shadow`、primary 按钮用天蓝、EntryCard 只用 `rounded-xl` 而非 **20px**、TypeChip 随意霓虹色——交付前对照文末检查清单。

## Design Tokens（直接粘贴可用）

```css
:root {
  --filo-sky: #89c3f2;
  --filo-cream: #f6e9d4;
  --filo-ink: #252d6e;
  --filo-dot: #fe6544;
  --sky-soft: #e3f0fb;
  --coral-soft: #ffede6;
  --coral-ink: #a8361a;
  --link: #1f5e9c;
  --background: #fbf7ef;
  --foreground: #252d6e;
  --card: #ffffff;
  --primary: #252d6e;
  --primary-foreground: #fbf7ef;
  --secondary: #f6e9d4;
  --muted: #f7f3ea;
  --muted-foreground: #62678f;
  --accent: #e3f0fb;
  --destructive: #c8431f;
  --border: #e6decf;
  --input: #e6decf;
  --ring: #89c3f2;
  --chart-1: #89c3f2;
  --chart-2: #252d6e;
  --chart-3: #fe6544;
  --radius: 0.875rem;
}

html {
  color-scheme: light;
}

body {
  margin: 0;
  min-height: 100vh;
  background: var(--background);
  color: var(--foreground);
  font-family: "Noto Sans SC", system-ui, sans-serif;
  font-size: 15px;
  line-height: 1.9;
  -webkit-font-smoothing: antialiased;
}

.font-heading {
  font-family: "Nunito", "ZCOOL KuaiLe", "Noto Sans SC", sans-serif;
  font-weight: 800;
  font-synthesis-weight: none;
}

a {
  color: var(--link);
}
a:hover {
  color: color-mix(in srgb, var(--link) 85%, var(--foreground));
}

::selection {
  background: var(--sky-soft);
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

**类型 chip**（答案卡片顶栏）：浅底 + 同色相深字，满足 AA——method `#d3e8fc/#1b5690`、concept `#fbe3b8/#7d4f0c`、pick `#ffd3c6/#a2321a`、read `#e1ddfb/#4a3c9e`、career `#cdeedb/#1f6a43`、company `#d2ecef/#19636b`、discussion `#f9d7e7/#9a2d63`。新类型照此配对，勿随机霓虹色。

## 核心工具类

```css
.page-frame {
  width: 100%;
  max-width: 1240px;
  margin: 0 auto;
  padding-inline: 1.25rem;
}
@media (min-width: 40rem) {
  .page-frame {
    padding-inline: 2.5rem;
  }
}
@media (min-width: 80rem) {
  .page-frame {
    padding-inline: 3.5rem;
  }
}

.hit-area {
  position: relative;
}
.hit-area::after {
  content: "";
  position: absolute;
  inset: -8px;
}

.eyebrow {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  margin-bottom: 0.75rem;
}
.eyebrow::after {
  content: "";
  width: 19px;
  height: 2px;
  background: var(--foreground);
  border-radius: 1px;
}

.mark {
  background: var(--filo-cream);
  color: var(--foreground);
  border-radius: 3px;
  padding: 0 0.2em;
}

.card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
}

.entry-card {
  border-radius: 20px;
  padding: 1.5rem;
  transition: border-color 0.12s ease;
}
.entry-card:hover {
  border-color: var(--filo-sky);
}
```

## 原语组件速查（语义对照，非 React 项目照 HTML 重写）

### SiteHeader（公开顶栏）

- 结构：左 **品牌**（Filo 圆头像 40px + `font-heading` 站名 + 12px muted 副标题，窄屏隐藏副标题）｜中 **主导航**（答案/话题/关于…）｜右 **工具区**（版本 pill、搜索框、次要 outline 按钮、主题图标、`btn-primary` 登录）
- 样式：`sticky top-0`，背景 = `--background`，`border-bottom: 1px solid var(--border)`；高度 desktop ~69px，mobile ≤767px ~58px
- 导航链接：14px，padding 0.5rem 0.75rem，`border-radius: 0.5rem`；hover → `muted` 底；当前页 → `accent` 底
- 搜索：白底 pill，`border: 1px solid var(--border)`，内嵌放大镜；占位 muted，可选 `Ctrl K` 提示用 `font-mono` 11px
- 登录：**唯一**常用实心墨蓝 pill，奶白字，min-height 44px

### EntryCard（答案/话题条目卡）

- 白底 + 1px 边框 + **`rounded-[20px]`** + `p-6`
- 顶行：`TypeChip` + `font-mono` 日期（「截至 yyyy-mm-dd」）+ 可选「推荐」（coral-ink + 星形 SVG，非 emoji）
- 标题：`font-heading` 21px/leading-snug，1–2 行
- 摘要：15px `muted-foreground`，一句结论或首段 preview
- 底栏：13px muted「专题 · xxx」或元信息
- hover：**只改边框色**为 `--filo-sky`，不加 shadow

### TypeChip / FilterChip

- TypeChip：`rounded-full`，12px 半粗，用上文 AA 配色表
- FilterChip（列表筛选项）：白底 + 边框；选中 `background: accent` + `border-color: filo-sky`

### SegControl（分段切换，如「全部 / 精华」）

- 外层：inline-flex，1px 边框，大圆角
- 选中项：`background: primary`，`color: primary-foreground`
- 未选：透明/白底，墨蓝字

### PromoBanner（首页/列表顶提示）

- 全宽（在 page-frame 内）：`background: sky-soft`，`border: 1px solid border`，`rounded-xl`，padding 1rem 1.25rem
- 左文案 + 右 outline/primary 小按钮；语气平实，非弹窗

### PageIntro（列表页标题区）

- `padding-block: 2rem 1.25rem`
- h1：`font-heading`，desktop ~28–32px，mobile 25px
- 副文案：15px muted，max-width ~36rem，行距 1.9

### StateView（空/加载/错误）

- 垂直居中，max-width ~420px
- Filo 插画 **112px**（SVG 或 CSS 占位，生产走 mascot.ts）
- 标题 `font-heading` ~22px；说明 muted 15px；可选 primary/outline 按钮
- 一状态一表情：loading=think、无结果=puzzled、需登录=curious、不可用=sleepy、404=puzzled（见 site-presets 语义）

### FooterCta（首页底部大条）

- **反色块**：`background: primary`，`color: primary-foreground`，`rounded-2xl`，padding 2rem+
- 左：标题 + 2 行说明；右：Filo 大插画或 outline 浅字按钮
- 全站少数大面积深色块；勿滥用

### SiteFooter

- `border-top: 1px solid border`，`margin-top: 4rem`，13px muted
- 左：免责声明/版权；右：链接组（周报、公告、关于、隐私…）

## 页面骨架规律

| 页面类型 | 骨架 |
| --- | --- |
| 营销首页 | Header → PromoBanner → Hero 双栏（左标题+搜索，右 Featured EntryCard + Filo 探出）→ 分节标题 + 卡片栅格 → Stat 行 → FooterCta → Footer |
| 索引列表（答案/话题） | Header → PageIntro → 搜索/FilterChip 行 → 可选 SegControl → 卡片栅格或 topic 卡 → 分页 → Footer |
| 空状态列表（面经等） | Header → PageIntro + 侧栏说明卡 → 筛选条 → **StateView 居中** → Footer |
| 关于/长文 | Header → PageIntro → 双栏（左 prose，右 Filo 插画卡）→ 编号步骤卡 grid → Footer |

- 栅格：desktop 3 列 entry 卡，`gap: 1rem`；≤767px 单列
- 分节标题：`font-heading` 20px + 右侧 `链接色`「看全部 →」
- 数字/日期/统计：IBM Plex Mono；中文正文永远 Noto Sans SC
- 验收宽度：**1280** 与 **390**（mobile 顶栏收图标 + 抽屉）

## 文案口吻

- 产品可第三人称（「服务正在整理…」），**不要**过度卖萌或虚构 QQ 群细节（公开 skill 示例用泛化社区名）
- 异常态 = **发生了什么 + 下一步**；不吓人、不甩锅
- 全角中文标点；书名号/引号用「」；数字与中文间留空格

## 静态示例与验证（本仓库）

- 样式校准页：`examples/calibration-*.html` + `shared.css`（fontsource CDN 仅本地/Playwright；**生产必须自托管**）
- 三轮验证产物：`examples/r1-*.html`、`r2-*.html`、`r3-*.html` + 对应 `*.jpg` / `*-390.jpg`；**禁止**提交 jiajia.fun 线上截图

## 新页面落地流程

1. 复制上文 tokens + 工具类（或引用 dashboard-ui `index.css`）
2. 公开页内容包在 `page-frame`；组件语义对齐 shadcn（`bg-card text-foreground border-border`…）
3. 状态用 StateView + presets，不另写一套空状态
4. **检查清单**（交付前逐项打勾）：
   - [ ] 页面暖纸、卡片白底、**无卡片阴影**
   - [ ] 正文/标题墨蓝，无纯黑
   - [ ] 标题 `font-heading`，正文 leading ~1.9
   - [ ] 主按钮墨蓝底；focus 3px sky ring
   - [ ] 珊瑚仅 dot/小点缀；TypeChip 用预设配色
   - [ ] EntryCard 20px 圆角，hover sky 边框
   - [ ] Header 69px/58px，小目标 44px + hit-area
   - [ ] `prefers-reduced-motion` 已写
   - [ ] 1280 / 390 视觉验收通过
   - [ ] 暗色无写死 hex（若支持 dark）
