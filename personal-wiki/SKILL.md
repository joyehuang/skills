---
name: personal-wiki
description: Import, resume, inspect, triage, or distill Markdown, local files, Feishu/Lark Docx links, Claude shares, and ChatGPT shares into a Git-backed personal Wiki. Use when the user says 导入、保存、整理、沉淀、提炼、归档、查看导入进度, provides one of these source types, or asks to continue blocked Wiki ingestion. This Skill is the product entry; the target repository remains the source of truth.
---

# Personal Wiki

Use the target `personal-wiki` repository as the canonical system. This Skill orchestrates its contracts and CLI; it does not duplicate parsing, hashing, schema, or provider selectors.

## Locate and enter the Wiki

Resolve the repository in this order:

1. a path explicitly supplied by the user;
2. `PERSONAL_WIKI_ROOT`;
3. the current Git repository or one of its parents;
4. a clear local candidate such as `~/Documents/personal-wiki`.

The chosen root must contain `AGENTS.md`, `package.json`, and `system/knowledge-schema.md`. If no unique repository can be established, ask for its path instead of guessing.

Before writing:

1. read `AGENTS.md` and every document it requires for the operation;
2. inspect `git status`, the current branch, worktree, and remote Agent branches;
3. preserve unrelated changes and continue an assigned worktree when one exists;
4. if work is required but the repository is on its stable branch, follow its Git collaboration workflow to create a task branch/worktree.

## Route the request

- “导入 / 保存 / 记下来” means `Capture → Source(imported)` only.
- “查看进度 / 有什么卡住” means read-only `ingest status`; do not mutate or commit.
- “重试 / 继续导入” means resume the existing Capture; do not create a duplicate.
- “整理 / triage” may advance an imported Source only to the requested semantic stage.
- “沉淀 / 提炼 / distill” may create or update atomic Notes and Maps after searching for overlap.
- “发布 / Clone / reviewed” requires Joye’s explicit approval and the repository’s review rules.

Never treat a Source as verified fact. Keep source evidence, Agent inference, and Joye’s judgment distinct.

## Ingest through the repository CLI

Read `references/commands.md`, then use `npm run ingest` from the Wiki root.

The CLI must create a Capture before provider, network, or browser work. Do not hand-author Capture or Source files when the CLI supports the input.

After the command:

- `resolved`: report the Capture ID, Source ID, completeness, and warnings.
- `blocked`: preserve and report the same Capture plus its exact required capability.
- `pending`: report that no resolution was attempted.

Do not replace a blocked Capture with a new Capture for the same request.

## Provider capability ladder

Use the repository’s resolver first:

- Markdown and local files use deterministic local parsing.
- Feishu/Lark Docx uses authenticated `lark-cli` user access.
- ChatGPT and Claude first try the repository’s ephemeral local Chrome/Edge adapter.

If Feishu blocks on authentication or access, report the safe remediation. Do not request, expose, or store tokens.

If a Claude or ChatGPT Capture blocks on `browser` and the current Agent has a browser:

1. read `references/browser-bridge.md`;
2. extract with the repository-owned `extractConversationPage` function;
3. submit that extraction to the existing Capture through the CLI bridge;
4. never save whole-page text, sidebar/account UI, cookies, storage, or a browser profile.

If no suitable browser exists, leave the Capture blocked. A blocked result is a valid recoverable outcome, not an invitation to infer content from a title or bare URL.

## Media and incomplete evidence

Binary originals do not enter Git. Provider-hidden or unresolved media must remain explicit and make the Source partial. When actual bytes are available and the user’s request includes media handling, follow `system/workflows/assets.md` to register private Asset Manifests and use R2.

Never persist signed URLs, temporary media URLs, credentials, or private browser state. Do not invent a missing year, timezone, message time, attachment, or hidden turn.

## Optional semantic organization

Stop after `Source(imported)` unless the user requested organization.

When triaging or distilling:

1. read `system/workflows/ingestion.md`, linking rules, and the nearest templates;
2. search titles, aliases, keywords, IDs, and `provider + source_id` before creating Notes;
3. merge into an existing knowledge thread when that keeps one clear proposition;
4. preserve exact Source lineage and evidence time;
5. use separate commits for import, triage/distillation, and Map changes.

Do not mechanically create one Note per conversation turn.

## Validate and deliver writes

The ingestion CLI has no Git side effects. For an authorized write task:

1. inspect the generated Capture/Source and any semantic changes;
2. run `git diff --check` and `npm run validate`;
3. stage only explicit task paths;
4. follow the repository commit format and trailers;
5. checkpoint blocked work or successful import as appropriate;
6. deliver through the repository’s default Draft PR workflow.

Never merge into the stable branch, force-push, delete a remote branch, or modify Git identity unless the repository rules and user explicitly authorize it.

## Report the outcome

Return a compact result containing:

- repository/worktree used;
- Capture status and ID;
- Source ID and provider revision or content hash when resolved;
- capture completeness and time limitations;
- unresolved media or required capabilities;
- validation and Git delivery state;
- the next semantic stage only if the user asked for it.

Do not paste private source bodies into the chat merely to prove ingestion.

## References

- `references/commands.md` — deterministic CLI entrypoints and result handling.
- `references/browser-bridge.md` — Agent-browser fallback using repository-owned extraction.
