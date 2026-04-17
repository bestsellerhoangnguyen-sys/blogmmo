# HANDOVER_CHECKLIST.md

## Quick Handover (5-minute runbook)

### A. Confirm services
- [ ] `pm2 status` shows `blogmmo` online
- [ ] `systemctl status nginx` is active
- [ ] `curl -s https://www.sspaitools.com/api/health` returns `{ ok: true }`

### B. Confirm key routes
- [ ] `https://www.sspaitools.com/blog` loads
- [ ] `https://www.sspaitools.com/guides` loads
- [ ] `https://www.sspaitools.com/admin` loads

### C. Confirm backup
- [ ] `crontab -l | grep bin_backup_appdb.sh`
- [ ] `ls -lh /backups | tail` contains recent `.sql.gz`

### D. Deploy procedure (operator)
- [ ] Pull/sync latest code into `/var/www/blogmmo/current`
- [ ] Ensure `.env` exists and valid
- [ ] `npm ci && npx prisma db push && npm run build`
- [ ] `pm2 reload ecosystem.config.js --only blogmmo`
- [ ] `pm2 save`

### E. Rollback procedure (operator)
- [ ] `git checkout <stable-commit>`
- [ ] `npm ci && npm run build`
- [ ] `pm2 reload ecosystem.config.js --only blogmmo`

### F. Security checks
- [ ] Root SSH login disabled
- [ ] Password SSH auth disabled
- [ ] Firewall services only `ssh http https`
- [ ] Response headers include CSP + X-Frame-Options

## Required secrets/config to keep safe
- Database password (`appuser`)
- NEXTAUTH secret
- Admin credentials
- Deploy key / GitHub secrets
