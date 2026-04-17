# TASK-07 — D1-05 + D1-06 (Layout + Blog listing/pagination)

## Scope
- D1-05: Layout chính Header + Footer + dark mode toggle
- D1-06: Trang `/blog` liệt kê post + phân trang

## Kết quả triển khai

### D1-05 — Layout
- Tạo `components/site-header.tsx`
  - Brand + nav (Blog, Guides)
  - Auth controls
  - Theme toggle
- Tạo `components/site-footer.tsx`
- Tạo `components/theme-toggle.tsx`
  - Lưu trạng thái `light/dark` bằng `localStorage`
  - Sử dụng `darkMode: class` của Tailwind
- Cập nhật `app/layout.tsx`:
  - Bọc toàn app với header/footer/container
  - Thêm `suppressHydrationWarning` cho html
- Cập nhật `tailwind.config.ts` bật `darkMode: "class"`
- Cập nhật `app/globals.css` cho style nền nhẹ, tránh xung đột auto dark media.

### D1-06 — Blog listing
- Tạo `lib/db.ts` (singleton Prisma client)
- Nâng cấp `app/blog/page.tsx`:
  - Query post published từ DB
  - Hiển thị title/excerpt/date/tag
  - Phân trang bằng query param `?page=`
  - `PAGE_SIZE = 5`
  - Dùng `dynamic = "force-dynamic"`
- Tạo placeholder `app/guides/page.tsx` để điều hướng không 404
- Cập nhật `app/page.tsx` thành dashboard trạng thái project

## Verify
- `next build` pass.
- `/blog` hoạt động với phân trang.
- Dark mode toggle hoạt động client-side.

## Files chính
- `components/site-header.tsx`
- `components/site-footer.tsx`
- `components/theme-toggle.tsx`
- `lib/db.ts`
- `app/layout.tsx`
- `app/blog/page.tsx`
- `app/guides/page.tsx`
- `app/page.tsx`
- `tailwind.config.ts`
- `app/globals.css`
