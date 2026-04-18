# CI_EVIDENCE.md

## Manual execution evidence (local runner against production)

### 1) Unit tests
- Command: `npm run test`
- Result: PASS
- Covered suites:
  - `lib/posts.test.ts`
  - `lib/storage-health.test.ts`

### 2) Build validation
- Command: `npm run build`
- Result: PASS

### 3) E2E smoke tests
- Command: `E2E_BASE_URL=https://www.sspaitools.com npm run test:e2e`
- Result: PASS (3/3)
- Checks:
  - Home page loads
  - Blog + Guides pages load
  - `/api/health` returns OK

### 4) Lighthouse reports (temporary public storage)
- Home: https://storage.googleapis.com/lighthouse-infrastructure.appspot.com/reports/1776483834715-73353.report.html
- Blog: https://storage.googleapis.com/lighthouse-infrastructure.appspot.com/reports/1776483836058-98371.report.html
- Guides: https://storage.googleapis.com/lighthouse-infrastructure.appspot.com/reports/1776483837321-87394.report.html

## Notes
- GitHub status checks were skipped in local LHCI run because no GitHub token is set in this runtime.
- Equivalent workflows are already present in `.github/workflows/` and can be run in GitHub Actions for centralized audit trail.
