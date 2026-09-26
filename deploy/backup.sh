#!/usr/bin/env bash
# Nightly backup of the database and uploaded media.
#   crontab -e  →  30 2 * * * /var/www/zeetech/deploy/backup.sh >> /var/log/zeetech-backup.log 2>&1
#
# Keeps 14 days locally. Set RCLONE_REMOTE (e.g. "b2:zeetech-backups") to also
# copy each backup off the server with rclone — strongly recommended.
set -euo pipefail

APP_DIR="$(cd "$(dirname "$0")/.." && pwd)"
BACKUP_DIR="${BACKUP_DIR:-/var/backups/zeetech}"
KEEP_DAYS="${KEEP_DAYS:-14}"
STAMP="$(date +%Y-%m-%d_%H%M)"
mkdir -p "$BACKUP_DIR"

# database (runs pg_dump inside the postgres container)
docker compose -f "$APP_DIR/deploy/docker-compose.yml" exec -T postgres \
  pg_dump -U zeetech --format=custom zeetech > "$BACKUP_DIR/db_$STAMP.dump"

# uploaded images, videos and caption files
tar -czf "$BACKUP_DIR/media_$STAMP.tar.gz" -C "$APP_DIR" media

find "$BACKUP_DIR" -type f -mtime +"$KEEP_DAYS" -delete

if [ -n "${RCLONE_REMOTE:-}" ]; then
  rclone copy "$BACKUP_DIR" "$RCLONE_REMOTE" --max-age 25h
fi

echo "$(date) backup ok: db_$STAMP.dump, media_$STAMP.tar.gz"

# Restore:
#   docker compose -f deploy/docker-compose.yml exec -T postgres pg_restore -U zeetech -d zeetech --clean < db_XXXX.dump
#   tar -xzf media_XXXX.tar.gz -C /var/www/zeetech
