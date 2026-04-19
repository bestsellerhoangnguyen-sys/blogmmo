# TASK-29 — Account Management + Admin UX Upgrade (COMPLETED)

## Goal
Implement next-phase product improvements after TASK-28 completion:
1) Account management module
2) Admin UX workflow upgrades

## Scope
### A. Account management
- Profile page (basic user info)
- Password change flow (secure validation)
- Session/account safety section (current session visibility + sign-out guidance)
- Role boundary checks in sensitive admin APIs/UI

### B. Admin UX upgrade
- Better edit workflow (post/guide editing clarity)
- Validation feedback for create/update forms
- Draft lifecycle hints/status cues
- Governance UX baseline (safe action prompts for destructive actions)

## Execution plan
1. Audit current auth/account routes and data model
2. Implement account settings page and server actions/APIs
3. Strengthen permission boundaries (UI + backend)
4. Upgrade admin forms with validation and clearer states
5. Regression checks (lint/test/build/e2e smoke)
6. Deploy + live smoke + docs update

## Status
- [x] Task initialized
- [x] Account management implementation (new `/account` page + account link in auth controls)
- [x] Admin UX workflow implementation (client-side validation + destructive confirm)
- [x] Role boundary tightening for admin APIs (`requireAdmin`)
- [x] Admin UX batch 2: inline edit workflow for posts/guides + draft/published status badges
- [x] Regression + deploy completed
- [x] Final handover update (`docs/TASK29_HANDOVER.md`)
