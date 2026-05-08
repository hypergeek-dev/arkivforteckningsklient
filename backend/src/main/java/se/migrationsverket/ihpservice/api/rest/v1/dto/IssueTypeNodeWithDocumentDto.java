package se.migrationsverket.ihpservice.api.rest.v1.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
@SuperBuilder
public class IssueTypeNodeWithDocumentDto extends IssueTypeNodeDto {
    private List<DocumentTypeNodeDto> handlingstyper;
}
