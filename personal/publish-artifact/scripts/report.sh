#!/usr/bin/env bash
# report.sh — one-shot pipeline: file → (md→html) → R2 upload → print clickable link
# Usage:
#   report.sh <file.md> [remote-key]          # convert md → html, upload
#   report.sh <file.html> [remote-key]        # upload as-is
#   report.sh --title "T" <file.md> [remote-key]
set -euo pipefail
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

TITLE=""
ARGS=()
while [[ $# -gt 0 ]]; do
  case "$1" in
    --title) TITLE="$2"; shift 2 ;;
    *) ARGS+=("$1"); shift ;;
  esac
done

SRC="${ARGS[0]:?usage: report.sh <file> [remote-key]}"
KEY="${ARGS[1]:-}"
[ -f "$SRC" ] || { echo "ERROR: not a file: $SRC" >&2; exit 1; }

EXT="${SRC##*.}"
case "$EXT" in
  md|markdown|txt)
    STEM="$(basename "${SRC%.*}")"
    HTML="/tmp/report-${STEM}-$$.html"
    node "$DIR/convert-md.js" "$SRC" "$HTML" "$TITLE" || { echo "ERROR: conversion failed" >&2; exit 1; }
    SRC="$HTML"
    [ -z "$KEY" ] && KEY="reports/${STEM}.html"
    ;;
  html|htm)
    [ -z "$KEY" ] && KEY="reports/$(basename "$SRC")"
    ;;
  *)
    [ -z "$KEY" ] && KEY="artifacts/$(basename "$SRC")"
    ;;
esac

LINK=$("$DIR/publish.sh" "$SRC" "$KEY")
rm -f "$HTML"
echo "$LINK"
