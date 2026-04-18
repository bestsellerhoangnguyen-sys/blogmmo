# TASK-28 — UI Overhaul (IN PROGRESS)

## Owner
- Main session (direct execution, no sub-agent)

## Requested by
- Nguyen Huy Hoang

## Goal
Nâng cấp giao diện website BlogMMO theo hướng hiện đại, đồng bộ, responsive cho các màn:
- Home
- Blog list
- Blog detail
- Guides list
- Guide detail
- Admin

## Scope thực thi
1. Audit UI hiện tại + chốt style system (spacing/typography/components states).
2. Refactor component hóa UI dùng Tailwind.
3. Nâng UX: nav rõ ràng, breadcrumb cơ bản, empty/loading states, dark mode polish.
4. Đảm bảo không phá API + test/build pass.
5. Cập nhật docs task log + commit.

## Status hiện tại
- [x] Tạo task tracking để tiếp tục ngày hôm sau.
- [x] UI audit + style system draft (UI primitives + sticky header + skeleton loading).
- [x] Implement Home/Blog UI overhaul.
- [x] Implement Guides/Admin UI overhaul.
- [x] Regression check (`npm run test`, `npm run build`, `npm run test:e2e`).
- [x] Deploy production + smoke live (`/`, `/blog`, `/guides`, `/api/health`).
- [~] Update docs + final commit (đang cập nhật dần theo từng batch).

## Notes for tomorrow report
- Đã xác nhận sẽ thực hiện trực tiếp trong main session.
- Không dùng sub-agent do lỗi pairing runtime.
- Đã triển khai batch UI chính: Home/Blog/Guides/Admin + shared UI primitives + global loading skeleton.
- Test/build/e2e local đã pass sau thay đổi UI.
- Đã deploy production thành công và smoke endpoint trả 200/ok.
