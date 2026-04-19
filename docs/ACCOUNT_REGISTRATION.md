# ACCOUNT_REGISTRATION.md

## Added features
- New registration page: `/register`
- New API: `POST /api/auth/register`
- Credentials login now supports:
  1) env-based admin account (legacy)
  2) DB-backed user accounts (`User.passwordHash`)

## Data model changes
`User` model extended with:
- `passwordHash` (nullable text)
- `role` (text, default `USER`)

Migration:
- `prisma/migrations/20260419_add_user_password_role/migration.sql`

## Validation rules
- email required
- password required, min 8 chars
- duplicate email blocked (409)

## Security notes
- Password hashed with bcryptjs (`hash(password, 10)`)
- Role boundary still enforced for admin APIs via `requireAdmin()`
- Non-admin users can create account/login but cannot access admin APIs

## UX changes
- Login page now links to register page
- Header/account flow unchanged for signed-in users
