import { DialogContent, Divider, Grid2, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import DateForm from 'Scenarios/components/DateForm';
import StandardDialog from 'Scenarios/components/StandardDialog';
import {
  actions,
  SearchDate,
  TimeIntervallSelect,
} from 'Store/ducks/eventlogg/reducer';
import {
  selectedIntervall,
  selectSearchDate,
} from 'Store/ducks/eventlogg/selectors';
import { useAppDispatch, useAppSelector } from 'Store/hooks';
import moment from 'moment';
import React, { useState } from 'react';

const intervall: TimeIntervallSelect[] = [
  { intervall: 7, label: 'Senaste veckan' },
  { intervall: 14, label: 'Senaste 2 veckorna' },
  { intervall: 30, label: 'Senaste månaden' },
  { intervall: 90, label: 'Senaste 3 månaderna' },
  { intervall: 180, label: 'Senaste halvåret' },
  { intervall: 365, label: 'Senaste året' },
];

export default function TimeSelect() {
  const [openDate, setOpenDate] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const date = useAppSelector(selectSearchDate);
  const days = useAppSelector(selectedIntervall);

  const setDate = (v: SearchDate) => {
    dispatch(actions.setSearchDate(v));
  };

  const handleChange = (event: SelectChangeEvent) => {
    const value = event.target.value;
    if (value !== 'custom') {
      const timeBetween = {
        from: moment().subtract(value, 'days').format('YYYY-MM-DD'),
        to: moment().format('YYYY-MM-DD'),
      };

      dispatch(actions.fetchEventsBetween(timeBetween));
    } else {
      setOpenDate(true);
    }
    const newIntervall = intervall.find((i) => '' + i.intervall === '' + value);
    if (newIntervall) dispatch(actions.setIntervall(newIntervall));
  };

  return (
    <Box sx={{ minWidth: 250 }}>
      <FormControl fullWidth>
        <Select
          id="timeselect"
          value={`${days.intervall}`}
          onChange={handleChange}
        >
          {intervall.map((i) => (
            <MenuItem key={i.intervall} value={i.intervall}>
              {i.label}
            </MenuItem>
          ))}
          <Divider />
          <MenuItem value={'custom'}>Anpassat tidsintervall</MenuItem>
        </Select>
      </FormControl>
      <StandardDialog open={openDate} handleClose={() => setOpenDate(false)}>
        <DialogContent sx={{ minWidth: '400px' }}>
          <Grid2 gap={2} container>
            <Grid2 size={{ xs: 12 }}>
              <Typography variant="h4">Anpassat tidsintervall</Typography>
            </Grid2>
            <Grid2 size={{ xs: 5 }}>
              <DateForm
                date={date.from}
                onChangeHandler={(v) => {
                  const from = moment(v).format('YYYY-MM-DD');
                  setDate({ ...date, from });
                }}
                label="Från"
                id="from"
              />
            </Grid2>
            <Grid2 size={{ xs: 6 }}>
              <DateForm
                date={date.to}
                onChangeHandler={(v) => {
                  const to = moment(v).format('YYYY-MM-DD');
                  setDate({ ...date, to });
                }}
                label="Till"
                id="to"
              />
            </Grid2>
          </Grid2>
        </DialogContent>
      </StandardDialog>
    </Box>
  );
}
