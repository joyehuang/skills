---
name: herdr-workflow
description: 用户的 Herdr 协作工作流：在明确要求操作 Herdr 时，按授权创建 pane/worktree、启动 Claude/Codex 并从文件提交任务。区分 Herdr 执行器与通用后台任务协议；不要仅因任务适合后台执行就擅自创建 Herdr 拓扑或重启会话。
---

# Herdr 工作流与后台任务的边界

同步基线：Herdr **v0.9.1**，2026-09-18。这是文档基线，不代表当前运行 server 已升级。

## 0. 先分清四件事

- **后台任务**：任务在当前对话回合结束后继续执行，让主 agent 能继续接收用户消息。它是一种调度方式，不是 Herdr 的同义词。
- **执行器**：可以是 Herdr pane 内的 Claude/Codex，也可以是独立 `codex exec` 子进程。两者都是真实执行；Herdr 不会自动显示未在其 pane 中启动的进程。
- **任务协议**：`~/bin/task_protocol.py`、私有 task/run 记录、完成事件、独立验收和真实交付收据。这层跨执行器工作，不由 Herdr 的 `done` 替代。
- **skill**：给 agent 的操作说明，不是守护进程、调度器或自动接线。修改 skill 不会自动迁移旧任务，也不会改变已经启动的进程。

**当前事实（2026-09-18核对）**：近期 Jev、QQbot 修复等实际走 `task_protocol → Python runner → codex exec`，并未创建对应 Herdr pane。此前本 skill 把后台任务一概写成 Herdr workspace，与事实不一致。本版澄清两条路径，不把历史任务伪装成 Herdr，也不据此擅自重跑或迁移它们。

本文件包含通用协议是历史组织方式，不意味着读取第6节就获准操作 Herdr。未来若拆出独立后台任务 skill，必须保持协议和事实来源一致，而不是另建一套登记簿。

### 权威来源

1. 运行时 CLI：先看 `herdr --help`、相关命令组和 `--help`，它是参数语法权威。
2. 官方 skill：`~/.agents/skills/herdr-official/SKILL.md`，同步自 v0.9.1，保持上游原文；可由匹配版本的 `herdr --skill` 校验。
3. 本 skill：用户偏好、账号边界和独立验收要求。
4. 任务协议细节：`~/dev/pi-agent-config/docs/delivery-watchdog-fix.md`、`python3 ~/bin/task_protocol.py --help`。

不要用裸 `herdr` 探测——它会启动/附着 TUI；不要省略 mutating 子命令参数试探，有些命令带默认值就会执行。

## 1. 何时使用 Herdr

只有用户明确提到 Herdr，或明确要求通过 Herdr 查看/控制 pane、workspace、agent 时，才进入 Herdr 控制流程。先确认自己确实在受管理的 pane 中：

```bash
test "${HERDR_ENV:-}" = 1
herdr --help
herdr status
```

- 检查失败就不要从外部控制用户聚焦的 Herdr 会话。
- **headless worker 不等于 Herdr pane**。启动独立进程时应移除继承的 `HERDR_*` 定位环境，不能借父进程遗留变量冒充主 pane。
- CLI/client 与运行中 server 的版本可能不同；先看 `herdr status`，新二进制安装成功不等于新 server 功能已生效。
- `herdr update` 若提示须在 Herdr 外、detach 后执行，就停在这个保护边界；不要伪造环境变量绕过，也不要杀当前主会话。可先准备并校验安装包，明确报告仍待安全更新。
- 不默认使用实验性 `--handoff`。用户授权一般更新不等于同意冒险迁移所有活跃 pane；需明确迁移范围和保留/回滚证据。

## 2. 拓扑、远程范围与身份

默认沿用当前目录、当前 tab 的 sibling pane，不额外创建 workspace/worktree。用户已授权隔离工作区时再创建：

```bash
herdr pane layout --pane "$HERDR_PANE_ID"
herdr pane split --current --direction right --cwd "$PWD" --no-focus

# 已授权隔离代码工作区时，读取实际 JSON 返回的 ID
herdr worktree create --cwd "$PWD" --branch fix/example --base main \
  --label "example" --no-focus
```

- 宽 pane 向右，窄/高 pane 向下，避免连续切成不可用细条。
- `workspace create` 返回 `.result.workspace/.tab/.root_pane`；`pane split` 返回 `.result.pane`。ID 不猜、不从侧栏序号推导。
- 优先 `--current` 或显式 pane ID，不依赖 UI 当前焦点。v0.9.1 的 `pane split` 缺省优先 caller，但其他命令未必如此。
- pane move 后读取新 ID；旧 workspace-qualified ID 不可继续当通用目标。
- `workspace close --group` 会连同关联 worktree workspaces 一起关闭，不是绕开 `workspace_group_close_required` 的通用办法。
- `--trust-repository` 是本次请求的 Git 信任授权，不能作为修复报错的默认开关。

### v0.9.1：保存的 SSH machine

```bash
herdr machine list --json
herdr --machine <已保存的label或ID> agent list
herdr --machine <同一个label或ID> pane list
```

- machine selector 是 enabled 的保存配置 ID 或唯一、区分大小写的标签，不是任意 SSH 主机名。
- 每次发现、读写、等待、清理都保持同一 `--machine`；本地与远程可以同时有 `w1:p1` 或同名 agent。
- 不与 `--session` / `--remote` 混用；继承的本地 ID、`--current` 不能指定远程 pane。
- 两端安装及远端 server 必须支持相应 API。转发不会安装、启动或重启 server，也不会失败后退回 Local。
- 连接失败不等于远端操作没执行，先对账再重试。
- 添加/删除/启停 machine 配置、替换不兼容 server，须有用户授权。本次文档更新不授权任何远程部署。

## 3. 启动执行者：模型、账号、prompt

### 执行配置

- 后台执行默认 **Codex GPT-6 Astra，reasoning low**；仅用户指定时覆盖，不开 fast mode。这不是修改主 Pi 模型的许可。
- 个人任务优先 agent5x（`~/.config/codex-agent`）；明确额度耗尽后，可按用户既有授权使用 personal20x（`~/.codex`）。个人 Plus 与工作账号不在该备用授权里。
- Herdr 中应在**目标 shell pane**设置选定的 `CODEX_HOME` 并核对；不要假定给控制 CLI 加临时环境变量就会传给 server 侧 pane。
- 用户指定 Claude 模型时使用 Claude Code，不启动另一个 Pi 替代。
- Codex 用用户已确定的 full access 参数；Claude 使用 auto permission mode。权限模式不扩大用户任务授权和数据边界。

```bash
herdr agent start example --kind codex --pane <实际pane-ID> --timeout 90000 -- \
  --model gpt-6-astra -c model_reasoning_effort='"low"' \
  --dangerously-bypass-approvals-and-sandbox

herdr agent start example-claude --kind claude --pane <实际pane-ID> --timeout 90000 -- \
  --model claude-opus-5 --permission-mode auto
```

- 模型和原生 agent 参数放在 `--` 后。
- 新 pane 可能暂时 `agent_pane_busy`：用 until 重试，但要有次数上限，且**只重试已确认的瞬时 busy**，不能吞掉其他错误无限循环。
- `agent start` 成功会等待检测到对应 agent 且就绪。若返回 `agent_not_ready`，名字可能已注册，先 `get/read`；不可重复 start。
- 正式 prompt 前确认 ready/idle，必要时读欢迎页或信任页，避免 prompt 丢失。未知仓库/权限对话不盲按确认。
- agent 名称在目标 server 的存活 agent 中必须唯一，使用有任务意义的名字。

### Prompt 从文件读取

```bash
herdr agent prompt example "$(cat /absolute/private/prompt.txt)" --wait --timeout 900000
```

- 不把复杂中文、引号、反引号和换行直接塞进命令行。
- 派发回合只确认真正开始后就结束，不等长任务完成。
- 上面的阻塞等待放进后台 relay/runner，不占住主对话回合。
- v0.9.1 的成功提交仅说明文本和 Enter 已写入，不代表模型已开始。
- `--wait` 从非 working 状态提交后，会在最多5秒内要求看到 working/blocked；idle/done/会话变化不能冒充启动活动。
- 超时包含提交时间；`agent_prompt_stalled` 或 timeout **不证明未投递**。先 `get/read` 对账，不能盲目重发。

## 4. 等待、读取与清理

- 普通 `agent prompt --wait` / `agent wait` 等待 settled；只在特定状态需求才加 `--until blocked` 等。
- `idle` / `done` 都是就绪状态；CLI用 server seen 状态区分，各 TUI 自有已读视图，显示可能不一致。
- `blocked` 是批准/问答 UI；`unknown` 不是完成。Herdr生命周期不是业务验收。
- 日志优先 `recent-unwrapped`，需要颜色证据才 `--format ansi`。普通 shell/test/server 走 pane 命令，不冒充 agent。
- 新版可对部分 idle agent 收集 alternate-screen 应用历史并恢复视口，但不是所有输出都能找回。扩大 read 仍无结果时，才让该 agent 将完整回复写文件；别靠滚屏截图猜。
- 技术调研/代码任务要求产物文件是我们自己的交付契约，与“终端回读失败才要求转录文件”不同。
- 用完只关闭自己创建且已完成的 pane/workspace；dirty、未推送、其他人的窗口先保留。不要 stop 主 server、kill Herdr 主进程或用 `--group` 批量绕过保护。

## 5. 接力必须有机制

- 发完任务不等于会自动收到结果。每次承诺后台收尾必须有 runner 结果事件、登记簿和 watchdog。
- Herdr wait 只观察生命周期；`DONE_XXX` 可能来自 prompt 回显，不能单靠 grep 宣告成功。
- 多阶段任务可合并成一个连续执行，或后台 relay 等待后检查实际 run 结果再接下一阶段。
- 禁止在主回合 sleep 长轮询。Herdr executor 使用内置 wait；headless executor 等实际子进程退出，不假造 Herdr 状态。

## 6. 通用后台任务协议（两种执行器共用）

### 先分类，再派发

- 前台：需要用户中途交互，或很短的读查/小配置。
- 后台：能独立执行的开发、修复、研究。必要派发和启动确认后立刻结束主回合。
- 用户明确指定执行器、模型、位置时按其授权；只说“后台”不自动授权新 Herdr 拓扑、远程机器、生产权限或付款。
- 研究任务要允许基于证据扩展问题、做反例和公平对照，不把它缩成固定开发清单；已有预算授权不因旧试用配置被悄悄收紧。

### 登记与执行

私有目录 `~/.config/agent-tasks/` 保存 registry/outbox/inbox、不可变 run 结果和交付证据；不能称为可丢弃缓存。所有 writer 经协议锁/原子更新，不直接改 JSON 状态。

```bash
python3 ~/bin/task_protocol.py register TASK --spec /private/spec.json
python3 ~/bin/task_protocol.py start-run TASK --run-id RUN
python3 ~/bin/task_protocol.py run TASK RUN -- /absolute/worker ARGS
python3 ~/bin/task_protocol.py result TASK RUN
```

- spec：instruction、acceptance、artifacts、done_marker、type、route。
- Herdr 额外记录实际 agent/pane/workspace；远程操作同时记录 machine/session 范围。headless 记录命令、PID出生身份、cwd、独立账号配置，不填虚构的 Herdr ID。
- worker 从 TASK_ID/TASK_RUN_ID/TASK_RESULT_PATH 写匹配 business JSON；实际 stdout 单独打印完成标记。
- 退出码、当前run标记、产物 freshness/hash、业务 reason/error 一起核对。`goal_complete` 与 `batch_finished` 分开；API错误、额度耗尽或未完成项不自动当成功。

### 独立验收与真实交付

- `ready_for_review` ≠ 做好。主 agent 先 inspect/result，再按 acceptance 实查，不只是转述 worker。
- Herdr状态读取实际 `result.agent.agent_status`；working不当done，未知不猜。headless则查实际进程与runner结果。
- 通过后 `verify TASK RUN --evidence FILE`，失败加 `--reject`。最多两次返工后升级问题，不能无限开跑。
- 已授权后续步骤继续执行；未授权付款、公开、改生产边界仍须确认。
- `prepare-report` 绑定验收、目标和正文hash；实际发送成功后，`report`关联真实sender/bridge账本。不能伪造receipt或用无关messageId补签。
- Telegram Markdown会转换HTML并trim；绑定hash前须使用相同渲染结果，或使用转换不变的纯文本。不可在发送后改不可变intent来迁就错误hash。
- 控制事件单独 `ack EVENT CLAIM handled --evidence FILE`；claim变化先inspect。enqueued不是handled，也不是业务成功。
- 内部阶段、返工、过期/重复事件不对用户重复播报。最终只交付结果与必要限制。

### 通知保障及旧记录

1. runner结构化结果与稳定 task/run/phase outbox 关联；notify-agent携带 task/run/event/result/route。
2. 主 agent 接续时现场对账结果、claim/lease、验收和签收。
3. launchd task-watchdog每180秒兜底；owner缺失或持续错误不能承诺一个周期内送达。

忙时排队、闲时注入；有界重试和幂等，不保证exactly-once。未知ACK不盲重发。过时未发通知可supersede；sending/unknown必须保留不确定性。旧CLI兼容通知只有durable inbox签收，不等于完成。

历史任务缺run证据先标needs_reconciliation；按CLI的expected-hash和inspection显式adopt/close-legacy，不批量假报完成。原始outbox/inbox/receipt不删不重放。通知/权限基础设施的改造要单独授权，不因为本次skill更新而重构生产。

## 7. 产物与同步

- 一般报告写 `~/research/`，按 `publish-artifact` 的 `report.sh` 发布HTML链接，并本地保留。远端key带 `.html`。
- 用户指定博客草稿走独立分支+Preview；公司资料按其工作域规则处理，不公开上传。
- Telegram链接一律 `[标题](https://...)`；长分析用段落+bullet，不用长表格。
- 运行时 `~/.agents/skills/` 为权威，更新后同步 `~/dev/skills/personal/`。官方skill保留原文并记来源版本；个人适配写在本文件。不把账号凭据、私有任务输入或输出同步到公开仓库。
