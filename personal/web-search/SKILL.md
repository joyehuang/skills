---
name: web-search
description: Web search and page fetching. Three engines — Tavily (keyword/time-sensitive), Exa (semantic + deep page content via MCP), and Parallel (broad multi-source aggregation with dates). Use whenever the user asks to search the web, look up current information, news, facts, find a URL, verify something online, or needs results from a search engine. Also covers fetching and extracting readable text from a specific page.
---

# Engine routing (decide first, then pick the tool)

**Do not default to Tavily.** Pick the primary engine by task type, then use the fallback for cross-check.

| Task type | Primary engine | Why | Fallback / cross-check |
|---|---|---|---|
| **Latest news / recent events / "what's new"** | **Parallel** (`web_search`, parallel-search MCP) | Returns publish dates + official sources; best freshness (实测 2026-08) | Tavily (also time-sensitive, but may surface older posts without dates — always check the date) |
| **Semantic retrieval — fuzzy memory, "something like X", concept explainer** | **Exa** (`web_search_exa`, exa MCP) | Semantic matching + full-page highlights, deepest content (实测 returns full article body) | Tavily keyword search |
| **Broad synthesis / multiple viewpoints / survey** | **Parallel** (`web_search` with multiple `search_queries`) | Multi-source aggregation in one call; good for "综述/多观点" | Exa |
| **Precise origin-locating — "find THE article/post that said X"** | **Tavily** (`search.sh`) + **GitHub API/code search** when repo docs suspected | Keyword precision | Exa semantic for fuzzy recall of the same origin |
| **Known URL → fetch content** | **Exa `web_fetch_exa`** | Clean markdown, full page | Tavily extract / curl fallback |
| **Code repo internal docs / non-default-branch files** | **GitHub API / raw / code search directly** — do NOT use web search engines | Web search engines cannot index non-default branches or repo-internal paths (实测教训 2026-08-23) | — |

## Hard rules (from the 2026-08-23 search-lessons post-mortem)

1. **Time-stamp gate**: task mentions "最新/近期" → check every candidate's publish date against current date. Window >3 months = flag as risk, do not silently accept. (Tavily is the worst offender for surfacing old posts.)
2. **Constraint checklist**: before searching, break the user's request into a constraint table (时间范围 / 对象范围 / 来源类型 / 语气). After finding a candidate, check EVERY constraint. Any unmet constraint ⇒ report as "疑似，XX未满足", never "找到了".
3. **Source-type matrix**: enumerate source types up front — 个人博客 / 公司官方博客 / changelog / GitHub 仓库文档(含非默认分支) / PR-RFC 讨论 / 社群帖子 (HN/Reddit/X). Don't creep one type at a time.
4. **Confidence grading**: output results as 确定 (all constraints verified) / 疑似 (some unverified) / 未找到. Never package "疑似" as a conclusion.
5. **Correction loop**: when the user corrects you, first restate the requirement ("是我理解错需求还是来源选错?") — don't dig deeper in the same direction.
6. **Multi-engine convergence**: run 2 engines independently; if both converge on the same origin, weight it high. If they disagree, the keyword/requirement understanding is off — redo the constraint table before more searching.
7. **Ask vs keep searching**: ask the user when two independent strategies both fail, or when a candidate conflicts with a hard constraint and no better candidate exists.

# Web Search (Tavily)

Search the web with the Tavily API. Keys are **rotated automatically**: `~/.config/tavily/rotate.sh` picks the key with the most remaining credits from `~/.config/tavily/keys/key-*`, and `search.sh` falls back to the next key on auth/rate errors. (Currently 2 keys × 1000 credits/mo.)

## Setup (one-time)

Key files:
- `~/.config/tavily/keys/key-agent` — agent@joyehuang.dev account (Researcher)
- `~/.config/tavily/keys/key-user` — Joye's personal account (Researcher)
- `~/.config/tavily/key` — legacy single-key path (fallback)

```bash
mkdir -p ~/.config/tavily/keys && printf '%s\n' 'tvly-xxx' > ~/.config/tavily/keys/key-NAME && chmod 600 ~/.config/tavily/keys/key-NAME
```

Never echo keys into logs or chat unless asked. Check usage with `~/.config/tavily/rotate.sh --status`.

## Search

```bash
bash ~/.agents/skills/web-search/scripts/search.sh "query here" [--max 5] [--depth basic|advanced] [--raw]
```

- `--max N` — max results (default 5)
- `--depth basic|advanced` — search depth (default basic)
- `--raw` — print the raw JSON instead of the formatted summary
- Env `TAVILY_KEY_FILE` — force a specific key file (bypass rotation)

The script prints the AI answer (if any), then numbered results with title, URL, and content snippet.

## Fetch a specific page

When search results are not enough and you know a URL, prefer `web_fetch_exa` (MCP, exa server) for clean markdown. Fallback:

```bash
curl -sL --max-time 20 -A "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36" <url>
```

Strip HTML with `python3 -c 'import sys,re,html; t=sys.stdin.read(); t=re.sub(r"<script.*?</script>|<style.*?</style>","",t,flags=re.S); t=re.sub(r"<[^>]+>"," ",t); print(html.unescape(re.sub(r"\s+"," ",t))[:3000])'`.

For GitHub repos specifically, prefer the API: `https://api.github.com/repos/<owner>/<repo>` and `https://raw.githubusercontent.com/<owner>/<repo>/main/README.md`.

## Notes

- Tavily free tier is ~1000 credits/month per key (2 keys → ~2000/mo).
- If the search returns an auth error and no fallback key works, tell the user to check `~/.config/tavily/keys/` or get a new key from https://app.tavily.com.
- Timeouts and network failures: retry once, then report the failure honestly.
