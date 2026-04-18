#!/usr/bin/env bash
set -euo pipefail

REPORT_DIR="${1:-/var/www/blogmmo/current/reports}"
OUT_FILE="${2:-$REPORT_DIR/csp-trend-latest.md}"

mkdir -p "$REPORT_DIR"

latest_files=$(ls -1t "$REPORT_DIR"/csp-summary-*.txt 2>/dev/null | head -n 10 || true)

{
  echo "# CSP Trend Report"
  echo
  echo "Generated: $(date -Iseconds)"
  echo

  if [ -z "$latest_files" ]; then
    echo "No csp-summary files found in $REPORT_DIR"
    exit 0
  fi

  echo "## Files analyzed"
  echo
  for f in $latest_files; do
    echo "- $(basename "$f")"
  done
  echo

  echo "## Total report lines per snapshot"
  echo
  for f in $latest_files; do
    total=$(grep -E '^Total report lines:' "$f" | awk -F': ' '{print $2}' | tr -d ' ')
    echo "- $(basename "$f"): ${total:-0}"
  done
  echo

  tmp=$(mktemp)
  trap 'rm -f "$tmp"' EXIT

  for f in $latest_files; do
    # collect violated-directive lines from each summary file
    awk '/^Top violated-directive/{flag=1;next}/^$/{if(flag){exit}}flag' "$f" >> "$tmp" || true
  done

  echo "## Aggregated top violated-directive (from summaries)"
  echo
  if [ -s "$tmp" ]; then
    awk '{print $2}' "$tmp" | sort | uniq -c | sort -nr | head -n 10 | sed 's/^/- /'
  else
    echo "- no directive data found"
  fi
  echo

  echo "## Recommendation"
  echo
  echo "- Keep CSP strict policy in Report-Only until at least 2-3 daily snapshots are available."
  echo "- Prioritize reducing persistent 'inline' reports on high-traffic pages (/ /blog /guides)."
} > "$OUT_FILE"

echo "$OUT_FILE"
