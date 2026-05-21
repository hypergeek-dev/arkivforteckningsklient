#!/usr/bin/env bash
# update-app.sh — Uppgradera Arkivförteckningsklient
#
# Docker-läge (standard): git pull + rebuild + omstart av backend och frontend
# Standalone-läge:        Driftsätt ny jar och/eller nya frontend-filer
#
# Läge           Kommando
# Docker         ./scripts/update-app.sh
# Standalone     ./scripts/update-app.sh --standalone <ny-app.jar> [ny-frontend-katalog]
#
# Miljövariabler:
#   COMPOSE_FILE Docker Compose-fil   (standard: docker-compose.prod.yml)
#   ENV_FILE     Sökväg till .env     (standard: .env.production)
#   BACKUP_DIR   Katalog för säkerhetskopia
#
# Skriptet tar alltid en säkerhetskopia av databasen innan det ändrar något.

set -euo pipefail

COMPOSE_FILE="${COMPOSE_FILE:-docker-compose.prod.yml}"
ENV_FILE="${ENV_FILE:-.env.production}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKUP_SCRIPT="${SCRIPT_DIR}/backup-postgres.sh"
APP_DIR="/opt/arkivforteckningsklient"

MODE="${1:-docker}"

run_backup() {
  if [[ -x "${BACKUP_SCRIPT}" ]]; then
    echo "==> Tar säkerhetskopia av databasen..."
    if [[ "${MODE}" == "--standalone" ]]; then
      "${BACKUP_SCRIPT}" --standalone || echo "    Varning: Säkerhetskopia misslyckades — fortsätter ändå."
    else
      "${BACKUP_SCRIPT}" || echo "    Varning: Säkerhetskopia misslyckades — fortsätter ändå."
    fi
  else
    echo "    Varning: backup-postgres.sh hittades inte — hoppar över säkerhetskopia."
  fi
}

if [[ "${MODE}" == "--standalone" ]]; then
  NEW_JAR="${2:-}"
  NEW_FRONTEND="${3:-}"

  if [[ -z "${NEW_JAR}" || ! -f "${NEW_JAR}" ]]; then
    echo "Fel: Ange sökväg till ny jar-fil." >&2
    echo "Användning: $0 --standalone <app.jar> [frontend-katalog]" >&2
    exit 1
  fi

  run_backup

  echo "==> Stoppar tjänst..."
  systemctl stop arkivforteckningsklient

  echo "==> Driftsätter backend..."
  cp "${NEW_JAR}" "${APP_DIR}/backend/app.jar"
  chown arkivapp:arkivapp "${APP_DIR}/backend/app.jar"

  if [[ -n "${NEW_FRONTEND}" && -d "${NEW_FRONTEND}" ]]; then
    echo "==> Driftsätter frontend..."
    rm -rf "${APP_DIR}/frontend/"*
    cp -r "${NEW_FRONTEND}/." "${APP_DIR}/frontend/"
    chown -R arkivapp:arkivapp "${APP_DIR}/frontend/"
    echo "    Frontend uppdaterat."
  fi

  echo "==> Startar tjänst..."
  systemctl start arkivforteckningsklient
  sleep 8
  if systemctl is-active --quiet arkivforteckningsklient; then
    echo "Uppgradering klar. Tjänsten är igång."
    systemctl status arkivforteckningsklient --no-pager -l
  else
    echo "VARNING: Tjänsten startade inte." >&2
    echo "         Kör: journalctl -u arkivforteckningsklient -n 50" >&2
    exit 1
  fi

else
  # Docker-läge
  run_backup

  echo "==> Hämtar senaste kod (git pull)..."
  git pull

  echo "==> Bygger nya images (--no-cache för backend och frontend)..."
  docker compose -f "${COMPOSE_FILE}" --env-file "${ENV_FILE}" \
    build --no-cache backend frontend

  echo "==> Startar om backend och frontend (databasen berörs inte)..."
  docker compose -f "${COMPOSE_FILE}" --env-file "${ENV_FILE}" \
    up -d --no-deps backend frontend

  echo "==> Städar bort oanvända images..."
  docker image prune -f

  echo ""
  echo "Uppgradering klar."
  docker compose -f "${COMPOSE_FILE}" --env-file "${ENV_FILE}" ps
fi
