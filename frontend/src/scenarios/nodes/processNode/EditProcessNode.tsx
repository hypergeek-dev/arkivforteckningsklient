import { requireDateFormat, requireMaxLength, requiredField } from 'Common/validators';
import { ProcessTypeNodeDto } from 'Models/index';
import RelationsCardContent from 'Scenarios/components/relations/RelationsCardContent';
import { StyledDateForm } from 'Scenarios/nodes/components/forms/DateForms';
import DefaultFormLayout from 'Scenarios/nodes/components/forms/DefaultFormLayout';
import { StyledInputForm } from 'Scenarios/nodes/components/forms/InputForm';
import { Stack } from '@mui/material';
import { selectAuthUser } from 'Store/ducks/user/selectors';
import { useAppSelector } from 'Store/hooks';
import React from 'react';
import FormCard from '../components/forms/FormCard';
import ImportMetadataCard from '../components/ImportMetadataCard';
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
      header={`Benämning serie ${disabled ? '' : '*'}`}
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
          title="Anmärkning serie"
          onChangeHandler={onChangeHandler}
          value={data.remark || ''}
          multiline
          rows={12}
          disabled={disabled}
          maxLength={1000}
          validators={[requireMaxLength(1000)]}
        />
      </FormCard>

      <FormCard sx={{ width: CARD_WIDTH }}>
        <Stack spacing={2}>
          <StyledInputForm
            name="seriesignum"
            title="Seriesignum (t.ex. A1, F2:a)"
            onChangeHandler={onChangeHandler}
            value={data.seriesignum || ''}
            disabled={disabled}
            maxLength={20}
            validators={[requireMaxLength(20)]}
          />
          <StyledInputForm
            name="serieRubrik"
            title="Serierubrik"
            onChangeHandler={onChangeHandler}
            value={data.serieRubrik || ''}
            disabled={disabled}
            maxLength={500}
            validators={[requireMaxLength(500)]}
          />
          <StyledInputForm
            name="forvaringsplats"
            title="Förvaringsplats"
            onChangeHandler={onChangeHandler}
            value={data.forvaringsplats || ''}
            disabled={disabled}
            maxLength={300}
            validators={[requireMaxLength(300)]}
          />
          <StyledInputForm
            name="omfang"
            title="Omfång (t.ex. 3 hyllmeter)"
            onChangeHandler={onChangeHandler}
            value={data.omfang || ''}
            disabled={disabled}
            maxLength={200}
            validators={[requireMaxLength(200)]}
          />
          <StyledInputForm
            name="handlingarFran"
            title="Handlingar fr.o.m. (ÅÅÅÅ-MM-DD)"
            onChangeHandler={onChangeHandler}
            value={data.handlingarFran || ''}
            disabled={disabled}
            maxLength={10}
            validators={[requireDateFormat()]}
          />
          <StyledInputForm
            name="handlingarTill"
            title="Handlingar t.o.m. (ÅÅÅÅ-MM-DD)"
            onChangeHandler={onChangeHandler}
            value={data.handlingarTill || ''}
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
          value={data.innehall || ''}
          multiline
          rows={8}
          disabled={disabled}
          maxLength={5000}
          validators={[requireMaxLength(5000)]}
        />
      </FormCard>
      <ImportMetadataCard nodeType="processnode" id={data.id} />
    </DefaultFormLayout>
  );
};

export default EditProcess;
