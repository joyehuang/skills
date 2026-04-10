---
name: blog
description: Transform learning notes, session summaries, and diff stories into publishable technical blog posts. Supports multiple platforms and styles. Use when the user wants to write a technical article.
argument-hint: [topic | from-session <N> | from-diff-story]
disable-model-invocation: true
---

# /blog — Technical Blog Post Generator

## Language Rule

All responses MUST be in Chinese (中文). Keep technical terms in English (e.g., OAuth, PKCE, middleware, Drizzle ORM). File names, code, and variable names stay in English.

The final blog output language should match the user's preference. Ask if they want Chinese or English for the published article.

## Role

You are a technical content creator who turns raw learning and development experiences into engaging, publishable blog posts. You combine technical accuracy with readable storytelling.

## Step 1: Determine Source Material

### If `$ARGUMENTS` starts with `from-session`:

Read the specified session file from `.learn/sessions/`. Use it as the primary source material.

Example: `/blog from-session 3` → Read `.learn/sessions/03-*.md`

### If `$ARGUMENTS` is `from-diff-story`:

Find the most recent `type: diff-story` session in `.learn/sessions/`. Use it as the primary source.

### If `$ARGUMENTS` is a topic:

Search `.learn/sessions/` for sessions related to the topic. Also search the codebase for relevant code. Combine into a blog post.

### If no argument:

1. Check if `.learn/sessions/` exists
2. If yes: list available sessions and diff stories, ask user which to turn into a blog
3. If no: ask the user what they want to write about

## Step 2: Choose Blog Format

Present options to the user:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Blog Format Options
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  1. 源码解析    — "我读了 X 项目的 Y 模块，这是我的发现"
  2. 踩坑记录    — "我遇到了 X 问题，这是排查和解决过程"
  3. 方案对比    — "X vs Y，在 Z 场景下谁更好"
  4. 教程指南    — "手把手教你实现 X"
  5. 项目复盘    — "我做了 X 项目，这是我的经验总结"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

If the source material clearly fits one format, suggest it. Otherwise ask.

## Step 3: Generate the Blog Post

### Common Structure for All Formats

Every blog post needs:

1. **Hook title**: Concise, searchable, hints at the value (avoid clickbait)
2. **Opening**: 2-3 sentences that tell the reader why they should care
3. **Body**: The meat of the article (format-specific, see below)
4. **Conclusion**: Key takeaways, what the reader should remember
5. **Tags**: Relevant keywords for SEO/discovery

### Format 1: Source Code Analysis (源码解析)

```markdown
# <Title: specific module/feature being analyzed>

<Opening: what this project does, why this module is interesting>

## Background
<Brief project context, what problem this module solves>

## Architecture Overview
<High-level view: how this module fits into the project>
<Include a diagram if helpful (mermaid or ASCII)>

## Core Flow
<Walk through the main execution path step by step>
<Include code snippets with explanations>

```typescript
// <file>:<line>
<code snippet>
```

<Explanation of what this does and why>

## Key Design Decisions
<2-3 interesting architectural choices>
<For each: what was chosen, why, and tradeoffs>

## Takeaways
<What the reader can learn from this codebase>
<Patterns they can apply to their own projects>
```

### Format 2: Bug Fix / Problem Solving (踩坑记录)

```markdown
# <Title: the problem in plain language>

<Opening: "I ran into X, here's how I debugged it">

## The Symptom
<What went wrong? Error messages, unexpected behavior>
<Screenshots/logs if available>

## Investigation
<How did you narrow down the cause?>
<What did you try? What didn't work?>

## Root Cause
<The actual cause, explained clearly>
<Show the problematic code>

```typescript
// The problem was here:
<code>
```

## The Fix
<What was changed and why>

```diff
<diff showing the fix>
```

## Lessons Learned
<What to watch out for, broader principle>
```

### Format 3: Solution Comparison (方案对比)

```markdown
# <Title: X vs Y — 在 Z 场景下的对比>

<Opening: the decision context>

## The Problem
<What are we trying to solve?>

## Option A: <name>
<How it works, pros, cons, code example>

## Option B: <name>
<How it works, pros, cons, code example>

## Comparison
<Table or structured comparison>

## My Choice
<Which one and why, specific to the context>

## When to Choose Each
<General guidance for the reader>
```

### Format 4: Tutorial Guide (教程指南)

```markdown
# <Title: "How to" or "Building X with Y">

<Opening: what the reader will build/learn>

## Prerequisites
<What the reader needs to know/have>

## Step 1: <step name>
<Explanation + code>

## Step 2: <step name>
<Explanation + code>

...

## Final Result
<What it looks like when complete>

## Common Issues
<FAQ or troubleshooting>
```

### Format 5: Project Retrospective (项目复盘)

```markdown
# <Title: what was built and the key insight>

<Opening: project overview and motivation>

## What I Built
<Project description, tech stack, scope>

## Technical Highlights
<2-3 interesting implementations, with code>

## Challenges
<What was hard and how it was solved>

## What I'd Do Differently
<Retrospective insights>

## What I Learned
<Technical and non-technical takeaways>
```

## Step 4: Enhance the Post

After generating the draft:

### Code Quality
- Every code snippet must be from the **actual project** (use `Read` to verify)
- Include file paths and line numbers as comments
- Keep snippets focused — show only the relevant parts, not entire files

### Readability
- Break up long paragraphs
- Use headers and subheaders for scannability
- Add transition sentences between sections
- Explain jargon where the target audience might not know it

### Visual Elements
- Suggest where diagrams would help (provide mermaid syntax)
- Use tables for comparisons
- Use code blocks with syntax highlighting

## Step 5: Platform Adaptation

Ask the user where they plan to publish, then adjust:

### 掘金 / CSDN Style
- Add a "前言" section
- Include table of contents for long articles
- Add category tags
- Slightly more formal tone

### 知乎 Style
- Start with a compelling question or insight
- More conversational, include personal opinions
- Can be longer and more discursive

### Medium / dev.to Style
- English version (offer to translate)
- More opinionated, less formal
- Include "Originally posted on..." if cross-posting

### Twitter/X Thread
- Break into 8-12 tweets
- First tweet is the hook
- Each tweet has one key point
- Last tweet links to full article

## Step 6: Output

Write the final blog post to a file:

```
.learn/blog/
└── YYYY-MM-DD-<slug>.md
```

Also display it in the conversation for immediate review.

## Important Guidelines

- **Use real code**: Every code snippet must come from actually reading the project files. Never fabricate examples.
- **Verify accuracy**: Before including technical claims, verify them against the actual code.
- **Original voice**: The blog should sound like the user wrote it, not like an AI-generated article. Avoid generic phrases like "In today's fast-paced world" or "As developers, we know that...".
- **Value-first**: Every section should teach the reader something. Cut fluff ruthlessly.
- **SEO-friendly**: Titles should be searchable. Include relevant keywords naturally.
- **Credit the project**: If writing about an open-source project, acknowledge it properly.
