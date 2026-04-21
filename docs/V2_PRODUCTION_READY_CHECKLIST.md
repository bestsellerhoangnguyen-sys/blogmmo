# V2 Production-Ready Checklist

## Current architecture (approved Option A)
- Frontend: `personal-blog-full-v2` static UI
- Backend: existing Next.js APIs + Prisma/PostgreSQL
- Auth/Role: existing NextAuth + `requireAdmin()`
- Deployment: single app + PM2 + Nginx

## Synced to backend (DONE)
- Posts CRUD
- Categories CRUD
- Comments create/moderate/delete/like
- Subscribers create/list/delete
- Site settings read/write

## Security controls (DONE)
- Admin route gated by server-side `requireAdmin()`
- Admin UI checks authenticated admin session via API
- CSRF required for sensitive admin mutations
- Audit logging enabled for sensitive operations

## Hardening pass (DONE)
- Removed silent API failure behavior in key admin actions
- Sensitive actions now require backend success before local state mutation:
  - delete post
  - approve/unapprove/delete comment
  - remove subscriber
  - save settings

## Remaining optional improvements
1. Remove local fallback for post save entirely (currently still allows local draft in API error cases).
2. Add visible “offline / sync pending” banner when backend unavailable.
3. Add API contract tests for v2 static UI integration.
4. Add periodic consistency check endpoint (counts across posts/comments/subscribers).

## Ops quick checks
- `/` returns 200
- `/admin` returns 200 for admin session
- `/api/health` returns `{ok:true}`
- Critical APIs return expected auth/403 behavior for non-admin

## Rollback
- Previous stable commits can be restored via git history.
- Static frontend can be switched back by editing redirects in `app/page.tsx` and `app/admin/page.tsx`.
