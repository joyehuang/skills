---
title: TTS Integration (Optional)
phase: 3
purpose: Generate text-to-speech audio using Google Gemini API
---

# TTS Integration

使用 Google Gemini API 生成 TTS 音频（可选步骤）。

## 前提条件

- Google Gemini API Key
- Node.js 18+
- script.json 文件

## 快速开始

### 1. 创建 TTS 生成脚本

```bash
Read .claude/skills/script-to-remotion/templates/tts-generator.js.template
Write video-output-xxx/tts-generator.js
```

### 2. 设置环境变量

```bash
export GOOGLE_GEMINI_API_KEY="your-api-key-here"
```

### 3. 运行脚本

```bash
node tts-generator.js
```

输出：
- `public/audio/scene-1.mp3`
- `public/audio/scene-2.mp3`
- ...
- `public/subtitles/subtitles.json`

## TTS 生成器代码模板

```javascript
const fs = require('fs').promises;
const path = require('path');
const https = require('https');

const API_KEY = process.env.GOOGLE_GEMINI_API_KEY;
const PLAYBACK_RATE = 1.25;  // 播放速度

async function generateTTS() {
  // 1. 读取 script.json
  const scriptData = JSON.parse(await fs.readFile('./src/script.json', 'utf-8'));
  const { scenes } = scriptData;

  // 2. 为每个场景生成音频
  for (const scene of scenes) {
    console.log(`Generating audio for ${scene.id}...`);

    const audioData = await callGeminiTTS({
      text: scene.narration,
      voiceName: 'en-US-Wavenet-D',  // 或其他声音
      playbackRate: PLAYBACK_RATE
    });

    // 保存音频文件
    const audioPath = `./public/audio/${scene.id}.mp3`;
    await fs.writeFile(audioPath, audioData);

    console.log(`✓ ${audioPath}`);
  }

  // 3. 生成字幕数据
  console.log('Generating subtitles...');
  const subtitles = generateSubtitles(scenes);
  await fs.writeFile(
    './public/subtitles/subtitles.json',
    JSON.stringify(subtitles, null, 2)
  );

  console.log('✓ All done!');
}

async function callGeminiTTS({ text, voiceName, playbackRate }) {
  // 调用 Google Gemini TTS API
  // 返回音频数据（Buffer）
  // 实现细节参考 Google Cloud TTS 文档
}

function generateSubtitles(scenes) {
  // 参考 subtitle-generation.md 中的算法
  return scenes.map(scene => ({
    sceneId: scene.id,
    segments: segmentNarration(scene.narration, scene.durationFrames)
  }));
}

generateTTS().catch(console.error);
```

## 声音选项

Google TTS 支持多种声音：

**英文**:
- `en-US-Wavenet-D` - 男声（专业）
- `en-US-Wavenet-F` - 女声（友好）
- `en-US-Neural2-A` - 男声（自然）

**中文**:
- `cmn-CN-Wavenet-A` - 女声
- `cmn-CN-Wavenet-B` - 男声

## 播放速度

- 基准: 1.0x（正常速度）
- 推荐: 1.25x（社交媒体优化）
- 范围: 0.25x - 4.0x

## 跳过 TTS

如果不需要 TTS，可以：
1. 跳过此步骤
2. 修改 `SceneAudio.tsx` 返回 `null`
3. 或提供自己的音频文件
