package se.migrationsverket.ihpservice.support;

import lombok.extern.slf4j.Slf4j;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Base64;
import java.util.Date;

@Slf4j
public class IhpUtils {

    private IhpUtils() {

    }

    public static String resolveTyp(String modelId) {
        try {
            return new String(Base64.getUrlDecoder().decode(modelId));
        } catch (Exception e) {
            log.error("ModelId is invalid - not encoded with base64");
        }
        return modelId;
    }

    public static String nullIntegerToString(Integer i) {
        return i == null ? null : Integer.toString(i);
    }

    public static Integer nullStringToInteger(String s) {
        return s == null || s.isEmpty() ? null : Integer.parseInt(s);
    }

    public static String composeOaPath(String parentPath, int numberOfNodes, int incrementNumber) {
        return parentPath + "/" + (numberOfNodes + incrementNumber == 0 ? 1 : numberOfNodes + incrementNumber);
    }

    public static String composePath(String parentPath, int numberOfNodes, int incrementNumber) {
        String number = parentPath.substring(parentPath.lastIndexOf("/"));
        return numberOfNodes + incrementNumber == 0 ? parentPath + number + ".1" : parentPath + number + "." + (numberOfNodes + incrementNumber);

    }

    public static Date localDateTimeToDate(LocalDateTime dateToConvert) {
        return java.util.Date
                .from(dateToConvert.atZone(ZoneId.systemDefault())
                        .toInstant());
    }
}
