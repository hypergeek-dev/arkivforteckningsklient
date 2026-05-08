package se.migrationsverket.ihpservice.domain.exceptions;

public class AuthorizationException extends RuntimeException {
    public AuthorizationException() {
        super("Unauthorized");
    }

    public AuthorizationException(String message) {
        super(message);
    }
}
