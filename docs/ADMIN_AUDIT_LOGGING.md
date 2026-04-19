# ADMIN_AUDIT_LOGGING.md

## What was added
Structured admin audit logging via `logAdminAudit()` in `lib/admin-audit.ts`.

Log format:
- prefix: `[ADMIN-AUDIT]`
- JSON payload: `ts`, `actor`, `action`, `resource`, `resourceId`, `status`, `detail`

## Covered operations
- Posts: create/update/delete
- Guides: create/update/delete
- Upload: media upload
- Storage ops: health check endpoint

## Behavior
- Forbidden attempts are logged with `status: failure` and `reason: forbidden`.
- Successful operations are logged with actor + key detail (slug/published/bucket...)

## Operational usage
- Query from PM2 logs:
  - `pm2 logs blogmmo --nostream | grep "\[ADMIN-AUDIT\]"`

This provides baseline governance/auditability without introducing schema migrations.
