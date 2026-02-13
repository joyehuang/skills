---
name: user-insight-research
description: Generate a weekly plan of 7 user-insight research topics (one per day) from users/{userId}/USER.md by combining profile context with recent web_search signals. Saves the result as a JSON file in the user's root folder for downstream consumption by create-project (UserInsight type).
---

# User Insight Research Weekly Topic Planner

This skill generates exactly 7 user-insight research topics as strict JSON — one topic per day for a 7-day period starting from today. The JSON is saved as a file in the user's root folder.

It is designed for one workflow only:
1. Read profile from `users/{userId}/USER.md`
2. Search recent external signals with `web_search`
3. Generate 7-topic JSON and **write it to file** `users/{userId}/YYYYMMDD-user-insight.json`

The output file is consumed by the `create-project` skill (UserInsight type) to create 7 projects and a daily cron job.

## Required Input

- `userId` (string)

## Input Source

Always read:

`users/{userId}/USER.md`

Do not use fallback paths.

## Core Rules

1. Support both subject types: company or person (auto-detect from USER.md content).
2. Generate user-insight topics only.
3. Always output exactly 7 topics, each assigned a unique `scheduled_date`.
4. `scheduled_date` values are 7 consecutive days starting from the current date (the day this skill is invoked). The start day can be any day of the week.
5. Every topic must set `kind` to `"insights"`.
6. The 7 topics must be independent of each other — each covers a different user-insight angle.
7. Output must be strict JSON only (no markdown code fences, no extra prose).
8. The JSON must be **written to file**, not just returned as text output.

## Workflow

### Step 1: Load and Parse USER.md

Read `users/{userId}/USER.md` and extract:

- `subject` name (company name or personal name/identity)
- subject type (`company` or `person`, internal use only)
- product/service or personal business focus
- target users/customers/audience
- business model or monetization context
- key goals, constraints, and open questions

### Step 2: Gather Recent External Signals

Use `web_search` to gather recent information (prefer last 90-180 days):

- Subject recent moves (product, positioning, partnership, channel, narrative)
- Industry and category shifts relevant to target users
- Competitor or substitute behavior changes
- Regulation/platform/environment changes if relevant

For company subjects, prioritize company + product + industry queries.
For person subjects, prioritize role/track + audience + creator/professional ecosystem queries.

### Step 3: Generate 7 User-Insight Topics

Generate 7 distinct, independent topics that focus on user behavior and decisions, not generic strategy.

Each topic must include:

- `scheduled_date`: the date this topic should be executed (`YYYY-MM-DD`), assigned sequentially from today for 7 days
- `title`: concise research topic title
- `content`: direct, execution-ready research prompt text for atypica study creation (in Chinese)
- `rationale`: why this topic matters based on USER.md + recent external signals
- `kind`: always `"insights"`

Coverage should span 7 different user-insight angles, such as:

- decision journey and trigger events
- motivation vs friction
- segmentation by context or role
- value perception and willingness-to-pay logic
- switching behavior and retention dynamics
- trust, risk, and objection patterns
- information sources and influence chain

### Step 4: Write JSON to File

Write the complete JSON to:

`users/{userId}/YYYYMMDD-user-insight.json`

Where `YYYYMMDD` is the `week_start` date (the first topic's `scheduled_date`).

Example: if today is 2026-02-12, the file path is `users/{userId}/20260212-user-insight.json`.

## Output Contract

The JSON written to file must have this exact top-level structure:

```json
{
  "generated_at": "YYYY-MM-DD",
  "subject": "string",
  "week_start": "YYYY-MM-DD",
  "week_end": "YYYY-MM-DD",
  "topics": [
    {
      "scheduled_date": "YYYY-MM-DD",
      "title": "string",
      "content": "string",
      "rationale": "string",
      "kind": "insights"
    }
  ]
}
```

Constraints:

- `topics.length` must be 7
- all `topics[*].kind` must be `"insights"`
- `generated_at` uses current date in `YYYY-MM-DD`
- `week_start` is the current date (same as `generated_at`)
- `week_end` is `week_start` + 6 days
- `topics[0].scheduled_date` == `week_start`, `topics[6].scheduled_date` == `week_end`
- each `scheduled_date` must be unique and consecutive

## Error Handling

If `users/{userId}/USER.md` does not exist or is unreadable, return strict JSON (do not write file):

```json
{
  "error_code": "USER_PROFILE_NOT_FOUND",
  "message": "Cannot read users/{userId}/USER.md",
  "user_id": "string"
}
```

If external signals are limited, still return 7 topics and state in each `rationale` that it is based on limited public signals.

## Quality Checklist

Before writing the output file, validate:

1. strict JSON only
2. top-level keys: `generated_at`, `subject`, `week_start`, `week_end`, `topics`
3. exactly 7 topics
4. all topics are user-insight oriented and independent of each other
5. each topic has `scheduled_date`, `title`, `content`, `rationale`, `kind`
6. each `kind` is `"insights"`
7. `scheduled_date` values are 7 consecutive days starting from `week_start`
8. each `content` is directly reusable as research input (in Chinese)
9. file is written to `users/{userId}/YYYYMMDD-user-insight.json`
