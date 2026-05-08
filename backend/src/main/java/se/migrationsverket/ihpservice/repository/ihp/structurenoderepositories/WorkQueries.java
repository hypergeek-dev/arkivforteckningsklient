package se.migrationsverket.ihpservice.repository.ihp.structurenoderepositories;

public class WorkQueries {
    public static final String COMBINED_DTO = """
                    with combined as (
                          SELECT node from ihp.handling_m_vy 
                          UNION ALL
                          SELECT node from ihp.arende_m_vy
                          UNION ALL
                          SELECT node from ihp.process_n_vy
                          UNION ALL
                          SELECT node from ihp.processgrupp_n_vy
                          UNION ALL
                          SELECT node from ihp.verksamhet_omrade_n_vy
                          UNION ALL
                          SELECT node from ihp.klassifikation_n_vy
                  )
            """;

    public static final String ESTABLISHED_IHP_FROM_PATH = """
            with combined as (
                  SELECT node from ihp.handling_n_vy 
                  UNION ALL
                  SELECT node from ihp.arende_n_vy
             )
             SELECT node from combined WHERE node->>'path' like ? AND node->>'status' = 'faststalld' ORDER BY node->>'localPath' ASC
            """;


    public static final String WORK_DTO_IHP = String.format("""
             %s
            SELECT node from combined WHERE node->>'path' like ? ORDER BY node->>'localPath' ASC
             """, COMBINED_DTO);


    private WorkQueries() {
    }
}
