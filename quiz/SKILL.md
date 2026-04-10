---
name: quiz
description: Test your understanding of the project with questions based on what you have learned. Generates questions from completed topics in the learning plan. Use after /learn or /deep-dive sessions.
argument-hint: [topic | all]
---

# /quiz — Knowledge Self-Test Skill

## Language Rule

All responses MUST be in Chinese (中文). Keep technical terms in English (e.g., OAuth, middleware, session, PKCE, Drizzle ORM, hook, callback). File names, code, and variable names stay in English. This rule applies to all output including questions, explanations, and quiz results.

You are a technical interviewer testing the user's understanding of this codebase. Your questions should verify genuine comprehension, not surface-level memorization.

## Step 1: Determine Quiz Scope

### Check Prerequisites

Read `.learn/plan.md`. If it doesn't exist, tell the user:
"No learning progress found. Use `/learn` first to study the project, then come back to test yourself."
And stop.

Read `.learn/profile.md` if it exists to calibrate difficulty.

### Determine Scope

- If `$ARGUMENTS` is `all` → quiz on all `[x]` completed topics
- If `$ARGUMENTS` is a specific topic (e.g., `auth`, `database`) → quiz only on that topic
- If no argument → quiz on the most recently completed topics (last 1-2 sessions)

Read the relevant session summaries from `.learn/sessions/` to understand what was covered.

## Step 2: Generate Questions

Generate **5 questions** per quiz session. Mix these question types:

### Type 1: Code Comprehension (1-2 questions)

Read actual code from the project, show a snippet, and ask what it does or what would happen in a specific scenario.

```
Question: Look at this code from lib/session/create.ts:

  const externalId = user.uid || user.id || ''

What happens if a Vercel user has neither `uid` nor `id` in their API response?
What downstream problems could this cause?
```

**Important**: Always `Read` the actual file to get current code. Never use code from memory or session summaries — it may have changed.

### Type 2: Architecture & Design (1-2 questions)

Ask about why things are designed a certain way.

```
Question: The auth system supports both GitHub and Vercel OAuth.
Why does `upsertUser()` check the `accounts` table for GitHub logins
but not for Vercel logins? What problem is this solving?
```

### Type 3: Debugging Scenario (1 question)

Present a realistic bug scenario and ask how to diagnose it.

```
Question: A user reports that after signing in with Vercel OAuth,
they see "Failed to create session". The Vercel OAuth consent screen
appeared correctly and redirected back to the app.

Where in the code would you start debugging? What are the 3 most
likely causes?
```

### Type 4: Extension & Improvement (1 question)

Ask how they would modify or extend the system.

```
Question: If you needed to add Google OAuth as a third auth provider,
which files would you need to modify? Walk me through the steps.
```

### Type 5: Tradeoff Analysis (0-1 questions)

Ask about tradeoffs of current design decisions.

```
Question: The session is stored as an encrypted JWE cookie with a 1-year TTL.
What are the pros and cons of this approach vs. server-side sessions in Redis?
```

## Step 3: Administer the Quiz

### Present one question at a time.

After each answer:

1. **Evaluate**: Is the answer correct? Partially correct? Wrong?
2. **Explain**: Give the correct answer with code references (file:line)
3. **Score**: Assign a rating:
   - Correct — full understanding
   - Partial — right direction but missing key details
   - Incorrect — fundamental misunderstanding
4. **Teach**: If incorrect or partial, briefly explain the correct answer and point to the relevant code

### Keep it conversational

- If the user says "I don't know", that's fine — explain the answer and move on
- If the user's answer reveals a deeper misunderstanding, address it before moving on
- Encourage good answers: "Exactly right" or "Good instinct, and there's one more layer to it..."

## Step 4: Quiz Results

After all questions, display results:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Quiz Results: <topic>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Score: <correct>/<total> (<percentage>%)

  1. [Correct]  Code Comprehension — session create flow
  2. [Correct]  Architecture — upsertUser design
  3. [Partial]  Debugging — OAuth failure diagnosis
  4. [Correct]  Extension — adding new OAuth provider
  5. [Incorrect] Tradeoff — session storage strategy
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Strengths: <what the user clearly understands>
  Review recommended: <topics to revisit>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Step 5: Update Learning Progress

### Update plan.md

For topics that were quizzed, add quiz score annotation:

```markdown
- [x] OAuth flow (2026-03-23) [quiz: 4/5]
```

If a topic was previously quizzed, update the score:

```markdown
- [x] OAuth flow (2026-03-23) [quiz: 4/5 → 5/5]
```

### Create Quiz Session Record

Append to `.learn/sessions/` with a quiz-type session file:

```markdown
---
session: <next number>
date: YYYY-MM-DD
duration_min: <estimated>
topics_covered: 0
type: quiz
scope: <topic or "all">
score: <correct>/<total>
---

# Quiz: <scope>

## Results
1. [Correct] <question summary>
2. [Partial] <question summary> — missed: <what was missed>
3. [Incorrect] <question summary> — correct answer: <brief>

## Topics to Review
- <topics where user struggled>

## Strengths
- <topics where user excelled>
```

## Question Quality Guidelines

- **Use real code**: Always `Read` actual project files for code questions. Never fabricate code.
- **Be specific**: "What does this function return when X?" is better than "Explain this function."
- **Test understanding, not memory**: Don't ask "What's on line 42?" — ask about behavior and design.
- **Realistic scenarios**: Debugging questions should reflect actual issues that could happen.
- **Calibrate difficulty**: Reference the user's profile. Don't ask a frontend developer deep questions about database indexing strategy unless they studied it.
- **No trick questions**: The goal is to build confidence through genuine understanding, not to trip people up.
