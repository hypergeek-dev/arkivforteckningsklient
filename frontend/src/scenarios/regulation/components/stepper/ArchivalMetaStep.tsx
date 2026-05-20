import { InputLabel, OutlinedInput, Stack } from '@mui/material';
import { actions } from 'Store/ducks/regulation';
import {
  selectAtgard,
  selectGallringsgrund,
  selectRaFsReferens,
} from 'Store/ducks/regulation/selectors';
import { useAppDispatch, useAppSelector } from 'Store/hooks';
import React from 'react';

const ArchivalMetaStep = () => {
  const raFsReferens = useAppSelector(selectRaFsReferens);
  const gallringsgrund = useAppSelector(selectGallringsgrund);
  const atgard = useAppSelector(selectAtgard);
  const dispatch = useAppDispatch();

  return (
    <Stack spacing={2}>
      <div>
        <InputLabel>RA-FS referens</InputLabel>
        <OutlinedInput
          sx={{ width: '100%' }}
          inputProps={{ maxLength: 100 }}
          value={raFsReferens}
          onChange={(e) => dispatch(actions.setRaFsReferens(e.target.value))}
        />
      </div>
      <div>
        <InputLabel>Gallringsgrund</InputLabel>
        <OutlinedInput
          sx={{ width: '100%' }}
          multiline
          rows={3}
          inputProps={{ maxLength: 500 }}
          value={gallringsgrund}
          onChange={(e) => dispatch(actions.setGallringsgrund(e.target.value))}
        />
      </div>
      <div>
        <InputLabel>Åtgärd</InputLabel>
        <OutlinedInput
          sx={{ width: '100%' }}
          multiline
          rows={3}
          inputProps={{ maxLength: 500 }}
          value={atgard}
          onChange={(e) => dispatch(actions.setAtgard(e.target.value))}
        />
      </div>
    </Stack>
  );
};

export default ArchivalMetaStep;
