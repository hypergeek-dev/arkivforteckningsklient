#!/usr/bin/env bash
# restore-postgres.sh — Återställ PostgreSQL-databasen ihp från säkerhetskopia
#
# VARNING: Återställning skriver ÖVER befintliga data i databasen ihp.
#
# Läge           Kommando
# Docker         ./scripts/restore-postgres.sh <backup-fil.sql.gz>
# Standalone     ./scripts/restore-postgres.sh --standalone <backup-fil.sql.gz>
#
# Miljövariabler:
#   ENV_FILE     Sökväg till .env     (standard: beror på läge, se nedan)
#   COMPOSE_FILE Docker Compose-fil   (standard: docker-compose.prod.yml)

set -euo pipefail

usage() {
  echo "Användning: $0 [--standalone] <backup-fil.sql.gz>" >&2
  exit 1
}

MODE="docker"
if [[ "${1:-}" == "--standalone" ]]; then
  MODE="standalone"
  shift
fi

BACKUP_FILE="${1:-}"
[[ -z "${BACKUP_FILE}" ]] && usage
[[ ! -f "${BACKUP_FILE}" ]] && { echo "Filen finns inte: ${BACKUP_FILE}" >&2; exit 1; }

echo "Återställer från: ${BACKUP_FILE}"
read -rp "Bekräfta — befintlig databas skrivs ÖVER [j/N]: " confirm
[[ "${confirm,,}" != "j" ]] && { echo "Avbrutet."; exit 0; }

if [[ "${MODE}" == "standalone" ]]; then
  ENV_FILE="${ENV_FILE:-/etc/arkivforteckningsklient/.env}"
  if [[ -f "${ENV_FILE}" ]]; then
    # shellcheck disable=SC1090
    set -a; source "${ENV_FILE}"; set +a
  fi
  PGPASSWORD="${SPRING_DATASOURCE_PASSWORD}" \
    psql \
      -h localhost \
      -U "${SPRING_DATASOURCE_USERNAME:-ihpuser}" \
      -d ihp \
      --no-password \
    < <(gunzip -c "${BACKUP_FILE}")
else
  COMPOSE_FILE="${COMPOSE_FILE:-docker-compose.prod.yml}"
  ENV_FILE="${ENV_FILE:-.env.production}"
  if [[ -f "${ENV_FILE}" ]]; then
    # shellcheck disable=SC1090
    set -a; source "${ENV_FILE}"; set +a
  fi
  gunzip -c "${BACKUP_FILE}" \
    | docker compose -f "${COMPOSE_FILE}" exec -T db \
        psql -U "${DB_USERNAME:-ihpuser}" ihp
fi

echo "Återställning klar."
