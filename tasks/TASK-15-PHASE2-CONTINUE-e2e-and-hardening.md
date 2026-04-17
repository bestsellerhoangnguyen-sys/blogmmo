# TASK-15 — Phase 2 continuation

## Completed in this step

### A) E2E smoke automation setup
- Added Playwright config: `playwright.config.ts`
- Added smoke tests: `tests/e2e/smoke.spec.ts`
  - home page visible
  - blog/guides routes load
  - `/api/health` returns ok
- Added workflow: `.github/workflows/e2e-smoke.yml`

### B) Test pipeline stabilization
- Vitest was accidentally collecting tests under `node_modules` after dependency changes.
- Fixed `vitest.config.ts`:
  - include only `lib/**/*.test.ts`
  - exclude `tests/e2e/**` + `node_modules/**`
- Re-verified `npm run test` pass.

### C) Production rollout re-verify
- Synced code to VPS.
- Ran migration flow:
  - `migrate resolve --applied baseline || true`
  - `migrate deploy`
- Build + PM2 reload + save successful.
- Live checks:
  - `/` -> 200
  - `/api/health` -> 200
  - tightened CSP headers present.

## Notes
- `migrate resolve --applied` returns P3008 when baseline already applied; this is expected and safely ignored via `|| true`.
