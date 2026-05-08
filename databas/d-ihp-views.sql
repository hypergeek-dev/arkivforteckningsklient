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