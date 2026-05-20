import { requireDateFormat, requireMaxLength, requiredField } from 'Common/validators';
import { IssueTypeNodeDto } from 'Models/index';
import TwoBooleanFormCard from 'Scenarios/nodes/components/forms/BooleanForm';
import { StyledDateForm } from 'Scenarios/nodes/components/forms/DateForms';
import DefaultFormLayout from 'Scenarios/nodes/components/forms/DefaultFormLayout';
import { Stack } from '@mui/material';
import React from 'react';
import RelationsCardContent from '../../components/relations/RelationsCardContent';
import FormCard from '../components/forms/FormCard';
import { StyledInputForm } from '../components/forms/InputForm';
import { CARD_HEIGHT, CARD_WIDTH } from '../ksNode/EditKsNode';
import EgnaElementCard from '../components/EgnaElementCard';
import ImportMetadataCard from '../components/ImportMetadataCard';

type Props = {
  data: IssueTypeNodeDto;
  onChangeHandler: (
    key: string,
    value: string | number | boolean,
    validators?: Validator[]
  ) => void;
  disabled: boolean;
};

const EditMatter: React.FC<Props> = ({ data, onChangeHandler, disabled }) => {
  return (
    <DefaultFormLayout
      node={data}
      disabled={disabled}
      header={`Benämning underserie ${disabled ? '' : '*'}`}
      onChange={onChangeHandler}
    >
      <FormCard sx={{ width: CARD_WIDTH, height: CARD_HEIGHT }}>
        <StyledInputForm
          name="remark"
          onChangeHandler={onChangeHandler}
          value={data.remark ?? ''}
          title="Anmärkning underserie"
          multiline
          rows={12}
          disabled={disabled}
          maxLength={1000}
          validators={[requireMaxLength(1000)]}
        />
      </FormCard>

      <FormCard sx={{ width: CARD_WIDTH, height: CARD_HEIGHT }}>
        <TwoBooleanFormCard
          header="Registreras"
          disabled={disabled}
          value={data.register}
          trueLabel="Ja"
          falseLabel="Nej"
          onChangeHandler={(e) => onChangeHandler('register', e)}
        />
        <StyledInputForm
          name="keepingUnit"
          title={`Förvaringsenhet ${disabled ? '' : '*'}`}
          required
          style={{ marginTop: '1rem' }}
          onChangeHandler={onChangeHandler}
          value={data.keepingUnit}
          disabled={disabled}
          multiline
          maxLength={300}
          validators={[requiredField(), requireMaxLength(300)]}
        />
        <StyledDateForm
          disabled={disabled}
          startLabel="Giltighetstid fr.o.m"
          stopLabel="Till"
          start={data.start}
          stop={data.stop}
          onChangeHandler={onChangeHandler}
          style={{ marginTop: '1rem' }}
        />
      </FormCard>

      <FormCard sx={{ width: CARD_WIDTH }}>
        <Stack spacing={2}>
          <StyledInputForm
            name="underseriesignum"
            title="Underseriesignum (t.ex. A1a)"
            onChangeHandler={onChangeHandler}
            value={data.underseriesignum ?? ''}
            disabled={disabled}
            maxLength={20}
            validators={[requireMaxLength(20)]}
          />
          <StyledInputForm
            name="handlingarFran"
            title="Handlingar fr.o.m. (ÅÅÅÅ-MM-DD)"
            onChangeHandler={onChangeHandler}
            value={data.handlingarFran ?? ''}
            disabled={disabled}
            maxLength={10}
            validators={[requireDateFormat()]}
          />
          <StyledInputForm
            name="handlingarTill"
            title="Handlingar t.o.m. (ÅÅÅÅ-MM-DD)"
            onChangeHandler={onChangeHandler}
            value={data.handlingarTill ?? ''}
            disabled={disabled}
            maxLength={10}
            validators={[requireDateFormat()]}
          />
        </Stack>
      </FormCard>

      <FormCard sx={{ width: CARD_WIDTH }}>
        <StyledInputForm
          name="innehall"
          title="Innehållsbeskrivning"
          onChangeHandler={onChangeHandler}
          value={data.innehall ?? ''}
          multiline
          rows={8}
          disabled={disabled}
          maxLength={5000}
          validators={[requireMaxLength(5000)]}
        />
      </FormCard>

      <FormCard sx={{ position: 'relative' }} xs={12}>
        <RelationsCardContent
          data={data}
          disabled={disabled}
          onChangeHandler={onChangeHandler}
        />
      </FormCard>
      <FormCard sx={{ height: CARD_HEIGHT }} xs={1}>
        <EgnaElementCard
          disabled={disabled}
          id={data.id}
          nodeName={'issuenode'}
          list={data.assignedElements}
        />
      </FormCard>
      <ImportMetadataCard nodeType="issuenode" id={data.id} />
    </DefaultFormLayout>
  );
};

export default EditMatter;
