<p align="center">
  <img src="./bilder/Isolated_IHPv_logo_with_text_black.png" alt="Förteckningsklient logotyp" width="180" height="80">
</p>

# Förteckningsklient för Skånearkiv

Webbaserat verktyg för att upprätta, förvalta och fastställa **arkivförteckningar** enligt svensk arkivredovisningsstandard. Verktyget är avsett för Skånearkiv och utgör ett interimistiskt alternativ till Visual Arkiv.

Baserat på Migrationsverkets öppna källkod [IHPv](https://github.com/migrationsverket/IHPv), omarbetad och utökad för arkivredovisning.

![Skärmbild av förteckningsklienten](./bilder/presentation.png)

---

## Strukturmodell

Förteckningsklienten följer den svenska arkivredovisningsstrukturen:

```
Arkivförteckning
└── Arkivbildare          (organisation, orgNummer, arkivansvarig, verksamhetsperiod)
    └── Arkiv             (arkivIdBeteckning, förvaringsplats, handlingar från/till)
        └── Serie         (seriesignum, serierubrik, förvaringsplats, omfång)
            └── Underserie
                └── Volym (volymnum, format, tillgänglighet)
```

Seriesignum (t.ex. `F1`, `A2:a`) visas som märke direkt i trädvyn och kortvyn.

---

## Funktioner

### Förteckningsbyggaren
Bygg arkivförteckningen i ett hierarkiskt träd. Varje nodnivå har egna metadatafält anpassade efter arkivredovisningsstandard. Dra och släpp för att omstrukturera.

### Gallrings- och bevaranderegler
Koppla regler till noder via en stegvis guide. Regelsteget **Arkivmetadata** samlar:
- **RA-FS referens** – hänvisning till Riksarkivets författningssamling
- **Gallringsgrund** – rättslig grund för gallringen
- **Åtgärd** – `gallras` eller `bevaras`

### Fastställning
Arkivförteckningen följer ett statusflöde: **Utkast → Fastställd → Utgått**. Fastställande kräver rollen ARKIVANSVARIG.

### Rapport och export
Högerklicka på en Arkivförteckning → **Rapport** för att granska hela förteckningen med arkivkorrekta prefix per nodnivå. Ladda ned som `FaststalldArkivforteckning.json`.

### Import
Högerklicka på en Arkivförteckning → **Importera** för att läsa in en tidigare exporterad JSON-fil. Alla noder återskapas med korrekta föräldra–barn-relationer. Kräver rollen ARKIVANSVARIG eller ARKIVARIE.

### Händelselogg
Spåra alla ändringar i förteckningen med tidsstämpel och användare.

---

## Roller

| Roll | Behörigheter |
|---|---|
| ARKIVANSVARIG | administrera, visa, faststalla, importera |
| ARKIVARIE | administrera, visa, importera |
| LASARE | visa |

I lokal/utvecklingsläge tillåts alla åtgärder utan IAM (mock-läge).

---

## Kom igång

### Förutsättningar

![Docker Compose](https://img.shields.io/static/v1?label=Docker%20Compose&message=v2.35%2B&color=informational&logo=docker)
![Java](https://img.shields.io/static/v1?label=Java&message=17%2B&color=informational&logo=openjdk)
![PostgreSQL](https://img.shields.io/static/v1?label=PostgreSQL&message=15%2B&color=informational&logo=postgresql)

<details><summary><b>Installation – ny installation</b></summary>

1. Klona repot:
   ```sh
   git clone https://github.com/hypergeek-dev/arkivforteckningsklient.git
   cd arkivforteckningsklient
   ```

2. Skapa en `.env`-fil med hemligheter (kopiera från mallen):
   ```sh
   cp .env.example .env
   # Redigera .env och sätt egna lösenord
   ```

3. Starta med Docker Compose:
   ```sh
   docker compose up -d
   ```

   Databasen skapas och migreras automatiskt av **Flyway** när backend startar.
   Inga manuella `psql`-kommandon behövs.

4. Öppna applikationen:
   ```
   http://localhost:8081/
   ```

5. Databas via pgAdmin:
   ```
   http://localhost:8082/
   ```

> **Standardinloggning (ändra omedelbart):** `admin` / `changeme`

</details>

<details><summary><b>Uppgradering – befintlig installation</b></summary>

Flyway detekterar automatiskt vilka migrationer som saknas och kör enbart dem.
Det krävs inga manuella SQL-kommandon vid uppgradering.

Om databasen är äldre än Flyway-versionen (initierades med `psql`-skripten):
```sh
# Baslinjea Flyway mot den befintliga databasen (körs en gång)
docker compose exec backend java -jar app.jar \
  -Dflyway.baselineOnMigrate=true -Dflyway.baselineVersion=1
```

Driftsätt sedan de nya Docker-imagen:
```sh
docker compose build --no-cache backend frontend
docker compose up -d --no-deps backend frontend
```

</details>

---

## Byggt med

![Spring Boot](https://img.shields.io/static/v1?label=Spring%20Boot&message=3.5&color=informational&logo=springboot)
![React](https://img.shields.io/static/v1?label=React&message=18.2&color=informational&logo=react)
![TypeScript](https://img.shields.io/static/v1?label=TypeScript&message=5.6&color=informational&logo=typescript)
![MUI](https://img.shields.io/static/v1?label=MUI&message=6.0&color=informational&logo=mui)
![Redux Toolkit](https://img.shields.io/static/v1?label=Redux%20Toolkit&message=1.9&color=informational&logo=redux)
![PostgreSQL](https://img.shields.io/static/v1?label=PostgreSQL&message=15&color=informational&logo=postgresql)

Backend: Java 17, Spring Boot 3.5, Spring Data JPA, Hibernate, Lombok.  
Frontend: React 18, TypeScript, Redux Toolkit + Redux-Saga, MUI, Webpack.  
Databas: PostgreSQL med Flyway-hanterade versionsmigrationer (V1–V5).

---

## Ursprung och licens

Detta projekt är en fork av [migrationsverket/IHPv](https://github.com/migrationsverket/IHPv), publicerat under **CC0 1.0 Universal** (ingen upphovsrätt förbehålls).

Förändringar i denna fork: terminologiomskrivning till arkivredovisning, arkivspecifika metadatafält, seriesignum-visning, RA-FS-stöd i regelbank, rapport- och importfunktion, Flyway-versionsmigrationer (V1–V5), JDBC-baserad Spring Security med rollmodell, Visual Arkiv ETL-pipeline (inspect/prepare/execute/report).

Se [LICENSE.txt](LICENSE.txt) för fullständig licenstext.
