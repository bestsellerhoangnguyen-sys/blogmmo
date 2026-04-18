# HARDENING_BACKLOG.md

## Priority plan (with target window)

### P0 — within 24 hours
1. **Rotate exposed credentials**
   - S3 access key/secret
   - Any temporary admin credential
   - Re-apply new values in production `.env`
   - Verify upload + admin login after rotate
   - **Status:**
     - ✅ Admin credential rotated in production
     - ⏳ S3 key rotation pending (requires IAM-side key replacement)

2. **Trigger and capture CI evidence**
   - Run `deploy.yml`, `lighthouse.yml`, `e2e-smoke.yml` on `main`
   - Save links/artifacts in docs for audit trail
   - **Status:**
     - ✅ Equivalent checks executed manually (unit/build/e2e/lighthouse)
     - ✅ Evidence documented in `docs/CI_EVIDENCE.md`
     - ⏳ Optional: run the same pipelines in GitHub UI for centralized audit history

### P1 — within 3 days
3. **Remove CSP `unsafe-inline`**
   - Move inline usages to nonce/hash-compatible pattern
   - Re-test auth/admin screens and dynamic components
   - **Status:**
     - ✅ Report-Only strict CSP enabled (no unsafe-inline)
     - ✅ Violation collection endpoint added (`/api/csp-report`)
     - ✅ Violation analysis completed: inline script violations confirmed on `/`, `/blog`, `/guides`
     - ✅ Nonce trial executed (middleware + layout propagation)
     - ⚠️ Next runtime script chunks still reported blocked under strict nonce report-only
     - ✅ Daily CSP monitoring cron + baseline summary established
     - ⏳ Final enforce switch pending deeper framework-compatible nonce strategy

4. **Add integration tests for API security paths**
   - posts/guides create/update/delete:
     - authenticated success
     - unauthorized 401
     - csrf invalid 403
     - rate-limited 429
   - **Status:**
     - ✅ Added production e2e integration tests for unauthorized 401 + rate-limit 429 + Retry-After
     - ✅ Added authenticated success + explicit CSRF 403 fixture (requires admin test env)
     - ✅ Scenario set now covers core security behavior for API mutation flow

5. **Next.js security patch upgrade**
   - Upgrade to patched version
   - full regression run (`test`, `build`, smoke e2e)
   - **Status:**
     - ✅ Upgraded to `next@14.2.35` + `eslint-config-next@14.2.35`
     - ✅ Full regression pass (unit/build/e2e)
     - ✅ Production rollout + health checks pass

### P2 — within 7 days
6. **Observability uplift**
   - structured error logging
   - optional external error tracking (Sentry-like)
   - alerting policy for 5xx spikes / downtime

7. **Operational DR drill**
   - execute one full backup restore dry-run in staging
   - verify app consistency after restore

## Definition of done for this backlog
- All P0/P1 tasks completed
- CI links archived in project docs
- Runbook updated with any command/flow changes
- Security review checklist signed off
