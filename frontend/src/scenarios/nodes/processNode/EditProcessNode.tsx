import { requireMaxLength, requiredField } from 'Common/validators';
import { ProcessTypeNodeDto } from 'Models/index';
import RelationsCardContent from 'Scenarios/components/relations/RelationsCardContent';
import { StyledDateForm } from 'Scenarios/nodes/components/forms/DateForms';
import DefaultFormLayout from 'Scenarios/nodes/components/forms/DefaultFormLayout';
import { StyledInputForm } from 'Scenarios/nodes/components/forms/InputForm';
import { selectAuthUser } from 'Store/ducks/user/selectors';
import { useAppSelector } from 'Store/hooks';
import React from 'react';
import FormCard from '../components/forms/FormCard';
import { CARD_HEIGHT, CARD_WIDTH } from '../ksNode/EditKsNode';

type Props = {
  data: ProcessTypeNodeDto;
  onChangeHandler: (key: string, value: string | number | boolean) => void;
  disabled: boolean;
};

const EditProcess: React.FC<Props> = ({ data, onChangeHandler, disabled }) => {
  const auth = useAppSelector(selectAuthUser);
  return (
    <DefaultFormLayout
      node={data}
      disabled={disabled}
      onChange={onChangeHandler}
      header={`Benämning process ${disabled ? '' : '*'}`}
    >
      <FormCard
        sx={{
          width: CARD_WIDTH,
          height: CARD_HEIGHT,
        }}
      >
        <StyledInputForm
          name="informationResponsible"
          title={`Informationsansvarig ${disabled ? '' : '*'}`}
          onChangeHandler={onChangeHandler}
          value={data.informationResponsible || ''}
          required
          disabled={disabled}
          maxLength={50}
          validators={[requiredField(), requireMaxLength(50)]}
        />

        <StyledInputForm
          name="contact"
          title="Kontaktperson"
          onChangeHandler={onChangeHandler}
          value={data.contact || ''}
          disabled={disabled}
          maxLength={50}
          style={{ marginTop: '1rem' }}
          validators={[requireMaxLength(50)]}
        />
      </FormCard>

      <FormCard
        sx={{
          width: CARD_WIDTH,
          height: CARD_HEIGHT,
        }}
      >
        <StyledDateForm
          disabled={disabled || !auth}
          start={data.start}
          stop={data.stop}
          onChangeHandler={onChangeHandler}
        />
      </FormCard>

      <FormCard sx={{ position: 'relative' }} xs={12}>
        <RelationsCardContent
          data={data}
          disabled={disabled}
          onChangeHandler={onChangeHandler}
        />
      </FormCard>

      <FormCard
        sx={{
          width: CARD_WIDTH,
          height: CARD_HEIGHT,
        }}
      >
        <StyledInputForm
          name="remark"
          title="Anmärkning process"
          onChangeHandler={onChangeHandler}
          value={data.remark || ''}
          /* title="Anmärkning" */
          multiline
          rows={12}
          disabled={disabled}
          maxLength={1000}
          validators={[requireMaxLength(1000)]}
        />
      </FormCard>
    </DefaultFormLayout>
  );
};

export default EditProcess;
