package se.migrationsverket.ihpservice.support.events;

public enum EventAction {
    UTKAST("Status till utkast"),
    KLAR("Status till klar"),
    GODKAND("Status till godkänd"),
    FASTSTALLD("Status till fastställd"),
    COMMENT("Kommentar tillagd"),
    @Deprecated(forRemoval = true)
    ACTIVATE("Aktiverar (status till fastställd)"),
    CREATE("Skapar"),
    UPDATE("Uppdaterar"),
    DELETE("Tar bort"),
    MOVE("Flyttar"),
    COPY("Kopierad");

    private final String description;

    EventAction(String description) {
        this.description = description;
    }

    public String getDescription() {
        return this.description;
    }
}
