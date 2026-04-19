# ADMIN_ACCOUNT_MANAGEMENT_UPDATE.md

## Implemented in this batch
1. **User management in Admin UI**
   - Added account management section in `/admin`
   - List registered users
   - Update user role (`USER` / `ADMIN`) inline
   - Backed by `GET/PATCH /api/admin/users` (admin-only + CSRF)

2. **Self-service password change**
   - Added `PATCH /api/account/password`
   - Added password change form in `/account`
   - Uses bcrypt compare/hash and requires authenticated user + CSRF

3. **Login/Register clarity**
   - Login title changed to generic account login wording
   - Register flow already integrated from prior batch

## Security posture
- Admin APIs still protected by `requireAdmin()`
- Role changes audited through existing admin audit log
- Password change available for DB-backed users only

## Note
- This closes the immediate user concern: “chưa có quản lý tài khoản, chưa đăng nhập tài khoản được”.
