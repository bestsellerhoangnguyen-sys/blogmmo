# TASK-19 — P1 CSP hardening (safe rollout)

## Objective
Start removing `unsafe-inline` safely without breaking production UI.

## Implementation
- Kept current enforced CSP for stability.
- Added strict `Content-Security-Policy-Report-Only` header (no `unsafe-inline`) in middleware.
- Added report endpoint:
  - `POST /api/csp-report` (logs violation payload)
  - `GET /api/csp-report` (health check)

## Why this approach
- Next.js apps often rely on framework/runtime inline behavior.
- Report-only phase allows collecting real violations first, then tightening enforced policy with low risk.

## Verification
- Local: tests/build pass.
- Production: deploy pass, PM2 reload pass.
- Headers verified:
  - `Content-Security-Policy` present
  - `Content-Security-Policy-Report-Only` present
- `GET /api/csp-report` returns `{ ok: true }`.
