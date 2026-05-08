package se.migrationsverket.ihpservice.domain.services;

import java.util.ArrayList;
import java.util.List;

public class NodePathHelper {

    private NodePathHelper() {
        throw new IllegalStateException("Verktygsklass");
    }

    public static String getTypePrefix(String path) {
        return path.contains("/ÄT") ? " ÄT " : " ";
    }

    public static String getNumber(String path) {
        return path.contains("/ÄT") ? getNumberIhp(path) : getNumberStruct(path);
    }

    // Get number from StructureNode
    private static String getNumberStruct(String path) {
        return path.substring(path.lastIndexOf("/") + 1);
    }

    // Get number from IHP-node
    private static String getNumberIhp(String path) {
        String partPath = path.substring(0, path.indexOf("/ÄT"));
        return partPath.substring(partPath.lastIndexOf("/") + 1);
    }

    // Extract displayname for nodetypes (i.e. 1.2.3 hantering av bla)
    public static String extractName(String path, String name) {
        return path.contains("/ÄT") ? extractIssueName(path, name) : extractStructName(path, name);
    }

    public static String extractIssueName(String path, String name) {
        return getNumberIhp(path) + " ÄT " + name;
    }

    public static String extractStructName(String path, String name) {
        return getNumberStruct(path) + " " + name;
    }

    public static int getSortValueFromPath(String path) {
        return getSortValue(getNumber(path));
    }

    public static int getSortValue(String number) {
        String strNumber = !number.contains(" ") ? "0" : number.substring(0, number.indexOf(" ")).trim();
        int startPos = 0;
        int sortValue = 0;
        int startFactor = 10000000;

        if (!strNumber.contains(".")) {

            return Integer.parseInt(strNumber) * startFactor;
        } else {
            startFactor = startFactor / 10;
        }
        List<Integer> positions = getDotPositions(strNumber);


        for (Integer pos : positions) {
            int factor = Integer.parseInt(strNumber.substring(startPos, pos)) * startFactor;
            sortValue = sortValue + factor;
            startFactor = startFactor / 10;
            startPos = pos + 1;
        }

        int factor = Integer.parseInt(strNumber.substring(startPos)) * startFactor;
        sortValue = sortValue + factor;

        return sortValue;

    }

    private static List<Integer> getDotPositions(String number) {
        List<Integer> positions = new ArrayList<>();

        for (int i = 0; i < number.length(); i++) {
            if (number.charAt(i) == '.') {
                positions.add(i);
            }
        }
        return positions;
    }

}
