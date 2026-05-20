-- V4: Legacy import reference fields on all archival node tables.
-- Enables idempotent Visual Arkiv imports: tracks source system, table, and primary key
-- so re-running an import skips already-imported records instead of creating duplicates.

SET search_path TO ihp, public;

ALTER TABLE classificationstructuretypenode
  ADD COLUMN IF NOT EXISTS legacy_source_system  VARCHAR(50),
  ADD COLUMN IF NOT EXISTS legacy_table          VARCHAR(100),
  ADD COLUMN IF NOT EXISTS legacy_id             VARCHAR(100),
  ADD COLUMN IF NOT EXISTS legacy_parent_id      VARCHAR(100),
  ADD COLUMN IF NOT EXISTS legacy_code           VARCHAR(100),
  ADD COLUMN IF NOT EXISTS legacy_path           VARCHAR(1000),
  ADD COLUMN IF NOT EXISTS imported_at           TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS import_batch_id       UUID;

CREATE UNIQUE INDEX IF NOT EXISTS idx_csnode_legacy_key
  ON classificationstructuretypenode (legacy_source_system, legacy_table, legacy_id)
  WHERE legacy_source_system IS NOT NULL;

ALTER TABLE operationalareatypenode
  ADD COLUMN IF NOT EXISTS legacy_source_system  VARCHAR(50),
  ADD COLUMN IF NOT EXISTS legacy_table          VARCHAR(100),
  ADD COLUMN IF NOT EXISTS legacy_id             VARCHAR(100),
  ADD COLUMN IF NOT EXISTS legacy_parent_id      VARCHAR(100),
  ADD COLUMN IF NOT EXISTS legacy_code           VARCHAR(100),
  ADD COLUMN IF NOT EXISTS legacy_path           VARCHAR(1000),
  ADD COLUMN IF NOT EXISTS imported_at           TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS import_batch_id       UUID;

CREATE UNIQUE INDEX IF NOT EXISTS idx_oanode_legacy_key
  ON operationalareatypenode (legacy_source_system, legacy_table, legacy_id)
  WHERE legacy_source_system IS NOT NULL;

ALTER TABLE processgrouptypenode
  ADD COLUMN IF NOT EXISTS legacy_source_system  VARCHAR(50),
  ADD COLUMN IF NOT EXISTS legacy_table          VARCHAR(100),
  ADD COLUMN IF NOT EXISTS legacy_id             VARCHAR(100),
  ADD COLUMN IF NOT EXISTS legacy_parent_id      VARCHAR(100),
  ADD COLUMN IF NOT EXISTS legacy_code           VARCHAR(100),
  ADD COLUMN IF NOT EXISTS legacy_path           VARCHAR(1000),
  ADD COLUMN IF NOT EXISTS imported_at           TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS import_batch_id       UUID;

CREATE UNIQUE INDEX IF NOT EXISTS idx_pgnode_legacy_key
  ON processgrouptypenode (legacy_source_system, legacy_table, legacy_id)
  WHERE legacy_source_system IS NOT NULL;

ALTER TABLE processtypenode
  ADD COLUMN IF NOT EXISTS legacy_source_system  VARCHAR(50),
  ADD COLUMN IF NOT EXISTS legacy_table          VARCHAR(100),
  ADD COLUMN IF NOT EXISTS legacy_id             VARCHAR(100),
  ADD COLUMN IF NOT EXISTS legacy_parent_id      VARCHAR(100),
  ADD COLUMN IF NOT EXISTS legacy_code           VARCHAR(100),
  ADD COLUMN IF NOT EXISTS legacy_path           VARCHAR(1000),
  ADD COLUMN IF NOT EXISTS imported_at           TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS import_batch_id       UUID;

CREATE UNIQUE INDEX IF NOT EXISTS idx_processnode_legacy_key
  ON processtypenode (legacy_source_system, legacy_table, legacy_id)
  WHERE legacy_source_system IS NOT NULL;

ALTER TABLE issuetypenode
  ADD COLUMN IF NOT EXISTS legacy_source_system  VARCHAR(50),
  ADD COLUMN IF NOT EXISTS legacy_table          VARCHAR(100),
  ADD COLUMN IF NOT EXISTS legacy_id             VARCHAR(100),
  ADD COLUMN IF NOT EXISTS legacy_parent_id      VARCHAR(100),
  ADD COLUMN IF NOT EXISTS legacy_code           VARCHAR(100),
  ADD COLUMN IF NOT EXISTS legacy_path           VARCHAR(1000),
  ADD COLUMN IF NOT EXISTS imported_at           TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS import_batch_id       UUID;

CREATE UNIQUE INDEX IF NOT EXISTS idx_issuenode_legacy_key
  ON issuetypenode (legacy_source_system, legacy_table, legacy_id)
  WHERE legacy_source_system IS NOT NULL;

ALTER TABLE documenttypenode
  ADD COLUMN IF NOT EXISTS legacy_source_system  VARCHAR(50),
  ADD COLUMN IF NOT EXISTS legacy_table          VARCHAR(100),
  ADD COLUMN IF NOT EXISTS legacy_id             VARCHAR(100),
  ADD COLUMN IF NOT EXISTS legacy_parent_id      VARCHAR(100),
  ADD COLUMN IF NOT EXISTS legacy_code           VARCHAR(100),
  ADD COLUMN IF NOT EXISTS legacy_path           VARCHAR(1000),
  ADD COLUMN IF NOT EXISTS imported_at           TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS import_batch_id       UUID;

CREATE UNIQUE INDEX IF NOT EXISTS idx_documentnode_legacy_key
  ON documenttypenode (legacy_source_system, legacy_table, legacy_id)
  WHERE legacy_source_system IS NOT NULL;
