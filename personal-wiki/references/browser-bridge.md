# Agent browser bridge

Use this only after the repository resolver has created a blocked Claude or ChatGPT Capture and the current Agent has a supported browser capability.

## Safety boundary

- Open only the Capture’s canonical Claude or ChatGPT share URL.
- Do not inspect cookies, local storage, passwords, profiles, history, unrelated tabs, sidebars, or account data.
- Do not use `body.innerText`, raw page HTML, or embedded application state as the conversation body.
- Do not solve or bypass a CAPTCHA. If interactive verification requires the user, follow the browser environment’s confirmation rules.
- Keep private message text in memory or ignored `.cache/ingestion/` storage; do not print it into logs or the final report.

## Extraction

1. Select the browser according to the current Agent’s browser-control rules.
2. Navigate to the exact Capture locator and wait for rendered message nodes.
3. Load this module from the selected Wiki checkout:

```text
scripts/lib/ingestion/browser-page-extractor.mjs
```

4. Import `extractConversationPage` into the Agent runtime.
5. Evaluate that function in the share page with:

```js
{ provider: "claude" }
```

or:

```js
{ provider: "chatgpt" }
```

The function is self-contained and repository-owned. It extracts provider message nodes, message IDs, raw time evidence, observed turn range, hidden attachments, and provider-object timestamps while excluding navigation and UI noise.

6. Check only structural diagnostics before submission:
   - provider matches the Capture;
   - message count is non-zero;
   - roles and sequence are plausible;
   - completeness and warnings reflect hidden attachments or missing turns.

Do not rewrite message bodies in the Skill.

## Resolve the existing Capture

Serialize the extraction as JSON and pass it to:

```bash
npm run ingest -- resolve "capture_<uuidv7>" --browser-extraction-stdin --json
```

The repository converts the extraction into a validated Snapshot, redacts credential-bearing URLs, computes content identity, deduplicates the provider revision, writes Source Markdown, and transitions the existing Capture.

If the bridge is rejected, leave the Capture blocked and report the validation error. Do not weaken selectors or switch to whole-page text as a fallback.
