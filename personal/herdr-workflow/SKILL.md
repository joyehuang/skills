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
- **Codex 必须用 full access mode（用户要求 2026-08-29，与 claude auto mode 同级默认）**: append `--dangerously-bypass-approvals-and-sandbox` after `--`, e.g. `-- --model gpt-5.6-sol -c model_reasoning_effort='"xhigh"' --dangerously-bypass-approvals-and-sandbox`。不带它 codex 会每条命令弹批准，后台任务直接卡死（2026-08-28 教训：忘带这个参数导致被迫写轮询+白名单自动批脚本打补丁）。配套原则：等待用 herdr 内置阻塞 wait（`herdr agent wait <name> --until done` / `agent prompt --wait`），不要手写轮询循环。
  - 启动时仍会有项目信任确认（"Do you trust the contents"）→ 发 `1` + Enter 一次
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

### 方式 A：有证据的阶段接力

终端可能回显 prompt 中的 DONE，不能 grep 命中就宣告成功。使用下节统一 runner：核对当前 task/run 的退出码、实际 stdout 独立 marker 行、新产物及业务 reason/error；需要验收时，主 agent 验收后才继续已授权阶段。

- herdr wait、agent_status=done 或 pane 命中仅为观察，不等于目标完成。
- 未接入 runner 的历史任务保留 needs_reconciliation，禁止猜测退出码。
- 等待只在后台 relay 中进行，不能在当前回合 sleep 长轮询。

### 方式 B：多阶段合并成一个连续任务

把 v1+v2+v3 的完整需求写进**一个 prompt**，让一个 agent 一口气做完，只打一个最终 `DONE_XXX`。适合阶段间耦合紧、中途不需人工确认的任务。缺点是单次运行时间长、中途不能插入新需求。

### 方式 C：herdr 内置 wait（无人值守时，2026-08-23 修正）

**不需要手写轮询脚本** —— herdr 内置了完整的等待机制：

```bash
# 后台跑一个接力脚本，每阶段用 herdr 内置 wait 等完成，跑完才退出
cat > /tmp/relay.sh << 'EOF'
herdr agent wait <name> --until done --timeout 1800000   # 仅等待状态，不证明业务成功
# 按下节核对当前 run 的 result 和 acceptance；通过后才继续下一阶段。
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
- 阶段完成标准 = 当前 run 的退出码 + 实际 stdout 标记 + 新产物 + 业务结果；prompt 回显和时间经过均不算证据

## 6. 后台任务协议（task/run + 验收 + 真实签收，2026-09-08 已激活）

后台任务 = subagent 模式：我是 orchestrator，herdr workspace 是 worker subagent，我是质量验收闸门。用户默认只听到「做完了」和需要拍板的事。

### 任务分类（接到任务先判断，前台 or 后台）

- **前台**：需要中途与用户交互、或几分钟内能完的问答/小改。
- **后台**：能独立完成、有明确验收标准的活（改代码/跑调研/做报告/长任务烧 token）。
- 判断不了就默认前台，或一句话向用户确认；用户说「放后台」/「前台做」优先。

### 登记与统一 runner（所有后台活，不另立账）

- 派活确认消息仍必须带 acceptance 给用户过目；后台默认 herdr subagent，用户只需一个主 agent 入口。本协议不授权新 workspace、模型测试、拓扑或模型默认值变更。
- 私有目录 `~/.config/agent-tasks/` 保存 registry/outbox/inbox、不可变 runs 结果及签收证据；**这些是持久证据，不得说损坏可丢弃**。status 是观察结果，不能直接改成完成。
- `python3 ~/bin/task_protocol.py register TASK --spec PRIVATE_JSON`：spec 含 instruction、acceptance、artifacts、done_marker、type、route；Herdr 加 agent_name/workspace_id/pane_id。
- 每次执行先 `start-run TASK --run-id RUN`，再 `run TASK RUN -- ABSOLUTE_COMMAND ARGS`。worker 从 TASK_ID/TASK_RUN_ID/TASK_RESULT_PATH 取身份，写匹配的 business JSON（reason/error），实际 stdout 打印独立 marker 行。
- `result TASK RUN` 核对退出码、PID 出生身份、产物 size/mtime/hash/freshness、marker、reason/error。goal_complete 与 batch_finished 分开；空/旧产物、缺标记、预算边界、read_error/http_error 都不证明成功。
- 禁止直接覆盖 registry；所有 writer 走协议锁和原子操作。元数据修改使用带 expected-hash 的 update；flock 不会保护不守锁的旧 writer。

### 状态与独立验收

- **ready_for_review ≠ 做好**。收到 task/run/event 先 inspect 对账，读当前 run 结构化结果，再按 acceptance 实查，不能只复述 worker 或回复收到。
- Herdr 状态从实际 `result.agent.agent_status` 读取；working 保持运行态，未知/查询错误只保留观察。终端 done 或 prompt 回显不能补造 runner 退出码。
- 通过：`verify TASK RUN --evidence FILE`；失败加 `--reject`。最多返工两次，第二次仍失败就升级用户，不无限开跑。
- 验收通过继续已经授权的步骤；发最终报告前用 prepare-report 绑定正文 hash、目标及验收。发送后用 report 关联真实 sender/bridge 账本。没有匹配 message_id、结果 unknown 或无签收，不得标 reported。
- 本事件处理另用 `ack EVENT CLAIM handled --evidence FILE`；enqueued 只代表注入尝试，不等于 handled/verified。claim 改变先 inspect。

### 通知三层保障与边界

1. **推送**：结构化 runner 结果与稳定 task/run/phase outbox 同事务提交；notify-agent 使用 --task-id/--run-id/--event-id/--result-path/--route。同事件双生产幂等，不同 run 不吞。
2. **拉取**：主 agent 接续时现场 inspect，检查结果、claim/lease、验收和真实签收。
3. **兜底**：原 launchd `com.joye.task-watchdog` 每 180 秒对账，独立重试 agent/Telegram 两个目标；超时生成稳定提醒，不假装目标完成。无 owner/持续错误时不能保证一个周期内送达。

- 用户直达 Telegram 兜底默认保留，不擅自关；待验收与已验收明确区分。失败 backoff，未知 ACK 人工对账，绝不盲重发。
- Relay 仅向当前 run-pi.sh 主进程实际拥有的 profile/session/thread 注入，宿主及队列均须 idle；无 owner 留 pending。当前 getBranch 持久输入支持去重，旧分支不能抑制新分支。原 handling deadline 后一次稳定恢复提示，仍无证明则 needs_attention，不无限续租。
- 跨进程崩溃恢复采用至少一次注入 + 幂等对账，不承诺 exactly-once。未发送的过时 run/阶段通知可 superseded，已在发送或 unknown 的不确定性必须保留。
- notify-agent 旧 `TEXT [SOURCE]` 与 `queued DIGITS-DIGITS.json` 兼容，该字符串只是私有 inbox 签收映射，不再是旧 spool 文件。旧调用方忽略退出码/源业务提前标 seen 的问题不能靠 CLI 兼容自动修复。
- 旧任务（包括有 run_id 却无有效 runs metadata）不批量宣告成功/失败、不重放历史通知。先人工读证据，再以 task_hash 和 inspection JSON 显式 adopt-legacy 或 close-legacy；closed_legacy 不冒充 verified/reported。pending 旧 .json 导入幂等并保留原件，.done 不自动重放。

具体 CLI、签收格式及安全部署/回滚见 `~/dev/pi-agent-config/docs/delivery-watchdog-fix.md`。主 agent 负责独立验收、上线与生产观察。

## Artifact convention (user's fixed preference)

- **Every report/artifact defaults to HTML and is delivered as a directly clickable https link** — never md attachments, never raw paths.
- One-shot pipeline: `bash ~/.agents/skills/publish-artifact/scripts/report.sh <file> [--title T]` (md → styled HTML → R2 upload → prints link). Reply with `[label](link)` Markdown links in Telegram.
- Chat/session exports to HTML when sharing: `pi --export <session-file> <out.html>`.
- Local copies always kept in `~/artifacts/YYYY-MM-DD/` (or alongside the report) before/after upload.
