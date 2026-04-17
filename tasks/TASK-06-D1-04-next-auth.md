# TASK-06 — D1-04 (next-auth: Credentials + Google)

## Scope
- Cài next-auth
- Tạo API route auth
- Cấu hình provider Credentials + Google
- Tạo login page và trạng thái login/logout cơ bản

## Kết quả triển khai
- Đã cài package `next-auth`.
- Tạo `lib/auth.ts` với `authOptions`:
  - `session.strategy = jwt`
  - Provider `Credentials` dùng env `AUTH_ADMIN_EMAIL` + `AUTH_ADMIN_PASSWORD`
  - Provider `Google` bật khi có `GOOGLE_CLIENT_ID` và `GOOGLE_CLIENT_SECRET`
- Tạo route: `app/api/auth/[...nextauth]/route.ts`.
- Tạo Session provider client: `components/providers.tsx`.
- Tạo UI trạng thái đăng nhập:
  - `components/auth-controls.tsx` (login/logout)
  - `app/login/page.tsx` (form credentials + nút Google login)
- Cập nhật `app/layout.tsx` để bọc `SessionProvider`.
- Cập nhật `.env.example` thêm biến:
  - `AUTH_ADMIN_EMAIL`
  - `AUTH_ADMIN_PASSWORD`

## Verify
- `next build` pass.
- Có route `/login`.
- Có route auth `api/auth/[...nextauth]`.

## Notes
- Google login chỉ hoạt động khi cấu hình Google OAuth credentials thật.
- Credentials login hiện là admin account từ ENV, phù hợp MVP nội bộ.
