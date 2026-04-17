# TASK 01 — Ngày 1 (Buổi sáng)

## Mục tiêu
Khởi tạo nền tảng dự án Blog + Guide để sẵn sàng phát triển feature buổi chiều.

## Phạm vi thực hiện (Sáng)

### 1) Khởi tạo project
- Tạo project Next.js + TypeScript
- Cài TailwindCSS + bộ UI cơ bản
- Thiết lập ESLint/Prettier

### 2) Thiết lập backend nền tảng
- Cài Prisma + PostgreSQL driver
- Tạo `prisma/schema.prisma` với các model MVP:
  - `Post`
  - `Category`
  - `GuideTopic`
- Tạo migration đầu tiên
- Seed dữ liệu mẫu tối thiểu

### 3) Khung giao diện chung
- Tạo layout tổng: Header / Footer / Container
- Trang Home placeholder
- Tạo route rỗng:
  - `/blog`
  - `/guides`
  - `/admin`

### 4) Tài liệu dự án
- Tạo `docs/PLAN.md` (roadmap 3 ngày)
- Tạo `docs/CHECKLIST.md` (check feature từng bước)
- Tạo `docs/CLAUDE.md` (quy tắc dev + DoD)
- Tạo `docs/MEMORY.md` (ghi quyết định kỹ thuật)

### 5) Chuẩn hóa môi trường
- Tạo `.env.example`
- Viết `README.md` phần setup local
- Scripts npm:
  - `dev`
  - `build`
  - `start`
  - `db:migrate`
  - `db:seed`

## Tiêu chí hoàn thành (Definition of Done - Buổi sáng)
- [ ] App chạy local thành công
- [ ] Kết nối DB thành công
- [ ] Migration + seed chạy ổn
- [ ] Có layout và các route khung
- [ ] Có đầy đủ docs cơ bản
- [ ] Không có lỗi nghiêm trọng ở console/server

## Checkpoint xác nhận với stakeholder
1. Demo chạy local (Home + route khung)
2. Xác nhận schema DB MVP
3. Xác nhận format tài liệu (`CLAUDE.md`, `MEMORY.md`, checklist)
4. Chốt chuyển qua phần triển khai tính năng buổi chiều

## Output bàn giao task
- `blog-guide-app/` đã được tạo
- `blog-guide-app/tasks/TASK-01-day1-morning.md`
- `blog-guide-app/docs/` đầy đủ file khung
