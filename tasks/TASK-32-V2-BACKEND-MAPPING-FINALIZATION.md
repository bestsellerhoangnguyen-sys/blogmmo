# TASK-32 — V2 backend mapping finalization (COMPLETED)

## Goal
Giảm phụ thuộc localStorage trong blog-v2 bằng cách map các tác vụ chính sang backend API hiện tại.

## Implemented
- Posts CRUD mapped to backend APIs (earlier batch)
- Categories CRUD mapped to backend APIs
- Comments mapped (public create/like + admin moderation/delete)
- Subscribers mapped (public subscribe + admin delete/list)
- Site settings mapped (admin save + public sync)
- Improved UX fallback messaging when API write fails (toast instead of silent catch)

## Status
- [x] Mapping core flows done
- [x] Build/deploy passed
- [x] Runtime fallback messaging improved
