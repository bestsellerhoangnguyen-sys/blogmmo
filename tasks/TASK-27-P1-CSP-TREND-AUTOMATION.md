# TASK-27 — P1 CSP trend automation

## Objective
Automate trend-level CSP analysis across multiple daily summary snapshots.

## Implemented
- Added script: `scripts/csp_trend_report.sh`
  - input: report directory (`csp-summary-*.txt`)
  - output: markdown trend report (`csp-trend-latest.md`)
  - includes:
    - files analyzed
    - total report lines by snapshot
    - aggregated violated directives
    - recommendation section

## Usage
```bash
/home/deploy/bin_csp_trend_report.sh /var/www/blogmmo/current/reports /var/www/blogmmo/current/reports/csp-trend-latest.md
```

## Next
- Wire script into cron after daily summary job so trend report always up-to-date.
