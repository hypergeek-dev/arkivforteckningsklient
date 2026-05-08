package se.migrationsverket.ihpservice.domain.services.rules;

import se.migrationsverket.ihpservice.api.rest.v1.dto.rules.RuleType;
import se.migrationsverket.ihpservice.domain.rules.Rule;
import se.migrationsverket.ihpservice.domain.rules.Term;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.function.Predicate;

public class RulePredicates {
    private RulePredicates() {
        throw new IllegalStateException("Utility class");
    }

    protected static List<Predicate<Rule>> getPredicates(List<List<Integer>> ranges) {
        List<Predicate<Rule>> validPredicates = new ArrayList<>();
        if (ranges.stream().mapToLong(Collection::size).sum() == 2) {
            List<Integer> range = ranges.stream().flatMap(Collection::stream).toList();
            validPredicates.add(getPredicate(range));
            return validPredicates;
        } else {
            return ranges.stream().map(RulePredicates::getPredicate).toList();
        }
    }

    private static Predicate<Rule> getPredicate(List<Integer> range) {
        int min = range.get(0) == null || range.get(0) == 0 ? 0 : range.get(0);
        int max = range.get(1) == null || range.get(1) == 0 ? Integer.MAX_VALUE : range.get(1);
        return getPredicate(min, max);

    }

    private static Predicate<Rule> getPredicate(int min, int max) {
        return r -> r.getRuleType().equals(RuleType.DEFAULT_RULE) && getValue(r.getTerms().get(0)) > min && getValue(r.getTerms().get(0)) <= max;
    }

    private static double getValue(Term term) {
        double months = term.getMonths() / 12.0;
        double days = term.getDays() / 365.0;
        return term.getYears() + months + days;
    }
}
