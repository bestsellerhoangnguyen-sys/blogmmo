# TASK-23 — P1 API security integration (auth success + CSRF 403)

## Added
- `tests/e2e/api-security-auth.spec.ts`

## New covered scenarios
1. Authenticated create post with valid CSRF token -> `201` (and cleanup delete succeeds).
2. Authenticated mutation with invalid CSRF token -> `403`.

## Execution proof
- Command:
  - `E2E_BASE_URL=https://www.sspaitools.com E2E_ADMIN_EMAIL=admin@blogmmo.local E2E_ADMIN_PASSWORD=<set> npm run test:e2e`
- Result: PASS (`8/8` tests total)

## Regression checks
- `npm run test` pass
- `npm run build` pass

## Outcome
- API security path coverage is now materially complete for MVP hardening:
  - unauthorized 401
  - rate-limit 429 + Retry-After
  - authenticated success
  - invalid CSRF 403
