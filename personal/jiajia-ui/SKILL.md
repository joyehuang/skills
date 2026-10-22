---
name: jiajia-ui
description: 夹夹（jiajia.fun，qqbot dashboard-ui）的 UI/UX 设计系统——Filo 吉祥物配色（天空蓝 + 奶油 + 墨蓝 + 珊瑚点）、暖纸底、大圆角干净卡片、shadcn/Tailwind v4。当用户要为夹夹做新页面/组件、说「按夹夹站内风格」「jiajia 同款」时使用。不要用于 joyehuang.dev 手绘风（用 handdrawn-ui）或用户指定其他风格的场景。权威源码在 Joye-Co/qqbot 的 dashboard-ui/（私有仓库，只描述风格不外贴源码）。
---

# Jiajia UI（夹夹站设计系统）

**安静、可读、有一点可爱**。印刷感的阅读页骨架（暖纸底、细边框、宽行距），可爱只来自两处：圆润的标题字体（Nunito + 站酷快乐）和 Filo 吉祥物表情。不靠阴影、渐变、动效堆氛围。

## 权威源码（改设计先看这里，均在 Joye-Co/qqbot）

- `dashboard-ui/src/index.css` —— 全部 token（`:root` 亮色、`.dark` 暂定暗色、`@theme inline` 映射到 Tailwind）、`page-frame` / `hit-area` 工具类、`.font-heading`
- `dashboard-ui/src/app.css` —— 后台壳（侧栏/topbar/page-intro/eyebrow）、断点、reduced-motion 兜底
- `dashboard-ui/src/fonts.css` —— 自托管字体（CSP 只允许 self，且国内连不上 Google Fonts）
- `dashboard-ui/src/components/ui/*` —— shadcn 原语（button/card/badge/input/tabs/sheet…）
- `dashboard-ui/src/components/site/*` —— 站点组件：SiteHeader、SiteFooter、EntryCard、StateView、Mascot、NavDrawer
- `dashboard-ui/src/site-presets.ts` —— 空/加载/错误状态文案 + 表情、类型 chip 配色
- `dashboard-ui/src/mascot.ts` + `src/brand/filo/*.svg` —— Filo 8 种表情（素材 all-rights-reserved，可能被删，必须走 mascot.ts 降级）
- `dashboard-ui/src/theme.tsx` —— light/dark/system，`html.dark` 切换

## 设计原则（Do / Don't）

- **字是墨蓝不是黑**：正文/标题 `--foreground #252d6e`，次要 `--muted-foreground #62678f`；永远不用 #000
- **底是暖纸**：页面 `#fbf7ef`，卡片纯白 `#ffffff`，边框暖灰 `#e6decf`（1px）
- **珊瑚只做点**：`--filo-dot #fe6544` 是 Filo 的信号灯，只用于小面积点缀/图表第三色；文字级红用 `--coral-ink #a8361a`，错误用 `--destructive #c8431f`
- **天空蓝 = 交互**：focus ring、hover 边框（卡片 `hover:border-filo-sky`）、选中底 `--accent #e3f0fb`
- **阴影几乎没有**：卡片靠 1px 边框区分层级；全站只有两处极淡的墨蓝扩散阴影（负 spread），新页面默认不写阴影
- **大圆角**：`--radius 0.875rem`；卡片 `rounded-xl`/`rounded-2xl`/`rounded-[20px]`，chip 和头像 `rounded-full`，按钮 `rounded-lg`
- **标题用 font-heading**：Nunito（拉丁/数字，wght 760）+ 站酷快乐（中文，单字重，`font-synthesis-weight: none` 禁止伪粗体）；正文 Noto Sans SC Variable；日期/数字/代码 IBM Plex Mono
- **行距宽**：正文 `leading-7`/1.9；卡片标题 21px、要点 15px
- **动效极短**：页面切换 view-transition 140ms 交叉淡入，按钮 `active:translate-y-px`；没有入场动画秀。必须保留 `prefers-reduced-motion` 全局兜底（duration .01ms）
- **触控 44px**：小链接/图标按钮加 `hit-area`
- **暗色**：所有颜色走 CSS 变量，别写死 hex，暗色才能跟着 `.dark` 走（暗色调色板标注为暂定）
- Don't：毛玻璃、渐变按钮、大面积珊瑚色、纯黑文字、硬阴影/手绘边框（那是 handdrawn-ui）、外链字体 CDN、emoji 当图标（用 lucide-react）

## Design Tokens（亮色，节选自 index.css）

```css
:root {
  /* Filo 品牌色 */
  --filo-sky: #89c3f2; --filo-cream: #f6e9d4; --filo-ink: #252d6e; --filo-dot: #fe6544;
  --sky-soft: #e3f0fb; --coral-soft: #ffede6; --coral-ink: #a8361a; --link: #1f5e9c;
  /* shadcn 语义色 */
  --background: #fbf7ef; --foreground: #252d6e;
  --card: #ffffff; --primary: #252d6e; --primary-foreground: #fbf7ef;
  --secondary: #f6e9d4; --muted: #f7f3ea; --muted-foreground: #62678f;
  --accent: #e3f0fb; --destructive: #c8431f;
  --border: #e6decf; --input: #e6decf; --ring: #89c3f2;
  --chart-1: #89c3f2; --chart-2: #252d6e; --chart-3: #fe6544; --chart-4: #f6e9d4; --chart-5: #62678f;
  --radius: 0.875rem;
}
/* 暗色（暂定）：bg #15161c / card #1d1f28 / fg #f1eadc / primary 反转为 #89c3f2 / border #2e3040 */
```

**类型 chip**（知识库条目，tint 底 + 同色相深字，满足 AA）：method 蓝 `#d3e8fc/#1b5690`、concept 杏 `#fbe3b8/#7d4f0c`、pick 珊瑚 `#ffd3c6/#a2321a`、read 紫 `#e1ddfb/#4a3c9e`、career 绿 `#cdeedb/#1f6a43`、company 青 `#d2ecef/#19636b`、discussion 粉 `#f9d7e7/#9a2d63`。新类型照此「浅底 + 同色相深字」配对。

## 布局与断点

- 公开页容器 `page-frame`：max-width 1240px，左右 1.25rem → ≥40rem 2.5rem → ≥80rem 3.5rem
- 后台壳：固定侧栏 230px（≤1190px 缩到 205px，≤1023px 隐藏改抽屉），topbar 69px（≤1023px 58px），内容 max 1340px
- 移动端 ≤767px：栅格改单列，page-intro h1 25px，内边距 19px
- 验收两个宽度：**1280** 和 **390**；390 下 header 改 `max-sm:` 紧凑版（品牌字 text-sm、导航收进 NavDrawer/MoreNav）

## 组件速查

- **SiteHeader**：底部 1px 边框、背景同页面、`view-transition-name: site-header` 切页不闪；品牌 = Filo 头像 + font-heading 名字 + 小副标题（窄屏隐藏）
- **EntryCard**：白卡 + 1px 边框 + `rounded-[20px]` + p-6；顶行 TypeChip + mono「截至 日期」+ 可选「推荐」（珊瑚深字 + 实心星）；标题 font-heading 21px；一句结论 muted 15px；底部「专题 · xx」
- **Button**（shadcn cva）：default 墨蓝底奶白字，hover 80% 透明；outline 边框 + hover muted 底；focus 3px 天空蓝 ring
- **Eyebrow**：小号大字距标签 + 19px 短横线，墨蓝色，用在页面标题上方
- **StateView**（空/加载/错误）：居中，Filo 表情 112px → font-heading 标题 → muted 说明 → 可选操作。一个状态一个表情：loading=think、无结果=puzzled、需登录=curious、不可用=sleepy、已撤回=shy、404=puzzled
- **mark 高亮**：奶油底 + 墨蓝字 + 3px 圆角
- **滚动条**：细圆 thumb，前景色 18% 混合，hover 34%

## 文案口吻

- 夹夹是第三人称角色：「夹夹正在翻找…」「夹夹打了个盹，暂时连不上」
- 每个异常状态 = **发生了什么 + 下一步做什么**，语气平实不卖萌过度：「换个说法试试，或者去看看全部答案。」
- 说明实际情况，不吓人：「通常几分钟后就会恢复，你看到的是上一次成功加载的内容。」
- 全角中文标点，书名号/引号用「」；数字与中文之间留空格

## 静态示例（本仓库 `personal/jiajia-ui/examples/`）

- 单文件 HTML + `shared.css`，token 与上文一致；截图存 `assets/`（1280 / 390）
- 示例字体经 jsDelivr @fontsource，便于本地打开与 Playwright 复拍；**线上夹夹仍必须自托管 `fonts.css`（禁止生产环境外链 Google Fonts）**

## 新页面落地流程

1. 在 dashboard-ui 内直接用 Tailwind 语义类（`bg-card text-foreground border text-muted-foreground font-heading`），不要新增 hex
2. 公开页包 `page-frame`；新路由按仓库规则同时登记（如 SPA_ROUTES / PUBLIC_PAGES）
3. 状态一律用 StateView + site-presets，不另写空状态
4. 检查清单：文字是墨蓝？卡片只有边框没阴影？珊瑚只是点缀？标题 font-heading？小目标有 hit-area？reduced-motion 有效？`.dark` 下不出现写死颜色？1280/390 都截图过？
