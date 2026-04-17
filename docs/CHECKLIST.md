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

## Next Focus
- Chuyển sang Day 2: D2-01 Schema Guide/Step/Category.
