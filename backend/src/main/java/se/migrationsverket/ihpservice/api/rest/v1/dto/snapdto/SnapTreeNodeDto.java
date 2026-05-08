package se.migrationsverket.ihpservice.api.rest.v1.dto.snapdto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Slf4j
public class SnapTreeNodeDto implements Comparable<SnapTreeNodeDto> {
    @NotNull
    int id;
    @NotNull
    int parent;
    @NotNull
    String text;
    @NotNull
    String data;
    Integer index;
    String localPath;

    @Override
    public int compareTo(@NotNull SnapTreeNodeDto o) {

        String s1 = this.getLocalPath();
        String s2 = o.getLocalPath();

        String[] parts1 = s1.split("\\.");
        String[] parts2 = s2.split("\\.");

        int maxLength = Math.min(parts1.length, parts2.length);

        for (int i = 0; i < maxLength; i++) {
            int p1 = Integer.parseInt(parts1[i]);
            int p2 = Integer.parseInt(parts2[i]);

            if (p1 != p2) {
                return p1 - p2;
            }
        }
        return parts1.length - parts2.length;

    }

}
