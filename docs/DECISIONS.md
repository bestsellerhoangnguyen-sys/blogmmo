# DECISIONS.md

## Tổng hợp quyết định quan trọng (đến hết Day 1)

- **Chọn Next.js 14 fullstack (App Router) thay vì tách FE/BE sớm**
  - **Lý do:** giảm overhead tích hợp, phù hợp timeline 3 ngày, ship MVP nhanh.

- **Triển khai GitHub push bằng Deploy Key riêng cho repo**
  - **Lý do:** bảo mật tốt hơn PAT rộng quyền; giới hạn blast radius nếu lộ key.

- **Dùng PostgreSQL 16 trên VPS với user/db riêng (`appuser`/`appdb`)**
  - **Lý do:** tách biệt quyền, dễ vận hành và backup.

- **Sửa `pg_hba.conf` localhost sang `scram-sha-256`**
  - **Lý do:** app auth bằng password; cấu hình mặc định `ident` gây fail kết nối app user.

- **SSH hardening: tắt root login + tắt password auth, dùng user `deploy` + key**
  - **Lý do:** giảm rủi ro brute-force/lộ mật khẩu; giữ đường truy cập an toàn.

- **PM2 systemd unit chuyển từ `Type=forking` sang `Type=simple` (`--no-daemon`)**
  - **Lý do:** template mặc định fail PID trên AlmaLinux 10; chỉnh tay để service ổn định.

- **Certbot cài qua `pip3` (không dùng dnf/snap)**
  - **Lý do:** repo AlmaLinux 10 không có gói certbot mặc định; cần phương án khả dụng ngay.

- **Bật firewalld, chỉ mở `ssh/http/https`**
  - **Lý do:** nguyên tắc least exposure cho production.

- **Auth MVP dùng next-auth Credentials + Google (conditional env)**
  - **Lý do:** đáp ứng nhanh nhu cầu login admin nội bộ, vẫn mở đường OAuth sau.

- **Theme toggle dùng `darkMode: class` + localStorage**
  - **Lý do:** kiểm soát trạng thái rõ ràng, tránh phụ thuộc hoàn toàn vào OS preference.

- **Blog list dùng server rendering + query pagination `?page=`**
  - **Lý do:** SEO tốt, đơn giản, dễ mở rộng filter/search.

- **Blog detail hiện render plain content (chưa parse MDX đầy đủ)**
  - **Lý do:** ưu tiên tiến độ Day 1; đưa MDX parser/editor vào phase tiếp theo.

- **RSS + sitemap tạo động từ Prisma data**
  - **Lý do:** đồng bộ nội dung tự động, không cần maintain thủ công.

- **Unit test dùng Vitest + mock Prisma cho `getPostBySlug`**
  - **Lý do:** test nhanh, nhẹ, phù hợp App Router stack.

- **Tạm dùng `prisma db push` ở bootstrap thay cho `prisma migrate dev`**
  - **Lý do:** quyền DB hiện tại không tạo được shadow DB; tránh block tiến độ Day 1.
  - **Hệ quả:** cần quay lại migration versioned chuẩn trước/ở D3 (`prisma migrate deploy`).
