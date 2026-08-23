---
name: herdr-workflow
description: The user's preferred herdr workflow for spawning coding-agent workspaces (git worktree + claude/codex agents + prompts from files). Use whenever driving herdr to start agents, create workspaces, or coordinate agent tasks for this user. Also covers the R2 artifact-publishing convention (HTML-first outputs).
---

# herdr Workflow (user's established pattern)

The user drives herdr this way. Follow it unless they say otherwise.

## 0. 兜底规则（fallback rule）

本 skill 是用户的工作流偏好 + 踩坑经验；**官方 skill 在 `~/.agents/skills/herdr-official/SKILL.md`**（herdrdev/herdr v0.8.2 官方版，195 行）。

- **本 skill 没覆盖的情况**（新命令、报错、行为异常、生命周期状态不明确等）→ 读官方 skill，或直接查 `herdr <cmd> --help`（CLI 是命令语法权威）。
- 官方 skill 的补充要点（本 skill 未写）：
  - agent 生命周期：`idle`=就绪、`done`=后台工作完成后的 idle、`blocked`=审批/提问 UI、`unknown`=无法分类（不代表完成）
  - `agent prompt` 从非工作状态发指令，5 秒内必须看到生命周期变化，否则返回 `agent_prompt_stalled`
  - `--until` 仅用于状态特定等待（如等 blocked）；普通等待用 `--wait` 即可
  - `agent send-keys <name> esc|ctrl+c` 逻辑键控
  - `pane run` / `pane wait-output --match` 用于普通命令 + 等输出
  - read source：`visible` / `recent` / `recent-unwrapped`（日志/转录优先）/ `detection`
  - 安全：`--no-focus` 后台工作；不关自己没建的 workspace/pane；不 kill herdr 主进程；`herdr server stop` 只在用户明确要求时用

## 1. Open a workspace (worktree for code work)

```bash
WS=$(herdr worktree create --cwd "$PWD" \
       --branch fix/some-bug --base main \
       --label "P1 some-bug" --no-focus \
     | jq -r '.result.workspace.workspace_id')

PANE=$(herdr pane list --workspace "$WS" | jq -r '.result.panes[0].pane_id')
```

- `--branch <name> --base <base>` for real code work (git worktree isolation).
- For read-only research/scratch use plain `herdr workspace create --cwd "$PWD" --label "..." --no-focus` (no worktree — research produces no git changes).

## 2. Start the agent (retry until pane ready)

```bash
until herdr agent start some-bug --kind claude --pane "$PANE" --timeout 90000 2>/dev/null; do sleep 1; done
```

- Model goes **after `--`**: `-- --model claude-opus-5`
- **Prefer auto mode for claude** (user's default since 2026-08-18): append `--permission-mode auto` after `--`, e.g. `-- --model claude-opus-5 --permission-mode auto`. Auto mode lets claude auto-run lower-risk commands without blocking (verified: runs commands, creates files, zero prompts). Without it, in-pane claude sits on manual mode and blocks on every permission prompt — you'd have to babysit approvals.
  - First run asks "Make auto mode your default permission mode?" → answer Yes (option 1) once; it persists.
  - Also handles the project trust prompt at startup: send `1` + Enter once when it asks "Is this a project you created or one you trust?"
  - Alternative for tighter control: `--permission-mode acceptEdits` (auto-accepts edits, still asks for risky bash) or `--settings <file>` with a `permissions.allow` list.
- `--timeout 90000` (90s) for startup.
- **Agent name is global per terminal**: if `agent start claude` fails with `agent_name_taken`, another agent in that terminal already uses the name — use a unique `<NAME>` (e.g. `dash-react`) instead of the default.
- **READ THE SKILL FIRST**: before driving herdr, read this skill (and memory) — don't rely on recollection of the workflow.

## 3. Prompt from a FILE, never inline

```bash
herdr agent prompt some-bug "$(cat prompts/some-bug.txt)" --wait --timeout 900000
```

- Inline prompts lose Chinese quotes, backticks, newlines to shell quoting.
- Wait a few seconds after `agent start` before prompting — claude may still be on its welcome screen and the prompt gets dropped (check terminal_title changes to the task title as confirmation it was received).
- Ask for a completion marker in the prompt ("print exactly DONE_XXX at the end").

## 4. Read results & close

```bash
herdr agent read <name> --source recent-unwrapped --lines 200
herdr pane close <pane_id>   # only panes/workspaces you created
herdr workspace close <ws>   # after user is done with it
```

## 5. Multi-stage relay tasks (自动接力，不靠盯梢)

> 2026-08-20 教训：trajectory-panel v2 完成后 workspace 闲置 3 小时，v3 直到用户问起才开始。根因：`--wait` 被 abort 后误判“还在跑”，没轮询状态也没检测完成标记。**多阶段接力必须脚本化自动触发，不能靠 agent 人工盯梢。**

### 方式 A：同 agent 接力（推荐）

```bash
# 发完 stage1，立即挂接力循环：检测到 DONE_XXX 就自动发 stage2
until herdr agent read <name> --source recent-unwrapped 2>/dev/null | grep -q "DONE_STAGE1"; do sleep 60; done
herdr agent prompt <name> "$(cat prompts/stage2.txt)" --wait --timeout 1800000
# stage2 同理接 stage3...
```

- prompt 里要求每阶段末尾打印唯一完成标记（`DONE_STAGE1` / `DONE_STAGE2`…）
- 每阶段之间用 until 循环 grep 该标记，命中才发下一阶段
- 适合：同一 workspace/目录的连续改动（如 UI 升级 → 后端接入）

### 方式 B：多阶段合并成一个连续任务

把 v1+v2+v3 的完整需求写进**一个 prompt**，让一个 agent 一口气做完，只打一个最终 `DONE_XXX`。适合阶段间耦合紧、中途不需人工确认的任务。缺点是单次运行时间长、中途不能插入新需求。

### 方式 C：herdr 内置 wait（无人值守时，2026-08-23 修正）

**不需要手写轮询脚本** —— herdr 内置了完整的等待机制：

```bash
# 后台跑一个接力脚本，每阶段用 herdr 内置 wait 等完成，跑完才退出
cat > /tmp/relay.sh << 'EOF'
herdr agent wait <name> --until done --timeout 1800000   # 等任务完成（agent 回 idle/done）
herdr agent prompt <name> "$(cat v3.txt)" --wait --timeout 1800000  # 下一阶段（--wait 本身就等到完成）
EOF
nohup bash /tmp/relay.sh > /tmp/relay.log 2>&1 &
```

关键点：
- `agent prompt --wait` / `agent wait` 本身就等到 settled 状态（idle/done/blocked）才返回，**无需轮询**
- 等特定输出用 `herdr pane wait-output <pane> --match "DONE_XXX" --timeout <ms>`
- `--wait` 被 bash 工具 timeout 截断 ≠ 任务没在跑 —— 把带 `--wait` 的命令放后台（nohup）跑，完成读日志即可
- 多阶段都写进一个脚本，最后一步完成后可加通知（如 notify-telegram.py）

### 铁律

- 承诺“我收尾/我盯着”必须伴随实际保障机制（herdr 内置 wait/接力脚本），否则不说
- `--wait` 被 abort ≠ 任务没在跑，先查 `herdr agent get <name>` 的 `agent_status` 再判断
- 阶段完成标准 = prompt 里要求的 `DONE_XXX` 标记出现，不是时间到了就以为完成

## Artifact convention (user's fixed preference)

- **Every report/artifact defaults to HTML and is delivered as a directly clickable https link** — never md attachments, never raw paths.
- One-shot pipeline: `bash ~/.agents/skills/publish-artifact/scripts/report.sh <file> [--title T]` (md → styled HTML → R2 upload → prints link). Reply with `[label](link)` Markdown links in Telegram.
- Chat/session exports to HTML when sharing: `pi --export <session-file> <out.html>`.
- Local copies always kept in `~/artifacts/YYYY-MM-DD/` (or alongside the report) before/after upload.
