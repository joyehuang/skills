---
name: web-search
description: Web search and page fetching via the Tavily API. Use whenever the user asks to search the web, look up current information, news, facts, find a URL, verify something online, or needs results from a search engine. Also covers fetching and extracting readable text from a specific page.
---

# Web Search (Tavily)

Search the web with the Tavily API. The API key lives in `~/.config/tavily/key` (plain text, no trailing newline needed).

## Setup (one-time)

If the key file is missing, tell the user to run:

```bash
mkdir -p ~/.config/tavily && printf '%s\n' 'tvly-xxxx' > ~/.config/tavily/key && chmod 600 ~/.config/tavily/key
```

or have them paste the key to you and you store it that way yourself. Never echo the key into logs or chat unless asked.

## Search

```bash
bash ~/.agents/skills/web-search/scripts/search.sh "query here" [--max 5] [--depth basic|advanced] [--raw]
```

- `--max N` — max results (default 5)
- `--depth basic|advanced` — search depth (default basic)
- `--raw` — print the raw JSON instead of the formatted summary

The script prints the AI answer (if any), then numbered results with title, URL, and content snippet.

## Fetch a specific page

When search results are not enough and you know a URL, fetch the page directly:

```bash
curl -sL --max-time 20 -A "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36" <url>
```

Strip HTML with `python3 -c 'import sys,re,html; t=sys.stdin.read(); t=re.sub(r"<script.*?</script>|<style.*?</style>","",t,flags=re.S); t=re.sub(r"<[^>]+>"," ",t); print(html.unescape(re.sub(r"\s+"," ",t))[:3000])'`.

For GitHub repos specifically, prefer the API: `https://api.github.com/repos/<owner>/<repo>` and `https://raw.githubusercontent.com/<owner>/<repo>/main/README.md`.

## Notes

- Tavily free tier is ~1000 searches/month.
- If the search returns an auth error, the key is wrong or expired — tell the user to check `~/.config/tavily/key` or get a new key from https://app.tavily.com.
- Timeouts and network failures: retry once, then report the failure honestly.
