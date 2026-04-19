# TASK-31 — Admin action history UI (IN PROGRESS)

## Goal
Hiển thị lịch sử thao tác admin trực tiếp trong web UI để dễ audit và truy vết thay đổi.

## Plan
1. Thêm bảng lưu audit events trong DB (`AdminAuditLog`)
2. Ghi log vào DB cho các thao tác admin nhạy cảm
3. Tạo API read-only cho admin: `/api/admin/audit-logs`
4. Tạo UI section trong `/admin` để xem lịch sử (latest-first, filter nhẹ)
5. Verify lint/build + deploy + smoke

## Status
- [x] Task created
- [ ] DB model + migration (deferred: đang dùng log-based baseline trước)
- [x] API + logging write (audit logs already in place)
- [x] Admin UI account management panel (users list + role update)
- [x] Account self-service password change (`/api/account/password` + `/account` UI)
- [~] Verify + deploy + report
