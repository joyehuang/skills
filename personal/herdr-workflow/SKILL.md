---
name: herdr-workflow
description: The user's preferred herdr workflow for spawning coding-agent workspaces (git worktree + claude/codex agents + prompts from files). Use whenever driving herdr to start agents, create workspaces, or coordinate agent tasks for this user. Also covers the R2 artifact-publishing convention (HTML-first outputs).
---

# herdr Workflow (user's established pattern)

The user drives herdr this way. Follow it unless they say otherwise.

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
- To avoid permission prompts blocking in-pane claude, also pass `--settings <file>` with a permissions allow list (e.g. /tmp/claude-settings.json with `permissions.allow: ["Bash","Read","Write","Edit","Glob","Grep","WebFetch"]`). Interactive claude defaults to manual mode and will sit blocked otherwise.
- `--timeout 90000` (90s) for startup.

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

## Artifact convention (user's fixed preference)

- **Every report/artifact defaults to HTML and is delivered as a directly clickable https link** — never md attachments, never raw paths.
- One-shot pipeline: `bash ~/.agents/skills/publish-artifact/scripts/report.sh <file> [--title T]` (md → styled HTML → R2 upload → prints link). Reply with `[label](link)` Markdown links in Telegram.
- Chat/session exports to HTML when sharing: `pi --export <session-file> <out.html>`.
- Local copies always kept in `~/artifacts/YYYY-MM-DD/` (or alongside the report) before/after upload.
