# RUNBOOK.md

## 1) Deploy mới
1. Pull code vào `/var/www/blogmmo/current` (hoặc rsync từ CI runner)
2. Khôi phục/tạo `.env` production (lưu ý không để rsync --delete xóa file env)
3. Cài deps: `npm ci`
4. DB sync hiện tại (MVP): `npx prisma db push`
5. Build: `npm run build`
6. Reload app: `pm2 reload ecosystem.config.js --only blogmmo`
7. Persist process list: `pm2 save`

## 2) Rollback nhanh
1. Vào thư mục deploy: `cd /var/www/blogmmo/current`
2. Checkout commit stable gần nhất: `git checkout <commit>`
3. Cài deps: `npm ci`
4. Build: `npm run build`
5. Sync DB nếu cần tương thích schema: `npx prisma db push`
6. Reload app: `pm2 reload ecosystem.config.js --only blogmmo`

## 3) Backup DB
- Script: `/home/deploy/bin_backup_appdb.sh`
- Output: `/backups/appdb_<timestamp>.sql.gz`
- Cron daily (02:00)
- Retention: 14 ngày (xóa file cũ hơn 14 ngày)

## 4) Restore DB
1. Dừng app tạm thời: `pm2 stop blogmmo`
2. Restore: `gunzip -c /backups/<file>.sql.gz | psql -h 127.0.0.1 -U appuser -d appdb`
3. Start lại app: `pm2 start ecosystem.config.js --only blogmmo`
4. Verify dữ liệu + smoke test routes

## 5) Health checks
- `curl -I https://www.sspaitools.com`
- `curl -s https://www.sspaitools.com/api/health`
- `pm2 status`
- `systemctl status nginx`
- `ls -lh /backups | tail`
- `crontab -l | grep bin_backup_appdb.sh`

## 6) Analytics (Umami/Plausible style)
- Set env:
  - `ANALYTICS_SCRIPT_URL`
  - `ANALYTICS_WEBSITE_ID`
- Deploy/reload app để script analytics được inject.
