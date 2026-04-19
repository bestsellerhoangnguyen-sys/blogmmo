# TASK-30 — Admin finalization (IN PROGRESS)

## Goal
Hoàn thiện phần admin theo yêu cầu: tăng tính an toàn vận hành + khả năng kiểm soát thay đổi.

## Scope
- Add structured admin audit logging for sensitive operations
- Wire audit events into post/guide/upload/storage operations
- Add account registration flow (UI + API + auth integration)
- Verify build/tests and production rollout
- Update handover docs

## Status
- [x] Task created
- [x] Audit logging implementation
- [x] Account registration implementation (`/register` + `/api/auth/register` + credentials db fallback)
- [x] Regression verified (`lint`, `build`, `test:e2e`)
- [x] Handover update completed
