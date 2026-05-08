package se.migrationsverket.ihpservice.api.rest.v1.dto.rules;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import se.migrationsverket.ihpservice.api.rest.v1.dto.DataTransferObject;
import se.migrationsverket.ihpservice.api.rest.v1.dto.DtoMapper;
import se.migrationsverket.ihpservice.domain.rules.Term;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class TermDto implements DataTransferObject, DtoMapper<Term> {
    private Integer id;
    @NotNull
    private TermAttribute attribute;
    @NotNull
    private TermOperand operand;
    private String createdBy;
    private String updatedBy;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private Date createdAt;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private Date updatedAt;
    @NotNull
    private Integer years;
    @NotNull
    private Integer months;
    @NotNull
    private Integer days;
    private Integer ruleId;

    @Override
    public Term map() {
        return Term.builder()
                .id(getId())
                .attribute(getAttribute())
                .operand(getOperand())
                .createdBy(getCreatedBy())
                .updatedBy(getUpdatedBy())
                .createdAt(getCreatedAt())
                .updatedAt(getUpdatedAt())
                .days(getDays())
                .months(getMonths())
                .years(getYears())
                .build();
    }

    @Override
    public Term addMap() {
        return Term.builder()
                .attribute(getAttribute())
                .operand(getOperand())
                .days(getDays())
                .months(getMonths())
                .years(getYears())
                .build();
    }
}
