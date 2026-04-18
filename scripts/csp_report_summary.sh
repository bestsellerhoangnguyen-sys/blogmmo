#!/usr/bin/env bash
set -euo pipefail

OUT_DIR="${1:-/var/www/blogmmo/current/reports}"
mkdir -p "$OUT_DIR"
OUT_FILE="$OUT_DIR/csp-summary-$(date +%F-%H%M%S).txt"

TMP=$(mktemp)
trap 'rm -f "$TMP"' EXIT

pm2 logs blogmmo --lines 5000 --nostream 2>/dev/null | grep '\[CSP-REPORT\]' > "$TMP" || true

{
  echo "CSP Summary generated at: $(date -Iseconds)"
  echo "Source: pm2 logs blogmmo (last 5000 lines)"
  echo

  total=$(wc -l < "$TMP" | tr -d ' ')
  echo "Total report lines: $total"
  echo

  if [ "$total" -eq 0 ]; then
    echo "No CSP report entries found."
    exit 0
  fi

  echo "Top violated-directive"
  grep -o '"violated-directive":"[^"]*"' "$TMP" | sed 's/"violated-directive":"//;s/"$//' | sort | uniq -c | sort -nr | head -n 10
  echo

  echo "Top blocked-uri"
  grep -o '"blocked-uri":"[^"]*"' "$TMP" | sed 's/"blocked-uri":"//;s/"$//' | sort | uniq -c | sort -nr | head -n 15
  echo

  echo "Top source-file"
  grep -o '"source-file":"[^"]*"' "$TMP" | sed 's/"source-file":"//;s/"$//' | sort | uniq -c | sort -nr | head -n 15
  echo

  echo "Recent 10 raw report lines"
  tail -n 10 "$TMP"
} > "$OUT_FILE"

echo "$OUT_FILE"
