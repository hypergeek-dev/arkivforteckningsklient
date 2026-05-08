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