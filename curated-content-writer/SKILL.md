---
name: curated-content-writer
description: Turn paper links, blog posts, articles, or any worthy external content into curated entries for the Personal Blog curated section. Use this whenever the user sends a link and says 精选/curated/收录/加到这个模块/收录到精选/加到精选, or when you discover notable external content worth surfacing on the homepage. Each curated entry is a concise recommendation with your own reading notes — not just a link dump.
---

# Curated Content Writer

This skill converts external content (papers, blogs, articles, reports) into compact curated entries for the Personal Blog curated section (`src/content/curated/`).

The goal is **not** to write a deep research card. The goal is to create a lightweight, scannable recommendation that shows on the homepage.

**Curated vs Archive distinction:**
- **Archive** (`src/content/archive/`): deep notes, research fragments, knowledge cards. Long-form, reference-oriented.
- **Curated** (`src/content/curated/`):精选推荐, concise actionable summary. Short-form, homepage-oriented.
- A curated entry can link to an archive card via `relatedArchive` when there's deeper context.

## Primary target

Write into:
- `/mnt/hermes-data/personal/projects/blog/src/content/curated/`

## Workflow

When triggered, do this sequence:

1. Read the user's input carefully — they'll typically send a URL.
2. If the input includes a URL, **fetch the actual content first** before writing.
   - For papers: use `web_extract` (works with arXiv PDFs), also check code repos
   - For blog posts: use `web_extract` or browser-based retrieval
   - For Claude/ChatGPT share links: use Playwright + system Chromium (`/usr/bin/chromium-browser`) — these are JS-rendered SPAs
3. Read and understand the content. Extract:
   - Core idea (1-2 sentences)
   - Why it's notable (the insight, not just the topic)
   - How it connects to the user's projects (Hermes Agent, Atypica, etc.)
   - Check code repos (for papers): is there a valid repo? What's the code quality like?
4. Decide whether a matching curated entry already exists. If so, update it.
5. Write the curated entry file.

## File naming

Use kebab-case English slugs. No date prefix needed (the `date` field in frontmatter handles ordering).

Examples:
- `hermes-fts5-session-search.md`
- `prompt-caching-engineering.md`
- `claude-html-effectiveness.md`

## Curated schema

```yaml
---
title:              # required — your title (concise, descriptive)
description:        # required — 1-2 sentence "why this matters" (max 200 chars)
date:               # required — current date
updatedDate:        # optional
source:             # required — URL to the original paper/blog/article
sourceTitle:        # optional — original title of the source
sourceAuthor:       # optional — author / organization name
tags:               # optional — reuse existing tags
type:               # required — enum: paper | blog | article | report
status:             # optional — enum: curated | digested. Use 'digested' if you've read and analyzed it deeply.
relatedArchive:     # optional — list of related archive card slugs (without .md)
heroImage:          # optional — if there's a good OG image
draft: false        # optional
---
```

### `type` values
- `paper` — academic papers (arXiv, conference proceedings)
- `blog` — blog posts (company blogs, personal blogs)
- `article` — long-form articles, documentation, tutorials
- `report` — technical reports, white papers

### `description` guidance
Write a compelling 1-2 sentence why-this-matters summary. Not a factual abstract — a judgement call. It should make someone want to click and read more.

Examples:
- ❌ "This paper discusses memory-augmented LLMs" (boring, factual)
- ✅ "Hermes 用 SQLite FTS5 + LLM 做会话搜索替代向量检索——单用户场景下比 vector RAG 更便宜、更稳、零运维" (opinionated, specific)

## Body structure

Keep the body concise but substantive. Recommended format:

```md
[Key insight in 1-2 sentences]

**为什么值得看**：[Why is this notable? What makes it different?]

**可落地**：[If applicable, how could this be used in the user's projects?]
```

The body should be 3-8 sentences total. Use Chinese for Chinese users, English for English users.

## Verification

After writing:
1. `bun run check` (or `bun run build`) — but only if the build currently passes without errors; skip if pre-existing errors exist
2. Create a git branch → commit → push → PR → merge
3. Check Vercel deployment status

## Related skill

Use the `archive-card-writer` skill when the user provides deep/nuanced content that deserves a full archive card alongside the curated entry.
