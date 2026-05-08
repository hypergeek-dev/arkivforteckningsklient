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