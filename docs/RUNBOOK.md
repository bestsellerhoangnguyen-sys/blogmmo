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
1. Checkout commit stable gần nhất
2. `pnpm install --frozen-lockfile`
3. `pnpm build`
4. `pm2 reload ecosystem.config.js --env production`

## 3) Backup DB
- Script: `/home/deploy/bin_backup_appdb.sh`
- Output: `/backups/appdb_<timestamp>.sql.gz`
- Cron daily (02:00)
- Retention: 14 ngày (xóa file cũ hơn 14 ngày)

## 4) Restore DB
1. `gunzip -c /backups/<file>.sql.gz | psql -U appuser -d appdb`
2. Verify dữ liệu và restart app

## 5) Health checks
- `curl -I https://www.sspaitools.com`
- `curl -s https://www.sspaitools.com/api/health`
- `pm2 status`
- `systemctl status nginx`
- `ls -lh /backups | tail`
