# TASK-22 — P1 API security integration tests

## Added
- `tests/e2e/api-security.spec.ts`

## Covered scenarios
1. Unauthorized mutation (`POST /api/posts`) returns `401`.
2. Auth endpoint burst (`/api/auth/session`) eventually returns `429`.
3. `429` response includes `Retry-After` header.

## Execution
- Command: `E2E_BASE_URL=https://www.sspaitools.com npm run test:e2e`
- Result: PASS (6/6 total, including existing smoke suite)

## Notes
- This is production-targeted e2e integration coverage for security behavior.
- Next expansion can add authenticated CRUD success + CSRF 403 case with controlled session fixture.
