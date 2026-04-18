# TASK-24 — P1 Next.js security patch upgrade

## Objective
Upgrade Next.js to latest patch in 14.2.x line and run full regression.

## Changes
- Upgraded:
  - `next` -> `14.2.35`
  - `eslint-config-next` -> `14.2.35`

## Validation (local)
- `npm run test` -> PASS
- `npm run build` -> PASS
- `npm run test:e2e` with production base URL -> PASS (8/8)

## Production rollout
- Synced code to VPS
- Ran:
  - `npm ci`
  - `npx prisma migrate deploy`
  - `npm run build`
  - `pm2 reload ecosystem.config.js --only blogmmo`
- Health checks:
  - `/` -> 200
  - `/api/health` -> 200

## Outcome
- Next.js patch upgrade completed without regression in current test matrix.
