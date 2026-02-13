---
title: Render Configuration
phase: 4
purpose: Preview and render the final video
---

# Render Configuration

预览和渲染最终视频。

## 命令

### 1. 预览（开发）

```bash
pnpm start
```

- 启动本地服务器：http://localhost:3000
- 实时预览：修改代码自动刷新
- 调试工具：时间轴、帧控制、性能监控

### 2. 渲染视频

```bash
pnpm build
```

输出：`out/video.mp4`

### 3. 自定义渲染选项

```bash
npx remotion render Video out/video.mp4 \
  --codec h264 \
  --crf 18 \
  --audio-codec aac \
  --audio-bitrate 192k
```

## 渲染设置

### remotion.config.ts

```typescript
import { Config } from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setCodec('h264');
Config.setCrf(18);  // 质量（越小越好，18-23 推荐）
Config.setAudioCodec('aac');
Config.setAudioBitrate('192k');
Config.setOverwriteOutput(true);
```

### 质量设置

| CRF | 质量 | 文件大小 | 用途 |
|-----|------|---------|------|
| 17 | 极高 | 很大 | 存档 |
| 18 | 高 | 大 | 社交媒体高清 |
| 23 | 中 | 中等 | 社交媒体标准 |
| 28 | 低 | 小 | 快速预览 |

## 性能优化

### 并行渲染

```bash
npx remotion render Video out/video.mp4 --concurrency 4
```

### GPU 加速

```bash
npx remotion render Video out/video.mp4 --gl=angle
```

## 输出格式

- **MP4**: 默认，兼容性最好
- **WebM**: 网页优化
- **ProRes**: 专业编辑

```bash
npx remotion render Video out/video.webm --codec vp8
```

## 常见问题

### 渲染很慢
- 减少 concurrency
- 降低 CRF
- 使用 GPU 加速

### 内存不足
- 限制 concurrency 为 2
- 使用 `--enforce-audio-track` 避免音频问题

### 音频不同步
- 确保 fps 为 30
- 检查音频文件完整性
