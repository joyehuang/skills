---
title: Hook Scene
scene_type: hook
duration: 5-8 seconds
purpose: Grab attention with bold opening statement
---

# Hook Scene

开场钩子场景：用大胆的陈述或问题吸引注意力。

## 特点

- **时长**: 5-8 秒（最短场景）
- **目标**: 3 秒内抓住观众注意力
- **动画风格**: 弹跳、有力、快速
- **文本风格**: 大而大胆，高对比度

## 视觉风格

### 布局
- 居中布局
- 大号文字填满屏幕中心
- 最小化干扰元素

### 动画
- **入场**: 弹跳缩放 + 打字机效果
- **强调**: 关键词脉冲动画
- **出场**: 快速淡出

### 颜色
- 霓虹绿主色（`theme.colors.primary`）
- 深色背景突出文字
- 关键词用强调色（`theme.colors.accent`）

## 动画时间轴

```
Frame 0-15   (0-0.5s):  背景淡入
Frame 15-45  (0.5-1.5s): 标题弹跳入场 + 打字机效果
Frame 45-60  (1.5-2s):   关键词脉冲高亮
Frame 60-180 (2-6s):     保持显示
Frame 180-210 (6-7s):    淡出准备下一场景
```

## 代码模板

```typescript
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { fitText } from '@remotion/layout-utils';
import NeonBackground from '../components/NeonBackground';
import SceneAudio from '../components/SceneAudio';
import Subtitle from '../components/Subtitle';
import { theme } from '../theme';
import type { Scene } from '../types';

interface HookSceneProps {
  startFrame: number;
  durationFrames: number;
  scene: Scene;
}

const HookScene: React.FC<HookSceneProps> = ({ startFrame, durationFrames, scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = frame - startFrame;

  // 弹跳缩放动画
  const scale = spring({
    frame: localFrame,
    fps,
    config: {
      damping: 12,
      stiffness: 100,
      mass: 0.8
    }
  });

  // 淡入淡出
  const opacity = interpolate(
    localFrame,
    [0, 15, durationFrames - 30, durationFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // 打字机效果
  const charsToShow = Math.floor(
    interpolate(
      localFrame,
      [15, 45],
      [0, scene.narration.length],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    )
  );

  const displayText = scene.narration.slice(0, charsToShow);

  // 关键词脉冲
  const keywordPulse = spring({
    frame: localFrame - 45,
    fps,
    config: { damping: 10, stiffness: 200 }
  });

  const keywordScale = 1 + keywordPulse * 0.1;

  // 文本适配
  const fittedText = fitText({
    text: scene.narration,
    withinWidth: 1600,
    fontFamily: theme.fonts.primary,
    fontSize: 120,
    fontWeight: 'bold'
  });

  // 高亮关键词
  const highlightKeywords = (text: string) => {
    let result = text;
    scene.visualCues.keywords.forEach(keyword => {
      const regex = new RegExp(`(${keyword})`, 'gi');
      result = result.replace(
        regex,
        `<span style="
          color: ${theme.colors.accent};
          transform: scale(${keywordScale});
          display: inline-block;
        ">$1</span>`
      );
    });
    return result;
  };

  return (
    <AbsoluteFill>
      <NeonBackground variant="gradient1" />

      <SceneAudio
        sceneId={scene.id}
        startFrame={startFrame}
        durationFrames={durationFrames}
      />

      <AbsoluteFill style={{
        justifyContent: 'center',
        alignItems: 'center',
        opacity,
        transform: `scale(${scale})`,
        padding: 100
      }}>
        <div
          style={{
            ...fittedText,
            color: theme.colors.primary,
            textAlign: 'center',
            textShadow: `0 0 40px ${theme.colors.primary}60`,
            lineHeight: 1.2
          }}
          dangerouslySetInnerHTML={{
            __html: highlightKeywords(displayText)
          }}
        />
      </AbsoluteFill>

      <Subtitle
        sceneId={scene.id}
        startFrame={startFrame}
        durationFrames={durationFrames}
      />
    </AbsoluteFill>
  );
};

export default HookScene;
```

## 变体

### 变体 1: 问题式钩子

适合以问题开头的钩子（如"What if...?"）

```typescript
// 添加问号的脉冲动画
const questionMarkScale = spring({
  frame: localFrame - 30,
  fps,
  from: 1,
  to: 1.3,
  config: { damping: 8, stiffness: 150 }
});

// 在文本中强调问号
const emphasizedText = scene.narration.replace(
  '?',
  `<span style="transform: scale(${questionMarkScale}); display: inline-block; color: ${theme.colors.accent};">?</span>`
);
```

### 变体 2: 数字式钩子

适合以数字开头的钩子（如"97% of people..."）

```typescript
// 提取数字
const numbers = scene.narration.match(/\d+%?/g) || [];

// 数字滚动动画
const numberProgress = interpolate(
  localFrame,
  [15, 45],
  [0, 1],
  { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
);

numbers.forEach(num => {
  const targetValue = parseInt(num);
  const currentValue = Math.floor(targetValue * numberProgress);
  // 替换文本中的数字为动画数字
});
```

### 变体 3: 多行钩子

适合较长的钩子（2行）

```typescript
// 分行显示
const lines = scene.narration.split('.');
const line1 = lines[0];
const line2 = lines[1];

// 第二行延迟显示
const line2Delay = 20; // 0.67秒
const line2Opacity = spring({
  frame: localFrame - line2Delay,
  fps,
  config: { damping: 20 }
});

<div style={{ flexDirection: 'column', gap: 20 }}>
  <div>{line1}</div>
  <div style={{ opacity: line2Opacity }}>{line2}</div>
</div>
```

## 优化建议

### 性能
- 避免过度使用 `dangerouslySetInnerHTML`
- 缓存 fitText 结果（如果文本不变）
- 限制同时动画的元素数量

### 可读性
- 确保文字大小至少 60px
- 保持足够的行距（lineHeight: 1.2-1.4）
- 文字与背景对比度至少 4.5:1

### 动画
- 保持弹跳动画在 1.5 秒内完成
- 打字机效果速度：15-30 帧（0.5-1秒）
- 关键词脉冲延迟：1-1.5 秒后开始

## 常见错误

### ❌ 文字太小
```typescript
// 错误：固定小字体
fontSize: 40
```

```typescript
// 正确：使用 fitText 自动调整
const fittedText = fitText({
  text: scene.narration,
  withinWidth: 1600,
  fontSize: 120  // 最大值
});
```

### ❌ 动画太慢
```typescript
// 错误：缓慢的淡入
config: { damping: 30, stiffness: 50 }
```

```typescript
// 正确：快速有力
config: { damping: 12, stiffness: 100 }
```

### ❌ 没有打字机效果
```typescript
// 错误：直接显示全部文本
{scene.narration}
```

```typescript
// 正确：逐字显示
{displayText}
```

## 质量检查

生成 Hook 场景后验证：

- [ ] 文字在 0.5-1.5 秒内完成入场动画
- [ ] 关键词明显高亮（颜色或大小）
- [ ] 文字大小适配屏幕（不溢出）
- [ ] 弹跳动画自然（不过度）
- [ ] 总时长 5-8 秒
- [ ] 文字颜色与背景对比明显
- [ ] 打字机效果流畅（无闪烁）

## 示例场景数据

```json
{
  "id": "scene-1",
  "type": "hook",
  "narration": "What if I told you your roof could make you money while you sleep?",
  "visualCues": {
    "keywords": ["roof", "money", "sleep"],
    "animation": "bouncy"
  }
}
```

## 下一个场景类型

完成 Hook 场景后，继续 **Text Display Scene** (`text-display-scene.md`)
