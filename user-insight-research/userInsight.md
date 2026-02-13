# Prerequisite
- A `*-user-insight.json` file must already exist in the agent's workspace root (produced by the `user-insight-research` skill in a prior step).
- If no such file exists, abort and inform the user to run the `user-insight-research` skill first.

# Project Creation (One-Time Setup)
This is NOT a cron job. These steps run once when `create-project` is invoked.

1. Read the latest `*-user-insight.json` from the workspace root (pick by most recent filename date).
2. For each of the 7 topics in the JSON, create a project directory:
   - Project ID format: `YYYY-MM-DD-{title}-UserInsight` (YYYY-MM-DD from the topic's `scheduled_date`, `{title}` directly from the topic's `title` field)
   - Create the directory: `projects/{projectId}/`
   - Create subdirectory: `projects/{projectId}/signals/`
3. Generate an **enriched schedule JSON** by copying the original JSON and adding a `projectId` field to each topic. Save it to:
   - `YYYYMMDD-user-insight-schedule.json` (YYYYMMDD = `week_start` date)
4. **Immediately execute Day 1**: After setup is complete, trigger the first topic's research right away (the topic whose `scheduled_date` matches today). Follow the same execution flow as the Daily Execution cron job below. The daily cron job will handle Day 2 through Day 7.

Enriched schedule JSON format:
```json
{
  "generated_at": "YYYY-MM-DD",
  "subject": "string",
  "week_start": "YYYY-MM-DD",
  "week_end": "YYYY-MM-DD",
  "topics": [
    {
      "scheduled_date": "YYYY-MM-DD",
      "projectId": "YYYY-MM-DD-{title}-UserInsight",
      "title": "string",
      "content": "string",
      "rationale": "string",
      "kind": "insights"
    }
  ]
}
```

# Daily Execution (Atypica Research)
- Create **1 shared cronJob** that has 1 hour timeout (remember to enable), that uses atypica-research skill to run the research for today's scheduled topic.
- When: Every day (cron: `0 10 * * *`). For testing, can be set to every 1 minute (`*/1 * * * *`).

**CRITICAL**: When creating the cronJob, copy the following message template EXACTLY into the cronJob message. Replace {} placeholders with actual values dependent on project details. Can edit, but DO NOT summarize, paraphrase, or omit any part.

```
Use atypica-research skill to run today's scheduled user insight research.

Execution requirements:
1. Read the enriched schedule JSON from `YYYYMMDD-user-insight-schedule.json` in the workspace root (pick the most recent by filename date). Parse the JSON and find the topic whose `scheduled_date` matches today's date (YYYY-MM-DD). If no topic matches today's date, skip execution and record a skip message to the agent's messages/ directory, then exit.
2. Use the matched topic's `content` field as the research prompt to create a new research in Chinese via atypica_study_create. The research kind is insights. The corresponding project is identified by the topic's `projectId` field.
3. You can find ATYPICA_API_KEY in USER.md
4. Follow the atypica-research skill instructions strictly
5. Poll every 60 seconds using: sleep 60 && call atypica_study_get_messages
6. Use `tail` parameter to prevent message explosion: call atypica_study_get_messages with `{userChatToken: "<TOKEN>", tail: 1}` (start with 1, increase if more context needed, but never exceed 3)
7. Complete necessary interactions and confirm/fix the plan provided by Atypica.
8. After plan confirmation, increase poll interval to 5 minutes
9. Check only `isRunning` status and latest tool states from returned messages
10. You are not allowed to create subagent in this cronjob.
11. Retry logic: if atypica_study_create fails or returns an error, wait 5 minutes (sleep 300), then retry once. If the retry also fails, skip this topic and record the failure.

Output requirements:
- Each output (replay URL, etc.) must be recorded in a separate file under the matched project: `projects/{projectId}/messages/YYYYMMDD-HHMMSS.md` (use current timestamp as filename)
- Output format:
'''
---
time: YYYYMMDD-HHMMSS
projectId: {projectId}
title: Atypica Research Complete - [Research Title from Topic]
description: [Brief description, max 200 chars]
url: https://atypica.ai/study/<RESEARCH_TOKEN>/share?replay=1
---
[Any additional content: exceptions, troubleshooting, long markdown output, etc.]
'''
- If skipped (no matching date or retry exhausted), record a skip/failure message:
'''
---
time: YYYYMMDD-HHMMSS
projectId: {projectId or "N/A"}
title: Daily Research Skipped - [Reason]
description: [Brief description of why today's topic was skipped, max 200 chars]
---
[Error details, retry logs, etc.]
'''
Continue polling until research is complete, then save the replay URL to the message file following the format above.
```
