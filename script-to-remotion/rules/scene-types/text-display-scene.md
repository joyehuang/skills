---
title: Text Display Scene
scene_type: textDisplay
duration: 15-20 seconds
purpose: Present core message or key point with clean text focus
---

# Text Display Scene

文本展示场景：清晰呈现核心信息或关键要点。

## 特点

- **时长**: 15-20 秒
- **目标**: 传达一个清晰的核心信息
- **动画风格**: 平滑、专业、易读
- **文本风格**: 大字体，良好间距，分层显示

## 动画时间轴

```
Frame 0-20   (0-0.67s):  背景和主标题滑入
Frame 20-40  (0.67-1.3s): 副标题或支持文本淡入
Frame 40-60  (1.3-2s):    关键词高亮脉冲
Frame 60-450 (2-15s):     保持显示
Frame 450-480 (15-16s):   淡出
```

## 核心代码模式

```typescript
const HookScene: React.FC<HookSceneProps> = ({ startFrame, durationFrames, scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = frame - startFrame;

  // 主标题滑入
  const titleSlide = spring({
    frame: localFrame,
    fps,
    config: { damping: 20, stiffness: 80 }
  });

  const titleTransform = interpolate(
    titleSlide,
    [0, 1],
    [-100, 0]  // 从左侧滑入
  );

  // 副标题延迟淡入
  const subtitleOpacity = spring({
    frame: localFrame - 20,
    fps,
    config: { damping: 20 }
  });

  // 文本适配
  const fittedTitle = fitText({
    text: mainText,
    withinWidth: 1600,
    fontSize: 80,
    fontFamily: theme.fonts.primary,
    fontWeight: 'bold'
  });

  return (
    <AbsoluteFill>
      <NeonBackground variant="gradient2" />

      <AbsoluteFill style={{
        justifyContent: 'center',
        alignItems: 'center',
        padding: 100,
        flexDirection: 'column',
        gap: 40
      }}>
        {/* 主标题 */}
        <div style={{
          ...fittedTitle,
          color: theme.colors.primary,
          transform: `translateX(${titleTransform}px)`,
          textAlign: 'center'
        }}>
          {mainText}
        </div>

        {/* 副标题 */}
        <div style={{
          fontSize: 40,
          color: theme.colors.text,
          opacity: subtitleOpacity,
          textAlign: 'center',
          maxWidth: 1400
        }}>
          {supportingText}
        </div>
      </AbsoluteFill>

      <SceneAudio sceneId={scene.id} startFrame={startFrame} durationFrames={durationFrames} />
      <Subtitle sceneId={scene.id} startFrame={startFrame} durationFrames={durationFrames} />
    </AbsoluteFill>
  );
};
```

## 布局变体

### 单行居中

```typescript
<div style={{
  fontSize: fittedText.fontSize,
  textAlign: 'center',
  maxWidth: '80%'
}}>
  {scene.narration}
</div>
```

### 多行分段

```typescript
const [line1, line2] = scene.narration.split('. ');

<>
  <div style={titleStyle}>{line1}</div>
  <div style={{ ...subtitleStyle, opacity: line2Opacity }}>{line2}</div>
</>
```

### 标题 + 要点列表

```typescript
<div style={{ flexDirection: 'column', gap: 30 }}>
  <h1 style={titleStyle}>{title}</h1>
  <ul style={listStyle}>
    {scene.visualCues.keywords.map((keyword, i) => (
      <li key={i} style={{ opacity: itemOpacity(i) }}>
        {keyword}
      </li>
    ))}
  </ul>
</div>
```

## 质量检查

- [ ] 文字在 1 秒内完成入场
- [ ] 主标题使用 fitText 自适应
- [ ] 支持文本清晰可读（至少 32px）
- [ ] 关键词视觉强调
- [ ] 总时长 15-20 秒
- [ ] 滑入动画平滑（无卡顿）
