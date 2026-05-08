import { InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { Status } from 'Models/typed';
import { actions } from 'Store/ducks/IHPToolStructure/reducer';
import { selectStatusFilter } from 'Store/ducks/IHPToolStructure/selectors';
import { useAppDispatch, useAppSelector } from 'Store/hooks';
import * as React from 'react';

const StatusFilter = () => {
  const status = useAppSelector(selectStatusFilter);
  const dispatch = useAppDispatch();

  const handleStatusChange = (event: SelectChangeEvent) => {
    if (event.target.value === 'Alla') {
      dispatch(actions.setStatusFilter('Alla'));
    } else {
      dispatch(actions.setStatusFilter(event.target.value as Status));
    }
  };

  return (
    <div>
      <InputLabel htmlFor="status-select" id="label">
        <b>Status</b>
      </InputLabel>
      <Select
        inputProps={{ id: 'status-select' }}
        sx={(theme) => ({
          minWidth: '200px',
          backgroundColor: theme.palette.background.paper,
          marginTop: { xs: 0, md: '10px' },
        })}
        onChange={handleStatusChange}
        labelId="label"
        value={status || 'Alla'}
      >
        <MenuItem value="Alla">
          <em>Alla statusar</em>
        </MenuItem>
        <MenuItem value="utkast">Utkast</MenuItem>
        <MenuItem value="klar">Klar</MenuItem>
        <MenuItem value="godkand">Godkänd</MenuItem>
        <MenuItem value="faststalld">Fastställd</MenuItem>
      </Select>
    </div>
  );
};
export default StatusFilter;
