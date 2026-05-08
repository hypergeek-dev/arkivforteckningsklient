import { Grid2 } from '@mui/material';
import Box from '@mui/material/Box';
import { STANDARD_ISO_FORMAT } from 'Models/dataObjects';
import moment from 'moment';
import * as React from 'react';
import DateForm from './DateForm';

interface DateRangeProps {
  setDate: (date: { from: string; to: string }) => void;
  date: { to: string; from: string };
  style?: React.CSSProperties;
}

const DateRange: React.FC<DateRangeProps> = ({ setDate, date, style }) => {
  return (
    <Box
      sx={{
        width: '100%',
        display: 'grid',
        justifyContent: 'center',
        ...style,
      }}
    >
      <Grid2 gap={2} container>
        <Grid2>
          <DateForm
            id="date-from"
            maxDate={date.to}
            date={date.from}
            onChangeHandler={(v) => {
              const from = moment(v).startOf('day').format(STANDARD_ISO_FORMAT);
              const to = moment(date.to)
                .endOf('day')
                .format(STANDARD_ISO_FORMAT);
              setDate({ to, from });
            }}
            label="Från"
          />
        </Grid2>
        <Grid2>
          <DateForm
            id="date-to"
            minDate={date.from}
            date={date.to}
            onChangeHandler={(v) => {
              const from = moment(date.from)
                .startOf('day')
                .format(STANDARD_ISO_FORMAT);

              const to = moment(v).endOf('day').format(STANDARD_ISO_FORMAT);
              setDate({ to, from });
            }}
            label="Till"
          />
        </Grid2>
      </Grid2>
    </Box>
  );
};
export default DateRange;
