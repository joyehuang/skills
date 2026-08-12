#!/usr/bin/env bash
# Tavily web search — formatted results
set -euo pipefail

KEY_FILE="${TAVILY_KEY_FILE:-$HOME/.config/tavily/key}"
MAX=5
DEPTH="basic"
RAW=0

POS_ARGS=()
while [[ $# -gt 0 ]]; do
  case "$1" in
    --max) MAX="$2"; shift 2 ;;
    --depth) DEPTH="$2"; shift 2 ;;
    --raw) RAW=1; shift ;;
    *) POS_ARGS+=("$1"); shift ;;
  esac
done

QUERY="${POS_ARGS[*]}"
if [[ -z "$QUERY" ]]; then
  echo "usage: search.sh <query> [--max N] [--depth basic|advanced] [--raw]" >&2
  exit 2
fi
if [[ ! -f "$KEY_FILE" ]]; then
  echo "ERROR: no Tavily key at $KEY_FILE" >&2
  echo "Fix: mkdir -p ~/.config/tavily && printf '%s\\n' 'tvly-xxx' > ~/.config/tavily/key && chmod 600 ~/.config/tavily/key" >&2
  exit 1
fi

KEY=$(cat "$KEY_FILE")
BODY=$(python3 -c 'import json,sys; print(json.dumps({"query": sys.argv[1], "search_depth": sys.argv[2], "max_results": int(sys.argv[3]), "include_answer": True}))' "$QUERY" "$DEPTH" "$MAX")

RESP=$(curl -sS --max-time 30 https://api.tavily.com/search \
  -H "Authorization: Bearer $KEY" \
  -H "Content-Type: application/json" \
  -d "$BODY")

if [[ $RAW -eq 1 ]]; then
  printf '%s\n' "$RESP"
  exit 0
fi

python3 - "$RESP" <<'PY'
import json, sys
try:
    d = json.loads(sys.argv[1])
except Exception as e:
    print("parse error:", e)
    print(sys.argv[1][:500])
    sys.exit(1)
if "error" in d and isinstance(d["error"], dict):
    print("API error:", d["error"].get("message", d["error"]))
    sys.exit(1)
if d.get("answer"):
    print("ANSWER:", d["answer"], "\n")
for i, r in enumerate(d.get("results", []), 1):
    print(f"{i}. {r.get('title', '')}")
    print(f"   {r.get('url', '')}")
    print(f"   {r.get('content', '')[:300]}")
    print()
PY
