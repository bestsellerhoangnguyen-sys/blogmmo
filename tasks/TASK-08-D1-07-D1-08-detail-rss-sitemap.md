# TASK-08 — D1-07 + D1-08 (Blog detail + RSS + Sitemap)

## Scope
- D1-07: `/blog/[slug]` render nội dung + metadata
- D1-08: `/feed.xml` + `sitemap.xml` tự động

## Kết quả triển khai

### D1-07 — Blog detail + metadata
- Tạo `app/blog/[slug]/page.tsx`
  - Query post theo slug từ Prisma
  - `notFound()` nếu không tồn tại hoặc chưa publish
  - Hiển thị title, date, excerpt, tags, content
- Tạo `generateMetadata()`:
  - title/description
  - open graph article
  - canonical URL
- Cập nhật `/blog` để link sang trang chi tiết (`Đọc chi tiết →`).

### D1-08 — RSS + sitemap
- Tạo `app/feed.xml/route.ts`
  - RSS 2.0, lấy tối đa 50 bài publish mới nhất
- Tạo `app/sitemap.ts`
  - routes tĩnh: `/`, `/blog`, `/guides`
  - routes động: `/blog/[slug]`
- Tạo `lib/site.ts` chứa `siteConfig` dùng chung cho URL/site metadata.

## Verify
- Build pass khi có `DATABASE_URL`:
  - `/blog/[slug]` dynamic route xuất hiện
  - `/feed.xml` dynamic route xuất hiện
  - `/sitemap.xml` dynamic route xuất hiện

## Note
- Đã set `export const dynamic = "force-dynamic"` cho feed/sitemap để tránh lỗi prerender khi thiếu DB env trong build context.
