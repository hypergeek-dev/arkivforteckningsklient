-- SCHEMA & DB --

CREATE SCHEMA IF NOT EXISTS ihp;

SET
  search_path TO ihp,
  public;

ALTER DATABASE ihp
SET
  search_path TO ihp,
  public;

-- END SCHEMA & DB --

-- SEQUENCES --

DROP SEQUENCE IF EXISTS assignedrule_id_seq;

CREATE SEQUENCE assignedrule_id_seq INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 NO CYCLE;

DROP SEQUENCE IF EXISTS elements_datatype_id_seq;

CREATE SEQUENCE elements_datatype_id_seq INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 NO CYCLE;

DROP SEQUENCE IF EXISTS elements_document_id_seq;

CREATE SEQUENCE elements_document_id_seq INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 NO CYCLE;

DROP SEQUENCE IF EXISTS elements_id_seq;

CREATE SEQUENCE elements_id_seq INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 NO CYCLE;

DROP SEQUENCE IF EXISTS elements_issue_id_seq;

CREATE SEQUENCE elements_issue_id_seq INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 NO CYCLE;

DROP SEQUENCE IF EXISTS generic_nod_id_seq;

CREATE SEQUENCE generic_nod_id_seq INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 NO CYCLE;

DROP SEQUENCE IF EXISTS history_id_seq;

CREATE SEQUENCE history_id_seq INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 NO CYCLE;

DROP SEQUENCE IF EXISTS ihp_established_id_seq;

CREATE SEQUENCE ihp_established_id_seq INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 NO CYCLE;

DROP SEQUENCE IF EXISTS ihpservice_seq;

CREATE SEQUENCE ihpservice_seq INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 NO CYCLE;

DROP SEQUENCE IF EXISTS nodecomment_id_seq;

CREATE SEQUENCE nodecomment_id_seq INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 NO CYCLE;

DROP SEQUENCE IF EXISTS noderelation_id_seq;

CREATE SEQUENCE noderelation_id_seq INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 NO CYCLE;

DROP SEQUENCE IF EXISTS pdf_id_seq;

CREATE SEQUENCE pdf_id_seq INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 NO CYCLE;

DROP SEQUENCE IF EXISTS rule_id_seq;

CREATE SEQUENCE rule_id_seq INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 NO CYCLE;

DROP SEQUENCE IF EXISTS snapshot_id_seq;

CREATE SEQUENCE snapshot_id_seq INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 NO CYCLE;

DROP SEQUENCE IF EXISTS term_id_seq;

CREATE SEQUENCE term_id_seq INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 NO CYCLE;

-- END SEQUENCES --



-- TABLES --
DROP TABLE IF EXISTS assignedrule;

CREATE TABLE assignedrule (
  id SERIAL NOT NULL,
  rule_id INTEGER NOT NULL,
  doc_id INTEGER NOT NULL,
  doc_path CHARACTER VARYING(1500) NOT NULL,
  PRIMARY KEY (id)
);

DROP TABLE IF EXISTS classificationstructuretypenode;

CREATE TABLE classificationstructuretypenode (
  id BIGINT DEFAULT nextval('generic_nod_id_seq' :: regclass) NOT NULL,
  replaces_id BIGINT,
  name CHARACTER VARYING(300),
  remark CHARACTER VARYING(1000),
  start TIMESTAMP(6) WITH TIME ZONE,
  stop TIMESTAMP(6) WITH TIME ZONE,
  status CHARACTER VARYING(50) DEFAULT 'Utkast' :: character varying,
  cs_version BIGINT,
  auth_decision CHARACTER VARYING(300),
  auth_name CHARACTER VARYING(300),
  created_by CHARACTER VARYING(150),
  created_at TIMESTAMP(6) WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  path CHARACTER VARYING(300),
  decision_date DATE,
  updated_at TIMESTAMP(6) WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_by CHARACTER VARYING(150),
  uuid UUID,
  instruction CHARACTER VARYING(300),
  revised CHARACTER VARYING(1000),
  instruction_code_ihp CHARACTER VARYING(20),
  CONSTRAINT csnode_pkey PRIMARY KEY (id)
);

DROP TABLE IF EXISTS databasechangelog;

CREATE TABLE databasechangelog (
  id CHARACTER VARYING(255) NOT NULL,
  author CHARACTER VARYING(255) NOT NULL,
  filename CHARACTER VARYING(255) NOT NULL,
  dateexecuted TIMESTAMP(6) WITHOUT TIME ZONE NOT NULL,
  orderexecuted INTEGER NOT NULL,
  exectype CHARACTER VARYING(10) NOT NULL,
  md5sum CHARACTER VARYING(35),
  description CHARACTER VARYING(255),
  comments CHARACTER VARYING(255),
  tag CHARACTER VARYING(255),
  liquibase CHARACTER VARYING(20),
  contexts CHARACTER VARYING(255),
  labels CHARACTER VARYING(255),
  deployment_id CHARACTER VARYING(10)
);

DROP TABLE IF EXISTS databasechangeloglock;

CREATE TABLE databasechangeloglock (
  id INTEGER NOT NULL,
  locked BOOLEAN NOT NULL,
  lockgranted TIMESTAMP(6) WITHOUT TIME ZONE,
  lockedby CHARACTER VARYING(255),
  PRIMARY KEY (id)
);

DROP TABLE IF EXISTS documenttypenode;

CREATE TABLE documenttypenode (
  id INTEGER DEFAULT nextval('generic_nod_id_seq' :: regclass) NOT NULL,
  issuetype_id INTEGER,
  replaces_id INTEGER,
  name CHARACTER VARYING(600),
  remark CHARACTER VARYING(1000),
  start TIMESTAMP(6) WITH TIME ZONE,
  stop TIMESTAMP(6) WITH TIME ZONE,
  status CHARACTER VARYING(50) DEFAULT 'Utkast' :: character varying,
  register BOOLEAN DEFAULT false,
  keeping_unit CHARACTER VARYING(300),
  signature_required BOOLEAN DEFAULT false,
  informationsecurityclass INTEGER,
  created_by CHARACTER VARYING(150),
  created_at TIMESTAMP(6) WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  path CHARACTER VARYING(1500),
  secrecy BOOLEAN DEFAULT false,
  personal_data BOOLEAN DEFAULT false,
  updated_at TIMESTAMP(6) WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_by CHARACTER VARYING(150),
  uuid UUID,
  regulation CHARACTER VARYING(1000),
  manual_evaluation BOOLEAN DEFAULT false,
  secrecy_lawsection CHARACTER VARYING(1000),
  index INTEGER,
  PRIMARY KEY (id)
);

DROP TABLE IF EXISTS elements;

CREATE TABLE elements (
  id SERIAL NOT NULL,
  name CHARACTER VARYING(50) NOT NULL,
  description CHARACTER VARYING(300),
  datatype INTEGER,
  mandatory BOOLEAN,
  startdate TIMESTAMP(6) WITH TIME ZONE NOT NULL,
  enddate TIMESTAMP(6) WITH TIME ZONE NOT NULL,
  node_type CHARACTER VARYING(20),
  status CHARACTER VARYING(20),
  created_by CHARACTER VARYING(50) NOT NULL,
  updated_by CHARACTER VARYING(50),
  created_at TIMESTAMP(6) WITH TIME ZONE NOT NULL,
  updated_at TIMESTAMP(6) WITH TIME ZONE,
  PRIMARY KEY (id)
);

DROP TABLE IF EXISTS elements_datatype;

CREATE TABLE elements_datatype (
  id SERIAL NOT NULL,
  type CHARACTER VARYING(50),
  PRIMARY KEY (id),
  UNIQUE (type)
);

DROP TABLE IF EXISTS elements_document;

CREATE TABLE elements_document (
  id SERIAL NOT NULL,
  element_id INTEGER,
  document_id INTEGER,
  document_path CHARACTER VARYING(1500),
  PRIMARY KEY (id),
  UNIQUE (element_id, document_id)
);

DROP TABLE IF EXISTS elements_issue;

CREATE TABLE elements_issue (
  id SERIAL NOT NULL,
  element_id INTEGER,
  issue_id INTEGER,
  issue_path CHARACTER VARYING(1500),
  PRIMARY KEY (id),
  UNIQUE (element_id, issue_id)
);

DROP TABLE IF EXISTS handelselogg;

CREATE TABLE handelselogg (
  id INTEGER NOT NULL,
  version INTEGER,
  skapad_datum TIMESTAMP(6) WITHOUT TIME ZONE,
  uppdaterad_datum TIMESTAMP(6) WITHOUT TIME ZONE,
  uuid UUID NOT NULL,
  handelse CHARACTER VARYING(255),
  beskrivning CHARACTER VARYING(255),
  modell_id CHARACTER VARYING(1500),
  objekt_id UUID,
  objektnamn CHARACTER VARYING(1500),
  typ CHARACTER VARYING(255),
  anvandar_id CHARACTER VARYING(255),
  history_id INTEGER,
  PRIMARY KEY (id)
);

DROP TABLE IF EXISTS history;

CREATE TABLE history (
  id SERIAL NOT NULL,
  date TIMESTAMP(6) WITH TIME ZONE NOT NULL,
  json JSONB NOT NULL,
  uuid UUID
);

DROP TABLE IF EXISTS ihp_established;

CREATE TABLE ihp_established (
  id SERIAL NOT NULL,
  csnode_id INTEGER NOT NULL,
  timestamp TIMESTAMP(6) WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  modelb JSONB,
  instruction_code CHARACTER VARYING(20),
  PRIMARY KEY (id, csnode_id, timestamp)
);

DROP TABLE IF EXISTS issuetypenode;

CREATE TABLE issuetypenode (
  id INTEGER DEFAULT nextval('generic_nod_id_seq' :: regclass) NOT NULL,
  process_id INTEGER,
  replaces_id INTEGER,
  name CHARACTER VARYING(600),
  start TIMESTAMP(6) WITH TIME ZONE,
  stop TIMESTAMP(6) WITH TIME ZONE,
  status CHARACTER VARYING(50) DEFAULT 'Utkast' :: character varying,
  remark CHARACTER VARYING(1000),
  register BOOLEAN,
  keeping_unit CHARACTER VARYING(300),
  created_by CHARACTER VARYING(150),
  created_at TIMESTAMP(6) WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  path CHARACTER VARYING(1500),
  number CHARACTER VARYING,
  updated_at TIMESTAMP(6) WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_by CHARACTER VARYING(150),
  uuid UUID,
  index INTEGER,
  PRIMARY KEY (id)
);

DROP TABLE IF EXISTS model_snapshot_established;

CREATE TABLE model_snapshot_established (
  id INTEGER DEFAULT nextval('snapshot_id_seq' :: regclass) NOT NULL,
  csnode_id INTEGER NOT NULL,
  timestamp TIMESTAMP(6) WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  model CHARACTER VARYING,
  modelb JSONB NOT NULL,
  instruction_code CHARACTER VARYING(20),
  PRIMARY KEY (id, csnode_id, timestamp)
);

DROP TABLE IF EXISTS nodecomment;

CREATE TABLE nodecomment (
  id SERIAL NOT NULL,
  node_id INTEGER NOT NULL,
  comment CHARACTER VARYING(250) NOT NULL,
  created_by CHARACTER VARYING(30) NOT NULL,
  created_at TIMESTAMP(6) WITHOUT TIME ZONE
);

DROP TABLE IF EXISTS noderelation;

CREATE TABLE noderelation (
  id SERIAL NOT NULL,
  path CHARACTER VARYING(1500) NOT NULL,
  related_path CHARACTER VARYING(1500) NOT NULL,
  comment CHARACTER VARYING(500),
  type CHARACTER VARYING(50),
  PRIMARY KEY (id)
);

DROP TABLE IF EXISTS operationalareatypenode;

CREATE TABLE operationalareatypenode (
  id BIGINT DEFAULT nextval('generic_nod_id_seq' :: regclass) NOT NULL,
  csnode_id BIGINT,
  replaces_id BIGINT,
  name CHARACTER VARYING(600),
  remark CHARACTER VARYING(1000),
  start TIMESTAMP(6) WITH TIME ZONE,
  stop TIMESTAMP(6) WITH TIME ZONE,
  status CHARACTER VARYING(50) DEFAULT 'Utkast' :: character varying,
  information_responsible CHARACTER VARYING(300),
  contact CHARACTER VARYING(300),
  lawsection CHARACTER VARYING(300),
  relation_structuralunit CHARACTER VARYING(300),
  created_by CHARACTER VARYING(150),
  created_at TIMESTAMP(6) WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  path CHARACTER VARYING(300),
  decision_date DATE,
  auth_decision CHARACTER VARYING(300),
  updated_at TIMESTAMP(6) WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_by CHARACTER VARYING(150),
  uuid UUID,
  CONSTRAINT activityareanode_pkey PRIMARY KEY (id)
);

DROP TABLE IF EXISTS pdf;

CREATE TABLE pdf (
  id SERIAL NOT NULL,
  pdf_data BYTEA,
  pdf_type CHARACTER VARYING(26),
  skapad_stmp TIMESTAMP(6) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  skapad_av CHARACTER VARYING,
  PRIMARY KEY (id)
);

DROP TABLE IF EXISTS processgrouptypenode;

CREATE TABLE processgrouptypenode (
  id BIGINT DEFAULT nextval('generic_nod_id_seq' :: regclass) NOT NULL,
  parent_id BIGINT,
  replaces_id BIGINT,
  name CHARACTER VARYING(600),
  remark CHARACTER VARYING(1000),
  start TIMESTAMP(6) WITH TIME ZONE,
  stop TIMESTAMP(6) WITH TIME ZONE,
  status CHARACTER VARYING(50) DEFAULT 'Utkast' :: character varying,
  information_responsible CHARACTER VARYING(300),
  contact CHARACTER VARYING(300),
  lawsection CHARACTER VARYING(300),
  relation_structuralunit CHARACTER VARYING(300),
  created_by CHARACTER VARYING(150),
  created_at TIMESTAMP(6) WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  path CHARACTER VARYING(300),
  decision_date DATE,
  updated_at TIMESTAMP(6) WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_by CHARACTER VARYING(150),
  uuid UUID,
  CONSTRAINT processgroupnode_pkey PRIMARY KEY (id)
);

DROP TABLE IF EXISTS processtypenode;

CREATE TABLE processtypenode (
  id BIGINT DEFAULT nextval('generic_nod_id_seq' :: regclass) NOT NULL,
  parent_id BIGINT,
  replaces_id BIGINT,
  name CHARACTER VARYING(600),
  remark CHARACTER VARYING(1000),
  start TIMESTAMP(6) WITH TIME ZONE,
  stop TIMESTAMP(6) WITH TIME ZONE,
  status CHARACTER VARYING(50) DEFAULT 'Utkast' :: character varying,
  information_responsible CHARACTER VARYING(300),
  contact CHARACTER VARYING(300),
  lawsection CHARACTER VARYING(300),
  relation_structuralunit CHARACTER VARYING(300),
  created_by CHARACTER VARYING(150),
  created_at TIMESTAMP(6) WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  path CHARACTER VARYING(300),
  number CHARACTER VARYING,
  updated_at TIMESTAMP(6) WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_by CHARACTER VARYING(150),
  uuid UUID,
  CONSTRAINT processnode_pkey PRIMARY KEY (id)
);

DROP TABLE IF EXISTS rule;

CREATE TABLE rule (
  id SERIAL NOT NULL,
  ruletype CHARACTER VARYING(50) NOT NULL,
  description CHARACTER VARYING(1000),
  status CHARACTER VARYING(50) NOT NULL,
  uuid UUID NOT NULL,
  created_by CHARACTER VARYING(50) NOT NULL,
  created_at TIMESTAMP(6) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by CHARACTER VARYING(50),
  updated_at TIMESTAMP(6) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  name CHARACTER VARYING(100) NOT NULL,
  comment CHARACTER VARYING(500),
  PRIMARY KEY (id)
);

DROP TABLE IF EXISTS term;

CREATE TABLE term (
  id SERIAL NOT NULL,
  attribute CHARACTER VARYING(50) NOT NULL,
  operand CHARACTER VARYING(50) NOT NULL,
  created_by CHARACTER VARYING(50) NOT NULL,
  created_at TIMESTAMP(6) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_by CHARACTER VARYING(50),
  updated_at TIMESTAMP(6) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  rule_id INTEGER NOT NULL,
  years INTEGER NOT NULL,
  months INTEGER NOT NULL,
  days INTEGER NOT NULL,
  PRIMARY KEY (id)
);

ALTER TABLE
  "assignedrule"
ADD
  CONSTRAINT assignedrule_fk1 FOREIGN KEY ("rule_id") REFERENCES "rule" ("id");

ALTER TABLE
  "assignedrule"
ADD
  CONSTRAINT assignedrule_fk2 FOREIGN KEY ("doc_id") REFERENCES "documenttypenode" ("id") ON DELETE CASCADE;

ALTER TABLE
  "elements"
ADD
  CONSTRAINT elements_datatype_fkey FOREIGN KEY ("datatype") REFERENCES "elements_datatype" ("id");

ALTER TABLE
  "elements"
ADD
  CHECK (startdate < enddate);

ALTER TABLE
  "elements"
ADD
  CHECK (
    ((node_type) :: text = 'DOCUMENT' :: text)
    OR ((node_type) :: text = 'ISSUE' :: text)
  );

ALTER TABLE
  "elements"
ADD
  CHECK (
    ((status) :: text = 'DRAFT' :: text)
    OR ((status) :: text = 'ESTABLISHED' :: text)
  );

ALTER TABLE
  "elements_document"
ADD
  CONSTRAINT elements_document_document_id_fkey FOREIGN KEY ("document_id") REFERENCES "documenttypenode" ("id");

ALTER TABLE
  "elements_document"
ADD
  CONSTRAINT elements_document_element_id_fkey FOREIGN KEY ("element_id") REFERENCES "elements" ("id");

ALTER TABLE
  "elements_issue"
ADD
  CONSTRAINT elements_issue_element_id_fkey FOREIGN KEY ("element_id") REFERENCES "elements" ("id");

ALTER TABLE
  "elements_issue"
ADD
  CONSTRAINT elements_issue_issue_id_fkey FOREIGN KEY ("issue_id") REFERENCES "issuetypenode" ("id");

ALTER TABLE
  "operationalareatypenode"
ADD
  CONSTRAINT operationalareatypenode_fk1 FOREIGN KEY ("csnode_id") REFERENCES "classificationstructuretypenode" ("id") ON DELETE CASCADE;

ALTER TABLE
  "pdf"
ADD
  CHECK (
    (pdf_type) :: text = ANY (
      ARRAY [('klassificeringsstruktur'::character varying)::text, ('informationshanteringsplan'::character varying)::text]
    )
  );

ALTER TABLE
  "term"
ADD
  CONSTRAINT fk_rule FOREIGN KEY ("rule_id") REFERENCES "rule" ("id") ON DELETE CASCADE;

-- END TABLES --

-- VIEWS --
DROP VIEW IF EXISTS arende_n_vy;

CREATE VIEW arende_n_vy (node) AS
SELECT
  json_build_object(
    'id',
    id :: text,
    'replacesId',
    CASE
      WHEN replaces_id IS NOT NULL THEN replaces_id :: text
      ELSE NULL :: text
    END,
    'name',
    name,
    'path',
    path,
    'partialPath',
    NULL :: unknown,
    'localPath',
    (number :: text || '.' :: text) || index,
    'status',
    lower(status :: text),
    'start',
    CASE
      WHEN start IS NOT NULL THEN to_char(
        (start AT TIME ZONE 'Europe/Stockholm' :: text),
        'YYYY-MM-DD"T"HH24:MI:SS.USOF' :: text
      )
      ELSE NULL :: text
    END,
    'stop',
    CASE
      WHEN stop IS NOT NULL THEN to_char(
        (stop AT TIME ZONE 'Europe/Stockholm' :: text),
        'YYYY-MM-DD"T"HH24:MI:SS.USOF' :: text
      )
      ELSE NULL :: text
    END,
    'updated',
    CASE
      WHEN updated_at IS NOT NULL THEN to_char(
        (updated_at AT TIME ZONE 'Europe/Stockholm' :: text),
        'YYYY-MM-DD"T"HH24:MI:SS.USOF' :: text
      )
      ELSE NULL :: text
    END,
    'createdAt',
    CASE
      WHEN created_at IS NOT NULL THEN to_char(
        (created_at AT TIME ZONE 'Europe/Stockholm' :: text),
        'YYYY-MM-DD"T"HH24:MI:SS.USOF' :: text
      )
      ELSE NULL :: text
    END,
    'createdBy',
    created_by,
    'updatedBy',
    updated_by,
    'remark',
    remark,
    'uuid',
    uuid :: text,
    'nodeName',
    'issuenode',
    'parentId',
    process_id :: text,
    'register',
    register,
    'keepingUnit',
    keeping_unit,
    'relations',
    COALESCE(
      (
        SELECT
          json_agg(
            json_build_object(
              'id',
              relation.id,
              'path',
              relation.path,
              'relatedPath',
              relation.related_path,
              'comment',
              relation.comment,
              'type',
              relation.type
            )
          ) AS json_agg
        FROM
          noderelation relation
        WHERE
          relation.path :: text = d.path :: text
      ),
      '[]' :: json
    ),
    'assignedElements',
    COALESCE(
      (
        SELECT
          json_agg(
            json_build_object(
              'id',
              e.id,
              'name',
              e.name,
              'description',
              e.description,
              'datatype',
              e.datatype,
              'mandatory',
              e.mandatory,
              'startDate',
              CASE
                WHEN e.startdate IS NOT NULL THEN to_char(
                  (
                    e.startdate AT TIME ZONE 'Europe/Stockholm' :: text
                  ),
                  'YYYY-MM-DD"T"HH24:MI:SS.USOF' :: text
                )
                ELSE NULL :: text
              END,
              'endDate',
              CASE
                WHEN e.enddate IS NOT NULL THEN to_char(
                  (e.enddate AT TIME ZONE 'Europe/Stockholm' :: text),
                  'YYYY-MM-DD"T"HH24:MI:SS.USOF' :: text
                )
                ELSE NULL :: text
              END,
              'nodeType',
              e.node_type,
              'status',
              e.status,
              'createdBy',
              e.created_by,
              'updatedBy',
              e.updated_by,
              'createdAt',
              CASE
                WHEN e.created_at IS NOT NULL THEN to_char(
                  (
                    e.created_at AT TIME ZONE 'Europe/Stockholm' :: text
                  ),
                  'YYYY-MM-DD"T"HH24:MI:SS.USOF' :: text
                )
                ELSE NULL :: text
              END,
              'updatedAt',
              CASE
                WHEN e.updated_at IS NOT NULL THEN to_char(
                  (
                    e.updated_at AT TIME ZONE 'Europe/Stockholm' :: text
                  ),
                  'YYYY-MM-DD"T"HH24:MI:SS.USOF' :: text
                )
                ELSE NULL :: text
              END
            )
          ) AS json_agg
        FROM
          elements e
          JOIN elements_issue ed ON e.id = ed.element_id
        WHERE
          ed.issue_id = d.id
      ),
      '[]' :: json
    ),
    'index',
    index
  ) AS node
FROM
  issuetypenode d;

DROP VIEW IF EXISTS handling_n_vy;

CREATE VIEW handling_n_vy (node) AS
SELECT
  json_build_object(
    'id',
    d.id :: text,
    'replacesId',
    CASE
      WHEN d.replaces_id IS NOT NULL THEN d.replaces_id :: text
      ELSE NULL :: text
    END,
    'name',
    d.name,
    'path',
    d.path,
    'partialPath',
    NULL :: unknown,
    'localPath',
    (
      ((issue.number :: text || '.' :: text) || issue.index) || '.' :: text
    ) || d.index,
    'status',
    lower(d.status :: text),
    'start',
    CASE
      WHEN d.start IS NOT NULL THEN to_char(
        (d.start AT TIME ZONE 'Europe/Stockholm' :: text),
        'YYYY-MM-DD"T"HH24:MI:SS.USOF' :: text
      )
      ELSE NULL :: text
    END,
    'stop',
    CASE
      WHEN d.stop IS NOT NULL THEN to_char(
        (d.stop AT TIME ZONE 'Europe/Stockholm' :: text),
        'YYYY-MM-DD"T"HH24:MI:SS.USOF' :: text
      )
      ELSE NULL :: text
    END,
    'updated',
    CASE
      WHEN d.updated_at IS NOT NULL THEN to_char(
        (
          d.updated_at AT TIME ZONE 'Europe/Stockholm' :: text
        ),
        'YYYY-MM-DD"T"HH24:MI:SS.USOF' :: text
      )
      ELSE NULL :: text
    END,
    'createdAt',
    CASE
      WHEN d.created_at IS NOT NULL THEN to_char(
        (
          d.created_at AT TIME ZONE 'Europe/Stockholm' :: text
        ),
        'YYYY-MM-DD"T"HH24:MI:SS.USOF' :: text
      )
      ELSE NULL :: text
    END,
    'createdBy',
    d.created_by,
    'updatedBy',
    d.updated_by,
    'remark',
    d.remark,
    'uuid',
    d.uuid :: text,
    'nodeName',
    'documentnode',
    'parentId',
    d.issuetype_id :: text,
    'register',
    d.register,
    'keepingUnit',
    d.keeping_unit,
    'signatureRequired',
    d.signature_required,
    'informationsecurityclass',
    d.informationsecurityclass,
    'secrecy',
    d.secrecy,
    'secrecyLawsection',
    d.secrecy_lawsection,
    'personalData',
    d.personal_data,
    'regulation',
    d.regulation,
    'manualEvaluation',
    d.manual_evaluation,
    'assignedRules',
    COALESCE(
      (
        SELECT
          json_agg(
            json_build_object(
              'id',
              r.id,
              'ruleType',
              r.ruletype,
              'description',
              r.description,
              'status',
              lower(r.status :: text),
              'name',
              r.name,
              'comment',
              r.comment,
              'createdBy',
              r.created_by,
              'updatedBy',
              r.updated_by,
              'createdAt',
              CASE
                WHEN r.created_at IS NOT NULL THEN to_char(
                  (
                    r.created_at AT TIME ZONE 'Europe/Stockholm' :: text
                  ),
                  'YYYY-MM-DD"T"HH24:MI:SS.USOF' :: text
                )
                ELSE NULL :: text
              END,
              'updatedAt',
              CASE
                WHEN r.updated_at IS NOT NULL THEN to_char(
                  (
                    r.updated_at AT TIME ZONE 'Europe/Stockholm' :: text
                  ),
                  'YYYY-MM-DD"T"HH24:MI:SS.USOF' :: text
                )
                ELSE NULL :: text
              END,
              'uuid',
              r.uuid :: text,
              'terms',
              COALESCE(
                (
                  SELECT
                    json_agg(
                      json_build_object(
                        'id',
                        t.id,
                        'attribute',
                        t.attribute,
                        'operand',
                        t.operand,
                        'years',
                        t.years,
                        'months',
                        t.months,
                        'days',
                        t.days,
                        'createdBy',
                        t.created_by,
                        'updatedBy',
                        t.updated_by,
                        'createdAt',
                        CASE
                          WHEN t.created_at IS NOT NULL THEN to_char(
                            (
                              t.created_at AT TIME ZONE 'Europe/Stockholm' :: text
                            ),
                            'YYYY-MM-DD"T"HH24:MI:SS.USOF' :: text
                          )
                          ELSE NULL :: text
                        END,
                        'updatedAt',
                        CASE
                          WHEN t.updated_at IS NOT NULL THEN to_char(
                            (
                              t.updated_at AT TIME ZONE 'Europe/Stockholm' :: text
                            ),
                            'YYYY-MM-DD"T"HH24:MI:SS.USOF' :: text
                          )
                          ELSE NULL :: text
                        END
                      )
                    ) AS json_agg
                  FROM
                    term t
                  WHERE
                    t.rule_id = r.id
                ),
                '[]' :: json
              )
            )
          ) AS json_agg
        FROM
          rule r
          JOIN assignedrule ar ON r.id = ar.rule_id
        WHERE
          ar.doc_id = d.id
      ),
      '[]' :: json
    ),
    'assignedElements',
    COALESCE(
      (
        SELECT
          json_agg(
            json_build_object(
              'id',
              e.id,
              'name',
              e.name,
              'description',
              e.description,
              'datatype',
              e.datatype,
              'mandatory',
              e.mandatory,
              'startDate',
              CASE
                WHEN e.startdate IS NOT NULL THEN to_char(
                  (
                    e.startdate AT TIME ZONE 'Europe/Stockholm' :: text
                  ),
                  'YYYY-MM-DD"T"HH24:MI:SS.USOF' :: text
                )
                ELSE NULL :: text
              END,
              'endDate',
              CASE
                WHEN e.enddate IS NOT NULL THEN to_char(
                  (e.enddate AT TIME ZONE 'Europe/Stockholm' :: text),
                  'YYYY-MM-DD"T"HH24:MI:SS.USOF' :: text
                )
                ELSE NULL :: text
              END,
              'nodeType',
              e.node_type,
              'status',
              e.status,
              'createdBy',
              e.created_by,
              'updatedBy',
              e.updated_by,
              'createdAt',
              CASE
                WHEN e.created_at IS NOT NULL THEN to_char(
                  (
                    e.created_at AT TIME ZONE 'Europe/Stockholm' :: text
                  ),
                  'YYYY-MM-DD"T"HH24:MI:SS.USOF' :: text
                )
                ELSE NULL :: text
              END,
              'updatedAt',
              CASE
                WHEN e.updated_at IS NOT NULL THEN to_char(
                  (
                    e.updated_at AT TIME ZONE 'Europe/Stockholm' :: text
                  ),
                  'YYYY-MM-DD"T"HH24:MI:SS.USOF' :: text
                )
                ELSE NULL :: text
              END
            )
          ) AS json_agg
        FROM
          elements e
          JOIN elements_document ed ON e.id = ed.element_id
        WHERE
          ed.document_id = d.id
      ),
      '[]' :: json
    ),
    'index',
    d.index
  ) AS node
FROM
  documenttypenode d
  JOIN issuetypenode issue ON d.issuetype_id = issue.id;

DROP VIEW IF EXISTS klassifikation_n_vy;

CREATE VIEW klassifikation_n_vy (node) AS
SELECT
  json_build_object(
    'id',
    id :: text,
    'replacesId',
    CASE
      WHEN replaces_id IS NOT NULL THEN replaces_id :: text
      ELSE NULL :: text
    END,
    'name',
    name,
    'path',
    path,
    'partialPath',
    NULL :: unknown,
    'localPath',
    '1',
    'status',
    lower(status :: text),
    'start',
    CASE
      WHEN start IS NOT NULL THEN to_char(
        (start AT TIME ZONE 'Europe/Stockholm' :: text),
        'YYYY-MM-DD"T"HH24:MI:SS.USOF' :: text
      )
      ELSE NULL :: text
    END,
    'stop',
    CASE
      WHEN stop IS NOT NULL THEN to_char(
        (stop AT TIME ZONE 'Europe/Stockholm' :: text),
        'YYYY-MM-DD"T"HH24:MI:SS.USOF' :: text
      )
      ELSE NULL :: text
    END,
    'updated',
    CASE
      WHEN updated_at IS NOT NULL THEN to_char(
        (updated_at AT TIME ZONE 'Europe/Stockholm' :: text),
        'YYYY-MM-DD"T"HH24:MI:SS.USOF' :: text
      )
      ELSE NULL :: text
    END,
    'createdAt',
    CASE
      WHEN created_at IS NOT NULL THEN to_char(
        (created_at AT TIME ZONE 'Europe/Stockholm' :: text),
        'YYYY-MM-DD"T"HH24:MI:SS.USOF' :: text
      )
      ELSE NULL :: text
    END,
    'createdBy',
    created_by,
    'updatedBy',
    updated_by,
    'remark',
    remark,
    'uuid',
    uuid :: text,
    'nodeName',
    'csnode',
    'csVersion',
    cs_version,
    'authDecision',
    auth_decision,
    'authName',
    auth_name,
    'decisionDate',
    decision_date,
    'instruction',
    instruction,
    'revised',
    revised,
    'instructionCodeIhp',
    instruction_code_ihp
  ) AS node
FROM
  classificationstructuretypenode d;

DROP VIEW IF EXISTS process_n_vy;

CREATE VIEW process_n_vy (node) AS
SELECT
  json_build_object(
    'id',
    id :: text,
    'replacesId',
    CASE
      WHEN replaces_id IS NOT NULL THEN replaces_id :: text
      ELSE NULL :: text
    END,
    'name',
    name,
    'path',
    path,
    'partialPath',
    NULL :: unknown,
    'localPath',
    regexp_replace(path :: text, '.*/([^/]+)$' :: text, '\1' :: text),
    'status',
    lower(status :: text),
    'start',
    CASE
      WHEN start IS NOT NULL THEN to_char(
        (start AT TIME ZONE 'Europe/Stockholm' :: text),
        'YYYY-MM-DD"T"HH24:MI:SS.USOF' :: text
      )
      ELSE NULL :: text
    END,
    'stop',
    CASE
      WHEN stop IS NOT NULL THEN to_char(
        (stop AT TIME ZONE 'Europe/Stockholm' :: text),
        'YYYY-MM-DD"T"HH24:MI:SS.USOF' :: text
      )
      ELSE NULL :: text
    END,
    'updated',
    CASE
      WHEN updated_at IS NOT NULL THEN to_char(
        (updated_at AT TIME ZONE 'Europe/Stockholm' :: text),
        'YYYY-MM-DD"T"HH24:MI:SS.USOF' :: text
      )
      ELSE NULL :: text
    END,
    'createdAt',
    CASE
      WHEN created_at IS NOT NULL THEN to_char(
        (created_at AT TIME ZONE 'Europe/Stockholm' :: text),
        'YYYY-MM-DD"T"HH24:MI:SS.USOF' :: text
      )
      ELSE NULL :: text
    END,
    'createdBy',
    created_by,
    'updatedBy',
    updated_by,
    'remark',
    remark,
    'uuid',
    uuid :: text,
    'nodeName',
    'processnode',
    'parentId',
    parent_id :: text,
    'informationResponsible',
    information_responsible,
    'contact',
    contact,
    'lawsection',
    lawsection,
    'relationStructuralunit',
    relation_structuralunit,
    'relations',
    COALESCE(
      (
        SELECT
          json_agg(
            json_build_object(
              'id',
              relation.id,
              'path',
              relation.path,
              'relatedPath',
              relation.related_path,
              'comment',
              relation.comment,
              'type',
              relation.type
            )
          ) AS json_agg
        FROM
          noderelation relation
        WHERE
          relation.path :: text = d.path :: text
      ),
      '[]' :: json
    )
  ) AS node
FROM
  processtypenode d;

DROP VIEW IF EXISTS processgrupp_n_vy;

CREATE VIEW processgrupp_n_vy (node) AS
SELECT
  json_build_object(
    'id',
    id :: text,
    'replacesId',
    CASE
      WHEN replaces_id IS NOT NULL THEN replaces_id :: text
      ELSE NULL :: text
    END,
    'name',
    name,
    'path',
    path,
    'partialPath',
    NULL :: unknown,
    'localPath',
    regexp_replace(path :: text, '.*/([^/]+)$' :: text, '\1' :: text),
    'status',
    lower(status :: text),
    'start',
    CASE
      WHEN start IS NOT NULL THEN to_char(
        (start AT TIME ZONE 'Europe/Stockholm' :: text),
        'YYYY-MM-DD"T"HH24:MI:SS.USOF' :: text
      )
      ELSE NULL :: text
    END,
    'stop',
    CASE
      WHEN stop IS NOT NULL THEN to_char(
        (stop AT TIME ZONE 'Europe/Stockholm' :: text),
        'YYYY-MM-DD"T"HH24:MI:SS.USOF' :: text
      )
      ELSE NULL :: text
    END,
    'updated',
    CASE
      WHEN updated_at IS NOT NULL THEN to_char(
        (updated_at AT TIME ZONE 'Europe/Stockholm' :: text),
        'YYYY-MM-DD"T"HH24:MI:SS.USOF' :: text
      )
      ELSE NULL :: text
    END,
    'createdAt',
    CASE
      WHEN created_at IS NOT NULL THEN to_char(
        (created_at AT TIME ZONE 'Europe/Stockholm' :: text),
        'YYYY-MM-DD"T"HH24:MI:SS.USOF' :: text
      )
      ELSE NULL :: text
    END,
    'createdBy',
    created_by,
    'updatedBy',
    updated_by,
    'remark',
    remark,
    'uuid',
    uuid :: text,
    'nodeName',
    'pgnode',
    'parentId',
    parent_id :: text,
    'informationResponsible',
    information_responsible,
    'contact',
    contact,
    'lawsection',
    lawsection,
    'relationStructuralunit',
    relation_structuralunit,
    'relations',
    COALESCE(
      (
        SELECT
          json_agg(
            json_build_object(
              'id',
              relation.id,
              'path',
              relation.path,
              'relatedPath',
              relation.related_path,
              'comment',
              relation.comment,
              'type',
              relation.type
            )
          ) AS json_agg
        FROM
          noderelation relation
        WHERE
          relation.path :: text = d.path :: text
      ),
      '[]' :: json
    )
  ) AS node
FROM
  processgrouptypenode d;

DROP VIEW IF EXISTS verksamhet_omrade_n_vy;

CREATE VIEW verksamhet_omrade_n_vy (node) AS
SELECT
  json_build_object(
    'id',
    id :: text,
    'replacesId',
    CASE
      WHEN replaces_id IS NOT NULL THEN replaces_id :: text
      ELSE NULL :: text
    END,
    'name',
    name,
    'path',
    path,
    'partialPath',
    NULL :: unknown,
    'localPath',
    regexp_replace(path :: text, '.*/([^/]+)$' :: text, '\1' :: text),
    'status',
    lower(status :: text),
    'start',
    CASE
      WHEN start IS NOT NULL THEN to_char(
        (start AT TIME ZONE 'Europe/Stockholm' :: text),
        'YYYY-MM-DD"T"HH24:MI:SS.USOF' :: text
      )
      ELSE NULL :: text
    END,
    'stop',
    CASE
      WHEN stop IS NOT NULL THEN to_char(
        (stop AT TIME ZONE 'Europe/Stockholm' :: text),
        'YYYY-MM-DD"T"HH24:MI:SS.USOF' :: text
      )
      ELSE NULL :: text
    END,
    'updated',
    CASE
      WHEN updated_at IS NOT NULL THEN to_char(
        (updated_at AT TIME ZONE 'Europe/Stockholm' :: text),
        'YYYY-MM-DD"T"HH24:MI:SS.USOF' :: text
      )
      ELSE NULL :: text
    END,
    'createdAt',
    CASE
      WHEN created_at IS NOT NULL THEN to_char(
        (created_at AT TIME ZONE 'Europe/Stockholm' :: text),
        'YYYY-MM-DD"T"HH24:MI:SS.USOF' :: text
      )
      ELSE NULL :: text
    END,
    'createdBy',
    created_by,
    'updatedBy',
    updated_by,
    'remark',
    remark,
    'uuid',
    uuid :: text,
    'nodeName',
    'oanode',
    'parentId',
    csnode_id :: text,
    'informationResponsible',
    information_responsible,
    'contact',
    contact,
    'lawsection',
    lawsection,
    'relationStructuralunit',
    relation_structuralunit,
    'relations',
    COALESCE(
      (
        SELECT
          json_agg(
            json_build_object(
              'id',
              relation.id,
              'path',
              relation.path,
              'relatedPath',
              relation.related_path,
              'comment',
              relation.comment,
              'type',
              relation.type
            )
          ) AS json_agg
        FROM
          noderelation relation
        WHERE
          relation.path :: text = d.path :: text
      ),
      '[]' :: json
    )
  ) AS node
FROM
  operationalareatypenode d;

-- END VIEWS --

-- MATERIALIZED VIEWS --
CREATE MATERIALIZED VIEW ihp.arende_m_vy AS
SELECT
  json_build_object(
    'id',
    (id) :: TEXT,
    'replacesId',
    CASE
      WHEN (replaces_id IS NOT NULL) THEN (replaces_id) :: TEXT
      ELSE NULL :: TEXT
    END,
    'name',
    NAME,
    'path',
    path,
    'partialPath',
    NULL :: UNKNOWN,
    'localPath',
    (((NUMBER) :: TEXT || '.' :: TEXT) || INDEX),
    'status',
    lower((status) :: TEXT),
    'start',
    CASE
      WHEN (START IS NOT NULL) THEN TO_CHAR(
        (START AT TIME ZONE 'Europe/Stockholm' :: TEXT),
        'YYYY-MM-DD"T"HH24:MI:SS.USOF' :: TEXT
      )
      ELSE NULL :: TEXT
    END,
    'stop',
    CASE
      WHEN (STOP IS NOT NULL) THEN TO_CHAR(
        (STOP AT TIME ZONE 'Europe/Stockholm' :: TEXT),
        'YYYY-MM-DD"T"HH24:MI:SS.USOF' :: TEXT
      )
      ELSE NULL :: TEXT
    END,
    'updated',
    CASE
      WHEN (updated_at IS NOT NULL) THEN TO_CHAR(
        (updated_at AT TIME ZONE 'Europe/Stockholm' :: TEXT),
        'YYYY-MM-DD"T"HH24:MI:SS.USOF' :: TEXT
      )
      ELSE NULL :: TEXT
    END,
    'createdAt',
    CASE
      WHEN (created_at IS NOT NULL) THEN TO_CHAR(
        (created_at AT TIME ZONE 'Europe/Stockholm' :: TEXT),
        'YYYY-MM-DD"T"HH24:MI:SS.USOF' :: TEXT
      )
      ELSE NULL :: TEXT
    END,
    'createdBy',
    created_by,
    'updatedBy',
    updated_by,
    'remark',
    remark,
    'uuid',
    (UUID) :: TEXT,
    'nodeName',
    'issuenode',
    'parentId',
    (process_id) :: TEXT,
    'register',
    register,
    'keepingUnit',
    keeping_unit,
    'relations',
    COALESCE(
      (
        SELECT
          json_agg (
            json_build_object (
              'id',
              relation.id,
              'path',
              relation.path,
              'relatedPath',
              relation.related_path,
              'comment',
              relation.comment,
              'type',
              relation.type
            )
          ) AS json_agg
        FROM
          ihp.noderelation relation
        WHERE
          (
            (
              relation.path
            ) :: TEXT = (d.path) :: TEXT
          )
      ),
      '[]' :: json
    ),
    'assignedElements',
    COALESCE(
      (
        SELECT
          json_agg(
            json_build_object(
              'id',
              e.id,
              'name',
              e.name,
              'description',
              e.description,
              'datatype',
              e.datatype,
              'mandatory',
              e.mandatory,
              'startDate',
              CASE
                WHEN (
                  e.startdate IS NOT NULL
                ) THEN TO_CHAR(
                  (
                    e.startdate AT TIME ZONE 'Europe/Stockholm' :: TEXT
                  ),
                  'YYYY-MM-DD"T"HH24:MI:SS.USOF' :: TEXT
                )
                ELSE NULL :: TEXT
              END,
              'endDate',
              CASE
                WHEN (
                  e.enddate IS NOT NULL
                ) THEN TO_CHAR(
                  (
                    e.enddate AT TIME ZONE 'Europe/Stockholm' :: TEXT
                  ),
                  'YYYY-MM-DD"T"HH24:MI:SS.USOF' :: TEXT
                )
                ELSE NULL :: TEXT
              END,
              'nodeType',
              e.node_type,
              'status',
              e.status,
              'createdBy',
              e.created_by,
              'updatedBy',
              e.updated_by,
              'createdAt',
              CASE
                WHEN (
                  e.created_at IS NOT NULL
                ) THEN TO_CHAR(
                  (
                    e.created_at AT TIME ZONE 'Europe/Stockholm' :: TEXT
                  ),
                  'YYYY-MM-DD"T"HH24:MI:SS.USOF' :: TEXT
                )
                ELSE NULL :: TEXT
              END,
              'updatedAt',
              CASE
                WHEN (
                  e.updated_at IS NOT NULL
                ) THEN TO_CHAR(
                  (
                    e.updated_at AT TIME ZONE 'Europe/Stockholm' :: TEXT
                  ),
                  'YYYY-MM-DD"T"HH24:MI:SS.USOF' :: TEXT
                )
                ELSE NULL :: TEXT
              END
            )
          ) AS json_agg
        FROM
          (
            ihp.elements e
            JOIN ihp.elements_issue ed ON (
              (
                e.id = ed.element_id
              )
            )
          )
        WHERE
          (
            ed.issue_id = d.id
          )
      ),
      '[]' :: json
    ),
    'index',
    INDEX
  ) AS node
FROM
  ihp.issuetypenode d;

CREATE MATERIALIZED VIEW ihp.handling_m_vy AS
SELECT
  json_build_object(
    'id',
    (d.id) :: TEXT,
    'replacesId',
    CASE
      WHEN (d.replaces_id IS NOT NULL) THEN (d.replaces_id) :: TEXT
      ELSE NULL :: TEXT
    END,
    'name',
    d.name,
    'path',
    d.path,
    'partialPath',
    NULL :: UNKNOWN,
    'localPath',
    (
      (
        (
          ((issue.number) :: TEXT || '.' :: TEXT) || issue.index
        ) || '.' :: TEXT
      ) || d.index
    ),
    'status',
    lower ((d.status) :: TEXT),
    'start',
    CASE
      WHEN (d.start IS NOT NULL) THEN TO_CHAR(
        (d.start AT TIME ZONE 'Europe/Stockholm' :: TEXT),
        'YYYY-MM-DD"T"HH24:MI:SS.USOF' :: TEXT
      )
      ELSE NULL :: TEXT
    END,
    'stop',
    CASE
      WHEN (d.stop IS NOT NULL) THEN TO_CHAR(
        (d.stop AT TIME ZONE 'Europe/Stockholm' :: TEXT),
        'YYYY-MM-DD"T"HH24:MI:SS.USOF' :: TEXT
      )
      ELSE NULL :: TEXT
    END,
    'updated',
    CASE
      WHEN (d.updated_at IS NOT NULL) THEN TO_CHAR(
        (
          d.updated_at AT TIME ZONE 'Europe/Stockholm' :: TEXT
        ),
        'YYYY-MM-DD"T"HH24:MI:SS.USOF' :: TEXT
      )
      ELSE NULL :: TEXT
    END,
    'createdAt',
    CASE
      WHEN (d.created_at IS NOT NULL) THEN TO_CHAR(
        (
          d.created_at AT TIME ZONE 'Europe/Stockholm' :: TEXT
        ),
        'YYYY-MM-DD"T"HH24:MI:SS.USOF' :: TEXT
      )
      ELSE NULL :: TEXT
    END,
    'createdBy',
    d.created_by,
    'updatedBy',
    d.updated_by,
    'remark',
    d.remark,
    'uuid',
    (d.uuid) :: TEXT,
    'nodeName',
    'documentnode',
    'parentId',
    (d.issuetype_id) :: TEXT,
    'register',
    d.register,
    'keepingUnit',
    d.keeping_unit,
    'signatureRequired',
    d.signature_required,
    'informationsecurityclass',
    d.informationsecurityclass,
    'secrecy',
    d.secrecy,
    'secrecyLawsection',
    d.secrecy_lawsection,
    'personalData',
    d.personal_data,
    'regulation',
    d.regulation,
    'manualEvaluation',
    d.manual_evaluation,
    'assignedRules',
    COALESCE(
      (
        SELECT
          json_agg (
            json_build_object (
              'id',
              r.id,
              'ruleType',
              r.ruletype,
              'description',
              r.description,
              'status',
              lower (
                (
                  r.status
                ) :: TEXT
              ),
              'name',
              r.name,
              'comment',
              r.comment,
              'createdBy',
              r.created_by,
              'updatedBy',
              r.updated_by,
              'createdAt',
              CASE
                WHEN (
                  r.created_at IS NOT NULL
                ) THEN TO_CHAR (
                  (
                    r.created_at AT TIME ZONE 'Europe/Stockholm' :: TEXT
                  ),
                  'YYYY-MM-DD"T"HH24:MI:SS.USOF' :: TEXT
                )
                ELSE NULL :: TEXT
              END,
              'updatedAt',
              CASE
                WHEN (
                  r.updated_at IS NOT NULL
                ) THEN TO_CHAR (
                  (
                    r.updated_at AT TIME ZONE 'Europe/Stockholm' :: TEXT
                  ),
                  'YYYY-MM-DD"T"HH24:MI:SS.USOF' :: TEXT
                )
                ELSE NULL :: TEXT
              END,
              'uuid',
              (
                r.uuid
              ) :: TEXT,
              'terms',
              COALESCE (
                (
                  SELECT
                    json_agg (
                      json_build_object (
                        'id',
                        t.id,
                        'attribute',
                        t.attribute,
                        'operand',
                        t.operand,
                        'years',
                        t.years,
                        'months',
                        t.months,
                        'days',
                        t.days,
                        'createdBy',
                        t.created_by,
                        'updatedBy',
                        t.updated_by,
                        'createdAt',
                        CASE
                          WHEN (
                            t.created_at IS NOT NULL
                          ) THEN TO_CHAR (
                            (
                              t.created_at AT TIME ZONE 'Europe/Stockholm' :: TEXT
                            ),
                            'YYYY-MM-DD"T"HH24:MI:SS.USOF' :: TEXT
                          )
                          ELSE NULL :: TEXT
                        END,
                        'updatedAt',
                        CASE
                          WHEN (
                            t.updated_at IS NOT NULL
                          ) THEN TO_CHAR (
                            (
                              t.updated_at AT TIME ZONE 'Europe/Stockholm' :: TEXT
                            ),
                            'YYYY-MM-DD"T"HH24:MI:SS.USOF' :: TEXT
                          )
                          ELSE NULL :: TEXT
                        END
                      )
                    ) AS json_agg
                  FROM
                    ihp.term t
                  WHERE
                    (
                      t.rule_id = r.id
                    )
                ),
                '[]' :: json
              )
            )
          ) AS json_agg
        FROM
          (
            ihp.rule r
            JOIN ihp.assignedrule ar ON (
              (
                r.id = ar.rule_id
              )
            )
          )
        WHERE
          (
            ar.doc_id = d.id
          )
      ),
      '[]' :: json
    ),
    'assignedElements',
    COALESCE(
      (
        SELECT
          json_agg(
            json_build_object(
              'id',
              e.id,
              'name',
              e.name,
              'description',
              e.description,
              'datatype',
              e.datatype,
              'mandatory',
              e.mandatory,
              'startDate',
              CASE
                WHEN (
                  e.startdate IS NOT NULL
                ) THEN TO_CHAR(
                  (
                    e.startdate AT TIME ZONE 'Europe/Stockholm' :: TEXT
                  ),
                  'YYYY-MM-DD"T"HH24:MI:SS.USOF' :: TEXT
                )
                ELSE NULL :: TEXT
              END,
              'endDate',
              CASE
                WHEN (
                  e.enddate IS NOT NULL
                ) THEN TO_CHAR(
                  (
                    e.enddate AT TIME ZONE 'Europe/Stockholm' :: TEXT
                  ),
                  'YYYY-MM-DD"T"HH24:MI:SS.USOF' :: TEXT
                )
                ELSE NULL :: TEXT
              END,
              'nodeType',
              e.node_type,
              'status',
              e.status,
              'createdBy',
              e.created_by,
              'updatedBy',
              e.updated_by,
              'createdAt',
              CASE
                WHEN (
                  e.created_at IS NOT NULL
                ) THEN TO_CHAR(
                  (
                    e.created_at AT TIME ZONE 'Europe/Stockholm' :: TEXT
                  ),
                  'YYYY-MM-DD"T"HH24:MI:SS.USOF' :: TEXT
                )
                ELSE NULL :: TEXT
              END,
              'updatedAt',
              CASE
                WHEN (
                  e.updated_at IS NOT NULL
                ) THEN TO_CHAR(
                  (
                    e.updated_at AT TIME ZONE 'Europe/Stockholm' :: TEXT
                  ),
                  'YYYY-MM-DD"T"HH24:MI:SS.USOF' :: TEXT
                )
                ELSE NULL :: TEXT
              END
            )
          ) AS json_agg
        FROM
          (
            ihp.elements e
            JOIN ihp.elements_document ed ON (
              (
                e.id = ed.element_id
              )
            )
          )
        WHERE
          (
            ed.document_id = d.id
          )
      ),
      '[]' :: json
    ),
    'index',
    d.index
  ) AS node
FROM
  (
    ihp.documenttypenode d
    JOIN ihp.issuetypenode issue ON (
      (d.issuetype_id = issue.id)
    )
  );

-- END MATERIALIZED VIEWS --

-- FUNCTIONS --
CREATE OR REPLACE FUNCTION refresh_arende_vy()
RETURNS TRIGGER AS
'
BEGIN
    REFRESH MATERIALIZED VIEW ihp.arende_m_vy;
    RETURN NULL;
END;
' LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION refresh_handling_vy()
RETURNS TRIGGER AS
'
BEGIN
    REFRESH MATERIALIZED VIEW ihp.handling_m_vy;
    RETURN NULL;
END;
' LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION refresh_handling_arende_vy()
RETURNS TRIGGER AS
'
BEGIN
    REFRESH MATERIALIZED VIEW ihp.handling_m_vy;
    REFRESH MATERIALIZED VIEW ihp.arende_m_vy;
    RETURN NULL;
END;
' LANGUAGE plpgsql;
-- END FUNCTIONS --

-- TRIGGER FUNCTION --
DROP TRIGGER IF EXISTS refresh_handling_vy_delete ON documenttypenode CASCADE;

CREATE TRIGGER refresh_handling_vy_delete
AFTER
  DELETE ON documenttypenode FOR EACH STATEMENT EXECUTE FUNCTION refresh_handling_vy();

DROP TRIGGER IF EXISTS refresh_handling_vy_insert ON documenttypenode CASCADE;

CREATE TRIGGER refresh_handling_vy_insert
AFTER
INSERT
  ON documenttypenode FOR EACH STATEMENT EXECUTE FUNCTION refresh_handling_vy();

DROP TRIGGER IF EXISTS refresh_handling_vy_update ON documenttypenode CASCADE;

CREATE TRIGGER refresh_handling_vy_update
AFTER
UPDATE
  ON documenttypenode FOR EACH STATEMENT EXECUTE FUNCTION refresh_handling_vy();

DROP TRIGGER IF EXISTS refresh_all_view_elements_delete ON elements CASCADE;

CREATE TRIGGER refresh_all_view_elements_delete
AFTER
  DELETE ON elements FOR EACH STATEMENT EXECUTE FUNCTION refresh_handling_arende_vy();

DROP TRIGGER IF EXISTS refresh_all_view_elements_insert ON elements CASCADE;

CREATE TRIGGER refresh_all_view_elements_insert
AFTER
INSERT
  ON elements FOR EACH STATEMENT EXECUTE FUNCTION refresh_handling_arende_vy();

DROP TRIGGER IF EXISTS refresh_all_view_elements_update ON elements CASCADE;

CREATE TRIGGER refresh_all_view_elements_update
AFTER
UPDATE
  ON elements FOR EACH STATEMENT EXECUTE FUNCTION refresh_handling_arende_vy();

DROP TRIGGER IF EXISTS refresh_arende_vy_delete ON issuetypenode CASCADE;

CREATE TRIGGER refresh_arende_vy_delete
AFTER
  DELETE ON issuetypenode FOR EACH STATEMENT EXECUTE FUNCTION refresh_handling_arende_vy();

DROP TRIGGER IF EXISTS refresh_arende_vy_insert ON issuetypenode CASCADE;

CREATE TRIGGER refresh_arende_vy_insert
AFTER
INSERT
  ON issuetypenode FOR EACH STATEMENT EXECUTE FUNCTION refresh_handling_arende_vy();

DROP TRIGGER IF EXISTS refresh_arende_vy_update ON issuetypenode CASCADE;

CREATE TRIGGER refresh_arende_vy_update
AFTER
UPDATE
  ON issuetypenode FOR EACH STATEMENT EXECUTE FUNCTION refresh_handling_arende_vy();

DROP TRIGGER IF EXISTS refresh_all_view_noderelation_delete ON noderelation CASCADE;

CREATE TRIGGER refresh_all_view_noderelation_delete
AFTER
  DELETE ON noderelation FOR EACH STATEMENT EXECUTE FUNCTION refresh_arende_vy();

DROP TRIGGER IF EXISTS refresh_all_view_noderelation_insert ON noderelation CASCADE;

CREATE TRIGGER refresh_all_view_noderelation_insert
AFTER
INSERT
  ON noderelation FOR EACH STATEMENT EXECUTE FUNCTION refresh_arende_vy();

DROP TRIGGER IF EXISTS refresh_all_view_noderelation_update ON noderelation CASCADE;

CREATE TRIGGER refresh_all_view_noderelation_update
AFTER
UPDATE
  ON noderelation FOR EACH STATEMENT EXECUTE FUNCTION refresh_arende_vy();

DROP TRIGGER IF EXISTS refresh_all_view_verksamhetomrade_delete ON operationalareatypenode CASCADE;

CREATE TRIGGER refresh_all_view_verksamhetomrade_delete
AFTER
  DELETE ON operationalareatypenode FOR EACH STATEMENT EXECUTE FUNCTION refresh_handling_arende_vy();

DROP TRIGGER IF EXISTS refresh_all_view_verksamhetomrade_insert ON operationalareatypenode CASCADE;

CREATE TRIGGER refresh_all_view_verksamhetomrade_insert
AFTER
INSERT
  ON operationalareatypenode FOR EACH STATEMENT EXECUTE FUNCTION refresh_handling_arende_vy();

DROP TRIGGER IF EXISTS refresh_all_view_verksamhetomrade_update ON operationalareatypenode CASCADE;

CREATE TRIGGER refresh_all_view_verksamhetomrade_update
AFTER
UPDATE
  ON operationalareatypenode FOR EACH STATEMENT EXECUTE FUNCTION refresh_handling_arende_vy();

DROP TRIGGER IF EXISTS refresh_all_view_processgrupp_delete ON processgrouptypenode CASCADE;

CREATE TRIGGER refresh_all_view_processgrupp_delete
AFTER
  DELETE ON processgrouptypenode FOR EACH STATEMENT EXECUTE FUNCTION refresh_handling_arende_vy();

DROP TRIGGER IF EXISTS refresh_all_view_processgrupp_insert ON processgrouptypenode CASCADE;

CREATE TRIGGER refresh_all_view_processgrupp_insert
AFTER
INSERT
  ON processgrouptypenode FOR EACH STATEMENT EXECUTE FUNCTION refresh_handling_arende_vy();

DROP TRIGGER IF EXISTS refresh_all_view_processgrupp_update ON processgrouptypenode CASCADE;

CREATE TRIGGER refresh_all_view_processgrupp_update
AFTER
UPDATE
  ON processgrouptypenode FOR EACH STATEMENT EXECUTE FUNCTION refresh_handling_arende_vy();

DROP TRIGGER IF EXISTS refresh_all_view_process_delete ON processtypenode CASCADE;

CREATE TRIGGER refresh_all_view_process_delete
AFTER
  DELETE ON processtypenode FOR EACH STATEMENT EXECUTE FUNCTION refresh_handling_arende_vy();

DROP TRIGGER IF EXISTS refresh_all_view_process_insert ON processtypenode CASCADE;

CREATE TRIGGER refresh_all_view_process_insert
AFTER
INSERT
  ON processtypenode FOR EACH STATEMENT EXECUTE FUNCTION refresh_handling_arende_vy();

DROP TRIGGER IF EXISTS refresh_all_view_process_update ON processtypenode CASCADE;

CREATE TRIGGER refresh_all_view_process_update
AFTER
UPDATE
  ON processtypenode FOR EACH STATEMENT EXECUTE FUNCTION refresh_handling_arende_vy();

DROP TRIGGER IF EXISTS refresh_handling_vy_rule_delete ON rule CASCADE;

CREATE TRIGGER refresh_handling_vy_rule_delete
AFTER
  DELETE ON rule FOR EACH STATEMENT EXECUTE FUNCTION refresh_handling_vy();

DROP TRIGGER IF EXISTS refresh_handling_vy_rule_insert ON rule CASCADE;

CREATE TRIGGER refresh_handling_vy_rule_insert
AFTER
INSERT
  ON rule FOR EACH STATEMENT EXECUTE FUNCTION refresh_handling_vy();

DROP TRIGGER IF EXISTS refresh_handling_vy_rule_update ON rule CASCADE;

CREATE TRIGGER refresh_handling_vy_rule_update
AFTER
UPDATE
  ON rule FOR EACH STATEMENT EXECUTE FUNCTION refresh_handling_vy();

-- END TRIGGER FUNCTIONS --

