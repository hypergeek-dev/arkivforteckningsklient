#!/usr/bin/env bash
# install-linux.sh — Installerar Arkivförteckningsklient (standalone) på Ubuntu/Debian
#
# Skapar:
#   /opt/arkivforteckningsklient/     — applikationsfiler
#   /etc/arkivforteckningsklient/     — konfiguration och miljöfil
#   /var/log/arkivforteckningsklient/ — loggkatalog (journald används primärt)
#
# Kräver: Ubuntu 22.04+ eller Debian 11+, root eller sudo.
#
# Förutsätter att du kör från katalogen som innehåller:
#   app.jar     — Spring Boot executable jar (döpt om från spring-boot-app-*-exec.jar)
#   frontend/   — React-bygget (innehållet av frontend/build/ efter npm run build)

set -euo pipefail

APP_NAME="arkivforteckningsklient"
APP_USER="arkivapp"
APP_DIR="/opt/${APP_NAME}"
CONF_DIR="/etc/${APP_NAME}"
LOG_DIR="/var/log/${APP_NAME}"
SERVICE_FILE="/etc/systemd/system/${APP_NAME}.service"
NGINX_CONF="/etc/nginx/sites-available/${APP_NAME}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

[[ $EUID -ne 0 ]] && { echo "Kör som root eller med sudo." >&2; exit 1; }
command -v apt-get &>/dev/null || { echo "Kräver apt (Ubuntu/Debian)." >&2; exit 1; }

echo "======================================="
echo " Arkivförteckningsklient — Installation"
echo "======================================="
echo ""

# --- Systemberoenden ---
echo "==> Installerar Java 17, PostgreSQL och Nginx..."
apt-get update -qq
apt-get install -y -q openjdk-17-jre-headless postgresql nginx

# --- Systemanvändare ---
echo "==> Skapar systemanvändare '${APP_USER}'..."
if ! id "${APP_USER}" &>/dev/null; then
  useradd --system --no-create-home --shell /usr/sbin/nologin "${APP_USER}"
fi

# --- Katalogstruktur ---
echo "==> Skapar katalogstruktur..."
mkdir -p \
  "${APP_DIR}/backend" \
  "${APP_DIR}/frontend" \
  "${CONF_DIR}" \
  "${LOG_DIR}"

# --- Backend jar ---
JAR_INSTALLED=false
for candidate in \
  "${REPO_ROOT}/app.jar" \
  "${SCRIPT_DIR}/app.jar" \
  "${REPO_ROOT}/backend/target/spring-boot-app-"*"-exec.jar"
do
  # Use glob expansion result
  for f in ${candidate}; do
    if [[ -f "${f}" ]]; then
      cp "${f}" "${APP_DIR}/backend/app.jar"
      echo "    Backend-jar installerad: ${f}"
      JAR_INSTALLED=true
      break 2
    fi
  done
done

if [[ "${JAR_INSTALLED}" == "false" ]]; then
  echo "    OBS: Ingen jar-fil hittades."
  echo "         Bygg med: mvn -f backend/pom.xml package -DskipTests"
  echo "         Kopiera sedan: cp backend/target/spring-boot-app-*-exec.jar ${APP_DIR}/backend/app.jar"
fi

# --- Frontend ---
FRONTEND_INSTALLED=false
for candidate in "${REPO_ROOT}/frontend/build" "${SCRIPT_DIR}/frontend"; do
  if [[ -d "${candidate}" ]]; then
    cp -r "${candidate}/." "${APP_DIR}/frontend/"
    echo "    Frontend-filer installerade från: ${candidate}"
    FRONTEND_INSTALLED=true
    break
  fi
done

if [[ "${FRONTEND_INSTALLED}" == "false" ]]; then
  echo "    OBS: Inga frontend-filer hittades."
  echo "         Bygg med: cd frontend && npm ci && npm run build"
  echo "         Kopiera sedan: cp -r frontend/build/. ${APP_DIR}/frontend/"
fi

# --- Rättigheter ---
chown -R "${APP_USER}":"${APP_USER}" "${APP_DIR}" "${LOG_DIR}"
chmod 750 "${APP_DIR}/backend"
chmod 755 "${APP_DIR}/frontend"
chown root:root "${CONF_DIR}"

# --- Miljöfil ---
if [[ ! -f "${CONF_DIR}/.env" ]]; then
  cat > "${CONF_DIR}/.env" <<'ENVEOF'
# Arkivförteckningsklient — miljöfil
# Känslig fil: rättigheter 640, ägd av root:arkivapp

SPRING_DATASOURCE_JDBC_URL=jdbc:postgresql://localhost:5432/ihp
SPRING_DATASOURCE_USERNAME=ihpuser
SPRING_DATASOURCE_PASSWORD=BYTA_TILL_STARKT_LOSENORD
ENVIRONMENT=production
ENVEOF
  echo "    Miljöfil skapad: ${CONF_DIR}/.env"
fi

chmod 640 "${CONF_DIR}/.env"
chown root:"${APP_USER}" "${CONF_DIR}/.env"

# --- Systemd-tjänst ---
echo "==> Skapar systemd-tjänst ${APP_NAME}..."
cat > "${SERVICE_FILE}" <<SVCEOF
[Unit]
Description=Arkivförteckningsklient Backend (Spring Boot)
Documentation=https://github.com/hypergeek-dev/arkivforteckningsklient
After=network.target postgresql.service
Requires=postgresql.service

[Service]
Type=simple
User=${APP_USER}
WorkingDirectory=${APP_DIR}/backend
EnvironmentFile=${CONF_DIR}/.env
ExecStart=/usr/bin/java -Xms256m -Xmx512m -jar ${APP_DIR}/backend/app.jar
Restart=on-failure
RestartSec=15
StandardOutput=journal
StandardError=journal
SyslogIdentifier=${APP_NAME}

[Install]
WantedBy=multi-user.target
SVCEOF

systemctl daemon-reload
echo "    Tjänstfil: ${SERVICE_FILE}"

# --- Nginx ---
echo "==> Skapar nginx-konfiguration..."
cat > "${NGINX_CONF}" <<'NGINXEOF'
# Nginx-konfiguration för Arkivförteckningsklient
# Ersätt arkiv.example.se med ditt faktiska domännamn.
# För HTTPS: kör certbot --nginx -d arkiv.example.se

server {
    listen 80;
    server_name arkiv.example.se;

    root /opt/arkivforteckningsklient/frontend;

    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options            "SAMEORIGIN"                         always;
    add_header X-Content-Type-Options     "nosniff"                            always;
    add_header X-XSS-Protection           "1; mode=block"                      always;
    add_header Cache-Control              "no-cache, private";

    # Proxy API-anrop till Spring Boot-backend
    location ~ ^/ihpappbackend(/rest/.*)$ {
        rewrite ^/ihpappbackend(/rest/.*)$ $1 break;

        proxy_pass         http://127.0.0.1:8080;
        proxy_set_header   Host              $host;
        proxy_set_header   X-Real-IP         $remote_addr;
        proxy_set_header   X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
        proxy_read_timeout 30s;
    }

    # React single-page application
    location / {
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Statiska tillgångar med cachelagring
    location ~* \.(js|css|png|jpg|ico|woff2?)$ {
        add_header Cache-Control "public, max-age=604800";
        access_log off;
    }

    # Hälsokontroll
    location /ping {
        default_type application/json;
        access_log   off;
        return 200   '{"status":"UP"}';
    }
}
NGINXEOF

if [[ ! -L "/etc/nginx/sites-enabled/${APP_NAME}" ]]; then
  ln -s "${NGINX_CONF}" "/etc/nginx/sites-enabled/${APP_NAME}"
fi

# --- PostgreSQL ---
echo "==> Kontrollerar PostgreSQL..."
if systemctl is-active --quiet postgresql; then
  su -s /bin/bash postgres -c "
    psql -tAc \"SELECT 1 FROM pg_roles WHERE rolname='ihpuser'\" | grep -q 1 ||
      psql -c \"CREATE USER ihpuser WITH PASSWORD 'BYTA_TILL_STARKT_LOSENORD'\"
    psql -tAc \"SELECT 1 FROM pg_database WHERE datname='ihp'\" | grep -q 1 ||
      psql -c \"CREATE DATABASE ihp OWNER ihpuser\"
  " 2>/dev/null && echo "    Databas 'ihp' och användare 'ihpuser' skapade." || true
fi

# --- Klar ---
echo ""
echo "======================================="
echo " Installation klar — nästa steg:"
echo "======================================="
echo ""
echo "1. Sätt rätt lösenord i miljöfilen:"
echo "   sudo nano ${CONF_DIR}/.env"
echo ""
echo "   Uppdatera sedan samma lösenord i PostgreSQL:"
echo "   sudo -u postgres psql -c \"ALTER USER ihpuser PASSWORD 'ditt-nya-losenord';\""
echo ""
echo "2. Uppdatera nginx-konfigurationen med ditt domännamn:"
echo "   sudo nano ${NGINX_CONF}"
echo "   (ändra 'server_name arkiv.example.se;')"
echo ""
echo "3. Validera nginx och ladda om:"
echo "   sudo nginx -t && sudo systemctl reload nginx"
echo ""
echo "4. Aktivera och starta applikationstjänsten:"
echo "   sudo systemctl enable --now ${APP_NAME}"
echo ""
echo "5. Kontrollera att tjänsten startade:"
echo "   sudo systemctl status ${APP_NAME}"
echo "   sudo journalctl -u ${APP_NAME} -f"
echo ""
echo "6. (Valfritt) HTTPS med Let's Encrypt:"
echo "   sudo apt install certbot python3-certbot-nginx"
echo "   sudo certbot --nginx -d ditt-domännamn.se"
echo ""
echo "VIKTIGT: ENVIRONMENT=production måste vara satt i miljöfilen."
echo "         Saknas den aktiveras mock-IAM — alla åtgärder tillåts utan autentisering."
echo ""
