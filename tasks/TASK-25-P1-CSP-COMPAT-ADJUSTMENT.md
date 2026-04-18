# TASK-25 — P1 CSP compatibility adjustment (Next.js-aware)

## Why
Nonce + strict-dynamic trial produced report noise/blocks on Next runtime chunk scripts, not suitable for immediate enforce switch.

## Adjustment applied
- Reverted report-only policy to Next-compatible strict baseline:
  - `script-src 'self'`
  - `style-src 'self'`
  - no `strict-dynamic` in report-only
- Removed nonce propagation complexity from middleware/layout/analytics.

## Validation
- Local: unit/build pass.
- E2E: pass (security + smoke suite).
- Production deploy: pass (build + migrate + PM2 reload).

## Result
- Report-only now focuses on actionable inline violations instead of noisy runtime chunk blocks.
- Enforce policy remains stable for uptime safety.
