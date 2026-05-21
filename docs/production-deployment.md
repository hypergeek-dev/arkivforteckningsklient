# Produktionsdriftsättning

Två alternativa driftsättningsvägar finns. Välj den som passar din infrastruktur.

| Metod | Kräver | Passar |
|---|---|---|
| **A — Docker Compose** | Docker Engine + Compose | Serverinstallation med Docker |
| **B — Standalone** | Java 17, PostgreSQL, Nginx | Kommunala servrar utan Docker |

---

## Metod A — Docker Compose (rekommenderat)

### Förutsättningar

- Docker Engine 24+ och Docker Compose v2.35+
- Git

### Installation

```sh
git clone https://github.com/hypergeek-dev/arkivforteckningsklient.git
cd arkivforteckningsklient

# Skapa produktionsmiljöfil
cp .env.production.example .env.production
nano .env.production        # Sätt starka lösenord
```

Starta:

```sh
docker compose -f docker-compose.prod.yml --env-file .env.production up -d
```

Applikationen är nu tillgänglig på `http://servernamn:80`.

### Konfigurerbara variabler (`.env.production`)

| Variabel | Syfte | Standard |
|---|---|---|
| `DB_USERNAME` | PostgreSQL-användarnamn | `ihpuser` |
| `DB_PASSWORD` | PostgreSQL-lösenord | — |
| `ENVIRONMENT` | Spring-profil | `production` |
| `LISTEN_HOST` | Nätverksgränssnitt | `0.0.0.0` |
| `FRONTEND_PORT` | Host-port för frontend | `80` |

Sätt `LISTEN_HOST=127.0.0.1` om en värd-nginx hanterar TLS.

### TLS med värd-nginx (Docker)

Sätt `LISTEN_HOST=127.0.0.1` och `FRONTEND_PORT=8081` i `.env.production`. Kör sedan applikationen och lägg en nginx framför:

```nginx
server {
    listen 443 ssl;
    server_name arkiv.example.se;

    ssl_certificate     /etc/letsencrypt/live/arkiv.example.se/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/arkiv.example.se/privkey.pem;

    location / {
        proxy_pass         http://127.0.0.1:8081;
        proxy_set_header   Host              $host;
        proxy_set_header   X-Real-IP         $remote_addr;
        proxy_set_header   X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
    }
}

server {
    listen 80;
    server_name arkiv.example.se;
    return 301 https://$host$request_uri;
}
```

### Uppgradering (Docker)

```sh
./scripts/update-app.sh
```

Skriptet tar säkerhetskopia, kör `git pull`, bygger om och startar om backend och frontend. Databasen berörs inte.

---

## Metod B — Standalone (Java-jar + Nginx)

Används när Docker inte är ett alternativ. Backend körs som systemd-tjänst, frontend serveras av Nginx.

### Förutsättningar

- Ubuntu 22.04 / Debian 11 (eller Windows Server, se nedan)
- Internet-åtkomst för apt-get

### Bygga artefakter

På en byggmaskin (eller CI-server):

```sh
# Backend
mvn -f backend/pom.xml package -DskipTests
# Jar finns i: backend/target/spring-boot-app-2.0.8-exec.jar
cp backend/target/spring-boot-app-*-exec.jar app.jar

# Frontend
cd frontend && npm ci && npm run build && cd ..
# Statiska filer finns i: frontend/build/
```

Kopiera `app.jar` och katalogen `frontend/build/` till produktionsservern.

### Installation på Ubuntu/Debian

```sh
sudo bash scripts/install-linux.sh
```

Skriptet installerar Java 17, PostgreSQL och Nginx, skapar:
- `/opt/arkivforteckningsklient/` — applikationsfiler
- `/etc/arkivforteckningsklient/.env` — miljöfil (rättigheter 640)
- `/var/log/arkivforteckningsklient/` — loggkatalog
- Systemd-tjänst `arkivforteckningsklient`
- Nginx-konfiguration i `/etc/nginx/sites-available/`

Efter installation:

```sh
# 1. Sätt lösenord
sudo nano /etc/arkivforteckningsklient/.env
sudo -u postgres psql -c "ALTER USER ihpuser PASSWORD 'ditt-lösenord';"

# 2. Uppdatera domännamn i nginx
sudo nano /etc/nginx/sites-available/arkivforteckningsklient
sudo nginx -t && sudo systemctl reload nginx

# 3. Starta
sudo systemctl enable --now arkivforteckningsklient

# 4. Verifiera
sudo journalctl -u arkivforteckningsklient -f
```

### Nginx-konfiguration (standalone)

Referenskonfiguration skapas av installationsskriptet i `/etc/nginx/sites-available/arkivforteckningsklient`:

```nginx
server {
    listen 80;
    server_name arkiv.example.se;

    root /opt/arkivforteckningsklient/frontend;

    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options            "SAMEORIGIN"                         always;
    add_header X-Content-Type-Options     "nosniff"                            always;
    add_header X-XSS-Protection           "1; mode=block"                      always;
    add_header Cache-Control              "no-cache, private";

    location ~ ^/ihpappbackend(/rest/.*)$ {
        rewrite ^/ihpappbackend(/rest/.*)$ $1 break;
        proxy_pass         http://127.0.0.1:8080;
        proxy_set_header   Host              $host;
        proxy_set_header   X-Real-IP         $remote_addr;
        proxy_set_header   X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
        proxy_read_timeout 30s;
    }

    location / {
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|ico|woff2?)$ {
        add_header Cache-Control "public, max-age=604800";
        access_log off;
    }
}
```

### HTTPS (standalone)

```sh
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d arkiv.example.se
```

### Uppgradering (standalone)

```sh
# Bygg nya artefakter på byggmaskin, kopiera till server, sedan:
sudo ./scripts/update-app.sh --standalone app.jar frontend/build/
```

Skriptet stoppar tjänsten, tar säkerhetskopia, driftsätter och startar om.

---

## Windows Server (standalone)

```powershell
# Kör som administratör
.\scripts\install-windows.ps1
```

Skriptet skapar `C:\arkivforteckningsklient\` med undermappar för backend, frontend, loggar och konfiguration.

**Backend som Windows-tjänst** — kräver [NSSM](https://nssm.cc/). Skriptet installerar tjänsten automatiskt om NSSM finns i PATH.

**Frontend-hosting** — två alternativ:

- **IIS** (Windows Server-standard): Skapa en webbplats som pekar på `C:\arkivforteckningsklient\frontend\`. Kräver URL Rewrite Module och Application Request Routing (ARR) för SPA-routing och API-proxy.
- **Nginx for Windows**: Ladda ner från [nginx.org](https://nginx.org/en/download.html) och anpassa Linux-konfigurationen ovan med Windows-sökvägar.

---

## Säkerhetskopiering och återställning

### Säkerhetskopia

```sh
# Docker
./scripts/backup-postgres.sh

# Standalone
./scripts/backup-postgres.sh --standalone
```

Säkerhetskopior sparas i `/var/backups/arkivforteckningsklient/` (konfigurerbart via `BACKUP_DIR`).

Sätt upp ett cron-jobb för automatisk daglig säkerhetskopia:

```sh
# crontab -e
0 2 * * * /opt/arkivforteckningsklient/scripts/backup-postgres.sh --standalone >> /var/log/arkivforteckningsklient/backup.log 2>&1
```

### Återställning

```sh
# Docker
./scripts/restore-postgres.sh /var/backups/arkivforteckningsklient/ihp_20260101_020000.sql.gz

# Standalone
./scripts/restore-postgres.sh --standalone /var/backups/arkivforteckningsklient/ihp_20260101_020000.sql.gz
```

> **Varning:** Återställning skriver över befintliga data. Skriptet ber om bekräftelse.

---

## Viktig säkerhetsinformation

| Punkt | Åtgärd |
|---|---|
| `ENVIRONMENT` | Måste vara `production`. Saknas den aktiveras mock-IAM utan autentisering. |
| Adminlösenord | Standardlösenordet `changeme` måste bytas vid första inloggning. Applikationen vägrar starta i produktion om det inte är gjort. |
| `.env`-filer | Committas aldrig. Läggs till i `.gitignore`. |
| pgAdmin | Ingår inte i `docker-compose.prod.yml`. Aktivera enbart vid behov, bind till `127.0.0.1`. |
| Swagger UI | Inaktiverat som standard. Aktivera med `SWAGGER_ENABLED=true` — rekommenderas inte i produktion. |
