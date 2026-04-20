# Blog Editor Cá Nhân — Hướng dẫn triển khai lên VPS

Một giao diện soạn bài viết cho blog cá nhân, **single-page HTML** chạy hoàn toàn ở client, không cần backend, không cần database. Rất nhẹ, deploy được trên mọi VPS chỉ trong vài phút.

---

## 1. Nội dung source

```
blog-editor/
├── index.html                  # Toàn bộ app (HTML + CSS + JS trong 1 file)
├── README.md                   # File này
└── deploy/
    ├── nginx.conf.example      # Cấu hình Nginx mẫu
    ├── apache.htaccess.example # Cấu hình Apache mẫu
    └── docker-compose.yml      # Deploy bằng Docker (tùy chọn)
```

**Phụ thuộc bên ngoài** (load qua CDN, cần VPS có mạng ra internet):

- Tailwind CSS (cdn.tailwindcss.com)
- Google Fonts (fonts.googleapis.com)

> Nếu VPS của bạn chạy offline hoặc muốn tự host, xem phần **"7. Tự host CDN"** ở dưới.

---

## 2. Yêu cầu hệ thống

- VPS với Ubuntu 20.04+, Debian 11+, CentOS 8+, hoặc tương đương
- Tối thiểu 512 MB RAM, 1 GB ổ cứng
- Tên miền đã trỏ về IP VPS (tuỳ chọn, nhưng khuyến khích)
- Quyền root hoặc sudo

---

## 3. Cách 1 — Deploy với Nginx (khuyến nghị)

### Bước 1: Cài Nginx

```bash
# Ubuntu / Debian
sudo apt update
sudo apt install -y nginx

# CentOS / RHEL
sudo yum install -y nginx
sudo systemctl enable nginx
```

### Bước 2: Upload source lên VPS

Từ máy local, dùng `scp` hoặc `rsync`:

```bash
# scp
scp -r blog-editor/ user@your-vps-ip:/tmp/

# hoặc rsync (khuyến nghị — nhanh hơn khi update)
rsync -avz blog-editor/ user@your-vps-ip:/tmp/blog-editor/
```

Sau đó SSH vào VPS và copy vào thư mục web:

```bash
ssh user@your-vps-ip
sudo mkdir -p /var/www/blog-editor
sudo cp -r /tmp/blog-editor/* /var/www/blog-editor/
sudo chown -R www-data:www-data /var/www/blog-editor
sudo chmod -R 755 /var/www/blog-editor
```

### Bước 3: Cấu hình Nginx

```bash
sudo nano /etc/nginx/sites-available/blog-editor
```

Dán nội dung từ `deploy/nginx.conf.example` (nhớ đổi `your-domain.com` thành tên miền của bạn).

Kích hoạt site:

```bash
sudo ln -s /etc/nginx/sites-available/blog-editor /etc/nginx/sites-enabled/
sudo nginx -t                     # kiểm tra cấu hình
sudo systemctl reload nginx
```

Xong! Truy cập `http://your-domain.com` (hoặc IP VPS) để xem.

### Bước 4: Bật HTTPS với Let's Encrypt (khuyến nghị)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

Certbot tự động cấu hình HTTPS và gia hạn chứng chỉ. Xong.

---

## 4. Cách 2 — Deploy với Apache

### Bước 1: Cài Apache

```bash
sudo apt install -y apache2
sudo a2enmod rewrite headers deflate
```

### Bước 2: Upload file

```bash
sudo mkdir -p /var/www/blog-editor
sudo cp -r blog-editor/* /var/www/blog-editor/
sudo cp blog-editor/deploy/apache.htaccess.example /var/www/blog-editor/.htaccess
sudo chown -R www-data:www-data /var/www/blog-editor
```

### Bước 3: Tạo Virtual Host

```bash
sudo nano /etc/apache2/sites-available/blog-editor.conf
```

Nội dung:

```apache
<VirtualHost *:80>
    ServerName your-domain.com
    ServerAlias www.your-domain.com
    DocumentRoot /var/www/blog-editor

    <Directory /var/www/blog-editor>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>

    ErrorLog ${APACHE_LOG_DIR}/blog-editor-error.log
    CustomLog ${APACHE_LOG_DIR}/blog-editor-access.log combined
</VirtualHost>
```

```bash
sudo a2ensite blog-editor.conf
sudo a2dissite 000-default.conf
sudo systemctl reload apache2
```

HTTPS với Certbot:

```bash
sudo apt install -y certbot python3-certbot-apache
sudo certbot --apache -d your-domain.com
```

---

## 5. Cách 3 — Deploy siêu nhanh bằng Python (thử nghiệm/local)

Chỉ dành cho test, **không dùng cho production**:

```bash
cd /var/www/blog-editor
python3 -m http.server 8080
```

Truy cập `http://your-vps-ip:8080`. Nhớ mở port 8080 trên firewall.

---

## 6. Cách 4 — Deploy bằng Docker

Nếu thích gói gọn trong container:

```bash
cd blog-editor
docker compose up -d
```

File `deploy/docker-compose.yml` đã cấu hình sẵn Nginx Alpine (cực nhẹ, ~20MB). Truy cập `http://your-vps-ip:8080`.

Dừng:
```bash
docker compose down
```

---

## 7. Tự host CDN (nếu VPS offline hoặc muốn tăng tốc)

Mặc định app load Tailwind và Google Fonts từ CDN. Nếu muốn tự host:

### 7a. Tailwind

```bash
cd /var/www/blog-editor
mkdir -p assets
curl -o assets/tailwind.js https://cdn.tailwindcss.com
```

Sửa `index.html`:

```html
<!-- Cũ -->
<script src="https://cdn.tailwindcss.com"></script>

<!-- Mới -->
<script src="assets/tailwind.js"></script>
```

### 7b. Google Fonts

1. Truy cập https://gwfh.mranftl.com/fonts (Google Webfonts Helper)
2. Chọn các font: **Lora, Inter, JetBrains Mono, Merriweather**
3. Chọn charset **latin + vietnamese**, chọn format `woff2`
4. Tải về, giải nén vào `/var/www/blog-editor/assets/fonts/`
5. Copy CSS mà trang đó sinh ra, dán vào `<style>` trong `index.html`
6. Xoá dòng `<link href="https://fonts.googleapis.com/...">` cũ

---

## 8. Cập nhật sau khi chỉnh sửa

Khi bạn sửa `index.html` ở local và muốn update lên VPS:

```bash
rsync -avz --delete blog-editor/ user@your-vps-ip:/var/www/blog-editor/
```

Không cần restart Nginx/Apache — web là static nên browser sẽ tự load bản mới (có thể cần Ctrl+F5 để xoá cache).

---

## 9. Lưu ý về dữ liệu bài viết

> **Quan trọng:** Demo hiện lưu dữ liệu trong **RAM của trình duyệt** (state JavaScript). Khi reload trang, các bài mới tạo sẽ mất — chỉ còn 5 bài mẫu.

### Các cách nâng cấp để lưu dữ liệu thật:

**Option A — LocalStorage (nhanh nhất, 5 phút):**

Tìm đoạn `let state = { ... }` trong `index.html`, thay bằng:

```js
let state = JSON.parse(localStorage.getItem('blogState')) || {
  posts: JSON.parse(JSON.stringify(DEMO_POSTS)),
  currentId: 'p1',
  filter: { folder: 'all', tag: null, q: '' },
  theme: 'light',
  goalTarget: 500,
  streak: 7,
};

// Trong hàm saveCurrent(), thêm vào cuối:
localStorage.setItem('blogState', JSON.stringify(state));
```

Bài sẽ lưu ngay trong trình duyệt của bạn — mở ở trình duyệt khác sẽ không thấy. Đủ dùng cho blog cá nhân.

**Option B — Supabase (miễn phí, sync đa thiết bị):**

Đăng ký https://supabase.com (free 500MB DB). Tạo bảng `posts`, thêm Supabase JS SDK vào `index.html`, thay `saveCurrent()` để gọi API Supabase.

**Option C — Backend riêng:**

Viết backend nhỏ bằng Node.js/Express + SQLite, thêm auth đơn giản. Dành cho ai muốn control hoàn toàn.

Nếu muốn hỗ trợ làm Option B hoặc C, báo nhé.

---

## 10. Firewall — mở port

```bash
# UFW (Ubuntu)
sudo ufw allow 'Nginx Full'   # hoặc 'Apache Full'
sudo ufw enable

# firewalld (CentOS)
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

---

## 11. Troubleshooting

**Trang hiện 403 Forbidden**
→ Kiểm tra quyền file: `sudo chown -R www-data:www-data /var/www/blog-editor && sudo chmod -R 755 /var/www/blog-editor`

**Font / style không load**
→ Kiểm tra VPS có ra được internet không: `curl -I https://cdn.tailwindcss.com`. Nếu không, dùng cách tự host ở mục 7.

**Reload bị mất bài viết**
→ Đúng như mô tả ở mục 9. Cần thêm LocalStorage hoặc backend.

**Nginx báo `nginx: [emerg] ...`**
→ Chạy `sudo nginx -t` để xem lỗi chi tiết. Thường là sai đường dẫn hoặc port conflict.

---

## 12. Checklist deploy nhanh

- [ ] SSH vào VPS
- [ ] Cài Nginx: `sudo apt install -y nginx`
- [ ] Upload source: `rsync -avz blog-editor/ user@vps:/var/www/blog-editor/`
- [ ] Set quyền: `sudo chown -R www-data:www-data /var/www/blog-editor`
- [ ] Copy nginx config từ `deploy/nginx.conf.example`, sửa domain
- [ ] `sudo nginx -t && sudo systemctl reload nginx`
- [ ] Cài SSL: `sudo certbot --nginx -d your-domain.com`
- [ ] Mở firewall: `sudo ufw allow 'Nginx Full'`
- [ ] Truy cập https://your-domain.com — xong!

---

Chúc bạn deploy thuận lợi và có nhiều niềm vui khi viết blog.
