---
name: archive-card-writer
description: Turn fragmented knowledge, rough notes, research snippets, interview takeaways, project learnings, paper excerpts, or partially formed ideas into structured archive cards for the Personal Blog archive system. Use this whenever the user asks to remember, 整理, 沉淀, 归档, 记到 archive, turn notes into cards, merge new knowledge into an existing archive note, or when they provide scattered points that should become a reusable archive card rather than a polished blog post. Also use this when new input should be matched against existing archive/blog content so similar notes are merged instead of duplicated.
---

# Archive Card Writer

This skill converts messy input into maintainable archive cards for the Personal Blog archive system.

The goal is **not** to over-polish everything into a blog article. The goal is to create or update a durable archive card that can keep growing.

## Primary target

Write into:
- `/mnt/hermes-data/personal/projects/blog/src/content/archive/`

This skill is used by the agent, but its content target is the Personal Blog archive.

## Workflow

When triggered, do this sequence:

1. Read the user's input carefully.
2. If the input includes a website URL, shared conversation link, or a pointer to externally hosted content, **fetch the actual content before summarizing or archiving it**.
3. For web pages and LLM conversation shares, prefer **browser-use / browser-based retrieval first** so you capture the rendered page rather than guessing from the title, snippet, or raw URL.
4. If browser-based retrieval is blocked, fall back to simpler fetch methods, but explicitly note when the captured content is partial, login-gated, or inferred from metadata only.
5. Treat URLs as references, not as sufficient content. Do not create an archive card from just a bare link unless the page content could not be retrieved and that limitation is made explicit.
6. Decide whether the input should:
   - create a **new archive card**, or
   - **merge into an existing archive card**.
7. Before writing, inspect existing archive cards for overlap in:
   - topic
   - tags
   - title similarity
   - repeated concepts
   - same project / same learning thread
8. If an existing archive card is clearly the same thread, **append or integrate** the new content there instead of creating a duplicate.
9. If several archive cards together are obviously feeding a future blog post, capture that relationship in metadata or in a short body note.
10. Write concise, readable Chinese-first content.
11. Keep technical terms and data in English when that is more natural or precise.
12. Create a dedicated git branch for this card workflow. Use the card filename slug (without `.md`) as the branch name whenever practical.
13. After writing into the blog project, run validation when practical:
   - `bun run check`
   - or `bun run build`
   - optionally `bun run lint` if the change touched app/page code rather than just content
   - Note: `bun` is installed at `/home/ubuntu/.bun/bin/bun`. If it is not in PATH in the current shell session, use the full path.
14. Commit and push the branch.
15. Open a PR to `main`.
16. Merge the PR after verification, so each archive card can ship independently and multiple archive cards can proceed in parallel.
17. Do not stop at “file created locally” unless the user explicitly asks you not to continue. The default finish line for this skill is: **content written → validated → committed → pushed → PR opened → merged**.

## Language and tone

- Default language: **Chinese-first**.
- Preserve technical terms, APIs, library names, model names, file paths, and data labels in English when useful.
- Match the style of the existing blog/archive content: clear, practical, not AI-corporate.
- `description` is optional. If the input supports a concise summary, write one. If not, omit it.

## File naming rules

Use:
- **English slug**
- **month prefix only in `MMYY`**
- kebab-case

Examples:
- `0326-agent-tool-calling-guardrails.md`
- `0326-rope-precision-notes.md`
- `0326-react-cache-observations.md`

Rules:
- keep the slug short
- prefer the main topic, not every subtopic
- do not add the day
- do not add Chinese characters to the filename

## Archive schema expectations

Respect the archive frontmatter already used by the blog project.

Use these fields when relevant:

```yaml
---
title:
description:
date:
updatedDate:
tags:
type:
status:
relatedBlog:
relatedArchive:
source:
draft: false
---
```

## Field guidance

### `title`
- clear and compact
- should sound like a knowledge card, not a clickbait article title

### `description`
- optional
- write only if a short summary is obvious and useful
- keep it brief

### `date`
- use the current date for newly created cards

### `updatedDate`
- set when modifying an existing card

### `tags`
- reuse existing tag vocabulary whenever possible
- normalize case and wording
- prefer a stable compact set over inventing near-duplicates

### `type`
Choose one:
- `note`
- `snippet`
- `draft`
- `idea`
- `research`
- `reference`

### `status`
Choose one:
- `in-progress`
- `incomplete`
- `ready`
- `archived`

Interpretation:
- `in-progress`: still actively growing
- `incomplete`: useful fragment, not yet coherent
- `ready`: already structured and reusable
- `archived`: mostly stable / reference-only

### `relatedBlog`
Use when this card clearly supports one or more blog posts.

### `relatedArchive`
Use when this card belongs to an existing archive thread or concept cluster.

### `source`
Use only when the source is concrete and worth preserving:
- URL
- paper
- repo
- doc
- interview-note source

## Canonical tag policy

This skill must enforce tag hygiene.

### Existing tag reuse first
Always inspect existing archive/blog tags before inventing new ones.

### Preferred canonical tag set
Start from the tags already seen in the project. Reuse these when relevant:
- `ai`
- `agent`
- `llm`
- `prompt`
- `rag`
- `embedding`
- `retrieval`
- `security`
- `multi-agent`
- `orchestration`
- `transformer`
- `rope`
- `normalization`
- `react`
- `frontend`
- `typescript`
- `performance`
- `reference`
- `software engineering`
- `workflow`
- `codex`
- `images`
- `astro`
- `waline`
- `deep learning`

You may add a new tag only when it adds real retrieval value and no good existing tag fits.

### Tag normalization rules
1. prefer lowercase English tags for technical topics unless the project already uses a better Chinese tag
2. do not create variants like:
   - `LLM` vs `llm`
   - `front-end` vs `frontend`
   - `agent systems` vs `agent`
3. do not create tags that are too narrow to ever reuse
4. when editing related cards, consolidate messy variants if you find them

## Merge-vs-create decision rule

Before creating a new file, decide whether the input should merge.

### Merge when
- the topic is the same ongoing learning thread
- the new fragment adds evidence, examples, nuance, or correction to an existing card
- the new fragment is a subpoint of an existing concept card
- the semantic overlap is high enough that two cards would feel redundant

### Create when
- the topic is meaningfully distinct
- merging would make the existing card bloated or unfocused
- the user explicitly asks for a separate card
- the fragment starts a new line of inquiry that can grow independently

When uncertain, prefer **merging** if semantic overlap is high.

## Merge procedure

If merging into an existing card:
- preserve the useful structure already present
- integrate the new information into the most relevant section
- create a subsection if needed
- update `updatedDate`
- update tags if the new fragment adds an important retrievable theme
- add `relatedArchive` links if this merge reveals nearby cards

Do **not** just dump raw text at the end unless the content is truly an appendix.

## Auto-assimilation rule

If the user provides a new fragment and an older archive card already contains a clearly similar idea, this skill should **prefer assimilation over duplication**.

That means:
- find the most relevant existing archive card
- merge the new fragment into the existing structure
- only create a new card if the old card would become muddled or too broad

## Archive-to-blog relationship rule

This skill should actively consider whether archive content may later become a blog post.

### When to mark blog relationships
Use `relatedBlog` when there is already a concrete relevant blog post.

If no matching blog post exists yet, but several archive fragments clearly form a future article cluster:
- mention this in the card body briefly, or
- link neighboring archive cards via `relatedArchive`

### Example
If several archive cards all discuss:
- context engineering
- memory layers
- token budget
- retrieval strategy

then the skill should notice that these may later combine into a blog article.

## Recommended body structure

Use a flexible archive-card structure. Do not force every section if it would feel fake.

Preferred template:

```md
## 核心内容

## 要点整理

## 当前理解 / 结论

## 待补充

## 相关链接 / 来源
```

### By type

#### `snippet`
Usually keep it compact:
- 核心内容
- 示例 / 片段
- 备注

#### `research`
Emphasize:
- 问题
- 观察
- 当前理解
- 待验证
- 来源

#### `idea`
Emphasize:
- 想法本身
- 为什么值得做
- 可能方向
- 待验证

#### `reference`
Emphasize:
- 资料是什么
- 为什么重要
- 关键摘录 / 总结
- 链接

## Handling very fragmented input

If the user's input is highly fragmented:
- reorganize it under the nearest useful headings
- condense repetition
- preserve the original insight
- do not over-invent content the user never implied

It is OK to add structure headings when the material is too碎.

## URL and shared-conversation intake rule

For inputs like:
- website URLs
- tweet / thread / post links
- YouTube / podcast / article links
- shared LLM conversations (Grok / ChatGPT / Claude / similar)

follow this retrieval order:

1. **Use browser-based retrieval first** when the content is likely rendered dynamically, hidden behind client-side hydration, or better represented visually than in raw HTML.
2. Use simpler fetch/extraction only when browser retrieval is unnecessary or fails.
3. If the page requires login and the content cannot be accessed, say so plainly and avoid pretending the title or preview text is the full source.
4. When archiving a conversation link, capture the actual exchanged points, decisions, examples, and conclusions — not just the headline.
5. If the retrieved content is incomplete, archive only what was actually observed and mark the limitation in the card body or `source` context.

## Expected behavior in conversation

When doing archive capture work:
- briefly say whether you are creating a new card or merging into an existing one
- mention the target file path
- if useful, mention chosen tags / type / status
- after writing, summarize what was captured

## Examples

### Example 1: merge
Input:
- “补充一下我昨天那个 tool calling 笔记：真正的问题不是死循环本身，而是 schema 写得不清楚导致模型误判。”

Action:
- find the existing tool-calling / agent reliability card
- merge the new point into the existing reasoning section
- update `updatedDate`

### Example 2: create new
Input:
- “我最近发现 RoPE 多频率机制里浮点精度这个点，值得单独记一张卡。”

Action:
- create a new archive card if no existing RoPE precision card exists
- likely use `research`
- add tags like `llm`, `transformer`, `rope`

### Example 3: merge instead of duplicate
Input:
- “我又补充一点上下文工程的碎片：working memory / short-term / long-term 不应该只按时间分，还要按重要性和可恢复性分。”

Action:
- search for an existing context-engineering or memory-layer card
- if found, merge into it instead of creating a duplicate file

## Constraints

- do not turn everything into a polished blog post
- do not create duplicate archive files when a merge is clearly better
- do not explode the tag set with one-off variants
- do not fabricate strong conclusions from weak fragments
- keep cards useful for future expansion
