package se.migrationsverket.ihpservice.api.rest.v1.dto.rules;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import se.migrationsverket.ihpservice.api.rest.v1.dto.DataTransferObject;
import se.migrationsverket.ihpservice.api.rest.v1.dto.DtoMapper;
import se.migrationsverket.ihpservice.domain.rules.Rule;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class RuleDto implements DataTransferObject, DtoMapper<Rule> {
    private Integer id;
    @NotNull
    private RuleType ruleType;
    private String description;
    private RuleStatus status;
    private List<TermDto> terms;
    private String name;
    private String comment;
    private String createdBy;
    private String updatedBy;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private Date createdAt;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private Date updatedAt;
    private UUID uuid;

    @Override
    public Rule map() {
        return Rule.builder()
                .id(getId())
                .ruleType(getRuleType())
                .description(getDescription())
                .ruleStatus(getStatus())
                .terms(getRuleType().equals(RuleType.TEXT_RULE) ? new ArrayList<>() : getTerms().stream().map(TermDto::map).collect(Collectors.toList()))
                .name(getName())
                .comment(getComment())
                .createdBy(getCreatedBy())
                .updatedBy(getUpdatedBy())
                .createdAt(getCreatedAt())
                .updatedAt(getUpdatedAt())
                .uuid(getUuid())
                .comment(getComment())
                .build();
    }

    @Override
    public Rule addMap() {
        return Rule.builder()
                .ruleType(getRuleType())
                .description(getDescription())
                .terms(getRuleType().equals(RuleType.TEXT_RULE) ? new ArrayList<>() : getTerms().stream().map(TermDto::map).collect(Collectors.toList()))
                .name(getName())
                .comment(getComment())
                .build();
    }
}
