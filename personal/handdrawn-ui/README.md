# handdrawn-ui

手绘 Excalidraw 风 + 马卡龙亮色的 UI 设计系统。**印刷稿是本体，手绘是批注层**——页面骨架（宋体标题、干净卡片、清晰栅格）保持印刷感，手绘元素（不规则圆角、马克笔、便利贴、箭头）只作为强调和批注。

设计规范见 [SKILL.md](SKILL.md)（tokens / 工具类 / 组件速查 / 落地流程）。本 README 是它的实战验证记录与案例画廊。

## 验证方法

三轮自动化测试，共 **20 个案例**，全部由「只读 SKILL.md、零口头指导」的编码 agent 产出（单文件 HTML，自包含）：

- **第一轮 · 模型矩阵**（5 个）：同一任务（模拟面试复盘报告页）× 5 个模型家族——Claude Opus 5、GPT-5.6-Sol（Codex）、DeepSeek-V4-Flash、Qwen3.8-Flash、GLM-5.3-Flash，验证 skill 跨模型可执行。
- **第二轮 · 页面形态**（5 个）：表单页 / 落地页 / 数据仪表盘 / 内容列表页 / 异常状态合集——手绘风最容易翻车的功能 UI 场景。
- **第三轮 · 产品语境**（10 个）：咖啡工作室、播客、文创电商、技术文档、工作坊报名、SaaS 定价、健身周报、音乐歌单、旅行行程、餐厅点单——跨行业的真实产品语境。

每份产物按 8 条硬性约束检查：点阵纸面、4 组不规则圆角轮换、无模糊硬阴影、元素微旋转、rise + draw-on 动效、reduced-motion 兜底、三字体分工（Noto Sans SC / ZCOOL KuaiLe / Caveat）、色板不越界。

**结果：20/20 通过，零翻车。**

## 案例画廊

### 第一轮 · 同一任务 × 五个模型

| 模型 | 产出 |
|---|---|
| Claude Opus 5 | ![claude-opus](examples/r1-opus.jpg) |
| GPT-5.6-Sol (Codex) | ![codex](examples/r1-codex.jpg) |
| DeepSeek-V4-Flash | ![ds4f](examples/r1-ds4f.jpg) |
| Qwen3.8-Flash | ![qwen38f](examples/r1-qwen38f.jpg) |
| GLM-5.3-Flash | ![glm53f](examples/r1-glm53f.jpg) |

> 五个模型家族只靠读一份 SKILL.md，产出同一份设计语言的五个版本——skill 的跨模型可执行性成立。速度与风格：Opus 最快最稳（~2min），Codex 视觉最敢做，CC 系性价比最高。

### 第二轮 · 功能 UI 形态

| 形态 | 产出 |
|---|---|
| 表单页（输入/多选/校验错误态/toast） | ![form](examples/r2-form.jpg) |
| 落地页（hero/卖点卡/FAQ 手风琴） | ![landing](examples/r2-landing.jpg) |
| 数据仪表盘（统计卡/表格/手绘柱状图） | ![dashboard](examples/r2-dashboard.jpg) |
| 内容列表页（筛选 chip/卡片流/分页） | ![list](examples/r2-list.jpg) |
| 异常状态（404/空结果/失败重试） | ![states](examples/r2-states.jpg) |

> 表单和表格是手绘风的天然雷区：这一轮验证了控件、数据密度和空状态在点阵纸面上不牺牲可读性。

### 第三轮 · 跨产品语境

| 语境 | 产出 |
|---|---|
| 咖啡烘焙工作室官网 | ![cafe](examples/r3-cafe.jpg) |
| 播客节目页 | ![podcast](examples/r3-podcast.jpg) |
| 文创电商详情页 | ![shop](examples/r3-shop.jpg) |
| 团队知识库文档页 | ![docs](examples/r3-docs.jpg) |
| 工作坊报名页 | ![event](examples/r3-event.jpg) |
| SaaS 定价页 | ![pricing](examples/r3-pricing.jpg) |
| 健身周报页 | ![fitness](examples/r3-fitness.jpg) |
| 音乐歌单页 | ![music](examples/r3-music.jpg) |
| 旅行行程页 | ![travel](examples/r3-travel.jpg) |
| 餐厅点单页 | ![menu](examples/r3-menu.jpg) |

> 这轮的重点是「不套模板」：两家执行模型都做了语境化设计——电商像开箱笔记、点单页用了小票式购物车、健身页的教练留言是便签、播客页有深夜电台氛围。风格统一但每页有自己的性格。

## 结论

- **skill 即规范**：一份 SKILL.md（tokens + 组件 + Do/Don't）足以让任意模型在任何页面形态、任何产品语境下复现这套设计语言。
- **最佳执行器**：要快和稳选 Claude Opus；要视觉惊喜选 GPT-5.6-Sol；CC 网关的 DeepSeek-V4-Flash 是性价比最优解。
- **权威源码**：`~/dev/interview-dashboard/src/index.css` + `src/components/ui/index.tsx`（线上实例 joyehuang.dev）。
