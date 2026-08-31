---
name: handdrawn-ui
description: joyehuang.dev（面试手记/interview-dashboard）的 UI/UX 设计系统——手绘 Excalidraw 风 + 马卡龙亮色。当用户要求新页面/组件/站点沿用 dev 域名的手绘风、或说「按站内风格」「同款设计」时使用。不要用于用户明确指定其他风格的场景。权威源码在 ~/dev/interview-dashboard。
---

# Handdrawn UI（dev 域名设计系统）

手绘 Excalidraw 风 + 马卡龙亮色。**印刷稿是本体，手绘是批注层**：页面骨架（宋体标题、干净卡片、清晰栅格）保持印刷感，手绘元素（不规则圆角、马克笔、便利贴、箭头）只作为强调和批注，不淹没可读性。

## 权威源码（改设计先看这里）

- `~/dev/interview-dashboard/src/index.css` —— 全部 design token + 工具类
- `~/dev/interview-dashboard/src/components/ui/index.tsx` —— 全部原语组件（React+Tailwind v4）

任何新页面直接复制 token 和工具类起步，不要凭记忆重造。

## 设计原则（Do / Don't）

- **无模糊硬阴影**：`box-shadow: 3px 3px 0 rgba(58,58,58,.18)`，永远不写 blur
- **同类元素轮换 4 组不规则圆角**，制造「每个都是手画的」错觉；同一组不要连排
- **2px 墨线**（#3a3a3a）描边是默认边框；细线用 hairline #d8d2c2
- **元素带轻微旋转**（±0.5~6deg），便利贴/徽章/印章必须有 rotate
- **颜色只用马卡龙色系做底**，文字永远 ink #3a3a3a；红 #d6606e 只用于强调/错误/印章
- **动效短促有弹性**：0.3-0.7s + `cubic-bezier(0.2,0.7,0.3,1)`，入场 = rise，笔画入场 = draw-on（stroke-dashoffset）
- **遵守 `prefers-reduced-motion`**（源码里有关闭全部动画的媒体查询块，照抄）
- Don't：毛玻璃/模糊阴影/渐变按钮/纯直角卡片堆叠/饱和度高于马卡龙的底色

## Design Tokens（直接粘贴可用）

```css
:root {
  /* 纸面与墨线 */
  --paper: #fffdf8; --ink: #3a3a3a; --sub: #5a564c;
  --weak: #8d887c; --faint: #b5b0a4;
  --hairline: #d8d2c2; --hairline2: #e4dfd2;
  /* 马卡龙 */
  --mac-yellow: #ffe08a; --mac-yellow2: #fff3b0;
  --mac-pink: #ffd6e0; --mac-mint: #c3f5d8;
  --mac-sky: #cdeaff; --mac-lilac: #e3d7ff;
  /* 强调 */
  --purple: #7a5fe0; --purple-hover: #5a3fd0; --purple-dash: #9b8cf0;
  --orange: #e8890c; --error: #d6606e;
  /* 字体 */
  --font-body: 'Noto Sans SC','PingFang SC',sans-serif;   /* 正文 */
  --font-title: 'ZCOOL KuaiLe','Noto Sans SC',sans-serif; /* 标题/按钮，Google Fonts */
  --font-hand: 'Caveat','Noto Sans SC',cursive;           /* 手写批注/数字，Google Fonts */
  --ease-sketch: cubic-bezier(0.2, 0.7, 0.3, 1);
}
body {
  background: var(--paper);
  /* 点阵画布：整站的纸面质感来源 */
  background-image: radial-gradient(circle, rgba(30,30,30,.08) 1.2px, transparent 1.2px);
  background-size: 22px 22px;
  color: var(--ink); font-family: var(--font-body);
  -webkit-font-smoothing: antialiased;
}
a { color: var(--purple); } a:hover { color: var(--purple-hover); }
::selection { background: var(--mac-yellow); }
```

## 核心工具类

```css
/* 手绘边框：4 组轮换（sk-1/2/3/4），小胶囊用 tag-1..4，圆徽章用 blob-1..3 */
.sk   { border: 2px solid var(--ink); }
.sk-1 { border-radius: 255px 15px 225px 15px / 15px 225px 15px 255px; }
.sk-2 { border-radius: 15px 225px 15px 255px / 255px 15px 225px 15px; }
.sk-3 { border-radius: 225px 15px 255px 15px / 15px 255px 15px 225px; }
.sk-4 { border-radius: 15px 255px 15px 225px / 225px 15px 255px 15px; }

/* 硬阴影 + 抬起/按压交互 */
.hs { --sh: rgba(58,58,58,.18); box-shadow: 3px 3px 0 var(--sh);
      transition: transform .13s var(--ease-sketch), box-shadow .13s var(--ease-sketch); }
.hs-lift:hover { transform: translate(-2px,-2px); box-shadow: 5px 5px 0 var(--sh); }
.press:active  { transform: translate(1px,1px); box-shadow: 1px 1px 0 var(--sh); }

/* 入场动效 */
@keyframes rise { from { opacity:0; transform: translateY(14px) } to { opacity:1; transform:none } }
.anim-rise { animation: rise .4s var(--ease-sketch) both; }
@keyframes draw { from { stroke-dashoffset:1 } to { stroke-dashoffset:0 } }
.anim-draw { stroke-dasharray:1; stroke-dashoffset:1; animation: draw .7s .35s ease-out both; }
/* 用法：SVG path 加 pathLength={1} + .anim-draw，笔画像被画出来 */
```

## 原语组件速查（React 实现在 ui/index.tsx，非 React 项目照语义重写）

- **Marker**（马克笔下划线）——文字底后压一条 17px 宽的弯曲粗笔（SVG path + anim-draw），黄/粉/绿换色。强调标题关键词用。
- **Blob**（血迹圆徽章）——不规则圆 + 2px 墨线 + 马卡龙底，序号/头像/logo 用，带 variant 轮换。
- **StickyNote**（便利贴）——马卡龙底 + sk 边框 + 轻旋转 + 硬阴影，hover 时保持 rotate 上浮 3px。卡片、要点块用。
- **Chip**（筛选胶囊）——选中黑底反白，未选白/马卡龙底 + 轮换小旋转。
- **SegControl**（分段控件）——sk 边框整体包裹，选中项马卡龙黄，其余白，2px 墨线分隔。
- **DashedFrame**（紫色虚线框）——1.5px dashed #9b8cf0 圆角框，标题嵌在边框线上（bg-paper 打断虚线）。分区容器用。
- **HandArrow / WavyRule**——手绘箭头（单向/双向两组走势轮换）、波浪分隔线，全部 SVG path，绝不用 ↓ 字符和 hr。
- **Toast**——底部居中黄便签，rotate(-1deg) + toastIn 入场。
- **ImageSlot**——图片占位：虚线框 + font-hand 灰字占位文案。

## 页面骨架规律

- 导航：底部 2px 墨线分隔，品牌名 font-title 22px，当前 tab 马卡龙黄底 + 2px 墨线框，右缘外链用虚线下划线
- 卡片栅格：白底卡 + sk 边框 + 硬阴影 + 入场 anim-rise（列表逐个 delay 0.05s）
- 数字/英文点缀用 font-hand（Caveat），中文正文永远 Noto Sans SC
- 长文本折叠用 5 行 clamp + 展开
- 仅亮色主题（本设计系统无暗色版）

## 新页面落地流程

1. `cp` 上面 tokens + 工具类到新项目（或整文件引用 `~/dev/interview-dashboard/src/index.css` 改）
2. React 项目直接 `import { Marker, Blob, StickyNote, ... } from` 源码（文件自包含，仅依赖 tailwindcss）
3. 检查清单：阴影全硬无模糊？同类圆角有轮换？元素有微旋转？动效带 ease-sketch + reduced-motion 兜底？颜色没有超出马卡龙+强调色板？
