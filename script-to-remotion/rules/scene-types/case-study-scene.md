---
title: Case Study Scene
scene_type: caseStudy
duration: 20-30 seconds
purpose: Tell a story, show transformation, or present customer example
---

# Case Study Scene

案例故事场景：讲述客户故事、展示转变过程或呈现具体案例。

## 特点

- **时长**: 20-30 秒（最长场景类型）
- **目标**: 通过叙事建立信任和说服力
- **动画风格**: 序列转场，前后对比
- **布局**: 时间线或前后分屏

## TransitionSeries 模式

使用 `<TransitionSeries>` 创建流畅的段落转场：

```typescript
import { TransitionSeries, linearTiming, slide } from '@remotion/transitions';

const CaseStudyScene: React.FC<SceneProps> = ({ startFrame, durationFrames, scene }) => {
  const segmentDuration = Math.floor(durationFrames / 3);

  return (
    <AbsoluteFill>
      <NeonBackground variant="gradient2" />

      <TransitionSeries>
        {/* 第一段：背景介绍 */}
        <TransitionSeries.Sequence durationInFrames={segmentDuration}>
          <Segment1 scene={scene} />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: 'from-right' })}
          timing={linearTiming({ durationInFrames: 20 })}
        />

        {/* 第二段：过程 */}
        <TransitionSeries.Sequence durationInFrames={segmentDuration}>
          <Segment2 scene={scene} />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: 'from-right' })}
          timing={linearTiming({ durationInFrames: 20 })}
        />

        {/* 第三段：结果 */}
        <TransitionSeries.Sequence durationInFrames={segmentDuration}>
          <Segment3 scene={scene} />
        </TransitionSeries.Sequence>
      </TransitionSeries>

      <SceneAudio sceneId={scene.id} startFrame={startFrame} durationFrames={durationFrames} />
      <Subtitle sceneId={scene.id} startFrame={startFrame} durationFrames={durationFrames} />
    </AbsoluteFill>
  );
};
```

## 段落组件示例

### Segment 1: 背景

```typescript
const Segment1: React.FC<{ scene: Scene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = spring({ frame, fps, config: { damping: 20 } });

  return (
    <AbsoluteFill style={{
      justifyContent: 'center',
      alignItems: 'center',
      padding: 100,
      opacity: fadeIn
    }}>
      <div style={{
        fontSize: 60,
        color: theme.colors.text,
        textAlign: 'center',
        maxWidth: 1400,
        lineHeight: 1.4
      }}>
        {/* 提取旁白的第一句 */}
        {scene.narration.split('. ')[0]}
      </div>
    </AbsoluteFill>
  );
};
```

### Segment 2: 数据展示

```typescript
const Segment2: React.FC<{ scene: Scene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const numbers = scene.visualCues.numbers || [];

  return (
    <AbsoluteFill style={{
      flexDirection: 'row',
      padding: 100,
      gap: 80
    }}>
      {numbers.map((num, index) => {
        const scale = spring({
          frame: frame - (index * 10),
          fps,
          config: { damping: 12, stiffness: 100 }
        });

        return (
          <div key={index} style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            transform: `scale(${scale})`
          }}>
            <div style={{
              fontSize: 32,
              color: theme.colors.textMuted,
              marginBottom: 20
            }}>
              {num.label}
            </div>
            <div style={{
              fontSize: 80,
              color: theme.colors.primary,
              fontWeight: 'bold'
            }}>
              {num.newValue}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
```

### Segment 3: 结果

```typescript
const Segment3: React.FC<{ scene: Scene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const checkScale = spring({
    frame,
    fps,
    from: 0,
    to: 1,
    config: { damping: 10, stiffness: 150 }
  });

  return (
    <AbsoluteFill style={{
      justifyContent: 'center',
      alignItems: 'center',
      padding: 100,
      flexDirection: 'column',
      gap: 40
    }}>
      {/* 成功标志 */}
      <div style={{
        fontSize: 120,
        color: theme.colors.primary,
        transform: `scale(${checkScale})`
      }}>
        ✓
      </div>

      {/* 结果文本 */}
      <div style={{
        fontSize: 50,
        color: theme.colors.text,
        textAlign: 'center',
        maxWidth: 1400
      }}>
        {/* 提取旁白的最后一句 */}
        {scene.narration.split('. ').slice(-1)[0]}
      </div>
    </AbsoluteFill>
  );
};
```

## 前后对比布局

```typescript
<AbsoluteFill style={{ flexDirection: 'row' }}>
  {/* 左侧：之前 */}
  <div style={{
    flex: 1,
    backgroundColor: `${theme.colors.muted}20`,
    padding: 80,
    justifyContent: 'center'
  }}>
    <div style={labelStyle}>Before</div>
    <div style={contentStyle}>{beforeContent}</div>
  </div>

  {/* 右侧：之后 */}
  <div style={{
    flex: 1,
    backgroundColor: `${theme.colors.primary}20`,
    padding: 80,
    justifyContent: 'center'
  }}>
    <div style={labelStyle}>After</div>
    <div style={contentStyle}>{afterContent}</div>
  </div>
</AbsoluteFill>
```

## 时间线布局

```typescript
const timelineSteps = [
  { time: '2020', event: 'Installed solar' },
  { time: '2021', event: '$1,500 saved' },
  { time: '2022', event: '$3,000 saved' },
  { time: '2025', event: 'Sold for $20K more' }
];

<div style={{
  flexDirection: 'column',
  padding: 100,
  gap: 40
}}>
  {timelineSteps.map((step, index) => {
    const opacity = spring({
      frame: localFrame - (index * 30),
      fps
    });

    return (
      <div key={index} style={{
        flexDirection: 'row',
        gap: 40,
        opacity
      }}>
        <div style={{ fontSize: 40, color: theme.colors.accent, fontWeight: 'bold' }}>
          {step.time}
        </div>
        <div style={{ fontSize: 40, color: theme.colors.text }}>
          {step.event}
        </div>
      </div>
    );
  })}
</div>
```

## 质量检查

- [ ] 分为 2-3 个清晰的段落
- [ ] 段落之间有转场动画
- [ ] 故事有开头、过程、结果
- [ ] 数据展示清晰（如有）
- [ ] 总时长 20-30 秒
- [ ] 文字大小适中（可读性）
- [ ] 转场流畅不突兀
