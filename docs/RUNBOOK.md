# RUNBOOK.md

## 1) Deploy mới
1. Pull code từ `main`
2. Cài deps: `pnpm install --frozen-lockfile`
3. Build: `pnpm build`
4. Migrate prod: `pnpm prisma migrate deploy`
5. Reload app: `pm2 reload ecosystem.config.js --env production`

## 2) Rollback nhanh
1. Checkout commit stable gần nhất
2. `pnpm install --frozen-lockfile`
3. `pnpm build`
4. `pm2 reload ecosystem.config.js --env production`

## 3) Backup DB
- Script: `pg_dump -U appuser -d appdb | gzip > /backups/appdb_$(date +%F).sql.gz`
- Cron daily (02:00)

## 4) Restore DB
1. `gunzip -c /backups/<file>.sql.gz | psql -U appuser -d appdb`
2. Verify dữ liệu và restart app

## 5) Health checks
- `curl -I https://domain.com`
- `curl -I https://domain.com/api/health`
- `pm2 status`
- `systemctl status nginx`
