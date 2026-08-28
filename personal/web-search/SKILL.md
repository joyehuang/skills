---
name: web-search
description: Web search and page fetching. Four engines — TinyFish (free default: precise/fresh/Chinese search + page fetch), Tavily (fallback keyword/time-sensitive), Exa (semantic + person/entity graphs via MCP), Parallel (broad multi-source aggregation). Use whenever the user asks to search the web, look up current information, news, facts, find a URL, verify something online, or needs results from a search engine. Also covers fetching and extracting readable text from a specific page.
---

# Engine routing (decide first, then pick the tool)

**默认层是 TinyFish（免费），不要一上来就烧 Tavily credits。** 按任务类型选引擎：

| Task type | Primary engine | Why | Fallback / cross-check |
|---|---|---|---|
| **精确检索（默认首选）— 实体/报错/产品/新闻关键词** | **TinyFish** (`scripts/tinyfish.sh search`) | 免费（30次/分）、延迟 ~1.5s、中文 5/5、结果全结构化（2026-08-29 两轮实测：免费版≈90% Tavily，幻觉零） | Tavily（结果可疑/为空时兜底） |
| **Fetch 网页内容（X 推文/普通页/文档）** | **TinyFish** (`scripts/tinyfish.sh fetch`) | 实测能抓 X 推文全文（替代大部分 ego-browser 场景）、干净 markdown | Exa `web_fetch_exa` / curl / ego-browser（小红书、登录门、需交互的页） |
| **时效新闻 / 多源综述** | **Parallel** (`web_search`, parallel-search MCP) | dates + 官方源，多 query 聚合 | TinyFish / Tavily |
| **语义/模糊回忆/人物图谱** | **Exa** (`web_search_exa`, exa MCP) | 语义匹配 + 人物/技术链递得最深（多跳实测 T2/T5 最强） | TinyFish；⚠️ Exa 中文复杂题会空手 |
| **语义/模糊回忆类兜底** | **Tavily** (`search.sh`) | 关键词精确度兜底 | — |
| **Code repo internal docs / non-default-branch files** | **GitHub API / raw / code search directly** — do NOT use web search engines | Web search engines cannot index non-default branches or repo-internal paths (实测教训 2026-08-23) | — |

**TinyFish 特有防线**：无结果时会硬凑结果（如填 YouTube）——拿到结果后做相关性复核，可疑就换 Tavily。用量已接监控（每晚 Telegram 日报）。

**用量日志（每晚 websearch-daily 日报的数据源）**：`scripts/tinyfish.sh` 和 `scripts/search.sh` 已自动记录。Exa / Parallel 走 MCP 无法自动记录——**每次调 `web_search_exa` / `web_fetch_exa` / `web_search`(parallel) 后**，顺手执行一行：
```bash
echo "$(date '+%Y-%m-%d %H:%M:%S'),exa,search" >> ~/.config/websearch-usage/usage.log   # parallel 则把 exa 换成 parallel
```

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
