package se.migrationsverket.ihpservice.domain.authorization;

public class AuthorizationStatics {
    private AuthorizationStatics() {
    }

    public static final String ACTION_ADMINISTRERA = "administrera";
    public static final String ACTION_VISA = "visa";
    public static final String ACTION_FASTSTALL = "faststalla";
    public static final String ACTION_IMPORTERA = "importera";

    /**
     * Intended role model for the archival inventory client:
     *
     *  ARKIVANSVARIG  – full access: administrera, visa, faststalla, importera
     *  ARKIVARIE      – administrera, visa, importera (may not faststalla independently)
     *  LASARE         – visa only
     *
     * In local/dev mode all actions return true (mock IAM).
     * In production these are enforced by the external IAM system via SecurityHelper.
     */
}
