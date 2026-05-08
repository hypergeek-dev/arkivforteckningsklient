import SecurityIcon from '@mui/icons-material/Security';
import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Typography,
  useTheme,
} from '@mui/material';
import SelectForm from 'Scenarios/nodes/components/forms/SelectForm';
import React, { useEffect, useState } from 'react';

import { DocumentTypeNodeDto } from 'Models/index';
import BooleanForm from '../components/forms/BooleanForm';
import { Validator, requireMaxLength, requiredField } from 'Common/validators';
import { StyledInputForm } from '../components/forms/InputForm';
import { informationsecurityclassAlternatives } from 'Common/constants';

type InfoClassCardContentProps = {
  disabled: boolean;
  data: DocumentTypeNodeDto;
  onChangeHandler: (
    key: string,
    value: unknown,
    validators?: Validator[]
  ) => void;
};

const InfoClassCardContent: React.FC<InfoClassCardContentProps> = ({
  disabled,
  data,
  onChangeHandler,
}) => {
  const currentInfoClass = Number(data?.informationsecurityclass);
  const currentProtection =
    currentInfoClass > 4 ? 'sakerhetsskydd' : 'verksamhetsskydd';

  const [protectionType, setProtectionType] =
    useState<string>(currentProtection);

  const menuAlternatives =
    protectionType === 'sakerhetsskydd'
      ? informationsecurityclassAlternatives.slice(5)
      : informationsecurityclassAlternatives.slice(0, 5);

  useEffect(() => {
    if (data.secrecy) {
      onChangeHandler('secrecyLawsection', data.secrecyLawsection || '', [
        (requireMaxLength(1000), requiredField()),
      ]);
    } else {
      onChangeHandler('secrecyLawsection', data.secrecyLawsection === ' ');
    }
  }, [data.secrecy]);

  return (
    <div
      style={{
        display: 'grid',
        height: '100%',
        gap: '2rem',
        gridTemplateColumns: '1fr 1fr',
      }}
    >
      <div
        style={{
          borderRadius: '1rem',
          border: '1px solid #808080',
          height: '300px',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          paddingInline: '2rem',
        }}
      >
        <InfoClassCardHeader />
        <div style={{ marginTop: '3rem' }}>
          <FormControl
            sx={(theme) => ({
              '.MuiFormControlLabel-label': { ...theme.typography.h5 },
            })}
            disabled={disabled}
          >
            <FormLabel id="infoclass-buttons-group-label">
              Alternativ för skydd av handlingar
            </FormLabel>
            <RadioGroup
              aria-labelledby="infoclass-buttons-group-label"
              defaultValue={protectionType}
              name="radio-buttons-group"
              onChange={(event) => setProtectionType(event.target.value)}
            >
              <FormControlLabel
                value="verksamhetsskydd"
                control={<Radio size="small" />}
                label="Verksamhetsskydd"
              />
              <FormControlLabel
                value="sakerhetsskydd"
                control={<Radio size="small" />}
                label="Säkerhetsskydd"
              />
            </RadioGroup>
          </FormControl>

          <SelectForm
            title="Välj ett alternativ"
            menuItems={menuAlternatives}
            onChange={(e) => {
              onChangeHandler('informationsecurityclass', e.target.value);
            }}
            value={data.informationsecurityclass}
            disabled={disabled}
            required
          />
        </div>
      </div>

      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <BooleanForm
          header="Hanterar personuppgifter"
          disabled={disabled}
          value={data.personalData}
          trueLabel="Ja"
          falseLabel="Nej"
          onChangeHandler={(e) => onChangeHandler('personalData', e)}
        />
        <BooleanForm
          onChangeHandler={(e) => {
            onChangeHandler('secrecy', e);
          }}
          trueLabel="Ja"
          falseLabel="Nej"
          value={data.secrecy}
          header="Sekretess"
          disabled={disabled}
        />

        <StyledInputForm
          name="secrecyLawsection"
          onChangeHandler={onChangeHandler}
          value={data.secrecyLawsection || ''}
          title={`Lagrum sekretess ${data.secrecy ? '*' : ''} `}
          required={data.secrecy}
          multiline
          rows={7}
          disabled={!data.secrecy || disabled}
          style={{ marginTop: '1rem' }}
          maxLength={1000}
          validators={[requireMaxLength(1000), requiredField()]}
        />
      </div>
    </div>
  );
};

export default InfoClassCardContent;

const InfoClassCardHeader = () => {
  const theme = useTheme();
  return (
    <Box
      style={{
        backgroundColor: theme.palette.background.paper,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '1rem',
        margin: '-0.75rem auto',
        paddingInline: '0.5rem',
      }}
    >
      <Typography variant="h3" fontWeight={500} fontSize={'1.25rem'}>
        <SecurityIcon /> Informationsklassning
      </Typography>
    </Box>
  );
};
