# TASK-10 — D2-01 (Schema Guide + Step + Category)

## Scope
- Thiết kế schema cho module Guide
- Đồng bộ vào DB

## Kết quả
- Đã thêm model mới trong `prisma/schema.prisma`:
  - `GuideCategory`
  - `Guide`
  - `GuideStep`
- Quan hệ:
  - `GuideCategory (1) -> (n) Guide`
  - `Guide (1) -> (n) GuideStep`
- Ràng buộc quan trọng:
  - `Guide.slug` unique
  - `GuideCategory.slug` unique
  - `GuideStep` unique theo `(guideId, order)`
- Đã `prisma db push` đồng bộ schema thành công lên DB VPS.
- Đã regenerate Prisma Client.

## Note
- Vẫn dùng chiến lược `db push` trong phase triển khai nhanh.
- Sẽ chuẩn hóa migration versioned trước deploy production (D3).
