---
name: publish-artifact
description: The user's standard artifact pipeline — every report or output file becomes a styled HTML page, uploaded to Cloudflare R2, and delivered as a directly clickable https link (never raw file paths, never md attachments). Use for reports, research writeups, session exports, screenshots, and any shareable output. HTML is the default format; Markdown is converted automatically.
---

# Publish Artifact (report → HTML → R2 → link)

The user's fixed convention: **reports/artifacts default to HTML and are delivered as clickable links**. Use this pipeline for every output worth sharing.

## Pipeline (one command)

```bash
bash ~/.agents/skills/publish-artifact/scripts/report.sh <file> [remote-key] [--title "T"]
```

- `.md` / `.txt` → auto-converted to a styled standalone HTML (marked, bundled in the skill)
- `.html` → uploaded as-is
- other files (png/pdf/zip…) → uploaded as artifacts
- Prints the public https link; reply to the user with a **clickable link**, e.g. `[报告标题](https://pub-xxx.r2.dev/...)` — in Telegram use Markdown link syntax so it's tappable.

## HTML-first rules (user preference)

- Generate reports as **HTML by default**, not Markdown — easier to share.
- Chat/session export to HTML: `pi --export <session-file> <out.html>` (sessions are JSONL under `~/.pi/agent/sessions/`), then upload via report.sh.
- Always keep a local copy (`~/artifacts/YYYY-MM-DD/` or next to the source) before/after uploading.

## Setup (done)

- Credentials: `~/.config/r2-upload/env` (0600): R2_ACCOUNT_ID / R2_ACCESS_KEY_ID / R2_SECRET_ACCESS_KEY / R2_BUCKET / R2_PUBLIC_BASE
- rclone installed; auth via env vars (no conf file needed)
- Converters: `scripts/convert-md.js` (marked bundled), `scripts/publish.sh` (upload+link), `scripts/report.sh` (one-shot pipeline)

## Troubleshooting

- Browse the bucket anytime (standard rclone conf at `~/.config/rclone/rclone.conf`, works in any shell):
  - `rclone lsf r2:joye-agent` — list files (recursive: `lsf --recursive` or `lsl`)
  - `rclone size r2:joye-agent` — total size
  - `rclone delete r2:joye-agent/<path>` — delete
  - `rclone copy <local> r2:joye-agent/<path>` — upload
  - `rclone copy r2:joye-agent/<path> <local>` — download
- "Credential access key has length 53" → the value is a Cloudflare API token, not an R2 S3 access key; get the 32-char key from R2 → Manage R2 API Tokens.
- Link 403s → bucket has no Public access enabled (Settings → Public access → Public bucket, or bind a custom domain).
- Never print secrets; read only from the env file.
