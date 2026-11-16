#!/usr/bin/env bash
# TinyFish free Search + Fetch wrapper
# Usage:
#   tinyfish.sh search "query here" [num_results]
#   tinyfish.sh fetch <url> [more urls...]
# Key: ~/.config/tinyfish/key (0600). Free tier: 30 search/min, 150 fetch URLs/min.

set -euo pipefail
KEY_FILE="$HOME/.config/tinyfish/key"
[ -f "$KEY_FILE" ] || { echo "ERROR: no $KEY_FILE" >&2; exit 1; }
KEY=$(cat "$KEY_FILE")
cmd="${1:-}"
shift || true

case "$cmd" in
  search)
    Q="${1:?usage: tinyfish.sh search <query> [num_results]}"
    N="${2:-5}"
    curl -sG "https://api.search.tinyfish.ai/" -H "X-API-Key: $KEY" \
      --data-urlencode "query=$Q" --max-time 30
    ;;
  fetch)
    [ $# -ge 1 ] || { echo "usage: tinyfish.sh fetch <url> [more...]" >&2; exit 1; }
    URLS=$(python3 -c "import json,sys;print(json.dumps({'urls':sys.argv[1:]}))" "$@")
    curl -s -X POST "https://api.fetch.tinyfish.ai/" -H "X-API-Key: $KEY" \
      -H "Content-Type: application/json" -d "$URLS" --max-time 60
    ;;
  *)
    echo "usage: tinyfish.sh search <query> [num_results] | fetch <url> [more...]" >&2
    exit 1
    ;;
esac
