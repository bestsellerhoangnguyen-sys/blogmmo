# NEXT_PHASE_PLAN.md

## Goal
Move from MVP-complete system to production-grade reliability and maintainability.

## Phase 2 (Recommended: 5–7 days)

### 1) Data/DB correctness (Priority: High)
- Replace `prisma db push` workflow with proper migration pipeline:
  - Create baseline migration
  - Validate rollback strategy
  - Use `prisma migrate deploy` in CI/CD
- Add DB constraints/index review for Guide/Post queries

### 2) Security hardening (Priority: High)
- Enforce stronger admin auth policy (rotate default admin password)
- Optional: add 2FA for admin login
- Tighten CSP to remove `unsafe-inline` where possible
- Add login rate limit specifically for auth endpoints

### 3) Storage & media (Priority: Medium)
- Move uploads from local `/public/uploads` to object storage (S3-compatible)
- Add signed URLs + basic image optimization pipeline

### 4) Quality & testing (Priority: Medium)
- Add API integration tests for posts/guides CRUD
- Add e2e smoke test (Playwright) for admin flow
- Expand unit tests for security guards (auth/csrf/rate-limit)

### 5) Observability (Priority: Medium)
- Add centralized app logs (PM2 + rotate + shipping)
- Add error tracking (Sentry or equivalent)
- Add uptime monitor and alerting

### 6) Performance & SEO (Priority: Medium)
- Run Lighthouse CI on each main push and publish reports
- Add caching strategy for list pages
- Add structured data for blog articles

### 7) Product polish (Priority: Low)
- Upgrade editor to Tiptap/advanced MDX editor
- Improve admin edit UX (draft autosave, validation feedback)
- Add category/tag management UI

## Immediate next sprint (first 3 tasks)
1. **Migration pipeline conversion** (`db push` → `migrate deploy`)  
2. **Upload storage migration** (local → S3-compatible)  
3. **Auth+security tightening** (admin password rotation, auth endpoint throttling)
