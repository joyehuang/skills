---
title: Three Columns Scene
scene_type: threeColumns
duration: 15-20 seconds
purpose: Compare 3 items, show 3-step process, or list 3 advantages
---

# Three Columns Scene

三列场景：并排展示3个项目、步骤或优势。

## 特点

- **时长**: 15-20 秒
- **目标**: 展示3个并列的概念
- **动画风格**: 错位显示（stagger），从左到右
- **布局**: 三列网格，等宽

## 核心代码模式

```typescript
const ThreeColumnsScene: React.FC<SceneProps> = ({ startFrame, durationFrames, scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = frame - startFrame;

  const keywords = scene.visualCues.keywords.slice(0, 3);
  const staggerDelay = 15; // 每列延迟 15 帧 (0.5秒)

  return (
    <AbsoluteFill>
      <NeonBackground variant="gradient1" />

      <AbsoluteFill style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 60,
        padding: 100
      }}>
        {keywords.map((keyword, index) => {
          const columnOpacity = spring({
            frame: localFrame - (index * staggerDelay),
            fps,
            config: { damping: 20 }
          });

          const columnScale = spring({
            frame: localFrame - (index * staggerDelay),
            fps,
            config: { damping: 15, stiffness: 100 }
          });

          return (
            <div key={index} style={{
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 30,
              padding: 40,
              backgroundColor: `${theme.colors.cardBg}40`,
              borderRadius: 20,
              border: `2px solid ${theme.colors.primary}60`,
              opacity: columnOpacity,
              transform: `scale(${columnScale})`
            }}>
              {/* 序号 */}
              <div style={{
                fontSize: 40,
                color: theme.colors.accent,
                fontWeight: 'bold'
              }}>
                {index + 1}
              </div>

              {/* 标题 */}
              <div style={{
                fontSize: 50,
                color: theme.colors.primary,
                fontWeight: 'bold',
                textAlign: 'center'
              }}>
                {keyword}
              </div>

              {/* 装饰线 */}
              <div style={{
                width: '80%',
                height: 3,
                backgroundColor: theme.colors.primary,
                borderRadius: 2
              }} />
            </div>
          );
        })}
      </AbsoluteFill>

      <SceneAudio sceneId={scene.id} startFrame={startFrame} durationFrames={durationFrames} />
      <Subtitle sceneId={scene.id} startFrame={startFrame} durationFrames={durationFrames} />
    </AbsoluteFill>
  );
};
```

## Series 序列模式

使用 Remotion 的 `<Series>` 组件：

```typescript
import { Series } from 'remotion';

<Series>
  <Series.Sequence durationInFrames={Math.floor(durationFrames / 3)}>
    <Column1 />
  </Series.Sequence>
  <Series.Sequence durationInFrames={Math.floor(durationFrames / 3)}>
    <Column2 />
  </Series.Sequence>
  <Series.Sequence durationInFrames={Math.floor(durationFrames / 3)}>
    <Column3 />
  </Series.Sequence>
</Series>
```

## 布局变体

### 卡片式

```typescript
style={{
  backgroundColor: `${theme.colors.cardBg}60`,
  backdropFilter: 'blur(10px)',
  borderRadius: 20,
  padding: 40,
  border: `2px solid ${theme.colors.border}`
}}
```

### 图标 + 文本

```typescript
<div style={columnStyle}>
  <div style={{ fontSize: 80 }}>✓</div> {/* 或其他图标 */}
  <div style={titleStyle}>{keyword}</div>
  <div style={descStyle}>{description}</div>
</div>
```

### 进度条式

```typescript
{keywords.map((keyword, index) => (
  <div key={index} style={{
    flexDirection: 'column',
    gap: 20,
    opacity: columnOpacity(index)
  }}>
    <div style={labelStyle}>{keyword}</div>
    <div style={{
      width: '100%',
      height: 10,
      backgroundColor: theme.colors.muted,
      borderRadius: 5,
      overflow: 'hidden'
    }}>
      <div style={{
        width: `${progress * 100}%`,
        height: '100%',
        backgroundColor: theme.colors.primary
      }} />
    </div>
  </div>
))}
```

## 质量检查

- [ ] 每列延迟 0.5 秒显示
- [ ] 3 列等宽，间距一致
- [ ] 卡片背景半透明玻璃态
- [ ] 序号或图标清晰
- [ ] 文字居中对齐
- [ ] 动画流畅不卡顿
- [ ] 总时长 15-20 秒
