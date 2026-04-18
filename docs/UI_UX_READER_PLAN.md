# UI_UX_READER_PLAN.md

## Objective
Tối ưu trải nghiệm **đọc blog** để tăng thời gian đọc, giảm thoát trang, và giúp người dùng đi tiếp sang bài liên quan/guides.

## Current gaps (from existing implementation)
1. Blog detail đang render nội dung dạng `pre` (plain text), chưa phải trải nghiệm đọc chuẩn article.
2. Chưa có mục lục, estimated reading time, hoặc progress indicator ở blog detail.
3. Chưa có khối “bài liên quan” để điều hướng tiếp.
4. Typography đã cải thiện nhưng chưa có chuẩn long-form reading riêng (line-length, heading rhythm, code block, quote).
5. Chưa có CTA rõ ở cuối bài (đi guides, subscribe RSS, đọc thêm tag tương tự).

## Proposed rollout (reader-first)

### Phase A — Foundation reading UI (P0)
- [ ] Tạo `ArticleLayout` component:
  - max-width tối ưu long-form (~68ch)
  - spacing chuẩn heading/paragraph/list/code/quote
  - sticky progress bar theo scroll
- [ ] Bổ sung metadata hiển thị:
  - publish date
  - reading time (ước lượng theo word count)
  - tags clickable
- [ ] Thêm “Back to Blog” + breadcrumb tối ưu mobile

**DoD A**
- Blog detail dễ đọc trên 360/390/430/768
- Không horizontal overflow
- LCP page blog detail không tệ hơn baseline hiện tại

### Phase B — Content render & navigation (P1)
- [ ] Nâng renderer từ plain/pre -> markdown render chuẩn (ít nhất heading/list/link/code block)
- [ ] Tạo Table of Contents tự động theo heading H2/H3
- [ ] Khối “Bài liên quan” (theo tags/category)
- [ ] CTA cuối bài: “Đọc guide liên quan” + link RSS

**DoD B**
- Người dùng có thể đọc, scan nhanh (TOC), và đi tiếp ít nhất 1 nội dung khác.

### Phase C — Engagement & trust (P2)
- [ ] Author box + updated timestamp
- [ ] Copy-link button + share actions
- [ ] “Last updated” badge khi bài cũ
- [ ] Optional: theme toggle shortcut cho reading mode

**DoD C**
- Luồng đọc hoàn chỉnh: vào bài -> theo dõi tiến độ -> đọc nội dung -> có next step rõ ràng.

## Technical tasks mapping
1. `components/article-layout.tsx` (new)
2. `components/reading-progress.tsx` (new)
3. `components/toc.tsx` (new)
4. Update `app/blog/[slug]/page.tsx` to use new reading layout
5. Update `lib/posts.ts` or helper for reading-time + related posts resolver
6. Add/extend e2e smoke for blog reader flow

## Suggested implementation order (safe)
1. Implement Phase A UI shell (không đổi data model)
2. Verify lint/build/e2e
3. Deploy + mobile QA checklist
4. Implement markdown renderer & TOC (Phase B)
5. Re-verify and rollout

## Success metrics (simple)
- + Tăng page/session từ blog entry (internal navigation click-through)
- + Tăng average time on blog detail
- - Giảm quick bounce trong 15–30s

## Status
- ✅ Plan reviewed and approved direction: reader-first UX for blog.
- ⏳ Ready to execute Phase A immediately.
