package se.migrationsverket.ihpservice.support;

public class ApplicationStatics {

    public static final String NAME = "informationshanteringsplan";
    public static final String REMOTE_ADDR = "remoteAddr";
    public static final String AUTH = "auth";
    public static final String IAM_USER = "iam_user";
    public static final String CONSUMER = "consumer";
    public static final String CORRELATION_ID = "correlationId";
    public static final String MDC_CORRELATION_ID = "correlationid";
    public static final String FASTSTALLD = "Fastställd";
    public static final String UTKAST = "Utkast";

    public static final String PC_DELETE_FAILED = "Endast utkastnoder får raderas, node med id %s har status %s";
    public static final String NODE_NF = "Nod med id %s hittas inte";
    public static final String PATH_EXISTS = "Föreslagen sökväg finns redan på en annan nod - nummer : %s ";
    public static final String NAME_EXISTS = "Nodnamnet finns redan i det aktuella %s";

    public static final String RULE_DELETE_FAILED = "Endast utkastsregler tillåts att radera, regel med id %s har status %s";

    public static final String UNSUP_IFC = "Interface metod not used here";


    private ApplicationStatics() {
    }
}