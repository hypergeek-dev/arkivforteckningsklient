import { Stack } from '@mui/material';
import { Validator, requireMaxLength, requiredField } from 'Common/validators';
import { ClassificationStructureTypeNodeDto } from 'Models/index';
import { StyledDateForm } from 'Scenarios/nodes/components/forms/DateForms';
import DefaultFormLayout from 'Scenarios/nodes/components/forms/DefaultFormLayout';
import {
  NumberInputForm,
  StyledInputForm,
} from 'Scenarios/nodes/components/forms/InputForm';
import { selectAuthUser } from 'Store/ducks/user/selectors';
import { useAppSelector } from 'Store/hooks';
import React from 'react';
import FormCard from '../components/forms/FormCard';

type Props = {
  data?: ClassificationStructureTypeNodeDto;
  onChangeHandler: (
    key: string,
    value: string | number | boolean,
    validators?: Validator[]
  ) => void;
  disabled: boolean;
};

export const CARD_WIDTH = 400;
export const CARD_HEIGHT = 360;

const EditKsNode: React.FC<Props> = ({ data, onChangeHandler, disabled }) => {
  const auth = useAppSelector(selectAuthUser);

  if (!data) {
    return null;
  }
  return (
    <DefaultFormLayout
      node={data}
      disabled={disabled}
      onChange={onChangeHandler}
      header={`Benämning klassificeringsstruktur ${disabled ? '' : '*'}`}
    >
      <FormCard
        sx={{
          width: `${CARD_WIDTH}px`,
          height: `${CARD_HEIGHT}px`,
        }}
      >
        <Stack spacing={2}>
          <StyledInputForm
            onChangeHandler={onChangeHandler}
            name="authDecision"
            title={`Myndighetens beslut ${disabled ? '' : '*'}`}
            value={data.authDecision}
            required
            disabled={disabled}
            maxLength={300}
            validators={[requiredField(), requireMaxLength(300)]}
          />
          <StyledInputForm
            onChangeHandler={onChangeHandler}
            name="instruction"
            title={`Instruktionsnummer KS ${disabled ? '' : '*'}`}
            value={data.instruction ?? ''}
            required
            disabled={disabled}
            maxLength={300}
            validators={[requiredField(), requireMaxLength(300)]}
          />

          <StyledInputForm
            onChangeHandler={onChangeHandler}
            name="instructionCodeIhp"
            title={`Instruktionsnummer IHP ${disabled ? '' : '*'}`}
            value={data.instructionCodeIhp ?? ''}
            required
            disabled={disabled}
            maxLength={300}
            validators={[requiredField(), requireMaxLength(300)]}
          />
        </Stack>
      </FormCard>

      <FormCard
        sx={{
          height: `${CARD_HEIGHT}px`,
          width: `${CARD_WIDTH}px`,
        }}
      >
        <StyledInputForm
          onChangeHandler={onChangeHandler}
          name="remark"
          value={data.remark ?? ''}
          title="Anmärkning klassificeringsstruktur"
          multiline
          rows={12}
          maxLength={1000}
          disabled={disabled}
          validators={[requireMaxLength(1000)]}
        />
      </FormCard>
      <FormCard
        sx={{
          height: `${CARD_HEIGHT}px`,
          width: `${CARD_WIDTH}px`,
        }}
      >
        <NumberInputForm
          onChangeHandler={onChangeHandler}
          name="csVersion"
          value={`${data.csVersion}`}
          title="Version (Heltal, ändra vid beredning)"
          maxLength={19}
          type="number"
          disabled={disabled}
        />

        <StyledDateForm
          disabled={disabled || !auth}
          start={data.start}
          stop={data.stop}
          onChangeHandler={onChangeHandler}
          style={{ marginTop: '1rem' }}
        />
      </FormCard>
      <FormCard
        sx={{
          height: `${CARD_HEIGHT}px`,
          width: `${CARD_WIDTH}px`,
        }}
      >
        <StyledInputForm
          onChangeHandler={onChangeHandler}
          name="revised"
          value={data.revised ?? ''}
          title="Processer som reviderats"
          multiline
          rows={5}
          maxLength={1000}
          disabled={disabled}
          validators={[requireMaxLength(1000)]}
        />
      </FormCard>
    </DefaultFormLayout>
  );
};

export default EditKsNode;
