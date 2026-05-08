package se.migrationsverket.ihpservice.repository.ihp.structurenoderepositories;

public class ModelSnapshotEstablishedQueries {

    protected static final String ACTIVE_KS_WITH_IHP = """
            WITH latest_ks AS (
            SELECT * FROM ihp.model_snapshot_established\s
                    WHERE CAST(modelb->0->>'start' AS DATE) < now()\s
                    AND CAST(coalesce(modelb->>'stop', '9999-12-31') AS DATE) > now()\s
                    ORDER BY id DESC LIMIT 1)
                    ,\s
                                latest_ihp AS ( \s
                                       SELECT modelb \s
                                       FROM ihp.ihp_established \s
                                       WHERE ihp_established.csnode_id = (SELECT csnode_id from latest_ks)\s
                                       ORDER BY timestamp DESC \s
                                       LIMIT 1 \s
                                ), \s
                                combined AS ( \s
                                       SELECT jsonb_array_elements(latest_ks.modelb) AS data \s
                                       FROM latest_ks \s
                                       UNION ALL \s
                                       SELECT jsonb_array_elements(modelb) AS data \s
                                       FROM latest_ihp \s
                                ) \s
                                SELECT data \s
                                FROM combined \s
                                ORDER BY (data->>'path')
            """;

    private ModelSnapshotEstablishedQueries() {
    }
}
