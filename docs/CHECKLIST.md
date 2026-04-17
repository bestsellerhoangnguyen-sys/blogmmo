# CHECKLIST.md

## ✅ Day 0 Status
- [x] D0-01 SSH key + disable root/password login
- [x] D0-02 OS update + git/curl/wget/unzip
- [x] D0-03 Node 20 + pnpm
- [x] D0-04 PostgreSQL 16 + appuser/appdb
- [x] D0-05 Nginx 200 OK
- [x] D0-06 PM2 startup active
- [x] D0-07 Domain + SSL Let's Encrypt
- [x] D0-08 Firewall chỉ mở ssh/http/https

## ✅ Day 1 Status
- [x] D1-01 Init Next.js 14 + push GitHub
- [x] D1-02 Prisma schema User/Post/Tag
- [x] D1-03 Seed 3 posts (bootstrap qua db push)
- [x] D1-04 next-auth Credentials + Google
- [x] D1-05 Layout Header/Footer + dark mode
- [x] D1-06 /blog list + pagination
- [x] D1-07 /blog/[slug] + metadata
- [x] D1-08 /feed.xml + sitemap.xml
- [x] D1-09 Unit test getPostBySlug

## ⚠️ Ghi chú đồng bộ thực tế
- D1-07 hiện **chưa parse MDX đầy đủ**, đang hiển thị content dạng plain/preformatted.
- D1-03 dùng `prisma db push` do hạn chế quyền shadow DB, sẽ chuẩn hóa migration ở giai đoạn deploy.

## ✅ Day 2 Status
- [x] D2-01 Schema Guide + Step + Category
- [x] D2-02 /guides filter + search
- [x] D2-03 /guides/[slug] step-by-step + progress bar
- [x] D2-04 API CRUD post + guide (auth guard)
- [x] D2-05 Admin panel /admin (create/list/publish/delete)
- [x] D2-06 MDX/markdown editor (textarea + preview)
- [x] D2-07 Upload ảnh vào /public/uploads
- [x] D2-08 Rate limiting middleware
- [x] D2-09 Security headers + CSRF token check
- [x] D2-10 Cập nhật env staging template

## Notes
- Luồng edit hiện tại là edit nhanh qua API PATCH payload; UI tập trung create/publish/delete để giữ tốc độ MVP.
- Rate limit dùng in-memory middleware (đủ cho single-instance; sẽ thay Redis/Upstash nếu scale nhiều instance).

## ✅ Day 3 Status
- [x] D3-01 GitHub Action deploy workflow (implemented)
- [x] D3-02 PM2 ecosystem + startup
- [x] D3-03 Nginx reverse proxy
- [x] D3-04 DB deploy sync (MVP dùng db push)
- [x] D3-05 Backup cron daily + test file backup
- [x] D3-06 Smoke test `/blog` `/guides` `/admin` `/api/health`
- [x] D3-07 UAT baseline ready
- [x] D3-08 Lighthouse CI workflow + thresholds config
- [x] D3-09 Analytics integration (env-driven)
- [x] D3-10 Runbook finalize

## Next Focus
- Chạy GitHub Actions thực tế (deploy/lighthouse) và chốt report CI links.
