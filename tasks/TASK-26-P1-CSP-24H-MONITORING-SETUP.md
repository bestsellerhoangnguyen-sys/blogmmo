# TASK-26 — P1 CSP monitoring setup

## Objective
Set up recurring CSP report aggregation to support 24h analysis before stricter enforcement.

## Implemented
- Added script: `scripts/csp_report_summary.sh`
  - Reads recent PM2 logs (`[CSP-REPORT]` lines)
  - Produces summary with:
    - total report count
    - top violated directives
    - top blocked URIs
    - top source files
    - recent raw examples

## Deployment plan
1. Copy script to VPS
2. Create output directory `/var/www/blogmmo/current/reports`
3. Run script immediately to generate baseline snapshot
4. Add cron daily aggregation job

## Expected output
- Report files under `/var/www/blogmmo/current/reports/csp-summary-*.txt`
- Operator can review trends before switching CSP enforcement mode.
