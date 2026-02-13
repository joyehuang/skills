---
title: Troubleshooting
purpose: Common issues and solutions
---

# Troubleshooting

常见问题和解决方案。

## TypeScript 错误

### 问题：找不到模块

```
Cannot find module '@remotion/layout-utils'
```

**解决**：
```bash
pnpm add @remotion/layout-utils
```

### 问题：类型错误

```
Property 'scene' does not exist on type 'SceneProps'
```

**解决**：检查 `types.ts` 中的接口定义是否完整。

## 动画问题

### 问题：动画卡顿

**原因**：
- 使用了 CSS animations（违反 remotion-best-practices）
- 计算量过大

**解决**：
- 使用 spring() 替代 CSS
- 优化计算逻辑

### 问题：元素闪烁

**原因**：opacity 从 undefined 开始

**解决**：
```typescript
const opacity = spring({
  frame: localFrame,
  fps,
  from: 0,  // 明确起始值
  to: 1
});
```

## 文本问题

### 问题：文本溢出

**原因**：未使用 fitText

**解决**：
```typescript
const fitted = fitText({
  text: scene.narration,
  withinWidth: 1600,
  fontSize: 80
});
```

### 问题：文字太小

**原因**：fitText 的 fontSize 设置太小

**解决**：增加 fontSize 参数（80-120 推荐）

## 音频问题

### 问题：音频不播放

**检查**：
1. 文件路径正确？`public/audio/scene-1.mp3`
2. 文件存在？
3. startFrame 和 durationFrames 正确？

### 问题：音频不同步

**解决**：
- 确保 scene.startFrame 和音频 startFrame 一致
- 检查 TTS 生成的时长与 script.json 匹配

## 渲染问题

### 问题：渲染失败

```
Error: ENOMEM
```

**解决**：
```bash
npx remotion render Video out/video.mp4 --concurrency 2
```

### 问题：渲染很慢

**优化**：
- 使用 GPU: `--gl=angle`
- 并行渲染: `--concurrency 4`
- 降低质量: `--crf 23`

## 检查清单

遇到问题时，依次检查：

1. ✅ TypeScript 编译通过？`npx tsc --noEmit`
2. ✅ 依赖已安装？`pnpm install`
3. ✅ 文件路径正确？
4. ✅ 使用 spring 而非 CSS？
5. ✅ 使用 fitText 处理文本？
6. ✅ localFrame 计算正确？
7. ✅ Props 类型匹配？

## 获取帮助

- 查看 remotion-best-practices 技能
- 参考 examples/ 中的完整示例
- 检查 Remotion 官方文档：https://remotion.dev
