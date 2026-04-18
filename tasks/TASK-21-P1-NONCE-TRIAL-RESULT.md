# TASK-21 — P1 nonce CSP trial result

## Change trialed
- Added per-request nonce in middleware.
- Injected nonce into response header (`x-nonce`) and Analytics script component.
- Updated CSP Report-Only policy to nonce model:
  - `script-src 'self' 'nonce-<value>' 'strict-dynamic'`

## Verification executed
- Local test/build: PASS
- Production deploy/reload: PASS
- Live traffic replay (Playwright smoke): PASS functional
- CSP report log collection: completed

## Findings
- Report-only violations still occur on Next.js script assets (`/_next/static/chunks/*.js`) and some inline scripts.
- This indicates current Next runtime scripts are not consistently nonce-tagged through this middleware/layout-only approach.

## Decision
- Keep enforced CSP unchanged for now.
- Keep strict nonce policy in Report-Only as telemetry.
- Plan next: framework-level nonce propagation strategy (or alternate CSP pattern compatible with Next runtime).
