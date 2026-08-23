---
name: skill-creator
description: 创建/规范化一个新 skill 的流程与模板。当用户要求"做一个 skill/技能"、把常用工作流沉淀成可复用 skill、或为 pi agent 添加能力时使用。覆盖：存放位置选择、SKILL.md 结构规范、命名与描述规范、验证清单。
---

# Skill Creator（创建新 skill 的标准流程）

用户的 skill 生态：
- `~/.agents/skills/` —— 个人可用 skill（web-search、publish-artifact、herdr-workflow、ego-browser）
- `~/dev/skills/personal/` —— 可移植 skill 仓库（同步到 GitHub joyehuang/skills）
- `~/dev/skills/` 根目录 —— 公开/通用 skill（已 push 的 17 个）

## 第一步：决定放哪

| 场景 | 位置 |
|---|---|
| 纯个人习惯/本地路径相关 | `~/.agents/skills/<name>/` |
| 通用、可移植、别人能用 | `~/dev/skills/personal/<name>/`（并同步仓库） |
| 成熟公开 skill | `~/dev/skills/<name>/` |

默认：**放 `~/.agents/skills/`，同时在 `~/dev/skills/personal/` 留一份**（保持仓库一致），是否 push 由用户决定。

## 第二步：SKILL.md 模板

```markdown
---
name: <短横线小写名>
description: <一句话说明是什么 + 明确触发条件（何时用/何时不用）+ 关键约定。30-60 字，让 agent 读 description 就能判断是否加载。>
---

# <标题>

## 是什么 / 何时用

## 步骤（按顺序，含具体命令）

## 验证清单
- [ ] 命令可直接执行（不依赖未说明的绝对路径/密钥）
- [ ] 描述里的触发条件准确
- [ ] 产物路径/交付方式符合用户约定
```

## 命名与描述规范

- 名字：kebab-case（`skill-creator`），不用下划线/大写
- description 必须包含：
  1. **触发词**："当用户要求 X 时"
  2. **边界**："不要用于 Y"（防误触发）
  3. **关键约定**（如"产物默认 HTML+链接"）

## 第三步：验证

1. 读一遍 SKILL.md，模拟一个新 agent 只看 description 能否判断"该不该用这个 skill"
2. 实测关键命令（bash 跑一遍）
3. 路径引用：`$HOME`/`~` 或绝对路径明确写出；不依赖 shell 当前目录

## 交付

- 创建后告知用户：位置、名称、一句话说明、是否已同步 `~/dev/skills/personal/`
- 问用户是否需要 push 到 GitHub（不默认 push）
