-- Klassificeringsstruktur

INSERT INTO ihp.classificationstructuretypenode (
    replaces_id,
    name,
    remark,
    start,
    stop,
    status,
    cs_version,
    auth_decision,
    auth_name,
    created_by,
    path,
    decision_date,
    updated_by,
    uuid,
    instruction,
    revised,
    instruction_code_ihp
) VALUES (
    NULL, -- replaces_id (INT8): Kan vara NULL om den inte ersätter något
    'Klassificeringsstruktur 2026', -- name (VARCHAR)
    'Detta är en exempelkommentar.', -- remark (VARCHAR)
    '2025-01-01 10:00:00+01', -- start (TIMESTAMPTZ)
    NULL, -- stop (TIMESTAMPTZ): Kan vara NULL om den är aktuell
    'utkast', -- status (VARCHAR)
    1, -- cs_version (INT8)
    'APPROVED', -- auth_decision (VARCHAR)
    'Godkännare A', -- auth_name (VARCHAR)
    'AnvändareX', -- created_by (VARCHAR)
    '/0c5d8353-1cf5-414b-807d-8c16cbce6dbf', -- path (VARCHAR)
    '2026-01-01', -- decision_date (DATE)
    'AnvändareY', -- updated_by (VARCHAR)
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, -- uuid (UUID): Använd '::uuid' för explicit typkonvertering
    'Följ dessa instruktioner.', -- instruction (VARCHAR)
    'false', -- revised (VARCHAR): Antar att detta är en sträng representation av boolean/status
    'IHP-CODE-123' -- instruction_code_ihp (VARCHAR)
);

-- Verksamhetsområde
INSERT INTO operationalareatypenode (
    csnode_id,
    replaces_id,
    name,
    remark,
    start,
    stop,
    status,
    information_responsible,
    contact,
    lawsection,
    relation_structuralunit,
    created_by,
    path,
    decision_date,
    auth_decision,
    updated_by,
    uuid
) VALUES (
    (SELECT id
     FROM classificationstructuretypenode
     WHERE uuid = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
     LIMIT 1), 
    NULL,
    'Verksamhetsområde 1',
    'Område kopplat till',
    '2024-05-20 09:00:00+02',
    NULL,
    'utkast',
    'Ansvarig Person B',
    'kontakt.b@example.com',
    'ABL 3 kap 5 §',
    'Avdelning Y',
    'SystemUserB',
    '/0c5d8353-1cf5-414b-807d-8c16cbce6dbf/1',
    '2024-05-15',
    'APPROVED',
    'Admin',
    'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12'::uuid
);

-- Processgrupp
INSERT INTO processgrouptypenode (
    parent_id,
    replaces_id,
    name,
    remark,
    start,
    stop,
    status,
    information_responsible,
    contact,
    lawsection,
    relation_structuralunit,
    created_by,
    path,
    decision_date,
    updated_by,
    uuid
) VALUES (
    (SELECT id
     FROM operationalareatypenode
     WHERE uuid = 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12'::uuid
     LIMIT 1),
    NULL,
    'ExempelProcessGrupp',
    'Denna processgrupp tillhör det operativa området med specifikt UUID.',
    '2024-05-21 10:00:00+02',
    NULL, -- stop
    'utkast',
    'Processansvarig C',
    'kontakt.c@example.com',
    'ABL 3 kap 6 §',
    'Avdelning Z',
    'ProcessUserA',
    '/0c5d8353-1cf5-414b-807d-8c16cbce6dbf/1/1.1',
    '2024-05-20',
    'UpdaterUserA',
    'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a13'::uuid -- Unikt UUID för denna nya rad
);

-- Process
INSERT INTO processtypenode (
    parent_id,
    replaces_id,
    name,
    remark,
    start,
    stop,
    status,
    information_responsible,
    contact,
    lawsection,
    relation_structuralunit,
    created_by,
    path,
    number,
    updated_by,
    uuid
) VALUES (
    (SELECT id
     FROM processgrouptypenode
     WHERE uuid = 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a13'::uuid
     LIMIT 1), -- Hämtar ID från den föregående processgruppen
    NULL,
    'ExempelProcess',
    'Denna nod representerar en enskild process.',
    '2024-05-21 10:00:00+02',
    NULL, -- stop
    'utkast', -- STATUS satt till 'utkast'
    'Processexpert D',
    'kontakt.d@example.com',
    'ABL 3 kap 7 §',
    'Avdelning A',
    'ProcessUserB',
    '/0c5d8353-1cf5-414b-807d-8c16cbce6dbf/1/1.1/1.1.1', -- PATH enligt önskat format
    NULL, -- number
    'UpdaterUserB',
    'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a14'::uuid -- Unikt UUID för denna nya processnod
);

-- Ärendetyp
INSERT INTO issuetypenode (
    process_id,
    replaces_id,
    name,
    start,
    stop,
    status,
    remark,
    register,
    keeping_unit,
    created_by,
    path,
    number,
    updated_by,
    uuid,
    index
) VALUES (
    (SELECT id
     FROM processtypenode
     WHERE uuid = 'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a14'::uuid
     LIMIT 1), -- Hämtar ID från den föregående processnoden
    NULL, -- replaces_id
    'ExempelÄrendeTyp', -- name
    '2024-05-22 10:00:00+02', -- start
    NULL, -- stop
    'utkast', -- status 
    'Denna ärendetyp beskriver hur ett specifikt ärende hanteras.', -- remark
    TRUE, -- register (boolean)
    'Arkiv Myndighet A', -- keeping_unit
    'IssueUserA', -- created_by
    '/0c5d8353-1cf5-414b-807d-8c16cbce6dbf/1/1.1/1.1.1/ÄT ExempelÄrendeTyp', -- path (anpassa efter logik)
    'A-500', -- number
    'UpdaterUserC', -- updated_by
    'e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a15'::uuid, -- Unikt UUID för denna nya ärendetyp
    0 -- index
);

-- Handlingstyp
INSERT INTO documenttypenode (
    issuetype_id,
    replaces_id,
    name,
    remark,
    start,
    stop,
    status,
    register,
    keeping_unit,
    signature_required,
    informationsecurityclass,
    created_by,
    path,
    secrecy,
    personal_data,
    updated_by,
    uuid,
    regulation,
    manual_evaluation,
    secrecy_lawsection,
    index
) VALUES (
    (SELECT id
     FROM issuetypenode
     WHERE uuid = 'e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a15'::uuid
     LIMIT 1), -- Hämtar ID från den föregående ärendetypen
    NULL, -- replaces_id
    'ExempelDokumentTyp', -- name
    'Beskrivning av en specifik dokumenttyp.', -- remark
    '2024-05-23 10:00:00+02', -- start
    NULL, -- stop
    'utkast', -- status
    TRUE, -- register (bool)
    'Arkiv Myndighet B', -- keeping_unit
    FALSE, -- signature_required (bool)
    2, -- informationsecurityclass (int4, t.ex. Intern)
    'DocumentUserA', -- created_by
    '/0c5d8353-1cf5-414b-807d-8c16cbce6dbf/1/1.1/1.1.1/ÄT ExempelÄrendeTyp/HT ExempelHandlingstypTyp', -- path (anpassa efter logik)
    FALSE, -- secrecy (bool)
    TRUE, -- personal_data (bool)
    'UpdaterUserD', -- updated_by
    'f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a16'::uuid, -- Unikt UUID för denna nya handlingstyp
    'GDPR (EU) 2016/679', -- regulation
    FALSE, -- manual_evaluation (bool)
    NULL, -- secrecy_lawsection
    0 -- index
);