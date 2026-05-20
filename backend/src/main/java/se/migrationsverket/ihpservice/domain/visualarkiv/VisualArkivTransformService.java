package se.migrationsverket.ihpservice.domain.visualarkiv;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.ZoneId;
import java.util.*;

/**
 * Transforms raw rows extracted from Visual Arkiv into domain-compatible maps
 * keyed by target field names.
 *
 * The transform layer is deliberately stateless and free of JPA/Spring Data dependencies
 * so it can be unit-tested without a database.
 */
@Slf4j
@Service
public class VisualArkivTransformService {

    /**
     * Transforms a list of raw source rows according to the provided mapping.
     *
     * @param sourceRows  rows extracted from Visual Arkiv (column name → raw JDBC value)
     * @param mapping     field mapping configuration for this table
     * @param batchId     import batch UUID, stored on each transformed row
     * @return list of transformed rows keyed by target field names
     */
    public List<TransformedRow> transform(
            List<Map<String, Object>> sourceRows,
            VisualArkivFieldMapping mapping,
            UUID batchId) {

        List<TransformedRow> result = new ArrayList<>(sourceRows.size());

        for (Map<String, Object> sourceRow : sourceRows) {
            TransformedRow transformed = transformRow(sourceRow, mapping, batchId);
            result.add(transformed);
        }

        return result;
    }

    private TransformedRow transformRow(
            Map<String, Object> sourceRow,
            VisualArkivFieldMapping mapping,
            UUID batchId) {

        Map<String, Object> target = new LinkedHashMap<>();
        List<String> warnings = new ArrayList<>();
        List<String> unmappedSourceColumns = new ArrayList<>();

        // Apply field mapping
        for (Map.Entry<String, Object> entry : sourceRow.entrySet()) {
            String sourceCol = entry.getKey();
            String targetField = mapping.getColumnMap().get(sourceCol);

            if (targetField == null) {
                unmappedSourceColumns.add(sourceCol);
                continue;
            }

            Object value = coerceValue(entry.getValue(), targetField, warnings);
            target.put(targetField, value);
        }

        // Legacy reference fields (always populated)
        String legacyId = extractString(sourceRow, mapping.getSourcePrimaryKeyColumn());
        String legacyParentId = extractString(sourceRow, mapping.getSourceParentKeyColumn());

        target.put("legacy_source_system", "visual_arkiv");
        target.put("legacy_table", mapping.getSourceTable());
        target.put("legacy_id", legacyId);
        target.put("legacy_parent_id", legacyParentId);
        target.put("import_batch_id", batchId);
        target.put("imported_at", java.time.Instant.now());
        target.put("target_type", mapping.getTargetType());

        if (!unmappedSourceColumns.isEmpty()) {
            warnings.add("Omappade källkolumner: " + String.join(", ", unmappedSourceColumns));
        }

        return new TransformedRow(legacyId, legacyParentId, mapping.getTargetType(), target, warnings);
    }

    /** Coerces raw JDBC types to appropriate target types. */
    private Object coerceValue(Object raw, String targetField, List<String> warnings) {
        if (raw == null) return null;

        // Date fields: convert SQL Date / Timestamp to LocalDate string
        if (isDateField(targetField)) {
            try {
                if (raw instanceof java.sql.Date d) {
                    return d.toLocalDate().toString();
                }
                if (raw instanceof java.sql.Timestamp ts) {
                    return ts.toLocalDateTime().toLocalDate().toString();
                }
                if (raw instanceof java.util.Date d) {
                    return d.toInstant().atZone(ZoneId.systemDefault()).toLocalDate().toString();
                }
            } catch (Exception e) {
                warnings.add("Kunde inte konvertera datumfält '" + targetField + "': " + e.getMessage());
                return null;
            }
        }

        // Preserve native types for non-varchar columns; toString() would cause type mismatches.
        if (raw instanceof Number || raw instanceof Boolean) return raw;

        return raw.toString().trim();
    }

    private boolean isDateField(String field) {
        return field != null && (field.contains("fran") || field.contains("till")
            || field.contains("datum") || field.contains("start") || field.contains("stop")
            || field.contains("period"));
    }

    private String extractString(Map<String, Object> row, String column) {
        if (column == null || !row.containsKey(column)) return null;
        Object val = row.get(column);
        return val != null ? val.toString().trim() : null;
    }

    /** A successfully transformed row ready for loading. */
    public record TransformedRow(
        String legacyId,
        String legacyParentId,
        String targetType,
        Map<String, Object> fields,
        List<String> warnings
    ) {
        public boolean hasWarnings() { return !warnings.isEmpty(); }
    }
}
