# UAT_CHECKLIST.md

## Authentication
- [ ] Login Credentials hoạt động
- [ ] Login Google hoạt động
- [ ] Logout thành công

## Blog
- [ ] /blog hiển thị danh sách bài viết
- [ ] Phân trang hoạt động
- [ ] /blog/[slug] render MDX đúng
- [ ] Metadata SEO đúng theo post

## Guides
- [ ] /guides lọc category OK
- [ ] Search guide hoạt động
- [ ] /guides/[slug] hiển thị step-by-step
- [ ] Progress bar chạy đúng khi scroll

## Admin
- [ ] /admin chỉ cho user đã auth
- [ ] Tạo post mới thành công
- [ ] Edit post thành công
- [ ] Publish toggle hoạt động
- [ ] CRUD guide đầy đủ

## Security
- [ ] API protected route trả 401 khi chưa auth
- [ ] Có CSP + X-Frame-Options header
- [ ] Rate limit có hiệu lực
- [ ] Form có CSRF protection

## Production & Ops
- [ ] HTTPS hợp lệ
- [ ] PM2 auto restart
- [ ] CI/CD deploy từ main thành công
- [ ] Backup DB chạy và có file .sql.gz
- [ ] Runbook có thể follow để rollback
