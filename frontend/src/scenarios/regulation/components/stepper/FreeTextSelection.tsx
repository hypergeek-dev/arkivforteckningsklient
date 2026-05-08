import { InputLabel, OutlinedInput } from '@mui/material';
import { actions, selectors } from 'Store/ducks/regulation';
import { useAppDispatch, useAppSelector } from 'Store/hooks';
import React from 'react';

const DummTextSelection: React.FC = () => {
  const text = useAppSelector(selectors.selectDummyText);
  const dispatch = useAppDispatch();

  if (typeof text === 'undefined') {
    return null;
  }

  return (
    <div key="beskrivning">
      <InputLabel>Referensregel villkor*</InputLabel>
      <OutlinedInput
        required
        sx={{ width: '100%' }}
        multiline
        rows={10}
        aria-label="Dummyregel"
        inputProps={{ maxLength: 300 }}
        id={`filledInput-Dummyregel`}
        value={text}
        onChange={(e) => dispatch(actions.setDummyText(e.target.value))}
      />
    </div>
  );
};

export const DummyName = () => {
  const name = useAppSelector(selectors.selectDummyName);
  const dispatch = useAppDispatch();
  return (
    <div key="dummyname">
      <InputLabel>Namn*</InputLabel>
      <OutlinedInput
        required
        sx={{ width: '100%' }}
        aria-label="Dummyregel"
        inputProps={{ maxLength: 100 }}
        id={`filledInput-regelnamn`}
        value={name}
        onChange={(e) => dispatch(actions.setDummyName(e.target.value))}
      />
    </div>
  );
};

export default React.memo(DummTextSelection);
