---
name: script-to-remotion
description: Convert video scripts into production-ready Remotion projects with React components, audio, and rendering
tags: [remotion, video, react, documentation]
version: 3.0.0
---

# script-to-remotion

将结构化的视频脚本转换为可运行的 Remotion 项目，包括 React 组件生成、TTS 音频集成、字幕生成和视频渲染。

## 使用场景

使用此技能当您需要：
- 将 script.json 转换为 Remotion 视频项目
- 生成符合 remotion-best-practices 的 React 组件
- 可选生成 TTS 音频（使用 Google Gemini API）
- 自动生成智能分段的字幕
- 渲染最终视频（MP4 格式）

**不要使用**当：
- 直接从文章生成脚本（使用 `article-to-script` 技能）
- 编辑现有视频或剪辑
- 创建交互式视频内容

## 前置要求

### 必需
- **script.json** - 来自 `article-to-script` 技能的输出
- **Node.js** - 版本 18+ 和 pnpm 包管理器
- **remotion-best-practices** 技能 - 必须参考以确保组件质量

### 可选
- **Google Gemini API Key** - 用于 TTS 音频生成
- **背景音乐** - BGM 文件（如需要）

## 工作流程

此技能遵循 **4阶段工作流**：

### 阶段 1: 组件生成 (30-45分钟)

为每个场景生成 React 组件

**流程**：
1. 读取 script.json
2. 参考 remotion-best-practices 技能
3. 为每个场景类型生成对应组件
4. 确保使用 spring 动画（不用 CSS 动画）
5. 使用 fitText/measureText 处理文本尺寸

**规则文件**: `rules/component-generation.md`
**场景类型指南**: `rules/scene-types/*.md`（6个文件）

### 阶段 2: 项目组装 (15-20分钟)

创建完整的 Remotion 项目结构

**流程**：
1. 创建项目目录结构
2. 复制 package.json、tsconfig.json、remotion.config.ts
3. 创建 Root.tsx 主组件
4. 复制共享组件（NeonBackground、Subtitle等）
5. 复制主题文件（theme.ts）
6. 安装依赖

**规则文件**: `rules/project-assembly.md`

### 阶段 3: TTS 音频生成（可选，10-15分钟）

使用 Google Gemini API 生成 TTS 音频

**流程**：
1. 创建独立的 tts-generator.js 脚本
2. 为每个场景生成音频文件
3. 应用 1.25x 播放速度
4. 生成字幕分段数据
5. 保存到 public/audio/ 目录

**规则文件**: `rules/tts-integration.md`, `rules/subtitle-generation.md`

### 阶段 4: 预览和渲染 (5-10分钟)

启动预览和渲染视频

**流程**：
1. 启动 Remotion 预览服务器（`pnpm start`）
2. 在浏览器中检查效果
3. 渲染最终视频（`pnpm build`）
4. 输出 video.mp4

**规则文件**: `rules/render-configuration.md`

## 快速开始

```bash
# 1. 准备 script.json
# 假设已通过 article-to-script 生成

# 2. 参考 remotion-best-practices
Read .claude/skills/remotion-best-practices/skill.md

# 3. 参考 script-to-remotion 规则
Read .claude/skills/script-to-remotion/rules/component-generation.md
Read .claude/skills/script-to-remotion/rules/scene-types/*.md

# 4. 生成组件（为每个场景）
# 根据场景类型选择对应的模板和规则生成代码

# 5. 组装项目
Read .claude/skills/script-to-remotion/rules/project-assembly.md
# 按照说明创建完整项目结构

# 6. 可选：生成 TTS
Read .claude/skills/script-to-remotion/rules/tts-integration.md
# 创建并运行 tts-generator.js

# 7. 安装依赖
cd video-output-<timestamp>
pnpm install

# 8. 预览
pnpm start
# 浏览器访问 http://localhost:3000

# 9. 渲染
pnpm build
# 输出到 out/video.mp4
```

## 核心特性

### 6种场景类型支持

每种场景类型都有专门的模板和动画：

| 场景类型 | 时长 | 用途 | 关键特性 |
|---------|------|------|---------|
| **hook** | 5-8s | 开场钩子 | 打字机效果，弹跳动画 |
| **textDisplay** | 15-20s | 核心信息展示 | fitText 自适应，滑入动画 |
| **numberComparison** | 12-18s | 数据对比 | 数字动画，前后对比布局 |
| **threeColumns** | 15-20s | 三列对比 | 错位显示，Series 序列 |
| **caseStudy** | 20-30s | 案例故事 | TransitionSeries，前后转场 |
| **cta** | 8-12s | 行动号召 | 多步骤显示，强调动画 |

### Spring 物理动画

所有动画使用 Remotion 的 spring() 物理引擎：

```typescript
const scale = spring({
  frame,
  fps,
  config: { damping: 12, stiffness: 100 }
});
```

**禁止使用 CSS 动画**（违反 remotion-best-practices）

### 响应式文本

使用 @remotion/layout-utils 确保文本适配：

```typescript
import { fitText, measureText } from '@remotion/layout-utils';

const fittedText = fitText({
  text: narration,
  withinWidth: 1600,
  fontFamily: 'Inter',
  fontSize: 80
});
```

### 智能字幕分段

自动将长旁白分段为易读的字幕：
- 按标点符号自然断句
- 每段 3-8 秒时长
- 淡入淡出效果（0.2秒）
- 完美同步音频

## 规则文件

所有工作流规则文档化在 `rules/` 目录：

**核心规则：**
- `component-generation.md` - React 组件生成指南
- `project-assembly.md` - 项目结构和配置
- `render-configuration.md` - Remotion 渲染设置
- `troubleshooting.md` - 常见问题解决

**场景类型指南（6个）：**
- `scene-types/hook-scene.md` - 开场钩子场景
- `scene-types/text-display-scene.md` - 文本展示场景
- `scene-types/number-comparison-scene.md` - 数字对比场景
- `scene-types/three-columns-scene.md` - 三列场景
- `scene-types/case-study-scene.md` - 案例故事场景
- `scene-types/cta-scene.md` - CTA 场景

**音频和字幕：**
- `tts-integration.md` - TTS 音频生成（可选）
- `subtitle-generation.md` - 字幕分段算法

## 模板文件

即用型代码模板在 `templates/` 目录：

**配置文件：**
- `package.json.template` - 项目依赖
- `tsconfig.json.template` - TypeScript 配置
- `remotion.config.ts.template` - Remotion 设置
- `theme.ts` - 霓虹玻璃态主题

**共享组件：**
- `components/NeonBackground.tsx` - 动态渐变背景
- `components/SceneAudio.tsx` - 音频播放器
- `components/Subtitle.tsx` - 字幕组件

**其他：**
- `Root.tsx.template` - 主组件模板
- `tts-generator.js.template` - TTS 生成脚本

## 示例

- `examples/script-input.json` - 示例输入脚本
- `examples/Hook-scene-example.tsx` - 完整的 Hook 场景组件
- `examples/complete-project/` - 完整项目参考

## Bash 命令

所有 CLI 操作文档化在 `commands/bash-commands.md`：
- 项目设置命令
- 依赖安装
- TTS 生成（可选）
- 预览和渲染
- 错误处理

## 质量保证

### 必须遵循 remotion-best-practices

**关键规则：**
- ✅ 使用 spring() 做所有动画
- ✅ 使用 fitText/measureText 处理文本
- ✅ 组件必须是纯函数（无副作用）
- ✅ 正确使用 useCurrentFrame() 和 useVideoConfig()
- ❌ 不使用 CSS animations 或 transitions
- ❌ 不使用 useState/useEffect
- ❌ 不使用外部 API 调用

### 组件质量标准

每个生成的组件必须：
- TypeScript 无错误编译
- 导出正确类型（场景组件）
- Props 包含 startFrame, durationFrames, scene
- 动画流畅（60fps）
- 文本清晰可读
- 颜色对比度充足

## 故障排查

常见问题和解决方案在 `rules/troubleshooting.md`：
- TypeScript 编译错误
- 动画卡顿
- 文本溢出
- 音频同步问题
- 渲染失败

## 版本历史

- **v3.0.0** (2025-01): 纯文档技能，模板驱动
- **v2.1.0** (2024-12): CLI 驱动的 Phase 4-8 实现
- **v1.0.0** (2024-11): 初始单体技能

## 支持

遇到问题时：
- 查看 `rules/troubleshooting.md` 常见问题
- 参考 `examples/` 示例实现
- 咨询 `remotion-best-practices` 技能
- 检查 Remotion 官方文档

## 相关技能

- **article-to-script** - 上游：生成 script.json
- **remotion-best-practices** - 必须参考：确保组件质量
