import {
  Box,
  Card,
  CardContent,
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid2,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';
import {
  Validator,
  requireMaxLength,
  requiredField,
  validate,
} from 'Common/validators';
import { SimpleChipSelect } from 'Scenarios/components/ChipSelect';
import Wrapper from 'Scenarios/components/Wrapper';
import { StyledDateForm } from 'Scenarios/nodes/components/forms/DateForms';
import { StyledInputForm } from 'Scenarios/nodes/components/forms/InputForm';
import SelectForm from 'Scenarios/nodes/components/forms/SelectForm';
import { actions as appactions } from 'Store/ducks/app';
import { selectErrors } from 'Store/ducks/app/selectors';
import { actions as elementsActions } from 'Store/ducks/elements';
import {
  selectDatatypes,
  selectEditElement,
  selectIsSameName,
  selectisDocumentType,
} from 'Store/ducks/elements/selectors';
import { useAppDispatch, useAppSelector } from 'Store/hooks';
import React from 'react';
import { DATA_TYPE } from './constants';

const CreateRegulation = () => {
  const dispatch = useAppDispatch();
  const formErrors = useAppSelector(selectErrors);
  const isDocumentType = useAppSelector(selectisDocumentType);
  const sameName = useAppSelector(selectIsSameName);
  const data = useAppSelector(selectEditElement);

  const onChangeHandler = (
    key: string,
    val: string | number | boolean,
    validators?: Validator[]
  ) => {
    dispatch(elementsActions.setEditElement({ ...data, [key]: val }));
    if (validators) {
      const error = validate(val as string, validators);
      if (error !== null) {
        dispatch(appactions.setErrors({ ...formErrors, [key]: error }));
      } else {
        dispatch(appactions.removeError(key));
      }
    }
  };

  return (
    <Wrapper>
      <Container sx={{ marginTop: '20px' }} maxWidth="sm">
        <Card elevation={10}>
          <CardContent>
            <Typography variant="h2">
              {data.id ? 'Redigera' : 'Skapa nytt'}
            </Typography>
            <ElementType />
            <StyledInputForm
              name="name"
              title="Benämning*"
              placeholder={
                isDocumentType ? 'Namnge dokumenttypen' : 'Namnge element'
              }
              disabled={data.status === 'ESTABLISHED'}
              required
              style={{ marginTop: '1rem' }}
              onChangeHandler={onChangeHandler}
              value={data.name}
              maxLength={50}
              validators={[requiredField(), requireMaxLength(50)]}
            />
            {sameName && (
              <Typography color={'red'}>Namnet existerar redan</Typography>
            )}
            <StyledInputForm
              name="description"
              title="Beskrivning*"
              placeholder={
                isDocumentType
                  ? 'Beskriv kort för användaren vad dokumenttypen ska användas till samt ge namnexempel'
                  : 'Beskriv för användaren hur elementet ska användas'
              }
              required
              style={{ marginTop: '1rem' }}
              onChangeHandler={onChangeHandler}
              value={data.description}
              multiline
              rows={3}
              maxLength={50}
              validators={[requiredField(), requireMaxLength(50)]}
            />

            {!isDocumentType && <ElementFields />}

            <StyledDateForm
              startLabel="Giltighetstid fr.o.m"
              stopLabel="Till"
              start={data.startDate}
              stop={data.endDate}
              onChangeHandler={(key: string, value: string) => {
                if (key === 'start') {
                  onChangeHandler('startDate', value);
                } else {
                  onChangeHandler('endDate', value);
                }
              }}
              style={{ marginTop: '1rem' }}
            />
          </CardContent>
        </Card>
      </Container>
    </Wrapper>
  );
};

function ElementFields() {
  const dispatch = useAppDispatch();
  const data = useAppSelector(selectEditElement);
  const dataTypes = useAppSelector(selectDatatypes);

  return (
    <Box sx={{ marginTop: '1rem' }}>
      <SelectForm
        title="Elementets datatyp*"
        header="Elementets datatyp*"
        disabled={data.status === 'ESTABLISHED'}
        menuItems={dataTypes
          .filter((type) => type.id < 6)
          .map((type) => ({
            label: DATA_TYPE[type.type],
            value: type.id,
          }))}
        onChange={(e) =>
          dispatch(
            elementsActions.setEditElement({
              ...data,
              datatype: e.target.value as number,
            })
          )
        }
        value={data.datatype}
        required
      />

      <Grid2
        columns={2}
        container
        sx={(theme) => ({
          marginTop: '1rem',
          border:
            theme.palette.mode === 'light'
              ? '1px solid rgba(0,0,0,0.14)'
              : '1px solid rgba(255,255,255,0.14)',
          borderRadius: '4px',
          padding: '20px',
        })}
      >
        <Grid2 size={{ xs: 1 }} width={1}>
          <FormControl>
            <FormLabel
              sx={(theme) => ({
                ...theme.typography.h5,
                color: theme.typography.h5.color,
                marginBottom: '0.5rem',
              })}
              id="nodeType-buttons-group-label"
            >
              Elementet gäller för
            </FormLabel>
            <RadioGroup
              aria-labelledby="nodeType-buttons-group-label"
              value={data.nodeType}
              name="nodeType-buttons-group"
              onChange={(event) => {
                dispatch(
                  elementsActions.setEditElement({
                    ...data,
                    nodeType: event.target.value as 'ISSUE' | 'DOCUMENT',
                  })
                );
              }}
            >
              <FormControlLabel
                value="ISSUE"
                control={<Radio size="small" />}
                label="Underserie"
              />

              <FormControlLabel
                value="DOCUMENT"
                control={<Radio size="small" />}
                label="Volym"
              />
            </RadioGroup>
          </FormControl>
        </Grid2>

        <Grid2 size={{ xs: 1 }} width={1}>
          <FormControl>
            <FormLabel
              sx={(theme) => ({
                ...theme.typography.h5,
                color: theme.typography.h5.color,
                marginBottom: '0.5rem',
              })}
              id="mandatory-buttons-group-label"
            >
              Obligatorisk
            </FormLabel>
            <RadioGroup
              aria-labelledby="mandatory-buttons-group-label"
              value={data.mandatory ? 'ja' : 'nej'}
              name="radio-buttons-group"
              onChange={(event) => {
                dispatch(
                  elementsActions.setEditElement({
                    ...data,
                    mandatory: event.target.value === 'ja',
                  })
                );
              }}
            >
              <FormControlLabel
                value="ja"
                control={<Radio size="small" />}
                label="Ja"
              />

              <FormControlLabel
                value="nej"
                control={<Radio size="small" />}
                label="Nej"
              />
            </RadioGroup>
          </FormControl>
        </Grid2>
      </Grid2>
    </Box>
  );
}

function ElementType() {
  const type = useAppSelector(selectisDocumentType);
  const editelement = useAppSelector(selectEditElement);
  const isDocumentType = useAppSelector(selectisDocumentType);
  const dispatch = useAppDispatch();
  if (editelement.id) {
    return (
      <Box pt={'20px'} pb={'20px'}>
        <Typography variant="h5" sx={{ pb: '20px' }}>
          {isDocumentType ? 'Dokumenttyp' : 'Eget element'}
        </Typography>
      </Box>
    );
  }
  return (
    <Box pt={'20px'} pb={'20px'}>
      <Typography variant="h5" sx={{ pb: '20px' }}>
        Välj
      </Typography>
      <SimpleChipSelect
        active={!type}
        label="Eget element"
        handleChipSelect={() =>
          dispatch(elementsActions.setisDocumentType(false))
        }
        sx={{ mr: '10px' }}
      ></SimpleChipSelect>
      <SimpleChipSelect
        active={type}
        label="Dokumenttyp"
        handleChipSelect={() =>
          dispatch(elementsActions.setisDocumentType(true))
        }
      ></SimpleChipSelect>
    </Box>
  );
}

export default CreateRegulation;
