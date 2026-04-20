# TASK-31 — Admin action history UI (COMPLETED)

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
- [x] DB model + migration (`AdminAuditLog` + migration `20260420_add_admin_audit_log`)
- [x] API + logging write (`/api/admin/audit-logs` + DB-backed `logAdminAudit`)
- [x] Admin UI account management panel (users list + role update)
- [x] Account self-service password change (`/api/account/password` + `/account` UI)
- [x] Verify + deploy + report
