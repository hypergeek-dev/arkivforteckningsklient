import { InputLabel, OutlinedInput } from '@mui/material';
import { actions } from 'Store/ducks/regulation';
import { selectComment } from 'Store/ducks/regulation/selectors';
import { useAppDispatch, useAppSelector } from 'Store/hooks';
import React from 'react';

const CommentStep = () => {
  const comment = useAppSelector(selectComment);
  const dispatch = useAppDispatch();

  return (
    <div>
      <InputLabel>Kommentar</InputLabel>
      <OutlinedInput
        sx={{ width: '100%' }}
        multiline
        rows={5}
        aria-label="Kommentar"
        inputProps={{ maxLength: 300 }}
        id={`filledInput-kommentar`}
        value={comment}
        onChange={(e) => dispatch(actions.setComment(e.target.value))}
      />
    </div>
  );
};

export default CommentStep;
