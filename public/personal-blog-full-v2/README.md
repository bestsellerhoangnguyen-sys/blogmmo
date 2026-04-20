# Personal Blog v2 — Full Stack (Node.js + PostgreSQL + R2 + Docker)

Phiên bản production-ready: **backend thật** thay cho localStorage.

- **Backend:** Node.js 20 + Express + PostgreSQL 16
- **Auth:** JWT (httpOnly cookie) + bcrypt
- **Media:** S3-compatible (Cloudflare R2 / Backblaze B2 / AWS S3 / MinIO)
- **Frontend:** HTML/CSS/JS thuần (từ v1) + `api.js` client
- **Deploy:** 1 lệnh — `docker compose up -d`

---

## 📁 Cấu trúc

```
blog-v2/
├── backend/
│   ├── src/
│   │   ├── index.js               # Express server
│   │   ├── db.js                  # PG pool + tx helpers
│   │   ├── auth.js                # JWT, bcrypt, middleware
│   │   ├── storage.js             # S3 upload/delete
│   │   ├── schema.sql             # Tables, indexes, triggers
│   │   ├── scripts/
│   │   │   ├── migrate.js         # Apply schema.sql
│   │   │   └── seed.js            # Admin + demo content
│   │   └── routes/
│   │       ├── auth.js            # /api/auth/*
│   │       ├── posts.js           # /api/posts/*
│   │       ├── categories.js      # /api/categories/*
│   │       ├── comments.js        # /api/comments/*
│   │       ├── media.js           # /api/media/*
│   │       ├── subscribers.js     # /api/subscribers/*
│   │       └── settings.js        # /api/settings/*
│   ├── Dockerfile
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── index.html                 # Reader (from v1)
│   ├── admin.html                 # CMS (from v1)
│   ├── shared.css                 # Design system
│   ├── shared.js                  # Helpers + embed hydration
│   ├── api.js                     # API client
│   ├── data-store.js              # Cache backed by API (v1-compat)
│   └── MIGRATION.md               # How to rewire v1 HTML to v2 API
├── nginx/
│   └── nginx.conf                 # Reverse proxy + static server
├── docker-compose.yml             # db + backend + migrate + web
├── .env.example
└── README.md
```

---

## 🚀 Quick start (local)

```bash
# 1. Clone / extract source
cd blog-v2

# 2. Fill in env files
cp .env.example .env
cp backend/.env.example backend/.env
# ⮕ edit backend/.env: set JWT_SECRET, ADMIN_PASSWORD, S3_* credentials

# 3. Start everything
docker compose up -d

# 4. Watch migrate container to confirm schema + seed ran
docker compose logs -f migrate

# 5. Visit
#    Reader:  http://localhost
#    Admin:   http://localhost/admin.html
```

Login with `ADMIN_USERNAME` / `ADMIN_PASSWORD` from `backend/.env`.

---

## 🔐 Generating secrets

```bash
# JWT secret (at least 32 bytes)
openssl rand -base64 48

# Admin password
openssl rand -base64 24

# PostgreSQL password (root .env)
openssl rand -base64 24
```

Paste into the respective `.env` files.

---

## ☁️ Configuring S3-compatible storage

### Cloudflare R2 (recommended — free egress)

1. Create a bucket at https://dash.cloudflare.com → R2.
2. Create an API token with **Object Read & Write** scope on the bucket.
3. (Optional but recommended) Map a custom domain like `media.yourblog.com` to the bucket for a nicer public URL.

Fill `backend/.env`:
```
S3_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com
S3_REGION=auto
S3_BUCKET=blog-media
S3_ACCESS_KEY_ID=<token key>
S3_SECRET_ACCESS_KEY=<token secret>
S3_PUBLIC_URL=https://media.yourblog.com     # or https://<account-id>.r2.cloudflarestorage.com/blog-media
```

### Backblaze B2 (alternative)

```
S3_ENDPOINT=https://s3.us-west-002.backblazeb2.com
S3_REGION=us-west-002
S3_BUCKET=blog-media
S3_ACCESS_KEY_ID=<keyID>
S3_SECRET_ACCESS_KEY=<applicationKey>
S3_PUBLIC_URL=https://f002.backblazeb2.com/file/blog-media
```

### MinIO (self-host, for dev)

```
S3_ENDPOINT=http://minio:9000
S3_REGION=us-east-1
S3_BUCKET=blog-media
S3_ACCESS_KEY_ID=minioadmin
S3_SECRET_ACCESS_KEY=minioadmin
S3_PUBLIC_URL=http://localhost:9000/blog-media
```

---

## 🌐 Deploying to a VPS

### 1. Provision

```bash
# On your VPS (Ubuntu 22.04+)
sudo apt update && sudo apt install -y docker.io docker-compose-plugin
sudo usermod -aG docker $USER   # log out/in
```

### 2. Upload source

```bash
# From your laptop
rsync -av --exclude node_modules --exclude .env blog-v2/ user@vps:/opt/blog/
```

### 3. Configure env on VPS

```bash
ssh user@vps
cd /opt/blog
cp .env.example .env && nano .env
cp backend/.env.example backend/.env && nano backend/.env
```

Set `SITE_ORIGIN=https://yourblog.com`.

### 4. Start

```bash
docker compose up -d
docker compose logs -f migrate  # confirm "Seed complete"
```

### 5. HTTPS (Let's Encrypt via Caddy, easiest)

Instead of the bundled Nginx, swap to Caddy for automatic HTTPS:

**Caddyfile** (at project root):
```
yourblog.com {
  reverse_proxy /api/* backend:4000
  root * /usr/share/caddy
  file_server
  try_files {path} /index.html
}
```

Then in `docker-compose.yml` replace the `web:` service with:
```yaml
web:
  image: caddy:alpine
  restart: unless-stopped
  ports: ["80:80", "443:443"]
  volumes:
    - ./frontend:/usr/share/caddy:ro
    - ./Caddyfile:/etc/caddy/Caddyfile:ro
    - caddydata:/data
    - caddyconfig:/config
```
Point your domain's A record to the VPS IP → done.

### 6. Protecting /admin.html further

You already have JWT login, but as an **extra layer** you can also gate the admin SPA behind Basic Auth (two-factor-lite):

```bash
# Install htpasswd
sudo apt install -y apache2-utils

# Create .htpasswd
htpasswd -c ./nginx/.htpasswd admin
```

Uncomment the `location = /admin.html { ... auth_basic ... }` block in `nginx/nginx.conf` and the `./nginx/.htpasswd` volume mount in `docker-compose.yml`. Restart.

---

## 🔌 API reference (short)

All endpoints prefixed with `/api`. JWT is read from cookie `token` or `Authorization: Bearer`.

### Auth
- `POST /auth/login` `{username, password}` → `{token, user}`, sets cookie
- `POST /auth/logout`
- `GET  /auth/me` *(auth)* → `{user}`

### Posts
- `GET  /posts?page=1&limit=20&q=&category=&tag=&status=` — published only for public; admin can filter by status
- `GET  /posts/by-slug/:slug` — public, increments views
- `GET  /posts/:id` *(auth)*
- `POST /posts` *(auth)* — create
- `PUT  /posts/:id` *(auth)* — update
- `DELETE /posts/:id` *(auth)*
- `POST /posts/:id/react` `{emoji}` — public

### Categories
- `GET  /categories` — public
- `POST /categories` *(auth)*
- `PUT  /categories/:id` *(auth)*
- `DELETE /categories/:id` *(auth)*

### Comments
- `GET  /comments/post/:postId` — approved only for public
- `POST /comments/post/:postId` `{author, email, content}` — public, status = pending
- `GET  /comments?status=pending|approved|spam|all` *(auth)*
- `PATCH /comments/:id` `{status}` *(auth)*
- `DELETE /comments/:id` *(auth)*

### Media
- `GET  /media?type=image|video|audio` *(auth)*
- `POST /media` *(auth, multipart)* — field: `file`, max 50MB
- `DELETE /media/:id` *(auth)*

### Subscribers
- `POST /subscribers` `{email}` — public
- `GET  /subscribers` *(auth)*
- `GET  /subscribers/export.csv` *(auth)*
- `DELETE /subscribers/:id` *(auth)*

### Settings
- `GET  /settings` — public (site info, author, appearance)
- `PUT  /settings/:key` *(auth)* — body is the new JSON value

---

## 🔄 Migrating from v1 (localStorage) data

Export from v1 admin → Settings → "Export data" → you get a JSON file.

To import into v2, write a one-off script in Postgres that reads the JSON and `INSERT`s into `posts`, `categories`, `comments`. Ask me if you want a ready-to-run importer — it's ~50 lines of Node.

---

## 🛠️ Maintenance

### Backup Postgres

```bash
docker compose exec db pg_dump -U blog blog > backup-$(date +%F).sql
```

### Restore

```bash
cat backup-2026-04-20.sql | docker compose exec -T db psql -U blog blog
```

### Reset DB

```bash
docker compose down -v    # deletes volume, ALL DATA GONE
docker compose up -d      # fresh start, re-seeds admin + demo
```

### Logs

```bash
docker compose logs -f backend
docker compose logs -f web
docker compose logs -f db
```

### Update (pull new source)

```bash
rsync -av blog-v2/ user@vps:/opt/blog/
ssh user@vps "cd /opt/blog && docker compose build backend && docker compose up -d"
```

---

## 🧪 Testing the API without the UI

```bash
# Health
curl http://localhost/api/health

# Login
curl -c cookies.txt -H 'Content-Type: application/json' \
  -d '{"username":"admin","password":"yourpass"}' \
  http://localhost/api/auth/login

# List posts (public)
curl http://localhost/api/posts | jq .

# List all posts including drafts (admin)
curl -b cookies.txt 'http://localhost/api/posts?status=all' | jq .

# Upload media
curl -b cookies.txt -F file=@photo.jpg http://localhost/api/media | jq .
```

---

## ⚠️ Limits / gotchas

- **`upload_max_body_size`** in nginx is set to 60MB. For bigger videos, increase it and also `UPLOAD_MAX_MB` in `backend/.env`.
- **Rate limits**: login 10/15min, comment 10/10min, subscribe 5/10min, global 300/min. Adjust in route files if needed.
- **CORS** uses `SITE_ORIGIN` from env. If the reader and admin are on different subdomains (e.g. `blog.com` + `admin.blog.com`), set `SITE_ORIGIN=https://blog.com,https://admin.blog.com` (comma-separated).
- **Cookies** are set `httpOnly + sameSite=lax + secure(prod)`. They only work over HTTPS in production.
- **Single admin** by default. Multi-user support: add rows to `users` manually or extend the `/api/auth` routes.

---

## 📦 Wiring the frontend

See `frontend/MIGRATION.md` for exactly what to change in the existing `index.html` and `admin.html` to consume the API instead of localStorage. The migration is small: swap `shared.js` imports + replace `saveData()` with `api.*` calls for the admin write paths.

---

**Bản này là bộ khung hoàn chỉnh — bạn có thể đi thẳng vào production hoặc mở rộng thêm (multi-user, comment replies, full-text search nâng cao, v.v.).**
