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
- D1-09 hoàn tất: có unit test cho `getPostBySlug` bằng Vitest (mock Prisma), test pass.
- Đã review đồng bộ tổng quan Day 1; chuẩn hóa checklist trạng thái thực tế và tạo `docs/DECISIONS.md` để tra cứu quyết định + lý do.
- Điểm lệch cần nhớ: D1-07 chưa parse MDX đầy đủ, sẽ xử lý ở phase sau.
- Đã bắt đầu Day 2 (D2-01): thêm schema `GuideCategory/Guide/GuideStep` và sync DB thành công.
- Day 2 đã hoàn tất D2-02..D2-10: guides search/filter + detail progress bar, API CRUD có auth guard, admin panel, upload image local, rate limit middleware, security headers + CSRF, env staging template.
- Đã kiểm tra sau từng cụm tính năng bằng build/test/curl để xác nhận không lỗi trước khi qua bước tiếp.
- Day 3 đã triển khai production app lên VPS: PM2 app `blogmmo` online, Nginx reverse proxy HTTPS hoạt động, `/api/health` trả OK.
- Backup DB đã bật cron 02:00 với script riêng và retention 14 ngày.
- Lưu ý vận hành: dùng rsync --delete có thể xóa `.env` production nếu không exclude; đã cập nhật runbook để tránh lặp lỗi.
- Day 3 hoàn tất thêm: LHCI workflow + thresholds, analytics env-driven injection, runbook rollback/restore/healthcheck được hoàn thiện.
- Production app đã reload ổn định sau cập nhật Day 3; cron backup vẫn tồn tại và hoạt động.
- Đã tạo bộ tài liệu đóng dự án: `FINAL_REPORT.md`, `HANDOVER_CHECKLIST.md`, `NEXT_PHASE_PLAN.md` để bàn giao và lên kế hoạch bước tiếp theo.
- Phase 2 đã triển khai thực tế: migration pipeline chuyển sang `migrate deploy` + baseline resolve; upload đã có lớp S3-compatible (fallback local); auth/security được siết thêm (auth throttle/CSP) và admin password production đã rotate.
- Đã bổ sung tự động hóa e2e smoke bằng Playwright + GitHub workflow; fix cấu hình Vitest để chỉ chạy test nội bộ và tránh quét node_modules.
- Re-deploy production sau cập nhật Phase 2 continuation thành công, health checks vẫn xanh.
- Bổ sung tiếp Phase 2: rate-limit auth/API có thể tune qua env + trả Retry-After; thêm endpoint `/api/ops/storage` để admin kiểm tra trạng thái S3 runtime.
- Đã thêm unit test cho storage health và chạy e2e smoke live trên production thành công (3/3 pass).
- Đã tổng hợp báo cáo hoàn tất Phase 2 (`PHASE2_COMPLETION_REPORT.md`) và tạo hardening backlog có timeline (`HARDENING_BACKLOG.md`).
- P0 được đẩy tiếp: đã rotate admin credential production, chạy unit/build/e2e/lighthouse thủ công và ghi evidence; phụ thuộc còn lại là rotate S3 IAM key mới.
