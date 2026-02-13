---
title: Component Generation Guide
phase: 1
purpose: Generate React components for each scene following remotion-best-practices
---

# Component Generation Guide

为每个场景生成高质量的 Remotion React 组件。

## 核心原则

### 1. 必须遵循 remotion-best-practices

**CRITICAL**: 生成组件前，务必参考 `remotion-best-practices` 技能。

关键要求：
- ✅ 使用 `spring()` 做所有动画（不用 CSS animations）
- ✅ 使用 `fitText()`/`measureText()` 处理文本尺寸
- ✅ 组件是纯函数（无副作用）
- ✅ 正确使用 `useCurrentFrame()` 和 `useVideoConfig()`
- ❌ 不使用 `useState`、`useEffect`
- ❌ 不使用 CSS `transition` 或 `animation`
- ❌ 不在渲染时调用外部 API

### 2. 场景类型特定模板

每种场景类型有不同的动画和布局模式。参考对应的场景类型指南：

| 场景类型 | 指南文件 | 关键特性 |
|---------|---------|---------|
| hook | `scene-types/hook-scene.md` | 打字机效果，弹跳动画 |
| textDisplay | `scene-types/text-display-scene.md` | fitText，滑入动画 |
| numberComparison | `scene-types/number-comparison-scene.md` | 数字动画，对比布局 |
| threeColumns | `scene-types/three-columns-scene.md` | 错位显示 |
| caseStudy | `scene-types/case-study-scene.md` | 序列转场 |
| cta | `scene-types/cta-scene.md` | 多步骤显示 |

## 组件结构

### 标准组件模板

```typescript
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from 'remotion';
import { fitText } from '@remotion/layout-utils';
import NeonBackground from './NeonBackground';
import SceneAudio from './SceneAudio';
import Subtitle from './Subtitle';
import { theme } from './theme';
import type { Scene } from './types';

interface SceneProps {
  startFrame: number;
  durationFrames: number;
  scene: Scene;
}

const SceneName: React.FC<SceneProps> = ({ startFrame, durationFrames, scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = frame - startFrame;

  // 动画计算（使用 spring）
  const opacity = spring({
    frame: localFrame,
    fps,
    config: { damping: 20 }
  });

  const scale = spring({
    frame: localFrame,
    fps,
    config: { damping: 12, stiffness: 100 }
  });

  // 文本适配（使用 fitText）
  const fittedTitle = fitText({
    text: scene.narration,
    withinWidth: 1600,
    fontFamily: theme.fonts.primary,
    fontSize: 80,
    fontWeight: 'bold'
  });

  return (
    <AbsoluteFill>
      <NeonBackground variant="gradient1" />

      {/* 音频 */}
      <SceneAudio
        sceneId={scene.id}
        startFrame={startFrame}
        durationFrames={durationFrames}
      />

      {/* 主要内容 */}
      <AbsoluteFill style={{
        justifyContent: 'center',
        alignItems: 'center',
        opacity,
        transform: `scale(${scale})`
      }}>
        <div style={{
          ...fittedTitle,
          color: theme.colors.primary,
          textAlign: 'center'
        }}>
          {scene.narration}
        </div>
      </AbsoluteFill>

      {/* 字幕 */}
      <Subtitle
        sceneId={scene.id}
        startFrame={startFrame}
        durationFrames={durationFrames}
      />
    </AbsoluteFill>
  );
};

export default SceneName;
```

### 必需的 Props

所有场景组件必须接受以下 props：

```typescript
interface SceneProps {
  startFrame: number;      // 场景开始帧
  durationFrames: number;  // 场景持续帧数
  scene: Scene;            // 场景数据（来自 script.json）
}
```

### Scene 类型定义

```typescript
interface Scene {
  id: string;
  type: 'hook' | 'textDisplay' | 'numberComparison' | 'threeColumns' | 'caseStudy' | 'cta';
  startTime: number;
  duration: number;
  startFrame: number;
  durationFrames: number;
  narration: string;
  visualCues: {
    keywords: string[];
    numbers?: Array<{
      label: string;
      oldValue?: string;
      newValue: string;
    }>;
    animation: 'bouncy' | 'smooth' | 'stagger' | 'scale';
    layout?: string;
  };
}
```

## 动画模式

### 1. Spring 配置

Remotion 使用物理模拟的 spring 动画。常用配置：

```typescript
// 柔和平滑（适合大多数场景）
const smooth = spring({
  frame: localFrame,
  fps,
  config: { damping: 20, stiffness: 80 }
});

// 弹跳活泼（适合 hook、CTA）
const bouncy = spring({
  frame: localFrame,
  fps,
  config: { damping: 12, stiffness: 100 }
});

// 快速响应（适合小元素）
const snappy = spring({
  frame: localFrame,
  fps,
  config: { damping: 15, stiffness: 200 }
});
```

### 2. 延迟启动

使用延迟让元素依次出现：

```typescript
const delay = 15; // 0.5秒（30fps * 0.5）

const opacity = spring({
  frame: localFrame - delay,
  fps,
  config: { damping: 20 }
});

// 只在延迟后显示
if (localFrame < delay) return null;
```

### 3. 序列动画

使用 `Series` 组件创建序列：

```typescript
import { Series } from 'remotion';

<Series>
  <Series.Sequence durationInFrames={60}>
    <Step1 />
  </Series.Sequence>
  <Series.Sequence durationInFrames={60}>
    <Step2 />
  </Series.Sequence>
  <Series.Sequence durationInFrames={60}>
    <Step3 />
  </Series.Sequence>
</Series>
```

### 4. 错位显示（Stagger）

让多个元素依次出现：

```typescript
const items = ['Item 1', 'Item 2', 'Item 3'];
const staggerDelay = 10; // 每个延迟 10 帧

{items.map((item, index) => {
  const itemOpacity = spring({
    frame: localFrame - (index * staggerDelay),
    fps,
    config: { damping: 20 }
  });

  return (
    <div key={index} style={{ opacity: itemOpacity }}>
      {item}
    </div>
  );
})}
```

## 文本处理

### 1. 使用 fitText

自动调整字体大小以适应容器：

```typescript
import { fitText } from '@remotion/layout-utils';

const fittedText = fitText({
  text: scene.narration,
  withinWidth: 1600,        // 容器宽度
  fontFamily: 'Inter',
  fontSize: 80,              // 最大字体大小
  fontWeight: 'bold'
});

<div style={{
  ...fittedText,  // 包含 fontSize, fontFamily, fontWeight
  color: theme.colors.primary
}}>
  {scene.narration}
</div>
```

### 2. 使用 measureText

测量文本尺寸以布局其他元素：

```typescript
import { measureText } from '@remotion/layout-utils';

const { width, height } = measureText({
  text: 'Hello World',
  fontFamily: 'Inter',
  fontSize: 60,
  fontWeight: 'bold'
});

// 根据测量结果调整布局
```

### 3. 关键词高亮

从 visualCues.keywords 提取关键词并高亮：

```typescript
const highlightKeywords = (text: string, keywords: string[]) => {
  let result = text;
  keywords.forEach(keyword => {
    const regex = new RegExp(`(${keyword})`, 'gi');
    result = result.replace(
      regex,
      `<span style="color: ${theme.colors.accent}; font-weight: bold;">$1</span>`
    );
  });
  return <span dangerouslySetInnerHTML={{ __html: result }} />;
};
```

### 4. 打字机效果

逐字显示文本（适合 hook 场景）：

```typescript
const charsToShow = Math.floor(
  (localFrame / durationFrames) * scene.narration.length
);

const displayText = scene.narration.slice(0, charsToShow);
```

## 布局模式

### 1. 居中布局

```typescript
<AbsoluteFill style={{
  justifyContent: 'center',
  alignItems: 'center',
  padding: 100
}}>
  <Content />
</AbsoluteFill>
```

### 2. 左右分屏

```typescript
<AbsoluteFill style={{ flexDirection: 'row' }}>
  <div style={{ flex: 1, padding: 80 }}>
    <LeftContent />
  </div>
  <div style={{ flex: 1, padding: 80 }}>
    <RightContent />
  </div>
</AbsoluteFill>
```

### 3. 三列网格

```typescript
<AbsoluteFill style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: 60,
  padding: 100
}}>
  <Column1 />
  <Column2 />
  <Column3 />
</AbsoluteFill>
```

### 4. 上下堆叠

```typescript
<AbsoluteFill style={{
  flexDirection: 'column',
  justifyContent: 'space-between',
  padding: 100
}}>
  <Header />
  <MainContent />
  <Footer />
</AbsoluteFill>
```

## 颜色和主题

使用 `theme.ts` 中定义的主题色：

```typescript
import { theme } from './theme';

<div style={{
  color: theme.colors.primary,           // 霓虹绿
  backgroundColor: theme.colors.background, // 深色背景
  borderColor: theme.colors.accent,      // 强调色
  fontFamily: theme.fonts.primary        // 主字体
}}>
  Content
</div>
```

## 质量检查清单

生成组件后，验证：

### 代码质量
- [ ] TypeScript 无编译错误
- [ ] 导出默认组件
- [ ] Props 类型正确（SceneProps）
- [ ] 无 console.log 或调试代码

### Remotion 最佳实践
- [ ] 使用 spring() 而非 CSS animations
- [ ] 使用 fitText/measureText 处理文本
- [ ] 组件是纯函数（无副作用）
- [ ] 使用 useCurrentFrame 和 useVideoConfig
- [ ] 不使用 useState/useEffect

### 动画质量
- [ ] 动画流畅（60fps）
- [ ] 延迟和时机合理
- [ ] 元素不闪烁或卡顿
- [ ] 淡入淡出自然

### 视觉质量
- [ ] 文本清晰可读
- [ ] 颜色对比度充足（WCAG AA 标准）
- [ ] 关键词正确高亮
- [ ] 布局平衡美观
- [ ] 响应式适配（1920x1080）

### 场景特定
- [ ] 符合场景类型规范（参考 scene-types/ 指南）
- [ ] 使用 visualCues 中的数据（keywords、numbers）
- [ ] 动画风格匹配 visualCues.animation
- [ ] 布局匹配 visualCues.layout（如有）

## 组件生成流程

### 步骤 1: 读取 script.json

```bash
Read /path/to/script.json
```

提取场景信息：
- type: 场景类型
- narration: 旁白文本
- visualCues: 视觉提示（关键词、数字、动画风格）
- duration: 时长

### 步骤 2: 选择场景类型指南

根据 scene.type，读取对应的场景类型指南：

```bash
# 例如：hook 场景
Read .claude/skills/script-to-remotion/rules/scene-types/hook-scene.md
```

### 步骤 3: 参考示例

查看完整示例组件：

```bash
Read .claude/skills/script-to-remotion/examples/Hook-scene-example.tsx
```

### 步骤 4: 生成组件代码

根据：
- 场景类型指南（动画模式、布局）
- script.json 数据（narration、visualCues）
- remotion-best-practices（技术规范）

生成完整的 React 组件。

### 步骤 5: 验证

使用质量检查清单验证生成的代码。

### 步骤 6: 保存

```bash
Write /path/to/project/src/scenes/Scene1-Hook.tsx
```

命名格式：`Scene{N}-{Type}.tsx`（例如：`Scene1-Hook.tsx`）

## 常见错误

### ❌ 使用 CSS animations

```typescript
// 错误
<div style={{
  animation: 'fadeIn 1s ease-in'
}}>
```

```typescript
// 正确
const opacity = spring({
  frame: localFrame,
  fps,
  config: { damping: 20 }
});

<div style={{ opacity }}>
```

### ❌ 硬编码文本大小

```typescript
// 错误
<div style={{ fontSize: 80 }}>
  {scene.narration}
</div>
```

```typescript
// 正确
const fittedText = fitText({
  text: scene.narration,
  withinWidth: 1600,
  fontSize: 80
});

<div style={fittedText}>
  {scene.narration}
</div>
```

### ❌ 使用 useEffect

```typescript
// 错误
useEffect(() => {
  // 任何副作用
}, []);
```

```typescript
// 正确
// Remotion 组件不需要副作用
// 所有逻辑应基于 frame 计算
```

### ❌ 忽略 localFrame

```typescript
// 错误
const opacity = spring({ frame, fps });  // 使用全局 frame
```

```typescript
// 正确
const localFrame = frame - startFrame;
const opacity = spring({ frame: localFrame, fps });  // 使用局部 frame
```

## 下一步

为每个场景生成组件后，进入**阶段 2: 项目组装**（`project-assembly.md`）
