# Repository commands

Run commands from the selected Personal Wiki root. Read that checkout’s `AGENTS.md` first; repository documentation is authoritative if these examples drift.

## Inspect

```bash
npm run ingest -- status --json
```

Use read-only status for progress questions. Do not create a commit merely for inspection.

## Add a source

URL or local Markdown file:

```bash
npm run ingest -- add "<url-or-path>" --json
```

Pasted Markdown:

```bash
npm run ingest -- add --stdin --title "<optional-title>" --json
```

Use the execution environment’s stdin facility. Do not interpolate private Markdown into a shell command.

Create the Capture without attempting resolution:

```bash
npm run ingest -- add "<url-or-path>" --no-resolve --json
```

## Resume

Retry pending work:

```bash
npm run ingest -- resume --json
```

Retry pending and blocked work after capabilities change:

```bash
npm run ingest -- resume --blocked --json
```

Retry one Capture:

```bash
npm run ingest -- resolve "capture_<uuidv7>" --json
```

## Browser extraction bridge

Submit repository-extracted browser data through stdin:

```bash
npm run ingest -- resolve "capture_<uuidv7>" --browser-extraction-stdin --json
```

When stdin is impractical, write the extraction only under the ignored `.cache/ingestion/` boundary and use:

```bash
npm run ingest -- resolve "capture_<uuidv7>" --browser-extraction-file ".cache/ingestion/<capture-id>.json" --json
```

Do not commit extraction JSON. The CLI validates it, renders the Source, and updates the existing Capture.

The lower-level `--snapshot-stdin` and `--snapshot-file` bridge accepts a complete repository Snapshot. Prefer browser extraction input when the Agent used the repository’s page extractor.

## Opt-in live smoke

This checks a share resolver without writing Capture or Source content:

```bash
npm run ingest:smoke -- "<claude-or-chatgpt-share-url>"
```

It reports metadata, counts, completeness, warnings, and hash only. It is diagnostic, not a substitute for Capture-first import.

## Result handling

CLI JSON returns:

- `resolved`: Source exists or was idempotently reused;
- `blocked`: Capture persists with a reason and required capabilities;
- `pending`: Capture exists but resolution was intentionally skipped.

Exit code `2` represents a recoverable blocked result. Do not report it as data loss.
