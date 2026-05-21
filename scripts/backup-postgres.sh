#!/usr/bin/env bash
# backup-postgres.sh — Säkerhetskopiera PostgreSQL-databasen ihp
#
# Läge           Kommando
# Docker         ./scripts/backup-postgres.sh
# Standalone     ./scripts/backup-postgres.sh --standalone
#
# Miljövariabler:
#   BACKUP_DIR   Destinationskatalog  (standard: /var/backups/arkivforteckningsklient)
#   ENV_FILE     Sökväg till .env     (standard: beror på läge, se nedan)
#   COMPOSE_FILE Docker Compose-fil   (standard: docker-compose.prod.yml)

set -euo pipefail

BACKUP_DIR="${BACKUP_DIR:-/var/backups/arkivforteckningsklient}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/ihp_${TIMESTAMP}.sql.gz"
MODE="${1:-docker}"

mkdir -p "${BACKUP_DIR}"

if [[ "${MODE}" == "--standalone" ]]; then
  ENV_FILE="${ENV_FILE:-/etc/arkivforteckningsklient/.env}"
  if [[ -f "${ENV_FILE}" ]]; then
    # shellcheck disable=SC1090
    set -a; source "${ENV_FILE}"; set +a
  fi
  PGPASSWORD="${SPRING_DATASOURCE_PASSWORD}" \
    pg_dump \
      -h localhost \
      -U "${SPRING_DATASOURCE_USERNAME:-ihpuser}" \
      -d ihp \
      --no-password \
    | gzip > "${BACKUP_FILE}"
else
  COMPOSE_FILE="${COMPOSE_FILE:-docker-compose.prod.yml}"
  ENV_FILE="${ENV_FILE:-.env.production}"
  if [[ -f "${ENV_FILE}" ]]; then
    # shellcheck disable=SC1090
    set -a; source "${ENV_FILE}"; set +a
  fi
  docker compose -f "${COMPOSE_FILE}" exec -T db \
    pg_dump -U "${DB_USERNAME:-ihpuser}" ihp \
    | gzip > "${BACKUP_FILE}"
fi

echo "Säkerhetskopia sparad: ${BACKUP_FILE}"
ls -lh "${BACKUP_FILE}"
