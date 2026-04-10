---
name: deep-dive
description: Deep dive into a specific module or system of the current project. Source-code-level analysis following the complete execution flow. Use when the user wants to thoroughly understand one part of the codebase.
argument-hint: <module-name>
---

# /deep-dive — Module Deep Dive Skill

## Language Rule

All responses MUST be in Chinese (中文). Keep technical terms in English (e.g., OAuth, middleware, session, PKCE, Drizzle ORM, hook, callback). File names, code, and variable names stay in English. This rule applies to all output including the module overview, flow traces, and interview summaries.

You are performing a deep, source-code-level analysis of a specific module. Unlike `/learn` which provides breadth, `/deep-dive` provides extreme depth on a single topic.

## Step 1: Determine Target Module

### If $ARGUMENTS is provided:

Use `$ARGUMENTS` as the target module name (e.g., `auth`, `sandbox`, `session`, `db`, `agent`).

### If no argument:

1. Quickly scan the project structure using `Glob`
2. List the major modules/systems found
3. Ask the user which one they want to deep dive into

## Step 2: Check Learning State

If `.learn/plan.md` exists, read it to understand what the user has already covered. This helps avoid re-explaining concepts they already know.

If `.learn/profile.md` exists, read it to adapt the depth and terminology to the user's level.

## Step 3: Module Reconnaissance

Before diving in, map out the module:

1. **Find all related files**: Use `Glob` and `Grep` to find every file related to this module
2. **Identify the entry points**: Where does execution begin? (API routes, exported functions, event handlers)
3. **Map the dependency graph**: What does this module import? What imports it?

Present a module overview:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Deep Dive: <module name>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Files: <N> files across <M> directories
  Entry points: <list>
  Key dependencies: <list>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Step 4: Flow Tracing

This is the core of deep-dive. Trace the complete execution flow for the module's primary use case.

### 4a: Pick the Primary Flow

Identify the most important flow for this module. For example:
- Auth module → Complete OAuth login flow from button click to session creation
- Sandbox module → Sandbox lifecycle from creation to cleanup
- Task module → Task submission through agent execution to completion

Tell the user: "I'll trace the <flow name> flow from start to finish."

### 4b: Step-by-Step Trace

For each step in the flow:

1. **Read the actual code** — Use `Read` with specific line ranges
2. **Explain what happens at this step** — What does the code do? What data is transformed?
3. **Show the handoff** — How does control flow to the next step? (function call, API request, event, redirect)
4. **Highlight interesting decisions** — Why is it done this way? What are the tradeoffs?
5. **Flag potential issues** — Are there edge cases, error paths, or potential bugs?

Format each step clearly:

```
Step N: <what happens>
File: <path>:<line range>
───────────────────────
<explanation>

→ Next: <what happens next and where>
```

### 4c: Error & Edge Case Paths

After tracing the happy path, cover:
- What happens when things fail?
- What are the error boundaries?
- Are there retry mechanisms?
- What state is left behind on failure?

### 4d: Secondary Flows

If the module has other important flows, briefly mention them and ask if the user wants to trace those too.

## Step 5: Architecture Analysis

After the flow trace, provide a higher-level analysis:

### Design Patterns Used
- What patterns does this module employ? (Repository, Factory, Middleware, etc.)
- Are they used well? Any anti-patterns?

### Interface Boundaries
- What's the public API of this module?
- What's internal/private?
- How clean is the separation?

### State Management
- What state does this module own?
- Where is it stored? (DB, memory, cookies, etc.)
- What are the state transitions?

### Security Considerations
- Are there auth checks?
- Input validation?
- Data encryption?
- Potential vulnerabilities?

## Step 6: Interview-Ready Summary

Generate a concise summary the user could use to explain this module in an interview:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Interview Angle: <module name>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  One-liner: <explain this module in one sentence>

  Key technical decisions:
  1. <decision and why>
  2. <decision and why>

  What I would improve:
  1. <improvement and why>

  Potential interview questions:
  - Q: <question>
    A: <brief answer>
  - Q: <question>
    A: <brief answer>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Step 7: Update Learning Progress

If `.learn/plan.md` exists:

1. Find any topics in the plan that relate to this module
2. Mark them as `[x]` with today's date
3. Add a note: `(via deep-dive)`

Example: `- [x] OAuth flow (2026-03-23, via deep-dive)`

Create a session summary in `.learn/sessions/` following the same format as `/learn`:

```markdown
---
session: <next number>
date: YYYY-MM-DD
duration_min: <estimated>
topics_covered: <count>
type: deep-dive
module: <module name>
---

# Deep Dive: <module name>

## Flow Traced
- <primary flow description>

## Key Findings
- <important insights>

## Files Analyzed
- <file:line references>

## Potential Improvements Found
- <what could be better>

## Related Modules
- <modules that connect to this one>
```

## Important Guidelines

- **Go deep, not wide**: This is not an overview. Read every line of the critical path.
- **Use actual code**: Always `Read` the real code. Never paraphrase or guess what code does.
- **Trace real execution**: Follow the actual call chain, don't just describe files in isolation.
- **Be opinionated**: Point out what's good and what's not. The user is here to truly understand, not just read docs.
- **Connect to the big picture**: Even though you're going deep on one module, explain how it connects to the rest of the system.
- **Performance awareness**: Point out any performance implications (N+1 queries, unnecessary re-renders, missing indexes, etc.)
- **Track line numbers**: Always reference specific file:line so the user can navigate to the code.
