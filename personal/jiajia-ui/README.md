# jiajia-ui

夹夹（jiajia.fun）公开站 UI 设计系统：**安静、可读、有一点可爱**——暖纸印刷骨架 + Filo 配色 + 大圆角 shadcn 语义。

设计规范见 [SKILL.md](SKILL.md)。本 README 将在 **SKILL 校准通过并完成 r1/r2/r3 验证** 后，按 [handdrawn-ui](../handdrawn-ui/README.md) 结构补全「验证方法 · 三轮画廊 · 结论」。

## 当前进度

- **Phase A**：线上一页一型截图已用于 SKILL 分析，存于本地 `/tmp/jiajia-site-capture/`（**不入库**）。
- **Phase B**：SKILL.md 已按 handdrawn-ui 深度重写（哲学 / 原语 / 骨架 / 检查清单）。
- **Phase C**：泛化校准页 [`examples/calibration-neighborhood-tools.html`](examples/calibration-neighborhood-tools.html) + [`shared.css`](examples/shared.css)。
- **待办**：r1 模型矩阵 → r2 形态 → r3 行业 → `examples/r*.jpg` 画廊 → README 结论。

## 安装

```bash
ln -s "$(pwd)/personal/jiajia-ui" .cursor/skills/jiajia-ui
```

## 本地复拍（验证阶段）

```bash
cd personal/jiajia-ui/scripts && npm install && npx playwright install chromium
# 线上分析（输出 /tmp，勿提交）：
node capture-live-site.mjs
```
