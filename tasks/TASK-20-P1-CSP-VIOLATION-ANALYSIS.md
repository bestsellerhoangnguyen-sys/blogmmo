# TASK-20 — P1 CSP violation analysis (production)

## What was done
- Executed live traffic generation (Playwright smoke) against production routes:
  - `/`
  - `/blog`
  - `/guides`
- Pulled PM2 logs and filtered `[CSP-REPORT]` events.

## Findings
- Repeated violations observed:
  - `violated-directive`: `script-src-elem`
  - `blocked-uri`: `inline`
  - pages impacted: `/`, `/blog`, `/guides`
- This confirms current app runtime still depends on inline scripts (expected for Next.js runtime patterns in current setup).

## Decision
- Do **not** switch enforced CSP to strict-no-inline yet.
- Keep strict policy in `Report-Only` while preparing nonce/hash migration.

## Next implementation tasks
1. Introduce nonce generation and propagate to script/style tags where possible.
2. Evaluate Next.js middleware/header strategy for nonce-compatible CSP.
3. Re-run report-only collection and ensure no inline violations remain.
4. Switch strict CSP from report-only to enforce.
