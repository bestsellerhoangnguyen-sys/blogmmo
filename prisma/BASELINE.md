# Prisma baseline migration notes

This project originally bootstrapped schema with `prisma db push` for speed.

To switch safely to migration-based deploys in existing environments:

1. Keep migration file in `prisma/migrations/20260417_phase2_baseline/migration.sql`
2. On environments that already contain tables, mark baseline as applied:

```bash
npx prisma migrate resolve --applied 20260417_phase2_baseline
```

3. Then use normal deploy flow:

```bash
npx prisma migrate deploy
```

For brand-new databases, `migrate deploy` will execute baseline SQL automatically.
