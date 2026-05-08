import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid2,
  SxProps,
  TextField,
  Theme,
} from '@mui/material';
import { Validator } from 'Common/validators';
import React, { useState } from 'react';
import DateForm from '../../../components/DateForm';

interface Props {
  start?: string;
  stop?: string;
  disabled?: boolean;
  onChangeHandler: (
    key: string,
    value: string,
    validators?: Validator[]
  ) => void;
  labelStyle?: SxProps<Theme>;
  startLabel?: string;
  stopLabel?: string;
  style?: React.CSSProperties;
}

const DateFormCard: React.FC<Props> = ({
  start,
  stop,
  disabled,
  onChangeHandler,
  labelStyle,
  startLabel = 'Giltighetstid fr.o.m *',
  stopLabel = 'Till',
  style,
}) => {
  const [forTimeBeing, setForTimeBeing] = useState(!stop || stop?.length === 0);
  return (
    <Grid2 spacing={1} container sx={style}>
      <Grid2 size={{ xs: 6 }}>
        <DateForm
          onError={(e) => onChangeHandler('start', start ?? '', [{ type: e }])}
          label={startLabel}
          labelStyle={labelStyle}
          disabled={disabled}
          onChangeHandler={(e) => onChangeHandler('start', e)}
          date={start}
          maxDate={stop}
          id={`dateFrom`}
        />
      </Grid2>
      <Grid2 size={{ xs: 6 }}>
        {!forTimeBeing ? (
          <DateForm
            onError={(e) => onChangeHandler('stop', stop ?? '', [{ type: e }])}
            label={stopLabel}
            labelStyle={labelStyle}
            disabled={disabled}
            onChangeHandler={(e) => onChangeHandler('stop', e)}
            date={stop}
            minDate={start}
            id={`dateTo`}
          />
        ) : (
          <TextField
            label={stopLabel}
            sx={(theme) => ({
              '.MuiFormLabel-root.MuiInputLabel-root.Mui-disabled': {
                ...theme.typography.h5,
                color: disabled ? '#c0c0c0' : theme.typography.h5.color,
                marginBottom: '0.5rem',
              },
              '.MuiInputBase-root.MuiOutlinedInput-root legend': {
                width: 0,
              },
            })}
            disabled
            value="TILLSVIDARE"
          >
            Tillsvidare
          </TextField>
        )}
      </Grid2>
      <Grid2
        sx={{
          display: 'flex',
          justifyContent: 'flex-start',
          marginLeft: 'auto',
        }}
        size={{ xs: 6 }}
      >
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                disabled={disabled}
                checked={forTimeBeing}
                onChange={(e) => {
                  onChangeHandler('stop', '');
                  setForTimeBeing(e.target.checked);
                }}
              />
            }
            label="Tillsvidare"
          />
        </FormGroup>
      </Grid2>
    </Grid2>
  );
};

export default DateFormCard;

export const StyledDateForm: React.FC<Props> = ({
  style,
  disabled,
  ...rest
}) => (
  <DateFormCard
    labelStyle={(theme) => ({
      ...theme.typography.h5,
      color: disabled ? '#c0c0c0' : theme.typography.h5.color,
      marginBottom: '0.5rem',
    })}
    disabled={disabled}
    style={style}
    {...rest}
  />
);
