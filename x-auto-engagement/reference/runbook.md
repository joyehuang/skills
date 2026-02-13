# Runbook

## Scope

Standard operating procedures for the X auto-engagement workflow. All commands assume you are in the openclaw workspace root (`~/.openclaw/`).

Replace `{name}` with the actual agent/user name throughout.

## First-Time Setup

### 1. Create agent (if needed)

```bash
openclaw agents add {name}
```

### 2. Install Python dependencies

```bash
pip install -r .openclaw/skills/x-auto-engagement/scripts/requirements.txt
```

### 3. Set up .env

```bash
cp .openclaw/skills/x-auto-engagement/reference/env-example.txt users/{name}/.env
```

Edit `users/{name}/.env` and fill in:
- `X_CONSUMER_KEY`, `X_CONSUMER_SECRET` - from X Developer Portal app
- `X_ACCESS_TOKEN`, `X_ACCESS_TOKEN_SECRET` - from X Developer Portal app
- `X_USER_ID` - your numeric X user ID

### 4. Set up persona profile

```bash
cp .openclaw/skills/x-auto-engagement/templates/X-PROFILE.md users/{name}/X-PROFILE.md
```

Edit `users/{name}/X-PROFILE.md` to define the persona:
- Who the account is (bio, background)
- Areas of expertise
- Communication tone and style
- Topics to engage with and avoid
- Comment guidelines and examples

## Running the Workflow

### Manual test via openclaw

```bash
openclaw agent --agent {name} --message "Use x-auto-engagement skill. Follow SKILL.md workflow steps 1-6 exactly. Read X-PROFILE.md, fetch timeline, select relevant tweets, generate comments, publish, and save the report to output/."
```

### Testing individual scripts

Test timeline fetch (confirms OAuth works):

```bash
python3 .openclaw/skills/x-auto-engagement/scripts/fetch_timeline.py \
  --env users/{name}/.env
```

Save output for inspection:

```bash
python3 .openclaw/skills/x-auto-engagement/scripts/fetch_timeline.py \
  --env users/{name}/.env > /tmp/xae-timeline.json
```

Test publish with a prepared comments file:

```bash
python3 .openclaw/skills/x-auto-engagement/scripts/publish.py \
  --comments /tmp/xae-comments.json \
  --env users/{name}/.env
```

### Script options

fetch_timeline.py:
- `--env <path>` (required) - path to .env file
- `--count <n>` (default: 50) - raw tweets to fetch from API
- `--lang <code>` (default: en) - language filter
- `--min-likes <n>` (default: 5) - minimum likes threshold

publish.py:
- `--comments <path>` (required) - path to comments JSON file
- `--env <path>` (required) - path to .env file
- `--max <n>` (default: 10) - max comments per batch
- `--min-delay <s>` (default: 30) - min seconds between posts
- `--max-delay <s>` (default: 120) - max seconds between posts

## Cron Job Setup

Create the cron job for automated execution:

```bash
openclaw cron add \
  --name "X-Auto-Engagement-{name}" \
  --cron "0 9,14,21 * * *" \
  --session isolated \
  --message "Use x-auto-engagement skill. Follow SKILL.md workflow steps 1-6 exactly. Read X-PROFILE.md, fetch timeline, select relevant tweets, generate comments, publish, and save the report to output/."
```

Or manually run an existing job:

```bash
openclaw cron list
openclaw cron run <job-id>
openclaw cron runs --id <job-id>
```

## Verify Results

Check the latest report:

```bash
ls -1t output/engagement-*.json | head -n 1
```

Key fields in the report:
- `total` - how many comments were attempted
- `success_count` - successfully published
- `failure_count` - failed to publish
- `results[].status` - per-item status (published or failed)
- `results[].error` - error message for failed items

## Tuning Guide

### Too few tweets passing filters

- Lower min-likes: `--min-likes 1`
- Fetch more raw tweets: `--count 100`
- These are script-level overrides; to change permanently, edit the DEFAULTS in `fetch_timeline.py`

### Comments feel generic or off-brand

- Add more example comments to X-PROFILE.md (5+ recommended)
- Make comment guidelines more specific with concrete dos and donts
- Sharpen the tone description with examples of phrases the persona would or would not use
- Improve the topics of interest section to be more specific

### Too many API rate limit errors

- Increase delays: `--min-delay 60 --max-delay 180`
- Reduce batch size: `--max 5`
- Reduce cron frequency (e.g., 2x daily instead of 3x)
