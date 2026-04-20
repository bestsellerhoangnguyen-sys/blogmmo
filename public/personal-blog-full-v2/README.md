# Personal Blog — Full Platform (Reader + CMS)

Một nền tảng blog cá nhân hoàn chỉnh: **trang công khai cho độc giả** (`index.html`) và **CMS quản trị** (`admin.html`), chia sẻ dữ liệu qua `localStorage`. Phong cách ấm áp, tối giản, ưu tiên trải nghiệm đọc và viết — lấy cảm hứng từ Medium, Ghost, Bear Blog, Substack.

> Toàn bộ chạy ở **client-side** (HTML/CSS/JS thuần + Tailwind CDN). Không cần build, không cần backend cho bản demo. Có thể deploy lên bất kỳ VPS / static host nào.

---

## 📁 Cấu trúc

```
blog-full/
├── index.html      # Trang công khai cho người đọc
├── admin.html      # CMS quản trị (login → dashboard → editor)
├── shared.css      # Design system dùng chung (3 theme: light / dark / sepia)
├── shared.js       # Data layer + helpers + embed hydration
└── README.md       # File này
```

Hai file HTML đều nạp `shared.css` và `shared.js`, chia sẻ dữ liệu qua key `blog_data_v1` trong `localStorage`.

---

## ✨ Tính năng đầy đủ

### Trang công khai (`index.html`)

- **Trang chủ** — bài nổi bật (hero), danh sách bài viết mới, chuyên mục, newsletter.
- **Trang bài viết** — typography serif (Merriweather/Lora), thanh tiến độ đọc, TOC tự động với active highlight, nút bookmark, drop cap tuỳ chọn, reading time, mood badge.
- **Trang lưu trữ** (`#/archive`) — toàn bộ bài gom theo tháng.
- **Trang tag** (`#/tags/{tag}`) và **chuyên mục** (`#/categories/{slug}`).
- **Trang giới thiệu** (`#/about`) — lấy từ Settings.
- **404** — thân thiện, gợi ý quay về trang chủ.

### Block / embed hỗ trợ trong bài viết

- Heading (H1 → H3), paragraph, blockquote, bullet/numbered/checklist.
- **Code block** có cú pháp tô màu nhẹ + ngôn ngữ, **inline code**.
- **Bảng** (content table), **divider**, **callout** (highlight).
- **Ảnh đơn**, **gallery 2 cột** với lightbox.
- **Video upload** (mp4/webm), **YouTube**, **Vimeo**.
- **Audio** — **Spotify embed**, **SoundCloud embed**.
- **Twitter/X quote**, **Google Maps**.
- **CTA button** (liên kết nổi bật).

### Trải nghiệm đọc

- **3 theme:** light / dark / sepia (lưu trong localStorage).
- **3 cỡ chữ:** small / medium / large.
- **Lightbox ảnh** — bấm vào ảnh/gallery để phóng to.
- **Command palette** (`Ctrl + K`) — nhảy nhanh giữa các bài.
- **Reactions** — 5 emoji (👏 ❤️ 🔥 💡 🙏).
- **Bình luận** — post + hiển thị (moderation pending/approved).
- **Chia sẻ** — Facebook, X/Twitter, copy link, in bài.
- **Prev / Next post** + **related posts**.
- **Author bio card** cuối bài.
- **Cookie banner**, **mobile nav**, **newsletter form**.

### CMS quản trị (`admin.html`)

- **Login gate** — demo: nhập bất kỳ tên đăng nhập & mật khẩu nào (chỉ là gate UX, không xác thực thật).
- **Dashboard** — 4 stat cards (posts / views / comments / subscribers), recent posts, top posts, activity feed.
- **Danh sách bài viết** — lọc theo search / status / category, bảng có action edit / view / delete.
- **Editor**:
  - Title, cover picker (upload hoặc chọn từ media library).
  - **Canvas contentEditable** với **slash menu (`/`)** kiểu Notion — 20+ loại block (headings, quote, lists, checklist, code, table, divider, callout, image, gallery, video, YouTube, Vimeo, Spotify, SoundCloud, Twitter, Maps, CTA).
  - **Floating toolbar** khi bôi đen chữ (bold / italic / underline / link / heading).
  - **Sidebar**: status (draft / published), slug (auto từ title, Unicode VN), category, tags, date, featured toggle, drop cap toggle, **mood picker** (12 emoji), signature, **SEO** (meta title / description / OG image), delete post.
  - **Auto-save** với debounce + shortcut **`Ctrl + S`**.
- **Thư viện media** — grid view, upload (images / video / audio), search / filter, delete, copy URL, reuse qua picker modal.
- **Bình luận** — moderation: filter pending / approved, approve / unapprove / delete.
- **Chuyên mục** — inline edit tên / slug / màu, add / delete.
- **Người đăng ký (newsletter)** — danh sách email + export CSV.
- **Cài đặt**:
  - Site info (tên, tagline, description).
  - Author (tên, bio, avatar, social links).
  - Appearance (accent color picker, default theme, font).
  - SEO defaults.
  - **Export** (JSON backup) / **Import** / **Reset** data.

---

## 🚀 Chạy thử local

Chỉ cần mở 2 file trong trình duyệt:

```bash
# Trang công khai
start blog-full/index.html     # Windows
open  blog-full/index.html     # macOS
xdg-open blog-full/index.html  # Linux

# CMS quản trị (mở tab mới)
start blog-full/admin.html
```

Lần đầu chạy, `shared.js` sẽ seed **7 bài viết demo**, 5 chuyên mục, vài comment, và 6 media mẫu vào localStorage — để bạn xem ngay mọi thứ hoạt động thế nào.

> **Lưu ý:** `index.html` và `admin.html` chia sẻ localStorage **chỉ khi mở cùng origin** (cùng protocol + host + port). Nếu mở bằng `file://` thì 2 tab tự động đồng bộ (cùng origin `file://`). Nếu deploy, đảm bảo cả hai cùng domain.

---

## 🔐 Đăng nhập admin (demo)

- **URL:** `/admin.html`
- **Username / Password:** bất kỳ (demo client-side, không xác thực).
- Session được nhớ trong `sessionStorage` — đóng tab sẽ logout.

**Production:** bạn cần thay login gate bằng xác thực thật (ví dụ: Basic Auth từ Nginx, hoặc gắn vào một backend — xem phần "Nâng cấp production" bên dưới).

---

## 🌐 Deploy lên VPS

### 1. Nginx (khuyên dùng)

```nginx
server {
  listen 80;
  server_name yourblog.com www.yourblog.com;

  root /var/www/blog;
  index index.html;

  # Static caching
  location ~* \.(js|css|woff2?|png|jpg|jpeg|gif|svg|webp|mp4|webm)$ {
    expires 30d;
    add_header Cache-Control "public, immutable";
  }

  # Bảo vệ admin bằng Basic Auth
  location = /admin.html {
    auth_basic "Admin Area";
    auth_basic_user_file /etc/nginx/.htpasswd;
    try_files $uri =404;
  }

  # Mọi route khác
  location / {
    try_files $uri $uri/ /index.html;
  }

  # Security headers
  add_header X-Frame-Options "SAMEORIGIN";
  add_header X-Content-Type-Options "nosniff";
  add_header Referrer-Policy "strict-origin-when-cross-origin";
}
```

Tạo file mật khẩu cho admin:

```bash
sudo apt install apache2-utils
sudo htpasswd -c /etc/nginx/.htpasswd admin
```

Upload files:

```bash
scp -r blog-full/* user@yourvps:/var/www/blog/
```

### 2. Apache (`.htaccess`)

```apache
# SPA fallback — hash routing không cần rewrite, nhưng để an toàn
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ index.html [L]

# Bảo vệ admin
<Files "admin.html">
  AuthType Basic
  AuthName "Admin Area"
  AuthUserFile /var/www/blog/.htpasswd
  Require valid-user
</Files>

# Caching
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType text/css "access plus 30 days"
  ExpiresByType application/javascript "access plus 30 days"
  ExpiresByType image/png "access plus 30 days"
  ExpiresByType image/jpeg "access plus 30 days"
  ExpiresByType video/mp4 "access plus 30 days"
</IfModule>
```

### 3. Docker

`docker-compose.yml`:

```yaml
version: "3.9"
services:
  blog:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./blog-full:/usr/share/nginx/html:ro
      - ./nginx.conf:/etc/nginx/conf.d/default.conf:ro
      - ./.htpasswd:/etc/nginx/.htpasswd:ro
    restart: unless-stopped
```

```bash
docker compose up -d
```

### 4. HTTPS (Let's Encrypt)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourblog.com -d www.yourblog.com
```

---

## 💾 Dữ liệu

- **Lưu trong:** `localStorage[blog_data_v1]` (dưới dạng JSON).
- **Cấu trúc:**
  ```ts
  {
    settings: { siteTitle, tagline, author: {name, bio, avatar, socials}, accent, theme, ... },
    categories: [{ id, name, slug, color, description }],
    posts: [{ id, title, slug, excerpt, cover, content, category, tags, status, date, mood, featured, dropcap, seo, ... }],
    comments: [{ id, postId, author, email, content, date, status }],
    subscribers: [{ id, email, date }],
    media: [{ id, name, type, url, date, size }]
  }
  ```
- **Export backup** từ Settings → "Export data" (tải JSON).
- **Import** từ Settings → "Import data" (upload JSON).
- **Reset** về demo từ Settings → "Reset data".

---

## 🔧 Nâng cấp production

Bản demo là client-only. Để dùng thật, bạn có thể:

1. **Backend thay localStorage** — viết API (Node/Express, FastAPI, Laravel, Go, …) đọc/ghi vào PostgreSQL/MongoDB. Chỉ cần thay `loadData()`/`saveData()` trong `shared.js` bằng `fetch()` calls.
2. **Authentication thật** — JWT / session cookies thay cho `sessionStorage` gate.
3. **Upload media** — dùng S3 / Cloudinary / backend server thay cho dataURL (vì dataURL chiếm rất nhiều dung lượng localStorage).
4. **SSR / SEO** — nếu cần index Google tốt, chuyển sang Next.js/Astro và tái sử dụng design system trong `shared.css`.
5. **Rich editor mạnh hơn** — thay contentEditable bằng TipTap / Lexical / ProseMirror khi cần collaborative editing, tracked changes, …

---

## 🎨 Tùy chỉnh

- **Màu chủ đạo:** Admin → Cài đặt → Appearance → Accent color picker (hoặc sửa biến `--accent` trong `shared.css`).
- **Font:** đang dùng Merriweather (heading), Lora (body), Inter (UI), JetBrains Mono (code). Muốn đổi → sửa `<link>` trong `<head>` của cả 2 HTML + `shared.css`.
- **Logo / favicon:** thay trong `<head>` của `index.html` và `admin.html`.

---

## 📝 Nội dung demo

Blog được seed sẵn 7 bài viết mẫu với nhiều loại content khác nhau để bạn xem mọi khối hiển thị ra sao:
- Bài có video YouTube
- Bài có gallery ảnh
- Bài có bảng
- Bài có code block
- Bài có callout + drop cap
- Bài travelogue dài
- Bài ngắn dạng nhật ký

Xoá toàn bộ demo → Admin → Cài đặt → "Reset data" → bỏ chọn seed, hoặc xoá từng bài trong Danh sách bài viết.

---

## 📜 Giấy phép

Dự án cá nhân, bạn toàn quyền sửa và dùng cho blog của mình.

---

**Have fun writing ✍️**
