package se.migrationsverket.ihpservice.domain.authorization;

import java.util.function.Predicate;

public interface AuthResolver {
    Predicate<String> administreraAllowed();
    Predicate<String> visaAllowed();
    Predicate<String> faststallAllowed();
    Predicate<String> importeraAllowed();
}
