package se.migrationsverket.ihpservice.api.rest.v1.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.util.Comparator;
import java.util.Date;
import java.util.UUID;

@Data
@EqualsAndHashCode(callSuper = false)
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class StructureNodeDto implements DataTransferObject {
    @NotNull
    private String id;
    private String replacesId;
    @NotNull
    private String name;
    private String path;
    private Integer partialPath;
    @NotNull
    private String localPath;
    @NotNull
    private NodeStatus status;
    @NotNull
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private Date start;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private Date stop;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private Date updated;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private Date createdAt;
    private String createdBy;
    private String updatedBy;
    private String remark;
    private UUID uuid;

    public static Comparator<StructureNodeDto> byLocalPath() {
        return (obj1, obj2) -> {
            String s1 = obj1.getLocalPath();
            String s2 = obj2.getLocalPath();

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
        };
    }

    public Integer extractPartialPath() {
        try {
            return Integer.parseInt(getPath().substring(getPath().lastIndexOf("/") + 1));
        } catch (Exception e) {
            return 0;
        }
    }

    public String getNodeName() {
        return null;
    }
}
