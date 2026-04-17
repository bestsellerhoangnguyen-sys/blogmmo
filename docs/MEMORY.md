# MEMORY.md

## Decisions
- 2026-04-13: Khởi tạo dự án theo hướng Next.js fullstack để đáp ứng tiến độ 3 ngày.
- 2026-04-13: Ưu tiên hoàn tất foundation trong Day 1 buổi sáng trước khi làm feature.

## Next
- D0-01 → D0-03 đã hoàn tất trên VPS AlmaLinux 10.1.
- Tiếp theo: D0-04 (PostgreSQL 16), D0-05 (Nginx), D0-06 (PM2).

## Ops Notes
- SSH hardening đã áp dụng: `PermitRootLogin no`, `PasswordAuthentication no`.
- User triển khai: `deploy` (sudo không mật khẩu), đăng nhập bằng SSH key.
- Runtime nền đã sẵn sàng: Node `v20.20.2`, pnpm `10.33.0`.
- PostgreSQL 16.13 đã cài và chạy; đã tạo `appuser/appdb`; local auth dùng `scram-sha-256`.
- Nginx đã cài và trả `HTTP/1.1 200 OK` trên localhost.
- PM2 đã cài; startup unit cần chỉnh tay trên AlmaLinux 10 sang `Type=simple` để service hoạt động ổn định (`pm2-deploy` active).
- Domain `sspaitools.com` + `www.sspaitools.com` đã trỏ đúng IP VPS và đã cấp SSL thành công (Let's Encrypt).
- Do repo AlmaLinux 10 chưa có gói certbot mặc định, triển khai certbot qua `pip3`.
- Firewalld đã bật, zone public chỉ giữ `ssh/http/https`.
- D1-01 hoàn tất: project đã init Next.js 14 App Router và push lên GitHub bằng deploy key.
- D1-02/D1-03 bootstrap hoàn tất: Prisma schema `User/Post/Tag` + seed 3 bài mẫu.
- Với quyền DB hiện tại, `prisma migrate dev` không chạy được do shadow DB permission; tạm dùng `prisma db push` cho giai đoạn bootstrap.
- D1-04 hoàn tất: tích hợp next-auth (Credentials + Google), có trang `/login` và luồng login/logout cơ bản.
- D1-05 hoàn tất: layout tổng có Header/Footer, dark mode toggle hoạt động.
- D1-06 hoàn tất: `/blog` render dữ liệu Post từ Prisma + phân trang (`?page=`).
- D1-07 hoàn tất: `/blog/[slug]` + metadata SEO/OG theo từng bài.
- D1-08 hoàn tất: RSS `/feed.xml` và `sitemap.xml` tự động từ dữ liệu DB.
