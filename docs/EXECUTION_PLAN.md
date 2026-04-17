# EXECUTION_PLAN.md

## 📦 DAY 0 — VPS Prep (AlmaLinux 10)
- D0-01 ⬜️ Tạo VPS, cấu hình SSH key, tắt root login
- D0-02 ⬜️ Update OS, cài git / curl / wget / unzip
- D0-03 ⬜️ Cài Node.js 20 LTS (nvm) + pnpm
- D0-04 ⬜️ Cài PostgreSQL 16, tạo user + DB riêng cho app
- D0-05 ⬜️ Cài Nginx, test default page trả 200
- D0-06 ⬜️ Cài PM2 global, kiểm tra pm2 startup
- D0-07 ⬜️ Trỏ domain, tạo SSL bằng certbot --nginx
- D0-08 ⬜️ Mở port 80/443, đóng mọi port thừa (firewalld)

✅ Checkpoint D0:
- SSH vào được bằng key, không password
- `psql -U appuser -d appdb` kết nối OK
- `https://domain.com` trả Nginx welcome + SSL xanh
- `node -v` → 20.x, `pm2 -v` → hiện version

---

## 🏗 DAY 1 — Foundation + Blog (Next.js 14 + Prisma)
- D1-01 ⬜️ Init Next.js 14 (App Router), push lên GitHub
- D1-02 ⬜️ Cài Prisma, tạo schema User + Post + Tag
- D1-03 ⬜️ prisma migrate dev, seed 3 post mẫu
- D1-04 ⬜️ Cài next-auth, provider Credentials + Google
- D1-05 ⬜️ Layout chính: Header + Footer + dark mode toggle
- D1-06 ⬜️ Trang /blog — danh sách post, phân trang
- D1-07 ⬜️ Trang /blog/[slug] — MDX render + metadata
- D1-08 ⬜️ RSS feed /feed.xml + sitemap tự động
- D1-09 ⬜️ Unit test: getPostBySlug trả đúng dữ liệu

✅ Checkpoint D1:
- /blog liệt kê post, click vào slug render MDX OK
- next-auth session hoạt động, logout/login thành công
- Prisma Studio thấy đủ bảng, seed data hiển thị
- /feed.xml valid RSS, lighthouse perf > 85

---

## ⚙️ DAY 2 — Guide + Admin + Security (CRUD + Hardening)
- D2-01 ⬜️ Schema Guide + Step + Category, migrate
- D2-02 ⬜️ Trang /guides — lọc theo category, search
- D2-03 ⬜️ Trang /guides/[slug] — step-by-step, progress bar
- D2-04 ⬜️ API Routes: CRUD post + guide (auth guard)
- D2-05 ⬜️ Admin panel /admin — list + edit + publish toggle
- D2-06 ⬜️ Rich text editor (Tiptap hoặc MDX editor)
- D2-07 ⬜️ Upload ảnh → lưu /public/uploads hoặc S3
- D2-08 ⬜️ Rate limiting API bằng upstash/ratelimit hoặc middleware
- D2-09 ⬜️ Thêm helmet headers, CSRF token cho form
- D2-10 ⬜️ Cấu hình env staging, .env.example đầy đủ

✅ Checkpoint D2:
- CRUD post + guide qua API trả 200, auth 401 đúng
- Admin tạo/xoá/edit post không lỗi console
- /guides/[slug] hiện progress bar khi scroll
- `curl -i /` có `X-Frame-Options` + `Content-Security-Policy`

---

## 🚀 DAY 3 — Deploy + UAT (Production)
- D3-01 ⬜️ GitHub Action: push main → build → deploy SSH
- D3-02 ⬜️ PM2 ecosystem.config.js, pm2 save + startup
- D3-03 ⬜️ Nginx reverse proxy /api + /_next Next.js static
- D3-04 ⬜️ prisma migrate deploy trên production DB
- D3-05 ⬜️ Bật pg_dump cronjob backup hàng ngày
- D3-06 ⬜️ Smoke test: /blog, /guides, /admin, /api/health
- D3-07 ⬜️ UAT checklist: login, tạo post, publish, xem live
- D3-08 ⬜️ Lighthouse CI — perf > 90, a11y > 85 trên prod
- D3-09 ⬜️ Gắn Umami hoặc Plausible analytics (self-host)
- D3-10 ⬜️ Viết runbook: deploy lại, rollback, restore DB

✅ Checkpoint D3 — DONE:
- CI/CD push main tự deploy, PM2 tự restart khi crash
- `https://domain.com/blog` + `/guides` load < 2s
- Backup DB chạy, file `.sql.gz` có trong `/backups`
- Runbook tồn tại, team đọc hiểu được trong 5 phút
