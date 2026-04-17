#!/usr/bin/env bash
set -euo pipefail
export PGPASSFILE=/home/deploy/.pgpass
TS=$(date +%F-%H%M%S)
pg_dump -h 127.0.0.1 -U appuser -d appdb | gzip > /backups/appdb_${TS}.sql.gz
find /backups -type f -name 'appdb_*.sql.gz' -mtime +14 -delete
