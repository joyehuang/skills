---
name: x-auto-engagement
description: Automatically engage with X (Twitter) home timeline by liking and replying to relevant tweets. The agent reads a persona profile (X-PROFILE.md), fetches timeline via script, filters tweets by relevance, generates comments directly, and publishes via script. Designed to run as a scheduled cron job (3x daily). Use when the user asks to set up X auto-engagement, configure a commenter persona, run timeline engagement, or troubleshoot engagement failures.
---

# X Auto Engagement

## Overview

This skill automates X (Twitter) timeline engagement. The agent itself is the brain: it reads a persona profile, judges tweet relevance, and generates comments. Python scripts handle X API I/O (fetching timeline, posting likes and replies).

Each openclaw agent corresponds to one X account. Per-user config lives in the agent workspace root:
- `X-PROFILE.md` - persona background knowledge
- `.env` - X API OAuth 1.0a credentials

## Prerequisites

1. A `.env` file in the workspace root with OAuth 1.0a credentials. See `reference/env-example.txt`.
2. An `X-PROFILE.md` file in the workspace root with persona info. See `templates/X-PROFILE.md`.
3. Python dependencies installed: `pip install -r .openclaw/skills/x-auto-engagement/scripts/requirements.txt`

## Workflow

Execute these steps in order. Do not skip any step.

### Step 1: Read Persona Profile

Read `X-PROFILE.md` from the workspace root. This file defines who you are on X: your expertise, tone, topics of interest, comment guidelines, and example comments.

Internalize the persona. All subsequent filtering and comment generation must reflect this profile.

If the file does not exist, stop and report the error.

### Step 2: Fetch Timeline

Run the fetch script:

```bash
python3 .openclaw/skills/x-auto-engagement/scripts/fetch_timeline.py --env .env
```

The script outputs JSON to stdout:

```json
{
  "fetched": 50,
  "passed": 25,
  "skipped_count": 25,
  "skipped_reasons": [{"tweet_id": "...", "reason": "..."}],
  "tweets": [{"tweet_id": "...", "text": "...", "author_username": "...", ...}]
}
```

If `tweets` is empty (all filtered out), write a skip report to `output/` and stop.

### Step 3: Select Relevant Tweets

Review the fetched tweets against your persona profile. For each tweet, decide whether it is worth engaging with.

Selection criteria:
- The tweet topic overlaps with your expertise or topics of interest
- The tweet invites discussion (not just a link dump or promotion)
- The tweet author is someone worth engaging with
- The tweet does NOT touch on your avoid_topics

Select at most 10 tweets. Prefer quality over quantity.

### Step 4: Generate Comments

For each selected tweet, generate a reply comment. You are the LLM. Write the comment directly based on your persona profile.

Rules:
- Each comment must be a direct reply, written as if posting on X
- Keep comments under 280 characters
- Follow the tone, style, and guidelines from X-PROFILE.md
- Match the quality of the example comments in your profile
- Be genuine and add value. No generic responses
- Write in English only
- Do not use hashtags unless the original tweet uses them
- Do not @ mention the author

### Step 5: Save Comments and Publish

Save the generated comments as a JSON file:

```json
[
  {"tweet_id": "123456", "generated_comment": "Your reply text here"},
  {"tweet_id": "789012", "generated_comment": "Another reply here"}
]
```

Save this to a temporary file (e.g., `/tmp/xae-comments.json`), then run:

```bash
python3 .openclaw/skills/x-auto-engagement/scripts/publish.py --comments /tmp/xae-comments.json --env .env
```

The script will like each tweet then reply, with random delays (30-120s) between posts.

### Step 6: Save Report

Save the publish report output to:

```
output/engagement-{YYYY-MM-DDTHH-MM-SS}Z.json
```

Create the `output/` directory if it does not exist.

## Safety Rules

- NEVER publish more than 10 comments in a single run.
- NEVER skip the filtering step.
- If fetch returns 0 eligible tweets, exit gracefully with a skip report.
- If publish partially fails, still save the report. Do not retry failed items in the same run.

## Cron Job Setup

Create a cron job for automated execution (3x daily):

```json
{
  "name": "X-Auto-Engagement",
  "schedule": "0 9,14,21 * * *",
  "sessionTarget": "isolated",
  "payload": {
    "kind": "agentTurn",
    "message": "Use x-auto-engagement skill. Follow SKILL.md workflow steps 1-6 exactly. Read X-PROFILE.md, fetch timeline, select relevant tweets, generate comments, publish, and save the report to output/.",
    "model": "ppio/pa/gemini-3-flash-preview",
    "timeoutSeconds": 600
  }
}
```

Adjust schedule times as needed. The model uses gemini-3-flash from the openclaw provider config.

## First-Time Setup

To set up a new X engagement agent:

1. Create the agent (if not exists): `openclaw agents add <name>`
2. Copy the .env template to the workspace: `cp .openclaw/skills/x-auto-engagement/reference/env-example.txt users/<name>/.env`
3. Fill in the OAuth 1.0a credentials and X_USER_ID in `.env`
4. Copy the profile template: `cp .openclaw/skills/x-auto-engagement/templates/X-PROFILE.md users/<name>/X-PROFILE.md`
5. Edit `X-PROFILE.md` to match the desired persona
6. Install dependencies: `pip install -r .openclaw/skills/x-auto-engagement/scripts/requirements.txt`
7. Test manually: `openclaw agent --agent <name> --message "Use x-auto-engagement skill. Run steps 1-6."`
8. Create cron job when satisfied with results

## References

- Standard operations: `reference/runbook.md`
- Failure diagnosis: `reference/troubleshooting.md`
- Environment template: `reference/env-example.txt`
- Profile template: `templates/X-PROFILE.md`
