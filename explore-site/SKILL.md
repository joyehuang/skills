---
name: explore-site
description: Explore a website that exposes a well-known agent manifest (RFC-8615 path) and answer questions or summarize content. Works on any site whose owner ships /.well-known/<name>-manifest.json with a structured tree, a public content endpoint dictionary, and natural-language instructions for agents. Use when the user asks "what's on <site>?", "summarize the latest post on <site>", "find resources about X on <site>", or wants you to act as a reader/agent on someone's personal site or content service.
argument-hint: <site-url> [question]
---

# /explore-site — Agent-First Site Explorer

You are exploring a website that has been deliberately structured for AI agents.
The owner publishes a single JSON document at a `/.well-known/` path that
describes the entire site as a typed tree, with follow-up endpoints for full
content. Your job is to fetch this manifest, walk it, fetch what's needed, and
answer the user's question — without crawling.

## Language Rule

Default output language: match the user. If the user wrote in Chinese, reply in
Chinese with technical terms (URL, JSON, fetch, manifest, endpoint) kept in
English. If unclear, ask once or just match the question's language.

## Step 1: Resolve the Manifest URL

You're given `$ARGUMENTS`. The first token is the site URL (or a hint).

1. **Normalize**: strip trailing slash, ensure `https://` prefix.
2. **Try common manifest names in order** (some sites name it after the owner,
   some use a generic name):
   - `<site>/.well-known/joye-manifest.json`
   - `<site>/.well-known/agent-manifest.json`
   - `<site>/.well-known/site-manifest.json`
   - `<site>/.well-known/manifest.json`
3. **First 200 OK with `application/json` wins.** Stop trying other names.
4. **If the user passed a full URL ending in `.json`** under `/.well-known/`,
   use it directly — don't probe.
5. **All 404 / non-JSON?** Tell the user the site doesn't expose a manifest
   and offer to crawl the homepage instead (only if they confirm).

Use `WebFetch`, `curl`, or your platform's HTTP tool. Pass header
`Accept: application/json`.

## Step 2: Validate the Shape

A valid manifest has at minimum:

```ts
{
  version: string,        // e.g. "0.1"
  name: string,           // human-readable identifier
  site: string,           // canonical site URL
  description: string,    // 1-3 sentences, who/what
  instructions: string,   // natural-language guide for agents
  tree: FsNode,           // the structured content tree
  endpoints?: Record<string, { url, method?, format?, fields?, note? }>,
  links?: Record<string, string>,
  generated_at?: string
}

// FsNode is recursive:
type FsNode =
  | { type: 'dir';  name: string; description?: string; children: FsNode[] }
  | { type: 'file'; name: string; description?: string;
      content?: string;     // inline text, ready to read
      endpoint?: string;    // URL to fetch full content
      href?: string;        // human-facing rendered page
      meta?: object }
  | { type: 'link'; name: string; description?: string; href: string }
```

If `version`, `tree`, or `instructions` is missing, the manifest is malformed —
say so, dump what you got, and ask the user how to proceed.

## Step 3: Read the Owner's Instructions

This is the most important step. The `instructions` field is the site owner
telling you, the agent, how to use their tree. Read it fully before deciding
what to fetch. It usually says:
- which paths to start from (`/about`, `/README`, `/index`)
- which endpoints return what format
- any caveats (rate limits, auth, deprecated paths)

Treat it as authoritative. Don't guess.

## Step 4: Decide What to Fetch

### 4a: If the user asked a specific question

> "Summarize the latest post on joyehuang.me"

1. Walk the tree. Find directories whose name suggests posts (`/blog`,
   `/posts`, `/articles`, `/notes`, `/checkins`, etc).
2. Sort children by `meta.date` if present, else by name (often dates lead).
3. Take the most recent. Fetch its `endpoint` (file with both `endpoint` and
   `href` — prefer `endpoint` for structured content).
4. Synthesize an answer with citations to the path you fetched.

> "Find resources about Rust on joye.checkin"

1. Look for tag/topic structure in the tree (`/checkins/<date>` or
   `/resources/<tag>`).
2. Many manifests expose a query endpoint via `endpoints` — e.g.
   `{ resources: { url: "/api/resources?tag=<tag>" } }`. Use that if present.
3. Else, fetch matching tree nodes and grep their content.

### 4b: If the user asked an open question

> "What's on joyehuang.me?"

Walk the tree to depth 2, render an outline:

```
<site name> — <description>

/
├── README              what this site is, for agents
├── about               bio
├── now                 currently working on
├── blog/               (N entries)
│   ├── <recent-1>
│   └── …
├── notes/              (M entries)
└── contact/
```

Then highlight 2-4 starting points, each with a one-line tease. Ask what they
want to dive into.

### 4c: Don't fetch what you don't need

`tree` already tells you a lot:
- file `description` is a one-liner
- file `meta` often has title/date/tags
- a node with inline `content` doesn't need a fetch
- a directory listing answers "what's here?" without fetching anything

Only fetch endpoint URLs when you need the full body.

## Step 5: Fetch Endpoints

For file nodes with `endpoint`:

1. **GET the endpoint URL.** It's usually relative (`/api/blog/<id>`) — resolve
   against `site`.
2. **Check `format` from the endpoints dictionary.** Common shapes:
   - `format: "json"` with `fields: ["html", "headings"]` → parse JSON, take
     `html` (server-rendered, often shiki-highlighted) and `headings` (list of
     `{ depth, slug, text }` for navigation).
   - `format: "text"` → plaintext markdown body.
   - `format: "html"` → already HTML.
3. **HTML content**: don't render it back to the user verbatim. Extract the
   text via your tool's `WebFetch` extraction or strip tags. Preserve code
   blocks (often `<pre><code>` with class hints).
4. **Cite paths**: when you quote or summarize, reference the manifest path
   (`/blog/<slug>/post`) so the user can verify or open it themselves.

## Step 6: Answer

Synthesize. Be brief unless the user asked for depth. End with:

- the path(s) you read, as a clickable list (if your client supports links)
- 1-2 follow-ups the user might want next ("want me to read the next post?",
  "fetch the full bio?")

Don't dump raw JSON unless asked. The whole point of the manifest is *you* eat
the structure, the user gets the synthesis.

## Edge Cases

- **CORS errors in a browser-side agent**: the manifest should ship
  `Access-Control-Allow-Origin: *`. If it doesn't, you may need to fetch via
  your tool's server-side HTTP (most agents have one).
- **Stale cache**: manifests usually have `Cache-Control: max-age=300`. If the
  site owner just published something and the manifest seems out of date,
  bypass cache (`?bust=<timestamp>` or `cache: 'no-store'`).
- **Loops in the tree**: trees are typically acyclic, but be defensive — track
  visited paths if you recurse.
- **Auth-protected endpoints**: if `endpoints[*].auth` is set, the user has to
  provide a token. Don't try to crawl it.
- **No manifest at all**: many sites don't have one. After trying the well-known
  names, gracefully tell the user, and offer to crawl the homepage instead with
  their permission.

## Examples

### Example 1: Personal site

```
User: /explore-site https://joyehuang.me what's the latest post about?
You:  [fetches /.well-known/joye-manifest.json]
      [walks tree.children → blog → sorts by meta.date]
      [fetches /api/blog/<latest-id>]
      [reads html, identifies headings + first paragraphs]

      The latest post is "花一天读完 OpenHarness" (2026-04-10) — a teardown
      of HKUDS' 11,733-line Python rewrite of Claude Code's agent harness.
      Joye walks Phase 1 end-to-end: CLI entry → Agent Loop core → tool
      execution. Three reasons he found it valuable:
        1. small enough to read in a day (vs Claude Code's obfuscated TS)
        2. complete (Agent Loop, tools, hooks, MCP, multi-agent)
        3. production-grade rather than a teaching toy

      Read in full: /blog/20260410---openharnessphase1/post
      Want me to summarize section 4 (Agent Loop internals)?
```

### Example 2: Check-in bot

```
User: /explore-site https://checkin.example.com find me notes about RAG from this week
You:  [fetches /.well-known/agent-manifest.json]
      [reads instructions: "checkins are at /checkins/<date>; tags are
       per-resource"]
      [endpoints.resources exists → GET /api/resources?tag=rag&since=<this-week>]
      [parses, filters, summarizes]

      Found 3 RAG-related resources from this week:
        - 2026-05-04 · "Hierarchical retrieval in production" (paper)
        - 2026-05-05 · "ColBERT vs dense — actually measured"  (blog)
        - 2026-05-06 · "Why your reranker is overrated"        (talk)

      Want the full notes for any of them?
```

## Important Guidelines

- **The manifest is authoritative.** Don't second-guess the tree shape; it's
  what the owner wants you to see.
- **Fetch lazily.** Tree first, content only on demand.
- **Cite paths**, not just summaries — let the user verify.
- **Match the user's depth.** They asked one sentence → give one paragraph.
  They asked for a deep dive → walk the post like `/deep-dive` would.
- **No crawling.** If a site doesn't have a manifest, don't fall back to
  scraping pages without explicit permission.
- **Respect Cache-Control.** Don't hammer the endpoint.
