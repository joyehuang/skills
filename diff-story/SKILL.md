---
name: diff-story
description: Generate a technical narrative from your git changes. Turns commits into a coherent story of problem discovery, analysis, and solution. Use after completing development work.
argument-hint: [branch-name | commit-range]
disable-model-invocation: true
---

# /diff-story — Change Narrative Generator

## Language Rule

All responses MUST be in Chinese (中文). Keep technical terms in English (e.g., OAuth, PKCE, middleware, race condition). File names, code, commit hashes, and variable names stay in English.

## Role

You are a technical writer who turns raw code changes into compelling narratives. You extract the **story** behind the diff — why changes were made, what problems they solve, and what the developer learned along the way.

## Step 1: Gather the Changes

### If `$ARGUMENTS` is a branch name:

```bash
git log main..$ARGUMENTS --oneline
git diff main..$ARGUMENTS
```

### If `$ARGUMENTS` is a commit range (e.g., `abc123..def456`):

```bash
git log $ARGUMENTS --oneline
git diff $ARGUMENTS
```

### If no argument:

Check what's available:
1. If on a non-main branch: use `git log main..HEAD` and `git diff main..HEAD`
2. If on main with uncommitted changes: use `git diff` and `git diff --staged`
3. If on main with recent commits: show last 10 commits and ask user which range to narrate

## Step 2: Analyze the Changes

### 2a: Categorize Each Change

Read through every changed file and categorize:

- **Bug fixes**: What was broken? What caused it?
- **New features**: What capability was added?
- **Refactoring**: What was restructured and why?
- **Config/setup**: Environment, build, dependency changes

### 2b: Find the Thread

Look for the logical connections between changes:
- Did fixing one bug lead to discovering another?
- Did a new feature require refactoring existing code first?
- Is there a cause-and-effect chain?

### 2c: Read the Before & After

For each significant change, read both the old and new code to understand the transformation. Use `git show` or `git diff` to see what changed, and `Read` to see the full current context.

## Step 3: Generate the Narrative

### Format: Technical Story

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Diff Story: <title summarizing the overall change>
  Range: <commit range or branch>
  Files changed: <N> | Insertions: +<N> | Deletions: -<N>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  ## 背景

  <What was the state of things before these changes?
   What problem existed or what opportunity was identified?>

  ## 发现

  <How was the problem discovered? What were the symptoms?
   Include specific error messages, logs, or behavior.>

  ## 分析

  <What was the root cause? How was it identified?
   Reference specific files and line numbers.
   Show the problematic code.>

  ## 方案

  <What approach was chosen? Why this over alternatives?
   If there were multiple options considered, briefly mention them.>

  ## 实现

  <Walk through the key changes in logical order (not commit order).
   For each significant change:
   - What file was changed
   - What the change does
   - Why it was necessary>

  ### 改动 1: <title>
  **文件**: `<file path>`
  **改动**: <what changed and why>
  ```diff
  <relevant diff snippet, keep it short>
  ```

  ### 改动 2: <title>
  ...

  ## 结果

  <What's the end state? What works now that didn't before?
   Any metrics or observable improvements?>

  ## 学到的

  <Technical lessons learned. Things that would be valuable
   to mention in an interview or blog post.>

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Step 4: Generate Reusable Outputs

After the narrative, provide these derivative formats:

### PR Description

```markdown
## Summary
<2-3 bullet points>

## Changes
- <file>: <what changed>
- ...

## Testing
- <how to verify>
```

### Resume Bullet Point

```
<STAR format: Situation → Task → Action → Result, 2-3 sentences>
```

### Blog Outline

```
<Suggested blog post structure if the user wants to turn this into an article via /blog>
```

## Step 5: Update Learning State (if applicable)

If `.learn/` exists, create a session record:

```markdown
---
session: <next number>
date: YYYY-MM-DD
duration_min: 0
topics_covered: 0
type: diff-story
commit_range: <range>
---

# Diff Story: <title>

## Changes Narrated
- <summary of changes>

## Technical Lessons
- <key learnings>
```

## Important Guidelines

- **Read the actual diff**: Always use `git diff` and `git log` to get the real changes. Never fabricate or assume changes.
- **Tell a story, not a changelog**: A changelog says "changed X in file Y". A story says "we discovered that X was causing Y, and the fix was Z because..."
- **Use the user's voice**: The narrative should sound like something the user could say in an interview — first person, confident, showing understanding.
- **Include code snippets**: Show the relevant before/after code, but keep snippets short and focused on the key change.
- **Connect to bigger picture**: How do these changes fit into the overall project architecture?
- **Be honest about scope**: Don't inflate a small fix into a major achievement, but do highlight genuine technical insight even in small changes.
