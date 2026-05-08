import ChipSelect from 'Scenarios/components/ChipSelect';
import { actions, selectors } from 'Store/ducks/regulation';
import { useAppDispatch, useAppSelector } from 'Store/hooks';
import React from 'react';

const RuleChipSelector = () => {
  const dispatch = useAppDispatch();
  const selectedRuleType = useAppSelector(selectors.selectCreateType);
  return (
    <div>
      <ChipSelect
        active={selectedRuleType === 'DEFAULT_RULE'}
        label="Gallringsregel"
        handleChipSelect={() => dispatch(actions.setCreateType('DEFAULT_RULE'))}
      />
      <ChipSelect
        active={selectedRuleType === 'EXCEPTION_RULE'}
        label="Undantagsregel"
        handleChipSelect={() =>
          dispatch(actions.setCreateType('EXCEPTION_RULE'))
        }
      />
      <ChipSelect
        active={selectedRuleType === 'TEXT_RULE'}
        label="Referensregel"
        handleChipSelect={() => dispatch(actions.setCreateType('TEXT_RULE'))}
      />
    </div>
  );
};

export default RuleChipSelector;
