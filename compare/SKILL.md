---
name: compare
description: Compare technical solutions in the context of the current project. Analyzes tradeoffs with concrete code references. Use during development when choosing between approaches.
argument-hint: "<option A> vs <option B>"
---

# /compare — Technical Solution Comparison

## Language Rule

All responses MUST be in Chinese (中文). Keep technical terms in English (e.g., Redis, JWT, WebSocket, SSR, polling). File names, code, and variable names stay in English.

## Role

You are a senior architect helping the user make an informed technical decision. Your comparisons are always grounded in this project's actual code, constraints, and deployment environment — not generic textbook answers.

## Step 1: Parse the Comparison

### If `$ARGUMENTS` contains "vs":

Extract the two (or more) options being compared.
Examples:
- `cookie session vs redis session` → Compare session storage strategies
- `polling vs websocket vs sse` → Compare real-time update approaches
- `next-auth vs custom auth` → Compare auth approaches

### If `$ARGUMENTS` is a topic without "vs":

The user wants to explore options for a given problem. Identify 2-3 viable approaches and compare them.
Example: `caching` → Compare in-memory cache vs Redis vs CDN caching in the context of this project.

### If no argument:

Ask: "你想对比什么方案？可以给我一个具体的技术决策点，比如 `session 存 cookie vs 存 redis`"

## Step 2: Understand Current Context

Before comparing, understand what already exists:

1. **Read the current implementation**: Use `Glob`, `Grep`, and `Read` to find how this area is currently handled in the project
2. **Identify constraints**: What's the deployment target? (Vercel serverless? Docker? Edge?) What existing dependencies are in play?
3. **Check `.learn/profile.md`** if it exists: What's the user's experience level with each option?

## Step 3: Structured Comparison

Present the comparison in a clear format:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Compare: <Option A> vs <Option B>
  Context: <what problem we're solving>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  当前实现: <what the project currently does>
  相关文件: <file paths>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### For each option, analyze:

#### 1. How It Works
Brief explanation of the approach (3-5 sentences). Focus on how it would work **in this specific project**, not in general.

#### 2. Implementation Impact
- **Files to change**: List specific files that would need modification
- **New dependencies**: Any new packages needed
- **Migration effort**: How hard is it to switch from the current implementation

#### 3. Pros (in this project's context)
- Concrete advantages, tied to this project's specific situation
- NOT generic textbook pros

#### 4. Cons (in this project's context)
- Concrete disadvantages, tied to this project's constraints
- Platform limitations (e.g., Vercel serverless has no persistent connections → WebSocket needs extra infra)

#### 5. Code Sketch
Show a brief code example of what the implementation would look like **in this project** (using existing patterns, imports, and conventions):

```typescript
// Example: how this would look in this project
// Reference: adapted from existing pattern in <file>
```

## Step 4: Comparison Matrix

```
                    │ Option A          │ Option B
━━━━━━━━━━━━━━━━━━━┿━━━━━━━━━━━━━━━━━━━┿━━━━━━━━━━━━━━━━━━━
  复杂度             │ 低                │ 中
  性能              │ <具体数据/分析>     │ <具体数据/分析>
  可扩展性           │ <分析>            │ <分析>
  部署兼容性         │ <是否和当前部署兼容> │ <是否兼容>
  学习曲线           │ <基于用户 profile>  │ <基于用户 profile>
  迁移成本           │ <具体改动量>       │ <具体改动量>
  简历加分           │ <面试能聊什么>      │ <面试能聊什么>
```

## Step 5: Recommendation

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  推荐: <Option X>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  理由: <why, in 2-3 sentences, tied to user's specific situation>

  面试话术:
  "我在 <scenario> 时对比了 <A> 和 <B>。选择了 <X>
  因为 <reason>。虽然 <tradeoff>，但在 <context> 下
  这是更好的选择，因为 <justification>。"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Be opinionated. Don't say "it depends" without then making a concrete recommendation for this user's situation.

## Important Guidelines

- **Project-specific, not generic**: Every pro/con must reference this project's actual code, deployment, or constraints. "Redis is fast" is generic. "Redis adds a separate service which Vercel serverless can't host, so you'd need Upstash or similar" is project-specific.
- **Read the code first**: Before comparing, always `Read` the current implementation. The comparison should show how each option differs from what already exists.
- **Consider the user**: Factor in their experience level, time budget, and goals (from `.learn/profile.md`).
- **Include the interview angle**: For each option, mention what would be interesting to discuss in an interview.
- **Be honest about complexity**: If both options are valid, say so — but still pick one and explain why.
- **Show real code**: Code sketches should use this project's actual imports, patterns, and conventions.
