---
title: Project Assembly
phase: 2
purpose: Create complete Remotion project structure
---

# Project Assembly

组装完整的 Remotion 项目结构。

## 目录结构

```
video-output-<timestamp>/
├── package.json
├── tsconfig.json
├── remotion.config.ts
├── src/
│   ├── Root.tsx                 # 主组件
│   ├── theme.ts                 # 主题配置
│   ├── types.ts                 # TypeScript 类型
│   ├── script.json              # 脚本数据
│   ├── components/
│   │   ├── NeonBackground.tsx   # 背景组件
│   │   ├── SceneAudio.tsx       # 音频组件
│   │   └── Subtitle.tsx         # 字幕组件
│   └── scenes/
│       ├── Scene1-Hook.tsx
│       ├── Scene2-TextDisplay.tsx
│       ├── Scene3-NumberComparison.tsx
│       └── ...
└── public/
    ├── audio/                   # TTS 音频文件（可选）
    │   ├── scene-1.mp3
    │   └── ...
    └── subtitles/               # 字幕数据（可选）
        └── subtitles.json
```

## 步骤 1: 创建项目目录

```bash
timestamp=$(date +%Y%m%d-%H%M%S)
mkdir -p video-output-$timestamp/src/{components,scenes}
mkdir -p video-output-$timestamp/public/{audio,subtitles}
cd video-output-$timestamp
```

## 步骤 2: 复制配置文件

从模板复制以下文件：

### package.json

```bash
Read .claude/skills/script-to-remotion/templates/package.json.template
Write video-output-$timestamp/package.json
```

### tsconfig.json

```bash
Read .claude/skills/script-to-remotion/templates/tsconfig.json.template
Write video-output-$timestamp/tsconfig.json
```

### remotion.config.ts

```bash
Read .claude/skills/script-to-remotion/templates/remotion.config.ts.template
Write video-output-$timestamp/remotion.config.ts
```

## 步骤 3: 复制共享文件

### theme.ts

```bash
Read .claude/skills/script-to-remotion/templates/theme.ts
Write video-output-$timestamp/src/theme.ts
```

### 共享组件

```bash
Read .claude/skills/script-to-remotion/templates/components/NeonBackground.tsx
Write video-output-$timestamp/src/components/NeonBackground.tsx

Read .claude/skills/script-to-remotion/templates/components/SceneAudio.tsx
Write video-output-$timestamp/src/components/SceneAudio.tsx

Read .claude/skills/script-to-remotion/templates/components/Subtitle.tsx
Write video-output-$timestamp/src/components/Subtitle.tsx
```

## 步骤 4: 创建 types.ts

```typescript
// src/types.ts
export interface Scene {
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
    animation: string;
    layout?: string;
  };
}

export interface VideoScript {
  metadata: {
    title: string;
    duration: number;
    fps: number;
    style: string;
  };
  scenes: Scene[];
}
```

## 步骤 5: 复制 script.json

```bash
cp /path/to/script.json video-output-$timestamp/src/script.json
```

## 步骤 6: 复制场景组件

将阶段 1 生成的所有场景组件复制到 `src/scenes/` 目录。

## 步骤 7: 创建 Root.tsx

```typescript
// src/Root.tsx
import { Composition } from 'remotion';
import { VideoComposition } from './VideoComposition';
import script from './script.json';

export const RemotionRoot: React.FC = () => {
  const { metadata } = script;

  return (
    <>
      <Composition
        id="Video"
        component={VideoComposition}
        durationInFrames={Math.ceil(metadata.duration * metadata.fps)}
        fps={metadata.fps}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
    </>
  );
};
```

## 步骤 8: 创建 VideoComposition.tsx

```typescript
// src/VideoComposition.tsx
import { AbsoluteFill, Sequence } from 'remotion';
import script from './script.json';

// 导入所有场景组件
import Scene1Hook from './scenes/Scene1-Hook';
import Scene2TextDisplay from './scenes/Scene2-TextDisplay';
// ... 其他场景

export const VideoComposition: React.FC = () => {
  const { scenes } = script;

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {scenes.map((scene, index) => {
        // 根据场景类型选择组件
        let SceneComponent;
        switch (scene.type) {
          case 'hook':
            SceneComponent = Scene1Hook;
            break;
          case 'textDisplay':
            SceneComponent = Scene2TextDisplay;
            break;
          // ... 其他场景类型
          default:
            return null;
        }

        return (
          <Sequence
            key={scene.id}
            from={scene.startFrame}
            durationInFrames={scene.durationFrames}
          >
            <SceneComponent
              startFrame={scene.startFrame}
              durationFrames={scene.durationFrames}
              scene={scene}
            />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
```

## 步骤 9: 安装依赖

```bash
pnpm install
```

## 依赖列表

```json
{
  "dependencies": {
    "@remotion/cli": "^4.0.0",
    "@remotion/layout-utils": "^4.0.0",
    "@remotion/transitions": "^4.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "remotion": "^4.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "typescript": "^5.0.0"
  }
}
```

## 验证

安装后验证：

```bash
# 检查依赖
pnpm list

# 尝试构建（不渲染）
pnpm build --help

# 检查 TypeScript
npx tsc --noEmit
```

## 常见问题

### 缺少依赖

```bash
pnpm add @remotion/layout-utils @remotion/transitions
```

### TypeScript 错误

检查 `tsconfig.json` 中的 `compilerOptions`：
- `"jsx": "react-jsx"`
- `"esModuleInterop": true`
- `"moduleResolution": "node"`

### 导入错误

确保所有场景组件正确导出：
```typescript
export default SceneName;  // ✅ 正确
export const SceneName;    // ❌ 错误
```

## 下一步

项目组装完成后：
- **可选**: 进入**阶段 3: TTS 音频生成** (`tts-integration.md`)
- **或直接**: 进入**阶段 4: 预览和渲染** (`render-configuration.md`)
