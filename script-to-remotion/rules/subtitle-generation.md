---
title: Subtitle Generation
phase: 3
purpose: Segment narration into readable subtitle chunks
---

# Subtitle Generation

将长旁白智能分段为易读的字幕。

## 分段算法

```typescript
function segmentNarration(narration: string, durationFrames: number, fps: number = 30) {
  const segments: SubtitleSegment[] = [];

  // 1. 按标点符号分句
  const sentences = narration.split(/([.!?。！？])/);

  let currentFrame = 0;
  const targetSegmentDuration = Math.floor((3 * fps + 8 * fps) / 2); // 3-8秒，平均5.5秒

  let buffer = '';
  let bufferStartFrame = 0;

  for (let i = 0; i < sentences.length; i++) {
    const sentence = sentences[i].trim();
    if (!sentence) continue;

    buffer += sentence + ' ';
    const estimatedDuration = estimateFrames(buffer, fps);

    // 如果缓冲区达到目标时长或到达句子结束，创建片段
    if (estimatedDuration >= targetSegmentDuration || isSentenceEnd(sentence)) {
      const segmentDuration = Math.min(estimatedDuration, durationFrames - bufferStartFrame);

      segments.push({
        text: buffer.trim(),
        startFrame: bufferStartFrame,
        endFrame: bufferStartFrame + segmentDuration,
        fadeIn: 6,   // 0.2秒淡入
        fadeOut: 6   // 0.2秒淡出
      });

      bufferStartFrame += segmentDuration;
      buffer = '';
    }
  }

  // 剩余文本
  if (buffer.trim()) {
    segments.push({
      text: buffer.trim(),
      startFrame: bufferStartFrame,
      endFrame: durationFrames,
      fadeIn: 6,
      fadeOut: 6
    });
  }

  return segments;
}

function estimateFrames(text: string, fps: number): number {
  const wordCount = text.split(/\s+/).length;
  return Math.floor((wordCount / 1.25) * fps);  // 1.25 words/sec
}

function isSentenceEnd(text: string): boolean {
  return /[.!?。！？]$/.test(text);
}
```

## 输出格式

```json
{
  "scene-1": {
    "segments": [
      {
        "text": "What if I told you your roof could make you money?",
        "startFrame": 0,
        "endFrame": 120,
        "fadeIn": 6,
        "fadeOut": 6
      },
      {
        "text": "Sound too good to be true?",
        "startFrame": 120,
        "endFrame": 210,
        "fadeIn": 6,
        "fadeOut": 6
      }
    ]
  }
}
```

## 分段规则

- **最短**：3 秒（90 帧）
- **最长**：8 秒（240 帧）
- **理想**：5-6 秒（150-180 帧）
- **换行时机**：句子结束或逗号后
- **淡入淡出**：各 0.2 秒（6 帧）
