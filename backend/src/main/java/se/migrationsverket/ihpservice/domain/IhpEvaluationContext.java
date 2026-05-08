package se.migrationsverket.ihpservice.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class IhpEvaluationContext implements IhpModelObject {
    private IhpModelObject ihpModelObject;


    @Override
    public void mapToContext(IhpEvaluationContext ihpEvaluationContext) {
        ihpModelObject.mapToContext(ihpEvaluationContext);
    }


}
