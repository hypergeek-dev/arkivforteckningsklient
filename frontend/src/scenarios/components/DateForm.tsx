import { SxProps, Theme } from '@mui/material';
import {
  DatePicker,
  DateValidationError,
  LocalizationProvider,
} from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { STANDARD_DATE_FORMAT } from 'Models/dataObjects';
import moment from 'moment';
import React from 'react';

interface Props {
  id: string;
  date?: string;
  maxDate?: string;
  minDate?: string;
  disabled?: boolean;
  label: string;
  onChangeHandler: (value: string) => void;
  onError?: (e: DateValidationError) => void;
  labelStyle?: SxProps<Theme>;
}

const DateForm: React.FC<Props> = ({
  id,
  date,
  onError,
  maxDate,
  minDate,
  disabled,
  label,
  onChangeHandler,
  labelStyle,
}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <DatePicker
        format={STANDARD_DATE_FORMAT}
        maxDate={maxDate ? moment(maxDate) : undefined}
        minDate={minDate ? moment(minDate) : undefined}
        disabled={disabled}
        onError={onError}
        value={date ? moment(date) : null}
        onChange={(v) => {
          if (v) onChangeHandler(moment(v).format('YYYY-MM-DDT12:00:00Z'));
        }}
        slotProps={{
          textField: {
            id: id,
            label: label,
            InputLabelProps: { htmlFor: id, sx: labelStyle },
            sx: {
              backgroundColor: 'background.paper',
              borderRadius: '4px',
            },
          },
        }}
      />
    </LocalizationProvider>
  );
};
export default DateForm;
