# TASK-09 — D1-09 (Unit test: getPostBySlug)

## Scope
- Viết unit test cho hàm `getPostBySlug`
- Tích hợp test runner vào project

## Kết quả triển khai
- Tạo `lib/posts.ts` với hàm:
  - `getPostBySlug(slug)` dùng Prisma để query bài theo slug.
- Cài `vitest` + `@vitest/coverage-v8`.
- Tạo cấu hình test `vitest.config.ts` (alias `@` và environment node).
- Tạo test `lib/posts.test.ts`:
  - Mock Prisma client
  - Assert `findUnique` được gọi đúng params
  - Assert trả đúng dữ liệu kỳ vọng
- Cập nhật `package.json` script:
  - `test: vitest run`

## Verify
- `npm run test` pass: 1 test passed.
- `npm run build` pass sau khi thêm test.

## Files
- `lib/posts.ts`
- `lib/posts.test.ts`
- `vitest.config.ts`
- `package.json`
