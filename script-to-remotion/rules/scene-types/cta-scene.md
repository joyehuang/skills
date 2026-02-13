---
title: CTA Scene
scene_type: cta
duration: 8-12 seconds
purpose: Clear call-to-action with contact information
---

# CTA Scene

行动号召场景：清晰的下一步行动和联系方式。

## 特点

- **时长**: 8-12 秒
- **目标**: 促使观众采取行动
- **动画风格**: 多步骤显示，强调放大
- **布局**: 居中焦点，醒目的联系方式

## 多步骤显示模式

```typescript
const CTAScene: React.FC<SceneProps> = ({ startFrame, durationFrames, scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = frame - startFrame;

  // 步骤 1: 主行动文本 (0-1s)
  const actionOpacity = spring({
    frame: localFrame,
    fps,
    config: { damping: 20 }
  });

  const actionScale = spring({
    frame: localFrame,
    fps,
    config: { damping: 12, stiffness: 100 }
  });

  // 步骤 2: 联系方式 (1-2s 延迟)
  const contactOpacity = spring({
    frame: localFrame - 30,
    fps,
    config: { damping: 20 }
  });

  // 步骤 3: 紧迫感文本 (2-3s 延迟)
  const urgencyOpacity = spring({
    frame: localFrame - 60,
    fps,
    config: { damping: 20 }
  });

  // 脉冲强调（持续）
  const pulse = Math.sin((localFrame / 30) * Math.PI) * 0.1 + 1;

  const keywords = scene.visualCues.keywords;
  const actionText = keywords[0] || 'Take Action';
  const contactInfo = keywords[1] || 'Visit Us';
  const urgency = keywords[2] || '';

  return (
    <AbsoluteFill>
      <NeonBackground variant="gradient1" />

      <AbsoluteFill style={{
        justifyContent: 'center',
        alignItems: 'center',
        padding: 100,
        flexDirection: 'column',
        gap: 50
      }}>
        {/* 步骤 1: 主行动 */}
        <div style={{
          fontSize: 80,
          color: theme.colors.primary,
          fontWeight: 'bold',
          textAlign: 'center',
          opacity: actionOpacity,
          transform: `scale(${actionScale})`,
          textShadow: `0 0 40px ${theme.colors.primary}80`
        }}>
          {actionText}
        </div>

        {/* 步骤 2: 联系方式（强调） */}
        <div style={{
          fontSize: 100,
          color: theme.colors.accent,
          fontWeight: 'bold',
          textAlign: 'center',
          opacity: contactOpacity,
          transform: `scale(${pulse})`,
          padding: '30px 60px',
          backgroundColor: `${theme.colors.accent}20`,
          borderRadius: 20,
          border: `3px solid ${theme.colors.accent}`
        }}>
          {contactInfo}
        </div>

        {/* 步骤 3: 紧迫感 */}
        {urgency && (
          <div style={{
            fontSize: 40,
            color: theme.colors.text,
            textAlign: 'center',
            opacity: urgencyOpacity
          }}>
            {urgency}
          </div>
        )}
      </AbsoluteFill>

      <SceneAudio sceneId={scene.id} startFrame={startFrame} durationFrames={durationFrames} />
      <Subtitle sceneId={scene.id} startFrame={startFrame} durationFrames={durationFrames} />
    </AbsoluteFill>
  );
};
```

## 布局变体

### 按钮式

```typescript
<div style={{
  fontSize: 60,
  color: 'white',
  fontWeight: 'bold',
  padding: '40px 80px',
  backgroundColor: theme.colors.primary,
  borderRadius: 60,
  boxShadow: `0 10px 40px ${theme.colors.primary}60`,
  cursor: 'pointer',
  transform: `scale(${pulse})`
}}>
  {actionText}
</div>
```

### QR 码 + 文本

```typescript
<div style={{ flexDirection: 'row', gap: 80, alignItems: 'center' }}>
  {/* QR 码占位符 */}
  <div style={{
    width: 300,
    height: 300,
    backgroundColor: 'white',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center'
  }}>
    <div style={{ fontSize: 24, color: 'black' }}>
      Scan QR Code
    </div>
  </div>

  {/* 文本信息 */}
  <div style={{ flexDirection: 'column', gap: 30 }}>
    <div style={actionTextStyle}>{actionText}</div>
    <div style={contactStyle}>{contactInfo}</div>
  </div>
</div>
```

### 多行动选项

```typescript
<div style={{
  flexDirection: 'column',
  gap: 40,
  alignItems: 'center'
}}>
  <div style={titleStyle}>Get Started Today</div>

  {['Visit Website', 'Call Now', 'Download App'].map((option, index) => {
    const opacity = spring({
      frame: localFrame - (index * 20),
      fps
    });

    return (
      <div key={index} style={{
        ...buttonStyle,
        opacity,
        transform: `scale(${opacity})`
      }}>
        {option}
      </div>
    );
  })}
</div>
```

## 动画技巧

### 脉冲效果

```typescript
const pulse = interpolate(
  Math.sin((localFrame / 20) * Math.PI),
  [-1, 1],
  [0.95, 1.05]
);

<div style={{ transform: `scale(${pulse})` }}>
  {contactInfo}
</div>
```

### 发光效果

```typescript
const glow = interpolate(
  localFrame % 60,
  [0, 30, 60],
  [20, 60, 20]
);

<div style={{
  boxShadow: `0 0 ${glow}px ${theme.colors.primary}`
}}>
  {actionButton}
</div>
```

### 箭头指示

```typescript
const arrowBounce = spring({
  frame: (localFrame % 60) - 30,
  fps,
  config: { damping: 8, stiffness: 200 }
});

<div style={{
  fontSize: 60,
  color: theme.colors.accent,
  transform: `translateY(${arrowBounce * 20}px)`
}}>
  ↓
</div>
```

## 文本提取

从 narration 中提取关键信息：

```typescript
// 提取 URL
const extractURL = (text: string) => {
  const urlMatch = text.match(/(https?:\/\/[^\s]+|[a-zA-Z0-9.-]+\.(com|org|net|io)\/[^\s]*)/);
  return urlMatch ? urlMatch[0] : '';
};

// 提取电话号码
const extractPhone = (text: string) => {
  const phoneMatch = text.match(/\d{1,3}[-.\s]?\d{3}[-.\s]?\d{3,4}[-.\s]?\d{4}/);
  return phoneMatch ? phoneMatch[0] : '';
};

// 提取 email
const extractEmail = (text: string) => {
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  return emailMatch ? emailMatch[0] : '';
};
```

## 质量检查

- [ ] 行动文本清晰明确（动词开头）
- [ ] 联系方式易读（至少 60px）
- [ ] 有视觉强调（脉冲、发光等）
- [ ] 分步骤显示（不一次全显示）
- [ ] 紧迫感文本（如有）突出
- [ ] 总时长 8-12 秒
- [ ] 联系方式正确无误
- [ ] 色彩对比度高（易读）

## 常见行动词

- **访问类**: Visit, Go to, Check out, Explore
- **注册类**: Sign up, Register, Join, Subscribe
- **下载类**: Download, Get, Install
- **联系类**: Call, Email, Contact, Reach out
- **购买类**: Buy, Order, Purchase, Get started

## 示例场景数据

```json
{
  "id": "scene-5",
  "type": "cta",
  "narration": "Ready to start saving? Schedule your free solar assessment at GreenEnergy.com/free. Limited slots available this month!",
  "visualCues": {
    "keywords": ["free assessment", "GreenEnergy.com/free", "limited slots"],
    "animation": "scale"
  }
}
```

提取结果：
- Action: "Schedule your free assessment"
- Contact: "GreenEnergy.com/free"
- Urgency: "Limited slots available"
