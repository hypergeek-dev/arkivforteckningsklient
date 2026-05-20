-- V1: Baseline schema — consolidated from legacy scripts a through h.
-- Safe for new installations. For existing databases use: flyway baseline -baselineVersion=1
-- All DDL uses IF NOT EXISTS / CREATE OR REPLACE to be idempotent-safe.

SET search_path TO ihp, public;

-- -----------------------------------------------------------------------
-- SCHEMA
-- -----------------------------------------------------------------------
CREATE SCHEMA IF NOT EXISTS ihp;
SET search_path TO ihp, public;
ALTER DATABASE ihp SET search_path TO ihp, public;

-- -----------------------------------------------------------------------
-- SEQUENCES
-- -----------------------------------------------------------------------
CREATE SEQUENCE IF NOT EXISTS assignedrule_id_seq     INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647    START WITH 1 NO CYCLE;
CREATE SEQUENCE IF NOT EXISTS elements_datatype_id_seq INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647   START WITH 1 NO CYCLE;
CREATE SEQUENCE IF NOT EXISTS elements_document_id_seq INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647   START WITH 1 NO CYCLE;
CREATE SEQUENCE IF NOT EXISTS elements_id_seq          INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647   START WITH 1 NO CYCLE;
CREATE SEQUENCE IF NOT EXISTS elements_issue_id_seq    INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647   START WITH 1 NO CYCLE;
CREATE SEQUENCE IF NOT EXISTS generic_nod_id_seq       INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 NO CYCLE;
CREATE SEQUENCE IF NOT EXISTS history_id_seq           INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647   START WITH 1 NO CYCLE;
CREATE SEQUENCE IF NOT EXISTS ihp_established_id_seq   INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647   START WITH 1 NO CYCLE;
CREATE SEQUENCE IF NOT EXISTS ihpservice_seq           INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 NO CYCLE;
CREATE SEQUENCE IF NOT EXISTS nodecomment_id_seq       INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647   START WITH 1 NO CYCLE;
CREATE SEQUENCE IF NOT EXISTS noderelation_id_seq      INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647   START WITH 1 NO CYCLE;
CREATE SEQUENCE IF NOT EXISTS pdf_id_seq               INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647   START WITH 1 NO CYCLE;
CREATE SEQUENCE IF NOT EXISTS rule_id_seq              INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647   START WITH 1 NO CYCLE;
CREATE SEQUENCE IF NOT EXISTS snapshot_id_seq          INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 NO CYCLE;
CREATE SEQUENCE IF NOT EXISTS term_id_seq              INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647   START WITH 1 NO CYCLE;

-- -----------------------------------------------------------------------
-- TABLES
-- -----------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS assignedrule (
  id      SERIAL NOT NULL,
  rule_id INTEGER NOT NULL,
  doc_id  INTEGER NOT NULL,
  doc_path CHARACTER VARYING(1500) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS classificationstructuretypenode (
  id                     BIGINT DEFAULT nextval('generic_nod_id_seq'::regclass) NOT NULL,
  replaces_id            BIGINT,
  name                   CHARACTER VARYING(300),
  remark                 CHARACTER VARYING(1000),
  start                  TIMESTAMP(6) WITH TIME ZONE,
  stop                   TIMESTAMP(6) WITH TIME ZONE,
  status                 CHARACTER VARYING(50) DEFAULT 'Utkast'::character varying,
  cs_version             BIGINT,
  auth_decision          CHARACTER VARYING(300),
  auth_name              CHARACTER VARYING(300),
  created_by             CHARACTER VARYING(150),
  created_at             TIMESTAMP(6) WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  path                   CHARACTER VARYING(300),
  decision_date          DATE,
  updated_at             TIMESTAMP(6) WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_by             CHARACTER VARYING(150),
  uuid                   UUID,
  instruction            CHARACTER VARYING(300),
  revised                CHARACTER VARYING(1000),
  instruction_code_ihp   CHARACTER VARYING(20),
  CONSTRAINT csnode_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS documenttypenode (
  id                     INTEGER DEFAULT nextval('generic_nod_id_seq'::regclass) NOT NULL,
  issuetype_id           INTEGER,
  replaces_id            INTEGER,
  name                   CHARACTER VARYING(600),
  remark                 CHARACTER VARYING(1000),
  start                  TIMESTAMP(6) WITH TIME ZONE,
  stop                   TIMESTAMP(6) WITH TIME ZONE,
  status                 CHARACTER VARYING(50) DEFAULT 'Utkast'::character varying,
  register               BOOLEAN DEFAULT false,
  keeping_unit           CHARACTER VARYING(300),
  signature_required     BOOLEAN DEFAULT false,
  informationsecurityclass INTEGER,
  created_by             CHARACTER VARYING(150),
  created_at             TIMESTAMP(6) WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  path                   CHARACTER VARYING(1500),
  secrecy                BOOLEAN DEFAULT false,
  personal_data          BOOLEAN DEFAULT false,
  updated_at             TIMESTAMP(6) WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_by             CHARACTER VARYING(150),
  uuid                   UUID,
  regulation             CHARACTER VARYING(1000),
  manual_evaluation      BOOLEAN DEFAULT false,
  secrecy_lawsection     CHARACTER VARYING(1000),
  index                  INTEGER,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS elements (
  id          SERIAL NOT NULL,
  name        CHARACTER VARYING(50) NOT NULL,
  description CHARACTER VARYING(300),
  datatype    INTEGER,
  mandatory   BOOLEAN,
  startdate   TIMESTAMP(6) WITH TIME ZONE NOT NULL,
  enddate     TIMESTAMP(6) WITH TIME ZONE NOT NULL,
  node_type   CHARACTER VARYING(20),
  status      CHARACTER VARYING(20),
  created_by  CHARACTER VARYING(50) NOT NULL,
  updated_by  CHARACTER VARYING(50),
  created_at  TIMESTAMP(6) WITH TIME ZONE NOT NULL,
  updated_at  TIMESTAMP(6) WITH TIME ZONE,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS elements_datatype (
  id   SERIAL NOT NULL,
  type CHARACTER VARYING(50),
  PRIMARY KEY (id),
  UNIQUE (type)
);

CREATE TABLE IF NOT EXISTS elements_document (
  id            SERIAL NOT NULL,
  element_id    INTEGER,
  document_id   INTEGER,
  document_path CHARACTER VARYING(1500),
  PRIMARY KEY (id),
  UNIQUE (element_id, document_id)
);

CREATE TABLE IF NOT EXISTS elements_issue (
  id         SERIAL NOT NULL,
  element_id INTEGER,
  issue_id   INTEGER,
  issue_path CHARACTER VARYING(1500),
  PRIMARY KEY (id),
  UNIQUE (element_id, issue_id)
);

CREATE TABLE IF NOT EXISTS handelselogg (
  id              INTEGER NOT NULL,
  version         INTEGER,
  skapad_datum    TIMESTAMP(6) WITHOUT TIME ZONE,
  uppdaterad_datum TIMESTAMP(6) WITHOUT TIME ZONE,
  uuid            UUID NOT NULL,
  handelse        CHARACTER VARYING(255),
  beskrivning     CHARACTER VARYING(255),
  modell_id       CHARACTER VARYING(1500),
  objekt_id       UUID,
  objektnamn      CHARACTER VARYING(1500),
  typ             CHARACTER VARYING(255),
  anvandar_id     CHARACTER VARYING(255),
  history_id      INTEGER,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS history (
  id   SERIAL NOT NULL,
  date TIMESTAMP(6) WITH TIME ZONE NOT NULL,
  json JSONB NOT NULL,
  uuid UUID
);

CREATE TABLE IF NOT EXISTS ihp_established (
  id               SERIAL NOT NULL,
  csnode_id        INTEGER NOT NULL,
  timestamp        TIMESTAMP(6) WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  modelb           JSONB,
  instruction_code CHARACTER VARYING(20),
  PRIMARY KEY (id, csnode_id, timestamp)
);

CREATE TABLE IF NOT EXISTS issuetypenode (
  id           INTEGER DEFAULT nextval('generic_nod_id_seq'::regclass) NOT NULL,
  process_id   INTEGER,
  replaces_id  INTEGER,
  name         CHARACTER VARYING(600),
  start        TIMESTAMP(6) WITH TIME ZONE,
  stop         TIMESTAMP(6) WITH TIME ZONE,
  status       CHARACTER VARYING(50) DEFAULT 'Utkast'::character varying,
  remark       CHARACTER VARYING(1000),
  register     BOOLEAN,
  keeping_unit CHARACTER VARYING(300),
  created_by   CHARACTER VARYING(150),
  created_at   TIMESTAMP(6) WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  path         CHARACTER VARYING(1500),
  number       CHARACTER VARYING,
  updated_at   TIMESTAMP(6) WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_by   CHARACTER VARYING(150),
  uuid         UUID,
  index        INTEGER,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS model_snapshot_established (
  id               INTEGER DEFAULT nextval('snapshot_id_seq'::regclass) NOT NULL,
  csnode_id        INTEGER NOT NULL,
  timestamp        TIMESTAMP(6) WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  model            CHARACTER VARYING,
  modelb           JSONB NOT NULL,
  instruction_code CHARACTER VARYING(20),
  PRIMARY KEY (id, csnode_id, timestamp)
);

CREATE TABLE IF NOT EXISTS nodecomment (
  id         SERIAL NOT NULL,
  node_id    INTEGER NOT NULL,
  comment    CHARACTER VARYING(250) NOT NULL,
  created_by CHARACTER VARYING(30) NOT NULL,
  created_at TIMESTAMP(6) WITHOUT TIME ZONE
);

CREATE TABLE IF NOT EXISTS noderelation (
  id           SERIAL NOT NULL,
  path         CHARACTER VARYING(1500) NOT NULL,
  related_path CHARACTER VARYING(1500) NOT NULL,
  comment      CHARACTER VARYING(500),
  type         CHARACTER VARYING(50),
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS operationalareatypenode (
  id                       BIGINT DEFAULT nextval('generic_nod_id_seq'::regclass) NOT NULL,
  csnode_id                BIGINT,
  replaces_id              BIGINT,
  name                     CHARACTER VARYING(600),
  remark                   CHARACTER VARYING(1000),
  start                    TIMESTAMP(6) WITH TIME ZONE,
  stop                     TIMESTAMP(6) WITH TIME ZONE,
  status                   CHARACTER VARYING(50) DEFAULT 'Utkast'::character varying,
  information_responsible  CHARACTER VARYING(300),
  contact                  CHARACTER VARYING(300),
  lawsection               CHARACTER VARYING(300),
  relation_structuralunit  CHARACTER VARYING(300),
  created_by               CHARACTER VARYING(150),
  created_at               TIMESTAMP(6) WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  path                     CHARACTER VARYING(300),
  decision_date            DATE,
  auth_decision            CHARACTER VARYING(300),
  updated_at               TIMESTAMP(6) WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_by               CHARACTER VARYING(150),
  uuid                     UUID,
  CONSTRAINT activityareanode_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS pdf (
  id          SERIAL NOT NULL,
  pdf_data    BYTEA,
  pdf_type    CHARACTER VARYING(26),
  skapad_stmp TIMESTAMP(6) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  skapad_av   CHARACTER VARYING,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS processgrouptypenode (
  id                      BIGINT DEFAULT nextval('generic_nod_id_seq'::regclass) NOT NULL,
  parent_id               BIGINT,
  replaces_id             BIGINT,
  name                    CHARACTER VARYING(600),
  remark                  CHARACTER VARYING(1000),
  start                   TIMESTAMP(6) WITH TIME ZONE,
  stop                    TIMESTAMP(6) WITH TIME ZONE,
  status                  CHARACTER VARYING(50) DEFAULT 'Utkast'::character varying,
  information_responsible CHARACTER VARYING(300),
  contact                 CHARACTER VARYING(300),
  lawsection              CHARACTER VARYING(300),
  relation_structuralunit CHARACTER VARYING(300),
  created_by              CHARACTER VARYING(150),
  created_at              TIMESTAMP(6) WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  path                    CHARACTER VARYING(300),
  decision_date           DATE,
  updated_at              TIMESTAMP(6) WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_by              CHARACTER VARYING(150),
  uuid                    UUID,
  CONSTRAINT processgroupnode_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS processtypenode (
  id                      BIGINT DEFAULT nextval('generic_nod_id_seq'::regclass) NOT NULL,
  parent_id               BIGINT,
  replaces_id             BIGINT,
  name                    CHARACTER VARYING(600),
  remark                  CHARACTER VARYING(1000),
  start                   TIMESTAMP(6) WITH TIME ZONE,
  stop                    TIMESTAMP(6) WITH TIME ZONE,
  status                  CHARACTER VARYING(50) DEFAULT 'Utkast'::character varying,
  information_responsible CHARACTER VARYING(300),
  contact                 CHARACTER VARYING(300),
  lawsection              CHARACTER VARYING(300),
  relation_structuralunit CHARACTER VARYING(300),
  created_by              CHARACTER VARYING(150),
  created_at              TIMESTAMP(6) WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  path                    CHARACTER VARYING(300),
  number                  CHARACTER VARYING,
  updated_at              TIMESTAMP(6) WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_by              CHARACTER VARYING(150),
  uuid                    UUID,
  CONSTRAINT processnode_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS rule (
  id          SERIAL NOT NULL,
  ruletype    CHARACTER VARYING(50) NOT NULL,
  description CHARACTER VARYING(1000),
  status      CHARACTER VARYING(50) NOT NULL,
  uuid        UUID NOT NULL,
  created_by  CHARACTER VARYING(50) NOT NULL,
  created_at  TIMESTAMP(6) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by  CHARACTER VARYING(50),
  updated_at  TIMESTAMP(6) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  name        CHARACTER VARYING(100) NOT NULL,
  comment     CHARACTER VARYING(500),
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS term (
  id         SERIAL NOT NULL,
  attribute  CHARACTER VARYING(50) NOT NULL,
  operand    CHARACTER VARYING(50) NOT NULL,
  created_by CHARACTER VARYING(50) NOT NULL,
  created_at TIMESTAMP(6) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by CHARACTER VARYING(50),
  updated_at TIMESTAMP(6) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  rule_id    INTEGER NOT NULL,
  years      INTEGER NOT NULL,
  months     INTEGER NOT NULL,
  days       INTEGER NOT NULL,
  PRIMARY KEY (id)
);

-- -----------------------------------------------------------------------
-- FOREIGN KEY CONSTRAINTS (idempotent via DO/EXCEPTION)
-- -----------------------------------------------------------------------

DO $$ BEGIN
  ALTER TABLE assignedrule ADD CONSTRAINT assignedrule_fk1 FOREIGN KEY (rule_id) REFERENCES rule (id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE assignedrule ADD CONSTRAINT assignedrule_fk2 FOREIGN KEY (doc_id) REFERENCES documenttypenode (id) ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE elements ADD CONSTRAINT elements_datatype_fkey FOREIGN KEY (datatype) REFERENCES elements_datatype (id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE elements ADD CHECK (startdate < enddate);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE elements ADD CHECK (((node_type)::text = 'DOCUMENT'::text) OR ((node_type)::text = 'ISSUE'::text));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE elements ADD CHECK (((status)::text = 'DRAFT'::text) OR ((status)::text = 'ESTABLISHED'::text));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE elements_document ADD CONSTRAINT elements_document_document_id_fkey FOREIGN KEY (document_id) REFERENCES documenttypenode (id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE elements_document ADD CONSTRAINT elements_document_element_id_fkey FOREIGN KEY (element_id) REFERENCES elements (id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE elements_issue ADD CONSTRAINT elements_issue_element_id_fkey FOREIGN KEY (element_id) REFERENCES elements (id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE elements_issue ADD CONSTRAINT elements_issue_issue_id_fkey FOREIGN KEY (issue_id) REFERENCES issuetypenode (id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE operationalareatypenode ADD CONSTRAINT operationalareatypenode_fk1 FOREIGN KEY (csnode_id) REFERENCES classificationstructuretypenode (id) ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE pdf ADD CHECK ((pdf_type)::text = ANY (ARRAY[('klassificeringsstruktur'::character varying)::text, ('informationshanteringsplan'::character varying)::text]));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE term ADD CONSTRAINT fk_rule FOREIGN KEY (rule_id) REFERENCES rule (id) ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- -----------------------------------------------------------------------
-- VIEWS
-- -----------------------------------------------------------------------

CREATE OR REPLACE VIEW arende_n_vy (node) AS
SELECT json_build_object(
  'id', id::text,
  'replacesId', CASE WHEN replaces_id IS NOT NULL THEN replaces_id::text ELSE NULL::text END,
  'name', name, 'path', path, 'partialPath', NULL::unknown,
  'localPath', (number::text || '.'::text) || index,
  'status', lower(status::text),
  'start', CASE WHEN start IS NOT NULL THEN to_char((start AT TIME ZONE 'Europe/Stockholm'::text), 'YYYY-MM-DD"T"HH24:MI:SS.USOF'::text) ELSE NULL::text END,
  'stop',  CASE WHEN stop  IS NOT NULL THEN to_char((stop  AT TIME ZONE 'Europe/Stockholm'::text), 'YYYY-MM-DD"T"HH24:MI:SS.USOF'::text) ELSE NULL::text END,
  'updated', CASE WHEN updated_at IS NOT NULL THEN to_char((updated_at AT TIME ZONE 'Europe/Stockholm'::text), 'YYYY-MM-DD"T"HH24:MI:SS.USOF'::text) ELSE NULL::text END,
  'createdAt', CASE WHEN created_at IS NOT NULL THEN to_char((created_at AT TIME ZONE 'Europe/Stockholm'::text), 'YYYY-MM-DD"T"HH24:MI:SS.USOF'::text) ELSE NULL::text END,
  'createdBy', created_by, 'updatedBy', updated_by, 'remark', remark, 'uuid', uuid::text,
  'nodeName', 'issuenode', 'parentId', process_id::text, 'register', register, 'keepingUnit', keeping_unit,
  'relations', COALESCE((SELECT json_agg(json_build_object('id', relation.id, 'path', relation.path, 'relatedPath', relation.related_path, 'comment', relation.comment, 'type', relation.type)) FROM noderelation relation WHERE relation.path::text = d.path::text), '[]'::json),
  'assignedElements', COALESCE((SELECT json_agg(json_build_object('id', e.id, 'name', e.name, 'description', e.description, 'datatype', e.datatype, 'mandatory', e.mandatory, 'startDate', CASE WHEN e.startdate IS NOT NULL THEN to_char((e.startdate AT TIME ZONE 'Europe/Stockholm'::text), 'YYYY-MM-DD"T"HH24:MI:SS.USOF'::text) ELSE NULL::text END, 'endDate', CASE WHEN e.enddate IS NOT NULL THEN to_char((e.enddate AT TIME ZONE 'Europe/Stockholm'::text), 'YYYY-MM-DD"T"HH24:MI:SS.USOF'::text) ELSE NULL::text END, 'nodeType', e.node_type, 'status', e.status, 'createdBy', e.created_by, 'updatedBy', e.updated_by, 'createdAt', CASE WHEN e.created_at IS NOT NULL THEN to_char((e.created_at AT TIME ZONE 'Europe/Stockholm'::text), 'YYYY-MM-DD"T"HH24:MI:SS.USOF'::text) ELSE NULL::text END, 'updatedAt', CASE WHEN e.updated_at IS NOT NULL THEN to_char((e.updated_at AT TIME ZONE 'Europe/Stockholm'::text), 'YYYY-MM-DD"T"HH24:MI:SS.USOF'::text) ELSE NULL::text END)) FROM elements e JOIN elements_issue ed ON e.id = ed.element_id WHERE ed.issue_id = d.id), '[]'::json),
  'index', index
) AS node
FROM issuetypenode d;

CREATE OR REPLACE VIEW klassifikation_n_vy (node) AS
SELECT json_build_object(
  'id', id::text,
  'replacesId', CASE WHEN replaces_id IS NOT NULL THEN replaces_id::text ELSE NULL::text END,
  'name', name, 'path', path, 'partialPath', NULL::unknown, 'localPath', '1',
  'status', lower(status::text),
  'start', CASE WHEN start IS NOT NULL THEN to_char((start AT TIME ZONE 'Europe/Stockholm'::text), 'YYYY-MM-DD"T"HH24:MI:SS.USOF'::text) ELSE NULL::text END,
  'stop',  CASE WHEN stop  IS NOT NULL THEN to_char((stop  AT TIME ZONE 'Europe/Stockholm'::text), 'YYYY-MM-DD"T"HH24:MI:SS.USOF'::text) ELSE NULL::text END,
  'updated', CASE WHEN updated_at IS NOT NULL THEN to_char((updated_at AT TIME ZONE 'Europe/Stockholm'::text), 'YYYY-MM-DD"T"HH24:MI:SS.USOF'::text) ELSE NULL::text END,
  'createdAt', CASE WHEN created_at IS NOT NULL THEN to_char((created_at AT TIME ZONE 'Europe/Stockholm'::text), 'YYYY-MM-DD"T"HH24:MI:SS.USOF'::text) ELSE NULL::text END,
  'createdBy', created_by, 'updatedBy', updated_by, 'remark', remark, 'uuid', uuid::text,
  'nodeName', 'csnode', 'csVersion', cs_version, 'authDecision', auth_decision,
  'authName', auth_name, 'decisionDate', decision_date, 'instruction', instruction,
  'revised', revised, 'instructionCodeIhp', instruction_code_ihp
) AS node
FROM classificationstructuretypenode d;

CREATE OR REPLACE VIEW process_n_vy (node) AS
SELECT json_build_object(
  'id', id::text,
  'replacesId', CASE WHEN replaces_id IS NOT NULL THEN replaces_id::text ELSE NULL::text END,
  'name', name, 'path', path, 'partialPath', NULL::unknown,
  'localPath', regexp_replace(path::text, '.*/([^/]+)$'::text, '\1'::text),
  'status', lower(status::text),
  'start', CASE WHEN start IS NOT NULL THEN to_char((start AT TIME ZONE 'Europe/Stockholm'::text), 'YYYY-MM-DD"T"HH24:MI:SS.USOF'::text) ELSE NULL::text END,
  'stop',  CASE WHEN stop  IS NOT NULL THEN to_char((stop  AT TIME ZONE 'Europe/Stockholm'::text), 'YYYY-MM-DD"T"HH24:MI:SS.USOF'::text) ELSE NULL::text END,
  'updated', CASE WHEN updated_at IS NOT NULL THEN to_char((updated_at AT TIME ZONE 'Europe/Stockholm'::text), 'YYYY-MM-DD"T"HH24:MI:SS.USOF'::text) ELSE NULL::text END,
  'createdAt', CASE WHEN created_at IS NOT NULL THEN to_char((created_at AT TIME ZONE 'Europe/Stockholm'::text), 'YYYY-MM-DD"T"HH24:MI:SS.USOF'::text) ELSE NULL::text END,
  'createdBy', created_by, 'updatedBy', updated_by, 'remark', remark, 'uuid', uuid::text,
  'nodeName', 'processnode', 'parentId', parent_id::text,
  'informationResponsible', information_responsible, 'contact', contact,
  'lawsection', lawsection, 'relationStructuralunit', relation_structuralunit,
  'relations', COALESCE((SELECT json_agg(json_build_object('id', relation.id, 'path', relation.path, 'relatedPath', relation.related_path, 'comment', relation.comment, 'type', relation.type)) FROM noderelation relation WHERE relation.path::text = d.path::text), '[]'::json)
) AS node
FROM processtypenode d;

CREATE OR REPLACE VIEW processgrupp_n_vy (node) AS
SELECT json_build_object(
  'id', id::text,
  'replacesId', CASE WHEN replaces_id IS NOT NULL THEN replaces_id::text ELSE NULL::text END,
  'name', name, 'path', path, 'partialPath', NULL::unknown,
  'localPath', regexp_replace(path::text, '.*/([^/]+)$'::text, '\1'::text),
  'status', lower(status::text),
  'start', CASE WHEN start IS NOT NULL THEN to_char((start AT TIME ZONE 'Europe/Stockholm'::text), 'YYYY-MM-DD"T"HH24:MI:SS.USOF'::text) ELSE NULL::text END,
  'stop',  CASE WHEN stop  IS NOT NULL THEN to_char((stop  AT TIME ZONE 'Europe/Stockholm'::text), 'YYYY-MM-DD"T"HH24:MI:SS.USOF'::text) ELSE NULL::text END,
  'updated', CASE WHEN updated_at IS NOT NULL THEN to_char((updated_at AT TIME ZONE 'Europe/Stockholm'::text), 'YYYY-MM-DD"T"HH24:MI:SS.USOF'::text) ELSE NULL::text END,
  'createdAt', CASE WHEN created_at IS NOT NULL THEN to_char((created_at AT TIME ZONE 'Europe/Stockholm'::text), 'YYYY-MM-DD"T"HH24:MI:SS.USOF'::text) ELSE NULL::text END,
  'createdBy', created_by, 'updatedBy', updated_by, 'remark', remark, 'uuid', uuid::text,
  'nodeName', 'pgnode', 'parentId', parent_id::text,
  'informationResponsible', information_responsible, 'contact', contact,
  'lawsection', lawsection, 'relationStructuralunit', relation_structuralunit,
  'relations', COALESCE((SELECT json_agg(json_build_object('id', relation.id, 'path', relation.path, 'relatedPath', relation.related_path, 'comment', relation.comment, 'type', relation.type)) FROM noderelation relation WHERE relation.path::text = d.path::text), '[]'::json)
) AS node
FROM processgrouptypenode d;

CREATE OR REPLACE VIEW verksamhet_omrade_n_vy (node) AS
SELECT json_build_object(
  'id', id::text,
  'replacesId', CASE WHEN replaces_id IS NOT NULL THEN replaces_id::text ELSE NULL::text END,
  'name', name, 'path', path, 'partialPath', NULL::unknown,
  'localPath', regexp_replace(path::text, '.*/([^/]+)$'::text, '\1'::text),
  'status', lower(status::text),
  'start', CASE WHEN start IS NOT NULL THEN to_char((start AT TIME ZONE 'Europe/Stockholm'::text), 'YYYY-MM-DD"T"HH24:MI:SS.USOF'::text) ELSE NULL::text END,
  'stop',  CASE WHEN stop  IS NOT NULL THEN to_char((stop  AT TIME ZONE 'Europe/Stockholm'::text), 'YYYY-MM-DD"T"HH24:MI:SS.USOF'::text) ELSE NULL::text END,
  'updated', CASE WHEN updated_at IS NOT NULL THEN to_char((updated_at AT TIME ZONE 'Europe/Stockholm'::text), 'YYYY-MM-DD"T"HH24:MI:SS.USOF'::text) ELSE NULL::text END,
  'createdAt', CASE WHEN created_at IS NOT NULL THEN to_char((created_at AT TIME ZONE 'Europe/Stockholm'::text), 'YYYY-MM-DD"T"HH24:MI:SS.USOF'::text) ELSE NULL::text END,
  'createdBy', created_by, 'updatedBy', updated_by, 'remark', remark, 'uuid', uuid::text,
  'nodeName', 'oanode', 'parentId', csnode_id::text,
  'informationResponsible', information_responsible, 'contact', contact,
  'lawsection', lawsection, 'relationStructuralunit', relation_structuralunit,
  'relations', COALESCE((SELECT json_agg(json_build_object('id', relation.id, 'path', relation.path, 'relatedPath', relation.related_path, 'comment', relation.comment, 'type', relation.type)) FROM noderelation relation WHERE relation.path::text = d.path::text), '[]'::json)
) AS node
FROM operationalareatypenode d;

-- handling_n_vy kept as full form to preserve the complex rule/element subqueries
CREATE OR REPLACE VIEW handling_n_vy (node) AS
SELECT json_build_object(
  'id', d.id::text,
  'replacesId', CASE WHEN d.replaces_id IS NOT NULL THEN d.replaces_id::text ELSE NULL::text END,
  'name', d.name, 'path', d.path, 'partialPath', NULL::unknown,
  'localPath', (((issue.number::text || '.'::text) || issue.index) || '.'::text) || d.index,
  'status', lower(d.status::text),
  'start', CASE WHEN d.start IS NOT NULL THEN to_char((d.start AT TIME ZONE 'Europe/Stockholm'::text), 'YYYY-MM-DD"T"HH24:MI:SS.USOF'::text) ELSE NULL::text END,
  'stop',  CASE WHEN d.stop  IS NOT NULL THEN to_char((d.stop  AT TIME ZONE 'Europe/Stockholm'::text), 'YYYY-MM-DD"T"HH24:MI:SS.USOF'::text) ELSE NULL::text END,
  'updated', CASE WHEN d.updated_at IS NOT NULL THEN to_char((d.updated_at AT TIME ZONE 'Europe/Stockholm'::text), 'YYYY-MM-DD"T"HH24:MI:SS.USOF'::text) ELSE NULL::text END,
  'createdAt', CASE WHEN d.created_at IS NOT NULL THEN to_char((d.created_at AT TIME ZONE 'Europe/Stockholm'::text), 'YYYY-MM-DD"T"HH24:MI:SS.USOF'::text) ELSE NULL::text END,
  'createdBy', d.created_by, 'updatedBy', d.updated_by, 'remark', d.remark, 'uuid', d.uuid::text,
  'nodeName', 'documentnode', 'parentId', d.issuetype_id::text,
  'register', d.register, 'keepingUnit', d.keeping_unit,
  'signatureRequired', d.signature_required, 'informationsecurityclass', d.informationsecurityclass,
  'secrecy', d.secrecy, 'secrecyLawsection', d.secrecy_lawsection,
  'personalData', d.personal_data, 'regulation', d.regulation, 'manualEvaluation', d.manual_evaluation,
  'assignedRules', COALESCE((
    SELECT json_agg(json_build_object(
      'id', r.id, 'ruleType', r.ruletype, 'description', r.description, 'status', lower(r.status::text),
      'name', r.name, 'comment', r.comment, 'createdBy', r.created_by, 'updatedBy', r.updated_by,
      'createdAt', CASE WHEN r.created_at IS NOT NULL THEN to_char((r.created_at AT TIME ZONE 'Europe/Stockholm'::text), 'YYYY-MM-DD"T"HH24:MI:SS.USOF'::text) ELSE NULL::text END,
      'updatedAt', CASE WHEN r.updated_at IS NOT NULL THEN to_char((r.updated_at AT TIME ZONE 'Europe/Stockholm'::text), 'YYYY-MM-DD"T"HH24:MI:SS.USOF'::text) ELSE NULL::text END,
      'uuid', r.uuid::text,
      'terms', COALESCE((SELECT json_agg(json_build_object('id', t.id, 'attribute', t.attribute, 'operand', t.operand, 'years', t.years, 'months', t.months, 'days', t.days, 'createdBy', t.created_by, 'updatedBy', t.updated_by, 'createdAt', CASE WHEN t.created_at IS NOT NULL THEN to_char((t.created_at AT TIME ZONE 'Europe/Stockholm'::text), 'YYYY-MM-DD"T"HH24:MI:SS.USOF'::text) ELSE NULL::text END, 'updatedAt', CASE WHEN t.updated_at IS NOT NULL THEN to_char((t.updated_at AT TIME ZONE 'Europe/Stockholm'::text), 'YYYY-MM-DD"T"HH24:MI:SS.USOF'::text) ELSE NULL::text END)) FROM term t WHERE t.rule_id = r.id), '[]'::json)
    )) FROM rule r JOIN assignedrule ar ON r.id = ar.rule_id WHERE ar.doc_id = d.id
  ), '[]'::json),
  'assignedElements', COALESCE((SELECT json_agg(json_build_object('id', e.id, 'name', e.name, 'description', e.description, 'datatype', e.datatype, 'mandatory', e.mandatory, 'startDate', CASE WHEN e.startdate IS NOT NULL THEN to_char((e.startdate AT TIME ZONE 'Europe/Stockholm'::text), 'YYYY-MM-DD"T"HH24:MI:SS.USOF'::text) ELSE NULL::text END, 'endDate', CASE WHEN e.enddate IS NOT NULL THEN to_char((e.enddate AT TIME ZONE 'Europe/Stockholm'::text), 'YYYY-MM-DD"T"HH24:MI:SS.USOF'::text) ELSE NULL::text END, 'nodeType', e.node_type, 'status', e.status, 'createdBy', e.created_by, 'updatedBy', e.updated_by, 'createdAt', CASE WHEN e.created_at IS NOT NULL THEN to_char((e.created_at AT TIME ZONE 'Europe/Stockholm'::text), 'YYYY-MM-DD"T"HH24:MI:SS.USOF'::text) ELSE NULL::text END, 'updatedAt', CASE WHEN e.updated_at IS NOT NULL THEN to_char((e.updated_at AT TIME ZONE 'Europe/Stockholm'::text), 'YYYY-MM-DD"T"HH24:MI:SS.USOF'::text) ELSE NULL::text END)) FROM elements e JOIN elements_document ed ON e.id = ed.element_id WHERE ed.document_id = d.id), '[]'::json),
  'index', d.index
) AS node
FROM documenttypenode d JOIN issuetypenode issue ON d.issuetype_id = issue.id;

-- -----------------------------------------------------------------------
-- MATERIALIZED VIEWS
-- -----------------------------------------------------------------------

CREATE MATERIALIZED VIEW IF NOT EXISTS ihp.arende_m_vy AS
SELECT json_build_object(
  'id', (id)::TEXT, 'replacesId', CASE WHEN (replaces_id IS NOT NULL) THEN (replaces_id)::TEXT ELSE NULL::TEXT END,
  'name', NAME, 'path', path, 'partialPath', NULL::UNKNOWN,
  'localPath', (((NUMBER)::TEXT || '.'::TEXT) || INDEX),
  'status', lower((status)::TEXT),
  'start', CASE WHEN (START IS NOT NULL) THEN TO_CHAR((START AT TIME ZONE 'Europe/Stockholm'::TEXT), 'YYYY-MM-DD"T"HH24:MI:SS.USOF'::TEXT) ELSE NULL::TEXT END,
  'stop',  CASE WHEN (STOP  IS NOT NULL) THEN TO_CHAR((STOP  AT TIME ZONE 'Europe/Stockholm'::TEXT), 'YYYY-MM-DD"T"HH24:MI:SS.USOF'::TEXT) ELSE NULL::TEXT END,
  'updated', CASE WHEN (updated_at IS NOT NULL) THEN TO_CHAR((updated_at AT TIME ZONE 'Europe/Stockholm'::TEXT), 'YYYY-MM-DD"T"HH24:MI:SS.USOF'::TEXT) ELSE NULL::TEXT END,
  'createdAt', CASE WHEN (created_at IS NOT NULL) THEN TO_CHAR((created_at AT TIME ZONE 'Europe/Stockholm'::TEXT), 'YYYY-MM-DD"T"HH24:MI:SS.USOF'::TEXT) ELSE NULL::TEXT END,
  'createdBy', created_by, 'updatedBy', updated_by, 'remark', remark, 'uuid', (UUID)::TEXT,
  'nodeName', 'issuenode', 'parentId', (process_id)::TEXT, 'register', register, 'keepingUnit', keeping_unit,
  'relations', COALESCE((SELECT json_agg(json_build_object('id', relation.id, 'path', relation.path, 'relatedPath', relation.related_path, 'comment', relation.comment, 'type', relation.type)) FROM ihp.noderelation relation WHERE ((relation.path)::TEXT = (d.path)::TEXT)), '[]'::json),
  'assignedElements', COALESCE((SELECT json_agg(json_build_object('id', e.id, 'name', e.name, 'description', e.description, 'datatype', e.datatype, 'mandatory', e.mandatory, 'startDate', CASE WHEN (e.startdate IS NOT NULL) THEN TO_CHAR((e.startdate AT TIME ZONE 'Europe/Stockholm'::TEXT), 'YYYY-MM-DD"T"HH24:MI:SS.USOF'::TEXT) ELSE NULL::TEXT END, 'endDate', CASE WHEN (e.enddate IS NOT NULL) THEN TO_CHAR((e.enddate AT TIME ZONE 'Europe/Stockholm'::TEXT), 'YYYY-MM-DD"T"HH24:MI:SS.USOF'::TEXT) ELSE NULL::TEXT END, 'nodeType', e.node_type, 'status', e.status, 'createdBy', e.created_by, 'updatedBy', e.updated_by, 'createdAt', CASE WHEN (e.created_at IS NOT NULL) THEN TO_CHAR((e.created_at AT TIME ZONE 'Europe/Stockholm'::TEXT), 'YYYY-MM-DD"T"HH24:MI:SS.USOF'::TEXT) ELSE NULL::TEXT END, 'updatedAt', CASE WHEN (e.updated_at IS NOT NULL) THEN TO_CHAR((e.updated_at AT TIME ZONE 'Europe/Stockholm'::TEXT), 'YYYY-MM-DD"T"HH24:MI:SS.USOF'::TEXT) ELSE NULL::TEXT END)) FROM (ihp.elements e JOIN ihp.elements_issue ed ON ((e.id = ed.element_id))) WHERE (ed.issue_id = d.id)), '[]'::json),
  'index', INDEX
) AS node
FROM ihp.issuetypenode d;

CREATE MATERIALIZED VIEW IF NOT EXISTS ihp.handling_m_vy AS
SELECT json_build_object(
  'id', (d.id)::TEXT, 'replacesId', CASE WHEN (d.replaces_id IS NOT NULL) THEN (d.replaces_id)::TEXT ELSE NULL::TEXT END,
  'name', d.name, 'path', d.path, 'partialPath', NULL::UNKNOWN,
  'localPath', ((((issue.number)::TEXT || '.'::TEXT) || issue.index) || '.'::TEXT) || d.index,
  'status', lower((d.status)::TEXT),
  'start', CASE WHEN (d.start IS NOT NULL) THEN TO_CHAR((d.start AT TIME ZONE 'Europe/Stockholm'::TEXT), 'YYYY-MM-DD"T"HH24:MI:SS.USOF'::TEXT) ELSE NULL::TEXT END,
  'stop',  CASE WHEN (d.stop  IS NOT NULL) THEN TO_CHAR((d.stop  AT TIME ZONE 'Europe/Stockholm'::TEXT), 'YYYY-MM-DD"T"HH24:MI:SS.USOF'::TEXT) ELSE NULL::TEXT END,
  'updated', CASE WHEN (d.updated_at IS NOT NULL) THEN TO_CHAR((d.updated_at AT TIME ZONE 'Europe/Stockholm'::TEXT), 'YYYY-MM-DD"T"HH24:MI:SS.USOF'::TEXT) ELSE NULL::TEXT END,
  'createdAt', CASE WHEN (d.created_at IS NOT NULL) THEN TO_CHAR((d.created_at AT TIME ZONE 'Europe/Stockholm'::TEXT), 'YYYY-MM-DD"T"HH24:MI:SS.USOF'::TEXT) ELSE NULL::TEXT END,
  'createdBy', d.created_by, 'updatedBy', d.updated_by, 'remark', d.remark, 'uuid', (d.uuid)::TEXT,
  'nodeName', 'documentnode', 'parentId', (d.issuetype_id)::TEXT,
  'register', d.register, 'keepingUnit', d.keeping_unit, 'signatureRequired', d.signature_required,
  'informationsecurityclass', d.informationsecurityclass, 'secrecy', d.secrecy,
  'secrecyLawsection', d.secrecy_lawsection, 'personalData', d.personal_data,
  'regulation', d.regulation, 'manualEvaluation', d.manual_evaluation,
  'assignedRules', COALESCE((SELECT json_agg(json_build_object('id', r.id, 'ruleType', r.ruletype, 'description', r.description, 'status', lower((r.status)::TEXT), 'name', r.name, 'comment', r.comment, 'createdBy', r.created_by, 'updatedBy', r.updated_by, 'createdAt', CASE WHEN (r.created_at IS NOT NULL) THEN TO_CHAR((r.created_at AT TIME ZONE 'Europe/Stockholm'::TEXT), 'YYYY-MM-DD"T"HH24:MI:SS.USOF'::TEXT) ELSE NULL::TEXT END, 'updatedAt', CASE WHEN (r.updated_at IS NOT NULL) THEN TO_CHAR((r.updated_at AT TIME ZONE 'Europe/Stockholm'::TEXT), 'YYYY-MM-DD"T"HH24:MI:SS.USOF'::TEXT) ELSE NULL::TEXT END, 'uuid', (r.uuid)::TEXT, 'terms', COALESCE((SELECT json_agg(json_build_object('id', t.id, 'attribute', t.attribute, 'operand', t.operand, 'years', t.years, 'months', t.months, 'days', t.days, 'createdBy', t.created_by, 'updatedBy', t.updated_by, 'createdAt', CASE WHEN (t.created_at IS NOT NULL) THEN TO_CHAR((t.created_at AT TIME ZONE 'Europe/Stockholm'::TEXT), 'YYYY-MM-DD"T"HH24:MI:SS.USOF'::TEXT) ELSE NULL::TEXT END, 'updatedAt', CASE WHEN (t.updated_at IS NOT NULL) THEN TO_CHAR((t.updated_at AT TIME ZONE 'Europe/Stockholm'::TEXT), 'YYYY-MM-DD"T"HH24:MI:SS.USOF'::TEXT) ELSE NULL::TEXT END)) FROM ihp.term t WHERE (t.rule_id = r.id)), '[]'::json))) FROM (ihp.rule r JOIN ihp.assignedrule ar ON ((r.id = ar.rule_id))) WHERE (ar.doc_id = d.id)), '[]'::json),
  'assignedElements', COALESCE((SELECT json_agg(json_build_object('id', e.id, 'name', e.name, 'description', e.description, 'datatype', e.datatype, 'mandatory', e.mandatory, 'startDate', CASE WHEN (e.startdate IS NOT NULL) THEN TO_CHAR((e.startdate AT TIME ZONE 'Europe/Stockholm'::TEXT), 'YYYY-MM-DD"T"HH24:MI:SS.USOF'::TEXT) ELSE NULL::TEXT END, 'endDate', CASE WHEN (e.enddate IS NOT NULL) THEN TO_CHAR((e.enddate AT TIME ZONE 'Europe/Stockholm'::TEXT), 'YYYY-MM-DD"T"HH24:MI:SS.USOF'::TEXT) ELSE NULL::TEXT END, 'nodeType', e.node_type, 'status', e.status, 'createdBy', e.created_by, 'updatedBy', e.updated_by, 'createdAt', CASE WHEN (e.created_at IS NOT NULL) THEN TO_CHAR((e.created_at AT TIME ZONE 'Europe/Stockholm'::TEXT), 'YYYY-MM-DD"T"HH24:MI:SS.USOF'::TEXT) ELSE NULL::TEXT END, 'updatedAt', CASE WHEN (e.updated_at IS NOT NULL) THEN TO_CHAR((e.updated_at AT TIME ZONE 'Europe/Stockholm'::TEXT), 'YYYY-MM-DD"T"HH24:MI:SS.USOF'::TEXT) ELSE NULL::TEXT END)) FROM (ihp.elements e JOIN ihp.elements_document ed ON ((e.id = ed.element_id))) WHERE (ed.document_id = d.id)), '[]'::json),
  'index', d.index
) AS node
FROM (ihp.documenttypenode d JOIN ihp.issuetypenode issue ON ((d.issuetype_id = issue.id)));

-- -----------------------------------------------------------------------
-- FUNCTIONS
-- -----------------------------------------------------------------------

CREATE OR REPLACE FUNCTION refresh_arende_vy() RETURNS TRIGGER AS
'BEGIN REFRESH MATERIALIZED VIEW ihp.arende_m_vy; RETURN NULL; END;'
LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION refresh_handling_vy() RETURNS TRIGGER AS
'BEGIN REFRESH MATERIALIZED VIEW ihp.handling_m_vy; RETURN NULL; END;'
LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION refresh_handling_arende_vy() RETURNS TRIGGER AS
'BEGIN REFRESH MATERIALIZED VIEW ihp.handling_m_vy; REFRESH MATERIALIZED VIEW ihp.arende_m_vy; RETURN NULL; END;'
LANGUAGE plpgsql;

-- -----------------------------------------------------------------------
-- TRIGGERS (DROP IF EXISTS + CREATE — no CREATE OR REPLACE for triggers in PG)
-- -----------------------------------------------------------------------

DROP TRIGGER IF EXISTS refresh_handling_vy_delete ON documenttypenode CASCADE;
CREATE TRIGGER refresh_handling_vy_delete AFTER DELETE ON documenttypenode FOR EACH STATEMENT EXECUTE FUNCTION refresh_handling_vy();

DROP TRIGGER IF EXISTS refresh_handling_vy_insert ON documenttypenode CASCADE;
CREATE TRIGGER refresh_handling_vy_insert AFTER INSERT ON documenttypenode FOR EACH STATEMENT EXECUTE FUNCTION refresh_handling_vy();

DROP TRIGGER IF EXISTS refresh_handling_vy_update ON documenttypenode CASCADE;
CREATE TRIGGER refresh_handling_vy_update AFTER UPDATE ON documenttypenode FOR EACH STATEMENT EXECUTE FUNCTION refresh_handling_vy();

DROP TRIGGER IF EXISTS refresh_all_view_elements_delete ON elements CASCADE;
CREATE TRIGGER refresh_all_view_elements_delete AFTER DELETE ON elements FOR EACH STATEMENT EXECUTE FUNCTION refresh_handling_arende_vy();

DROP TRIGGER IF EXISTS refresh_all_view_elements_insert ON elements CASCADE;
CREATE TRIGGER refresh_all_view_elements_insert AFTER INSERT ON elements FOR EACH STATEMENT EXECUTE FUNCTION refresh_handling_arende_vy();

DROP TRIGGER IF EXISTS refresh_all_view_elements_update ON elements CASCADE;
CREATE TRIGGER refresh_all_view_elements_update AFTER UPDATE ON elements FOR EACH STATEMENT EXECUTE FUNCTION refresh_handling_arende_vy();

DROP TRIGGER IF EXISTS refresh_arende_vy_delete ON issuetypenode CASCADE;
CREATE TRIGGER refresh_arende_vy_delete AFTER DELETE ON issuetypenode FOR EACH STATEMENT EXECUTE FUNCTION refresh_handling_arende_vy();

DROP TRIGGER IF EXISTS refresh_arende_vy_insert ON issuetypenode CASCADE;
CREATE TRIGGER refresh_arende_vy_insert AFTER INSERT ON issuetypenode FOR EACH STATEMENT EXECUTE FUNCTION refresh_handling_arende_vy();

DROP TRIGGER IF EXISTS refresh_arende_vy_update ON issuetypenode CASCADE;
CREATE TRIGGER refresh_arende_vy_update AFTER UPDATE ON issuetypenode FOR EACH STATEMENT EXECUTE FUNCTION refresh_handling_arende_vy();

DROP TRIGGER IF EXISTS refresh_all_view_noderelation_delete ON noderelation CASCADE;
CREATE TRIGGER refresh_all_view_noderelation_delete AFTER DELETE ON noderelation FOR EACH STATEMENT EXECUTE FUNCTION refresh_arende_vy();

DROP TRIGGER IF EXISTS refresh_all_view_noderelation_insert ON noderelation CASCADE;
CREATE TRIGGER refresh_all_view_noderelation_insert AFTER INSERT ON noderelation FOR EACH STATEMENT EXECUTE FUNCTION refresh_arende_vy();

DROP TRIGGER IF EXISTS refresh_all_view_noderelation_update ON noderelation CASCADE;
CREATE TRIGGER refresh_all_view_noderelation_update AFTER UPDATE ON noderelation FOR EACH STATEMENT EXECUTE FUNCTION refresh_arende_vy();

DROP TRIGGER IF EXISTS refresh_all_view_verksamhetomrade_delete ON operationalareatypenode CASCADE;
CREATE TRIGGER refresh_all_view_verksamhetomrade_delete AFTER DELETE ON operationalareatypenode FOR EACH STATEMENT EXECUTE FUNCTION refresh_handling_arende_vy();

DROP TRIGGER IF EXISTS refresh_all_view_verksamhetomrade_insert ON operationalareatypenode CASCADE;
CREATE TRIGGER refresh_all_view_verksamhetomrade_insert AFTER INSERT ON operationalareatypenode FOR EACH STATEMENT EXECUTE FUNCTION refresh_handling_arende_vy();

DROP TRIGGER IF EXISTS refresh_all_view_verksamhetomrade_update ON operationalareatypenode CASCADE;
CREATE TRIGGER refresh_all_view_verksamhetomrade_update AFTER UPDATE ON operationalareatypenode FOR EACH STATEMENT EXECUTE FUNCTION refresh_handling_arende_vy();

DROP TRIGGER IF EXISTS refresh_all_view_processgrupp_delete ON processgrouptypenode CASCADE;
CREATE TRIGGER refresh_all_view_processgrupp_delete AFTER DELETE ON processgrouptypenode FOR EACH STATEMENT EXECUTE FUNCTION refresh_handling_arende_vy();

DROP TRIGGER IF EXISTS refresh_all_view_processgrupp_insert ON processgrouptypenode CASCADE;
CREATE TRIGGER refresh_all_view_processgrupp_insert AFTER INSERT ON processgrouptypenode FOR EACH STATEMENT EXECUTE FUNCTION refresh_handling_arende_vy();

DROP TRIGGER IF EXISTS refresh_all_view_processgrupp_update ON processgrouptypenode CASCADE;
CREATE TRIGGER refresh_all_view_processgrupp_update AFTER UPDATE ON processgrouptypenode FOR EACH STATEMENT EXECUTE FUNCTION refresh_handling_arende_vy();

DROP TRIGGER IF EXISTS refresh_all_view_process_delete ON processtypenode CASCADE;
CREATE TRIGGER refresh_all_view_process_delete AFTER DELETE ON processtypenode FOR EACH STATEMENT EXECUTE FUNCTION refresh_handling_arende_vy();

DROP TRIGGER IF EXISTS refresh_all_view_process_insert ON processtypenode CASCADE;
CREATE TRIGGER refresh_all_view_process_insert AFTER INSERT ON processtypenode FOR EACH STATEMENT EXECUTE FUNCTION refresh_handling_arende_vy();

DROP TRIGGER IF EXISTS refresh_all_view_process_update ON processtypenode CASCADE;
CREATE TRIGGER refresh_all_view_process_update AFTER UPDATE ON processtypenode FOR EACH STATEMENT EXECUTE FUNCTION refresh_handling_arende_vy();

DROP TRIGGER IF EXISTS refresh_handling_vy_rule_delete ON rule CASCADE;
CREATE TRIGGER refresh_handling_vy_rule_delete AFTER DELETE ON rule FOR EACH STATEMENT EXECUTE FUNCTION refresh_handling_vy();

DROP TRIGGER IF EXISTS refresh_handling_vy_rule_insert ON rule CASCADE;
CREATE TRIGGER refresh_handling_vy_rule_insert AFTER INSERT ON rule FOR EACH STATEMENT EXECUTE FUNCTION refresh_handling_vy();

DROP TRIGGER IF EXISTS refresh_handling_vy_rule_update ON rule CASCADE;
CREATE TRIGGER refresh_handling_vy_rule_update AFTER UPDATE ON rule FOR EACH STATEMENT EXECUTE FUNCTION refresh_handling_vy();

-- -----------------------------------------------------------------------
-- REFERENCE DATA
-- -----------------------------------------------------------------------

INSERT INTO elements_datatype (id, type) VALUES (1, 'STRING')        ON CONFLICT (type) DO NOTHING;
INSERT INTO elements_datatype (id, type) VALUES (2, 'BOOLEAN')       ON CONFLICT (type) DO NOTHING;
INSERT INTO elements_datatype (id, type) VALUES (3, 'INTEGER')       ON CONFLICT (type) DO NOTHING;
INSERT INTO elements_datatype (id, type) VALUES (4, 'FLOAT')         ON CONFLICT (type) DO NOTHING;
INSERT INTO elements_datatype (id, type) VALUES (5, 'TIMESTAMP_TZ')  ON CONFLICT (type) DO NOTHING;
INSERT INTO elements_datatype (id, type) VALUES (6, 'DOCUMENT_TYPE') ON CONFLICT (type) DO NOTHING;
