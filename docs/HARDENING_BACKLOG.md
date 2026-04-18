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
     - ⏳ Final enforce switch pending after violation review

4. **Add integration tests for API security paths**
   - posts/guides create/update/delete:
     - authenticated success
     - unauthorized 401
     - csrf invalid 403
     - rate-limited 429

5. **Next.js security patch upgrade**
   - Upgrade to patched version
   - full regression run (`test`, `build`, smoke e2e)

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
