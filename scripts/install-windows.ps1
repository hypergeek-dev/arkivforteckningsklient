# install-windows.ps1 — Förbereder Windows Server för Arkivförteckningsklient (standalone)
#
# Skapar katalogstruktur, miljöfil och (valfritt) Windows-tjänst med NSSM.
# Kräver PowerShell som administratör.
#
# Förutsättningar:
#   - Java 17 JRE installerat och i PATH  (https://adoptium.net/)
#   - PostgreSQL 15+ installerat           (https://www.postgresql.org/download/windows/)
#   - NSSM (valfritt, för Windows-tjänst)  (https://nssm.cc/)
#
# Artefakter som skriptet letar efter:
#   app.jar     — Spring Boot executable jar (spring-boot-app-*-exec.jar, döpt om)
#   frontend\   — React-bygget (innehållet av frontend\build\ efter npm run build)

#Requires -RunAsAdministrator

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$AppName     = "arkivforteckningsklient"
$AppDir      = "C:\$AppName"
$BackendDir  = "$AppDir\backend"
$FrontendDir = "$AppDir\frontend"
$LogDir      = "$AppDir\logs"
$ConfDir     = "$AppDir\conf"
$ScriptDir   = $PSScriptRoot
$RepoRoot    = (Resolve-Path "$ScriptDir\..").Path

Write-Host "===============================================" -ForegroundColor Cyan
Write-Host " Arkivforteckningsklient — Windows-installation" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host ""

# --- Katalogstruktur ---
Write-Host "==> Skapar katalogstruktur..." -ForegroundColor Green
foreach ($dir in @($BackendDir, $FrontendDir, $LogDir, $ConfDir)) {
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
        Write-Host "    Skapade: $dir"
    } else {
        Write-Host "    Finns redan: $dir"
    }
}

# --- Backend jar ---
Write-Host ""
Write-Host "==> Kontrollerar backend-jar..." -ForegroundColor Green
$JarInstalled = $false
$JarCandidates = @(
    "$RepoRoot\app.jar",
    "$ScriptDir\app.jar"
)
# Glob for Maven build output
$MavenJars = Get-ChildItem "$RepoRoot\backend\target\spring-boot-app-*-exec.jar" -ErrorAction SilentlyContinue
if ($MavenJars) { $JarCandidates += $MavenJars[0].FullName }

foreach ($candidate in $JarCandidates) {
    if (Test-Path $candidate) {
        Copy-Item $candidate "$BackendDir\app.jar" -Force
        Write-Host "    Backend-jar installerad fran: $candidate"
        $JarInstalled = $true
        break
    }
}
if (-not $JarInstalled) {
    Write-Host "    OBS: Ingen jar-fil hittades." -ForegroundColor Yellow
    Write-Host "         Bygg med: mvn -f backend\pom.xml package -DskipTests"
    Write-Host "         Kopiera sedan jaret till: $BackendDir\app.jar"
}

# --- Frontend ---
Write-Host ""
Write-Host "==> Kontrollerar frontend-filer..." -ForegroundColor Green
$FrontendInstalled = $false
foreach ($candidate in @("$RepoRoot\frontend\build", "$ScriptDir\frontend")) {
    if (Test-Path $candidate) {
        Copy-Item "$candidate\*" $FrontendDir -Recurse -Force
        Write-Host "    Frontend-filer installerade fran: $candidate"
        $FrontendInstalled = $true
        break
    }
}
if (-not $FrontendInstalled) {
    Write-Host "    OBS: Inga frontend-filer hittades." -ForegroundColor Yellow
    Write-Host "         Bygg med: cd frontend; npm ci; npm run build"
    Write-Host "         Kopiera sedan: xcopy /E /I frontend\build\* $FrontendDir\"
}

# --- Miljöfil ---
Write-Host ""
Write-Host "==> Skapar miljöfil..." -ForegroundColor Green
$EnvFile = "$ConfDir\.env"
if (-not (Test-Path $EnvFile)) {
    @"
# Arkivforteckningsklient — miljofil
# Fyll i riktiga varden och skydda filen med lampliga NTFS-rattigheter.

SPRING_DATASOURCE_JDBC_URL=jdbc:postgresql://localhost:5432/ihp
SPRING_DATASOURCE_USERNAME=ihpuser
SPRING_DATASOURCE_PASSWORD=BYTA_TILL_STARKT_LOSENORD
ENVIRONMENT=production
"@ | Out-File -FilePath $EnvFile -Encoding utf8
    Write-Host "    Miljofil skapad: $EnvFile"
    Write-Host "    Redigera filen och satt ratt losenord: notepad `"$EnvFile`"" -ForegroundColor Yellow
} else {
    Write-Host "    Befintlig miljofil bevaras: $EnvFile"
}

# Begränsa läsrättigheter på miljöfilen (enbart Administratörer och SYSTEM)
try {
    $acl = Get-Acl $EnvFile
    $acl.SetAccessRuleProtection($true, $false)
    foreach ($identity in @("Administrators", "SYSTEM")) {
        $rule = New-Object System.Security.AccessControl.FileSystemAccessRule(
            $identity, "FullControl", "Allow")
        $acl.AddAccessRule($rule)
    }
    Set-Acl -Path $EnvFile -AclObject $acl
    Write-Host "    NTFS-rattigheter satta (enbart Administratorer och SYSTEM kan lasa)."
} catch {
    Write-Host "    Kunde inte satta rattigheter automatiskt — gor det manuellt i Utforskaren." -ForegroundColor Yellow
}

# --- Windows-tjänst med NSSM ---
Write-Host ""
Write-Host "==> Kontrollerar NSSM (Windows-tjansthanterare)..." -ForegroundColor Green
$NssmCmd = Get-Command nssm -ErrorAction SilentlyContinue
if ($NssmCmd) {
    $NssmPath = $NssmCmd.Source
    Write-Host "    NSSM hittades: $NssmPath"

    $JavaCmd = Get-Command java -ErrorAction SilentlyContinue
    if (-not $JavaCmd) {
        Write-Host "    OBS: Java hittades inte i PATH. Installera Java 17 och lagg till i PATH." -ForegroundColor Yellow
    } else {
        $JavaPath = $JavaCmd.Source
        Write-Host "    Java hittades: $JavaPath"

        $existing = Get-Service -Name $AppName -ErrorAction SilentlyContinue
        if (-not $existing) {
            Write-Host "    Installerar Windows-tjanst '$AppName'..."

            # Load env vars from file to pass to NSSM
            $envContent = Get-Content $EnvFile | Where-Object { $_ -match '^\s*\w+=.+' -and $_ -notmatch '^\s*#' }

            & $NssmPath install $AppName $JavaPath
            & $NssmPath set $AppName AppParameters "-Xms256m -Xmx512m -jar `"$BackendDir\app.jar`""
            & $NssmPath set $AppName AppDirectory $BackendDir
            & $NssmPath set $AppName AppStdout "$LogDir\stdout.log"
            & $NssmPath set $AppName AppStderr "$LogDir\stderr.log"
            & $NssmPath set $AppName AppRotateFiles 1
            & $NssmPath set $AppName AppRotateBytes 10485760
            & $NssmPath set $AppName Start SERVICE_AUTO_START
            & $NssmPath set $AppName AppEnvironmentExtra ($envContent -join "`n")

            Write-Host "    Tjanst '$AppName' installerad." -ForegroundColor Green
            Write-Host "    Starta med: nssm start $AppName"
        } else {
            Write-Host "    Tjanst '$AppName' finns redan — hoppas over."
            Write-Host "    Starta om med: nssm restart $AppName"
        }
    }
} else {
    Write-Host "    NSSM hittades inte." -ForegroundColor Yellow
    Write-Host "    Alternativ 1: Ladda ner NSSM fran https://nssm.cc/ och kor skriptet igen."
    Write-Host "    Alternativ 2: Starta manuellt fran terminal:"
    Write-Host "      java -Xms256m -Xmx512m -jar `"$BackendDir\app.jar`""
}

# --- Sammanfattning ---
Write-Host ""
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host " Installation klar — nasta steg:"             -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Redigera miljofilen och satt ratt databaslosenord:"
Write-Host "   notepad `"$EnvFile`""
Write-Host ""
Write-Host "2. Skapa PostgreSQL-databas och -anvandare (kors i psql):"
Write-Host "   psql -U postgres"
Write-Host "   CREATE USER ihpuser WITH PASSWORD 'ditt-losenord';"
Write-Host "   CREATE DATABASE ihp OWNER ihpuser;"
Write-Host "   \q"
Write-Host ""
Write-Host "3. Starta backend-tjansten:"
if ($NssmCmd) {
    Write-Host "   nssm start $AppName"
    Write-Host "   nssm status $AppName"
} else {
    Write-Host "   java -Xms256m -Xmx512m -jar `"$BackendDir\app.jar`""
}
Write-Host ""
Write-Host "4. Frontend-hosting — val av metod:"
Write-Host ""
Write-Host "   A) IIS (rekommenderas pa Windows Server):"
Write-Host "      - Installera IIS (Serverhanteraren -> Lagg till roller -> Webbserver)"
Write-Host "      - Installera URL Rewrite Module och Application Request Routing (ARR)"
Write-Host "      - Skapa en ny webbplats som pekar pa: $FrontendDir"
Write-Host "      - Lagg till en URL Rewrite-regel: alla okanda sokvagar -> /index.html"
Write-Host "      - Lagg till en ARR-omvand-proxy-regel:"
Write-Host "          /ihpappbackend/* -> http://localhost:8080/*"
Write-Host ""
Write-Host "   B) Nginx for Windows (enklare konfiguration):"
Write-Host "      - Ladda ner nginx for Windows fran https://nginx.org/en/download.html"
Write-Host "      - Anvand samma nginx.conf som Linux-varianten (se docs\production-deployment.md)"
Write-Host "      - Anpassa sokvagar fran /opt/arkivforteckningsklient till C:\$AppName"
Write-Host ""
Write-Host "VIKTIGT: ENVIRONMENT=production maste vara satt i miljofilen." -ForegroundColor Red
Write-Host "         Saknas den aktiveras mock-IAM — alla atgarder tillats utan autentisering." -ForegroundColor Red
Write-Host ""
