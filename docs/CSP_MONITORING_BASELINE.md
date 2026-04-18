# CSP_MONITORING_BASELINE.md

## Monitoring setup
- Aggregation script: `scripts/csp_report_summary.sh`
- Trend script: `scripts/csp_trend_report.sh`
- VPS runtime script paths:
  - `/home/deploy/bin_csp_report_summary.sh`
  - `/home/deploy/bin_csp_trend_report.sh`
- Report output dir: `/var/www/blogmmo/current/reports`
- Daily cron:
  - `55 23 * * * /home/deploy/bin_csp_report_summary.sh /var/www/blogmmo/current/reports >> /home/deploy/csp-report.log 2>&1`
  - `58 23 * * * /home/deploy/bin_csp_trend_report.sh /var/www/blogmmo/current/reports /var/www/blogmmo/current/reports/csp-trend-latest.md >> /home/deploy/csp-report.log 2>&1`

## First baseline snapshot
- File: `/var/www/blogmmo/current/reports/csp-summary-2026-04-18-121514.txt`

### Top findings (initial)
- Top violated directives:
  - `script-src-elem` (dominant)
  - `script-src-attr` (minor)
- Top blocked URIs:
  - many Next runtime chunks (`/_next/static/chunks/...`)
  - `inline` is still frequent
- Top affected pages:
  - `/`
  - `/blog`
  - `/guides`
  - `/login` (smaller share)

## Interpretation
- Current report-only policy surfaces both framework/runtime script behavior and inline-script events.
- Enforced CSP remains stable to avoid production breakage.
- Trend report auto-generated at:
  - `/var/www/blogmmo/current/reports/csp-trend-latest.md`
- Next step: compare 24h rolling snapshots to isolate persistent inline sources vs runtime-noise.
