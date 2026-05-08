package se.migrationsverket.ihpservice.repository.ihp.structurenoderepositories;

public class IssueNodeQueries {
    /**
     * returns an array of all established and active
     * issuetypes as stored in the established snapshop
     */
    public static final String FETCH_ESTABLISHED_ISSUETYPES = """
            WITH 
                -- find the active - element 0 is always the ks object
                active_ks AS ( 
                    SELECT csnode_id
                    FROM ihp.model_snapshot_established  
                    WHERE CAST(modelb->0->>'start' AS DATE) < now() AND CAST(coalesce(modelb->>'stop', '9999-12-31') AS DATE) > now()  
                    ORDER BY id DESC LIMIT 1 
                    ),

                -- find the latest ihp for the active ks 
                latest_ihp AS (
                        SELECT * FROM ihp.ihp_established
                        WHERE ihp_established.csnode_id = (SELECT csnode_id FROM active_ks)
                        ORDER BY timestamp DESC LIMIT 1
                )

                -- find all issuetypes in the latest ihp and aggregate the result into an array
                SELECT jsonb_agg(element) AS issuetypes
                FROM latest_ihp, jsonb_array_elements(modelb) AS element
                WHERE element->>'nodeName' = 'issuenode'
            """;
    public static final String FETCH_ESTABLISHED_ISSUETYPE = """
            WITH                 
                -- find the active - element 0 is always the ks object
                active_ks AS ( 
                    SELECT csnode_id
                    FROM ihp.model_snapshot_established  
                    WHERE CAST(modelb->0->>'start' AS DATE) < now() AND CAST(coalesce(modelb->>'stop', '9999-12-31') AS DATE) > now()  
                    ORDER BY id DESC LIMIT 1 
                    ),

                -- find the latest ihp for the ative ks 
                latest_ihp AS (
                        SELECT * FROM ihp.ihp_established
                        WHERE ihp_established.csnode_id = (SELECT csnode_id FROM active_ks)
                        ORDER BY timestamp DESC LIMIT 1
                )

                -- return the issuetypes and document types with a path that matches the requested 
                SELECT node
                FROM latest_ihp, jsonb_array_elements(modelb) AS node
                WHERE node->>'path' LIKE ?
            """;

    private IssueNodeQueries() {
    }
}

