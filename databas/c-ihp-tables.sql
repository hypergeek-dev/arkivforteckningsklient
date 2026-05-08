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