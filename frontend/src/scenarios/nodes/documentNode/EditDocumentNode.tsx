/* eslint-disable @typescript-eslint/no-explicit-any */
import { requireMaxLength, requiredField } from 'Common/validators';
import { DocumentTypeNodeDto } from 'Models/index';
import BooleanForm from 'Scenarios/nodes/components/forms/BooleanForm';
import DefaultFormLayout from 'Scenarios/nodes/components/forms/DefaultFormLayout';
import { StyledInputForm } from 'Scenarios/nodes/components/forms/InputForm';
import React from 'react';
import { StyledDateForm } from '../components/forms/DateForms';
import FormCard from '../components/forms/FormCard';
import RegulationStepper from '../components/regulationStepper/RegulationStepper';
import { CARD_HEIGHT } from '../ksNode/EditKsNode';
import InfoClassCardContent from './InfoClassCardContent';
import { steps } from '../components/regulationStepper/Steps';
import EgnaElementCard from '../components/EgnaElementCard';

type Props = {
  data: DocumentTypeNodeDto;
  onChangeHandler: (key: string, value: any, validators?: any) => void;
  disabled: boolean;
};

const EditDocumentNode: React.FC<Props> = ({
  data,
  onChangeHandler,
  disabled,
}) => (
  <DefaultFormLayout
    node={data}
    disabled={disabled}
    header={`Benämning handlingstyp  ${disabled ? '' : '*'}`}
    onChange={onChangeHandler}
  >
    <FormCard sx={{ height: CARD_HEIGHT }} xs={2}>
      <InfoClassCardContent
        disabled={disabled}
        data={data}
        onChangeHandler={onChangeHandler}
      />
    </FormCard>

    <FormCard sx={{ height: CARD_HEIGHT }} xs={3}>
      <RegulationStepper
        initialStep={data.assignedRules.length != 0 ? steps.length - 1 : 0}
      />
    </FormCard>

    <FormCard sx={{ height: CARD_HEIGHT }} xs={1}>
      <StyledInputForm
        name="remark"
        onChangeHandler={onChangeHandler}
        value={data.remark ?? ''}
        title="Anmärkning"
        multiline
        rows={12}
        disabled={disabled}
        maxLength={1000}
        validators={[requireMaxLength(1000)]}
      />
    </FormCard>

    <FormCard sx={{ height: CARD_HEIGHT }} xs={1}>
      <BooleanForm
        header="Registreras"
        disabled={disabled}
        value={data.register}
        trueLabel="Ja"
        falseLabel="Nej"
        onChangeHandler={(e) => onChangeHandler('register', e)}
      />
      <BooleanForm
        header="Krav på underskrift"
        disabled={disabled}
        value={data.signatureRequired}
        trueLabel="Ja"
        falseLabel="Nej"
        onChangeHandler={(e) => {
          onChangeHandler('signatureRequired', e);
        }}
      />
      <StyledInputForm
        name="keepingUnit"
        required
        title={`Förvaringsenhet ${disabled ? '' : '*'}`}
        onChangeHandler={onChangeHandler}
        style={{ marginTop: '1rem' }}
        value={data.keepingUnit}
        disabled={disabled}
        multiline
        maxLength={300}
        validators={[requiredField(), requireMaxLength(300)]}
      />
      <StyledDateForm
        disabled={disabled}
        start={data.start}
        stop={data.stop}
        onChangeHandler={onChangeHandler}
        style={{ marginTop: '1rem' }}
      />
    </FormCard>
    <FormCard sx={{ height: CARD_HEIGHT }} xs={1}>
      <EgnaElementCard
        disabled={disabled}
        id={data.id}
        nodeName={'documentnode'}
        list={data.assignedElements}
      />
    </FormCard>
  </DefaultFormLayout>
);

export default EditDocumentNode;
