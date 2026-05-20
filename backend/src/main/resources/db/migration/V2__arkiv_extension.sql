-- V2: Arkivförteckning extension — archival metadata fields on all node tables.
-- Migrated from j-arkiv-extension.sql. Safe to run on any V1 schema.

SET search_path TO ihp, public;

-- Arkivbildare
ALTER TABLE operationalareatypenode
  ADD COLUMN IF NOT EXISTS org_nummer               CHARACTER VARYING(20),
  ADD COLUMN IF NOT EXISTS arkivansvarig            CHARACTER VARYING(200),
  ADD COLUMN IF NOT EXISTS adress                   CHARACTER VARYING(500),
  ADD COLUMN IF NOT EXISTS verksamhetsperiod_start  DATE,
  ADD COLUMN IF NOT EXISTS verksamhetsperiod_slut   DATE;

COMMENT ON COLUMN operationalareatypenode.org_nummer              IS 'Organisationsnummer (t.ex. 202100-2817)';
COMMENT ON COLUMN operationalareatypenode.arkivansvarig           IS 'Namn på arkivansvarig person eller funktion';
COMMENT ON COLUMN operationalareatypenode.adress                  IS 'Postadress till arkivbildaren';
COMMENT ON COLUMN operationalareatypenode.verksamhetsperiod_start IS 'Datum då arkivbildaren påbörjade sin verksamhet';
COMMENT ON COLUMN operationalareatypenode.verksamhetsperiod_slut  IS 'Datum då arkivbildaren upphörde (null = pågående)';

-- Arkiv
ALTER TABLE processgrouptypenode
  ADD COLUMN IF NOT EXISTS arkiv_id_beteckning  CHARACTER VARYING(50),
  ADD COLUMN IF NOT EXISTS forvaringsplats      CHARACTER VARYING(300),
  ADD COLUMN IF NOT EXISTS handlingar_fran      DATE,
  ADD COLUMN IF NOT EXISTS handlingar_till      DATE,
  ADD COLUMN IF NOT EXISTS volym_antal          INTEGER;

COMMENT ON COLUMN processgrouptypenode.arkiv_id_beteckning IS 'Arkivets identitetsbeteckning (t.ex. SE/RA/123456)';
COMMENT ON COLUMN processgrouptypenode.forvaringsplats     IS 'Förvaringsplats för arkivet';
COMMENT ON COLUMN processgrouptypenode.handlingar_fran     IS 'Äldsta handling i arkivet';
COMMENT ON COLUMN processgrouptypenode.handlingar_till     IS 'Yngsta handling i arkivet';
COMMENT ON COLUMN processgrouptypenode.volym_antal         IS 'Uppskattat antal volymer';

-- Serie
ALTER TABLE processtypenode
  ADD COLUMN IF NOT EXISTS seriesignum      CHARACTER VARYING(20),
  ADD COLUMN IF NOT EXISTS serie_rubrik     CHARACTER VARYING(500),
  ADD COLUMN IF NOT EXISTS forvaringsplats  CHARACTER VARYING(300),
  ADD COLUMN IF NOT EXISTS innehall         TEXT,
  ADD COLUMN IF NOT EXISTS handlingar_fran  DATE,
  ADD COLUMN IF NOT EXISTS handlingar_till  DATE,
  ADD COLUMN IF NOT EXISTS omfang           CHARACTER VARYING(200);

COMMENT ON COLUMN processtypenode.seriesignum     IS 'Seriesignum (t.ex. A1, F2:a) – unikt inom arkivet';
COMMENT ON COLUMN processtypenode.serie_rubrik    IS 'Beskrivande rubrik för serien';
COMMENT ON COLUMN processtypenode.forvaringsplats IS 'Förvaringsplats för handlingarna i serien';
COMMENT ON COLUMN processtypenode.innehall        IS 'Innehållsbeskrivning av serien';
COMMENT ON COLUMN processtypenode.handlingar_fran IS 'Äldsta handling i serien';
COMMENT ON COLUMN processtypenode.handlingar_till IS 'Yngsta handling i serien';
COMMENT ON COLUMN processtypenode.omfang          IS 'Omfång (t.ex. 3 hyllmeter, 500 filer)';

CREATE UNIQUE INDEX IF NOT EXISTS idx_serie_signum_per_arkiv
  ON processtypenode (parent_id, seriesignum)
  WHERE seriesignum IS NOT NULL;

-- Underserie
ALTER TABLE issuetypenode
  ADD COLUMN IF NOT EXISTS underseriesignum  CHARACTER VARYING(20),
  ADD COLUMN IF NOT EXISTS innehall          TEXT,
  ADD COLUMN IF NOT EXISTS handlingar_fran   DATE,
  ADD COLUMN IF NOT EXISTS handlingar_till   DATE;

COMMENT ON COLUMN issuetypenode.underseriesignum IS 'Underseriesignum (t.ex. A1a)';
COMMENT ON COLUMN issuetypenode.innehall         IS 'Innehållsbeskrivning av underserien';
COMMENT ON COLUMN issuetypenode.handlingar_fran  IS 'Äldsta handling i underserien';
COMMENT ON COLUMN issuetypenode.handlingar_till  IS 'Yngsta handling i underserien';

-- Volym / Handlingstyp
ALTER TABLE documenttypenode
  ADD COLUMN IF NOT EXISTS volymnum        CHARACTER VARYING(20),
  ADD COLUMN IF NOT EXISTS forvaringsplats CHARACTER VARYING(300),
  ADD COLUMN IF NOT EXISTS format_beskriv  CHARACTER VARYING(100),
  ADD COLUMN IF NOT EXISTS tillganglighet  CHARACTER VARYING(50),
  ADD COLUMN IF NOT EXISTS omfang          CHARACTER VARYING(200);

COMMENT ON COLUMN documenttypenode.volymnum        IS 'Volymbeteckning (t.ex. 1, 2:1)';
COMMENT ON COLUMN documenttypenode.forvaringsplats IS 'Förvaringsplats (fysisk hyllplats eller digitalt system)';
COMMENT ON COLUMN documenttypenode.format_beskriv  IS 'Format/medium (t.ex. papper, PDF/A, e-post)';
COMMENT ON COLUMN documenttypenode.tillganglighet  IS 'Tillgänglighetsbegränsning (t.ex. offentlig, sekretess)';
COMMENT ON COLUMN documenttypenode.omfang          IS 'Omfång (t.ex. 250 sidor, 1,2 GB)';

-- Gallrings- och bevaranderegel
ALTER TABLE rule
  ADD COLUMN IF NOT EXISTS ra_fs_referens  CHARACTER VARYING(100),
  ADD COLUMN IF NOT EXISTS gallringsgrund  TEXT,
  ADD COLUMN IF NOT EXISTS atgard         CHARACTER VARYING(20);

COMMENT ON COLUMN rule.ra_fs_referens IS 'Hänvisning till RA-FS eller annan författning';
COMMENT ON COLUMN rule.gallringsgrund  IS 'Rättslig grund eller motivering för gallringen';
COMMENT ON COLUMN rule.atgard         IS 'Åtgärd: gallras eller bevaras';

DO $$ BEGIN
  ALTER TABLE rule
    ADD CONSTRAINT rule_atgard_check
      CHECK (atgard IS NULL OR atgard IN ('gallras', 'bevaras'))
      NOT VALID;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Arkivförteckning toppnivåmetadata
CREATE TABLE IF NOT EXISTS arkivforeteckning_metadata (
  id               BIGINT NOT NULL,
  diarium_nr       CHARACTER VARYING(100),
  upprattad_av     CHARACTER VARYING(200),
  faststelld_datum DATE,
  galler_fran      DATE,
  galler_till      DATE,
  ra_referens      CHARACTER VARYING(100),
  anmarkningar     TEXT,
  PRIMARY KEY (id)
);

DO $$ BEGIN
  ALTER TABLE arkivforeteckning_metadata
    ADD CONSTRAINT arkivforeteckning_metadata_fk
      FOREIGN KEY (id) REFERENCES classificationstructuretypenode (id)
      ON DELETE CASCADE
      NOT VALID;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

COMMENT ON TABLE  arkivforeteckning_metadata                  IS 'Toppnivåmetadata kopplad till en Arkivförteckning';
COMMENT ON COLUMN arkivforeteckning_metadata.diarium_nr       IS 'Diarienummer för fastställandet';
COMMENT ON COLUMN arkivforeteckning_metadata.upprattad_av     IS 'Organisation eller person som upprättat förteckningen';
COMMENT ON COLUMN arkivforeteckning_metadata.faststelld_datum IS 'Datum för fastställande';
COMMENT ON COLUMN arkivforeteckning_metadata.galler_fran      IS 'Giltighetsdatum från';
COMMENT ON COLUMN arkivforeteckning_metadata.galler_till      IS 'Giltighetsdatum till (null = tills vidare)';
COMMENT ON COLUMN arkivforeteckning_metadata.ra_referens      IS 'Riksarkivets referens eller godkännandenummer';
COMMENT ON COLUMN arkivforeteckning_metadata.anmarkningar     IS 'Övriga anmärkningar';
