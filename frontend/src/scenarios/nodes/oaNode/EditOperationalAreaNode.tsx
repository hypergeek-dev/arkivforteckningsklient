import { OperationalAreaTypeNodeDto } from 'Models/index';
import { StyledDateForm } from 'Scenarios/nodes/components/forms/DateForms';
import DefaultFormLayout from 'Scenarios/nodes/components/forms/DefaultFormLayout';
import { StyledInputForm } from 'Scenarios/nodes/components/forms/InputForm';
import { selectAuthUser } from 'Store/ducks/user/selectors';
import { useAppSelector } from 'Store/hooks';
import React from 'react';
import FormCard from '../components/forms/FormCard';
import { CARD_HEIGHT, CARD_WIDTH } from '../ksNode/EditKsNode';
import { requireMaxLength, requiredField } from 'Common/validators';

type Props = {
  data: OperationalAreaTypeNodeDto;
  onChangeHandler: (key: string, value: string | number | boolean) => void;
  disabled: boolean;
};

const EditOperationalAreaNode: React.FC<Props> = ({
  data,
  onChangeHandler,
  disabled,
}) => {
  const auth = useAppSelector(selectAuthUser);
  return (
    <DefaultFormLayout
      node={data}
      disabled={disabled}
      onChange={onChangeHandler}
      header={`Benämning verksamhetsområde ${disabled ? '' : '*'}`}
    >
      <FormCard
        sx={{
          width: `${CARD_WIDTH}px`,
          height: `${CARD_HEIGHT}px`,
        }}
      >
        <StyledInputForm
          name="authDecision"
          onChangeHandler={onChangeHandler}
          title={`Myndighetens beslut ${disabled ? '' : '*'}`}
          value={data.authDecision}
          required
          multiline
          rows={12}
          maxLength={300}
          disabled={disabled}
          validators={[requiredField(), requireMaxLength(300)]}
        />
      </FormCard>

      <FormCard
        sx={{
          height: `${CARD_HEIGHT}px`,
          width: `${CARD_WIDTH}px`,
        }}
      >
        <StyledInputForm
          name="remark"
          onChangeHandler={onChangeHandler}
          value={data.remark || ''}
          title="Anmärkning verksamhetsområde"
          multiline
          rows={12}
          maxLength={1000}
          disabled={disabled}
        />
      </FormCard>

      <FormCard
        sx={{
          height: `${CARD_HEIGHT}px`,
          width: `${CARD_WIDTH}px`,
        }}
      >
        <StyledDateForm
          disabled={disabled || !auth}
          start={data.start}
          stop={data.stop}
          onChangeHandler={onChangeHandler}
        />
      </FormCard>
    </DefaultFormLayout>
  );
};

export default EditOperationalAreaNode;
