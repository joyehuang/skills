---
title: Number Comparison Scene
scene_type: numberComparison
duration: 12-18 seconds
purpose: Show before/after comparisons or statistics with animated numbers
---

# Number Comparison Scene

数字对比场景：展示数据对比，前后变化，或统计数据。

## 特点

- **时长**: 12-18 秒
- **目标**: 视觉化数字变化，强调差异
- **动画风格**: 数字滚动，对比突出
- **布局**: 左右分屏或上下堆叠

## 数字动画核心

### 数字滚动效果

```typescript
const animateNumber = (target: number, localFrame: number, fps: number) => {
  const progress = spring({
    frame: localFrame - 20,
    fps,
    config: { damping: 20, stiffness: 80 }
  });

  return Math.floor(target * progress);
};

// 使用
const currentValue = animateNumber(1500, localFrame, fps);
<div>${currentValue.toLocaleString()}</div>
```

### 前后对比布局

```typescript
<AbsoluteFill style={{ flexDirection: 'row' }}>
  {/* 左侧：旧值 */}
  <div style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <div style={{ fontSize: 80, color: theme.colors.muted, textDecoration: 'line-through' }}>
      {number.oldValue}
    </div>
    <div style={{ fontSize: 32, color: theme.colors.textMuted }}>
      Before
    </div>
  </div>

  {/* 箭头 */}
  <div style={{ fontSize: 60, color: theme.colors.accent }}>
    →
  </div>

  {/* 右侧：新值 */}
  <div style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <div style={{ fontSize: 120, color: theme.colors.primary, fontWeight: 'bold' }}>
      {animatedNewValue}
    </div>
    <div style={{ fontSize: 32, color: theme.colors.text }}>
      After
    </div>
  </div>
</AbsoluteFill>
```

## 完整代码模板

```typescript
const NumberComparisonScene: React.FC<SceneProps> = ({ startFrame, durationFrames, scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = frame - startFrame;

  const numbers = scene.visualCues.numbers || [];

  // 数字动画函数
  const animateNumber = (target: string, delay: number = 0) => {
    const numericTarget = parseFloat(target.replace(/[^0-9.]/g, ''));
    const progress = spring({
      frame: localFrame - delay,
      fps,
      config: { damping: 20, stiffness: 80 }
    });

    const currentValue = Math.floor(numericTarget * progress);

    // 保留原始格式（%, $等）
    return target.replace(/[0-9]+/, currentValue.toLocaleString());
  };

  return (
    <AbsoluteFill>
      <NeonBackground variant="gradient3" />

      <AbsoluteFill style={{
        flexDirection: 'row',
        padding: 100,
        gap: 60
      }}>
        {numbers.map((number, index) => {
          const scale = spring({
            frame: localFrame - (index * 15),
            fps,
            config: { damping: 12, stiffness: 100 }
          });

          return (
            <div key={index} style={{
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 20,
              transform: `scale(${scale})`
            }}>
              {/* 标签 */}
              <div style={{
                fontSize: 32,
                color: theme.colors.textMuted,
                textAlign: 'center'
              }}>
                {number.label}
              </div>

              {/* 旧值（如果有） */}
              {number.oldValue && (
                <div style={{
                  fontSize: 50,
                  color: theme.colors.muted,
                  textDecoration: 'line-through'
                }}>
                  {number.oldValue}
                </div>
              )}

              {/* 新值（动画） */}
              <div style={{
                fontSize: 100,
                color: theme.colors.primary,
                fontWeight: 'bold',
                textShadow: `0 0 30px ${theme.colors.primary}80`
              }}>
                {animateNumber(number.newValue, index * 15)}
              </div>
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

## 布局模式

### 左右对比（2个数字）

```typescript
style={{
  flexDirection: 'row',
  gap: 100
}}
```

### 网格布局（3-4个数字）

```typescript
style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: 60
}}
```

### 垂直堆叠（时间线）

```typescript
style={{
  flexDirection: 'column',
  justifyContent: 'space-evenly'
}}
```

## 数字格式化

```typescript
// 货币
const formatCurrency = (value: number) =>
  `$${value.toLocaleString()}`;

// 百分比
const formatPercent = (value: number) =>
  `${value}%`;

// 大数字（k, M）
const formatLarge = (value: number) => {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  return value.toString();
};
```

## 质量检查

- [ ] 数字动画流畅（不跳跃）
- [ ] 旧值和新值对比明显
- [ ] 数字足够大（至少 80px）
- [ ] 格式保留（$, %, 等）
- [ ] 标签清晰描述数字含义
- [ ] 多个数字错位显示（stagger）
- [ ] 数字与叙述同步
