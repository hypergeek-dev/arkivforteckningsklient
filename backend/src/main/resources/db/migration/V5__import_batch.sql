-- V5: Import batch tracking table.
-- Records every import attempt (dry-run or real) with full metrics and audit trail.

SET search_path TO ihp, public;

CREATE TABLE IF NOT EXISTS import_batch (
  id                UUID        NOT NULL DEFAULT gen_random_uuid(),
  source_type       VARCHAR(50) NOT NULL,
  source_database   VARCHAR(300),
  source_host       VARCHAR(300),
  started_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at      TIMESTAMPTZ,
  status            VARCHAR(20) NOT NULL DEFAULT 'RUNNING',
  is_dry_run        BOOLEAN     NOT NULL DEFAULT TRUE,
  operator          VARCHAR(150),
  records_read      INTEGER     NOT NULL DEFAULT 0,
  records_mapped    INTEGER     NOT NULL DEFAULT 0,
  records_imported  INTEGER     NOT NULL DEFAULT 0,
  records_skipped   INTEGER     NOT NULL DEFAULT 0,
  records_duplicate INTEGER     NOT NULL DEFAULT 0,
  records_failed    INTEGER     NOT NULL DEFAULT 0,
  warnings          JSONB,
  errors            JSONB,
  unmapped_fields   JSONB,
  confirmation_token UUID,
  PRIMARY KEY (id)
);

COMMENT ON TABLE  import_batch                    IS 'Importkörsprotokoll — ett rad per körning (dry-run eller verklig import)';
COMMENT ON COLUMN import_batch.source_type        IS 'Källsystemtyp, t.ex. visual_arkiv eller json_export';
COMMENT ON COLUMN import_batch.is_dry_run         IS 'true = valideringsläge, inga poster skrivs till databasen';
COMMENT ON COLUMN import_batch.status             IS 'RUNNING | COMPLETED | FAILED | DRY_RUN_COMPLETE';
COMMENT ON COLUMN import_batch.confirmation_token IS 'Token från dry-run som krävs för att starta verklig import';

DO $$ BEGIN
  ALTER TABLE classificationstructuretypenode
    ADD CONSTRAINT csnode_import_batch_fk FOREIGN KEY (import_batch_id) REFERENCES import_batch (id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE operationalareatypenode
    ADD CONSTRAINT oanode_import_batch_fk FOREIGN KEY (import_batch_id) REFERENCES import_batch (id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE processgrouptypenode
    ADD CONSTRAINT pgnode_import_batch_fk FOREIGN KEY (import_batch_id) REFERENCES import_batch (id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE processtypenode
    ADD CONSTRAINT processnode_import_batch_fk FOREIGN KEY (import_batch_id) REFERENCES import_batch (id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE issuetypenode
    ADD CONSTRAINT issuenode_import_batch_fk FOREIGN KEY (import_batch_id) REFERENCES import_batch (id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE documenttypenode
    ADD CONSTRAINT documentnode_import_batch_fk FOREIGN KEY (import_batch_id) REFERENCES import_batch (id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
