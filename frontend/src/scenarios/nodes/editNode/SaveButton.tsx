import { SaveSharp } from '@mui/icons-material';
import { Button } from '@mui/material';
import { requiredFullfilled } from 'Common/helper';
import { CommonNode, Status } from 'Models/typed';
import { actions } from 'Store/ducks/app';
import { selectErrors } from 'Store/ducks/app/selectors';
import { useAppDispatch, useAppSelector } from 'Store/hooks';
import isEqual from 'lodash.isequal';
import React from 'react';

type SaveButtonProps = {
  originalData?: CommonNode;
  data: CommonNode;
  savedStatus: Status;
  openDialog: (command: 'OPEN' | 'CLOSE') => void;
};

export default function SaveButton({
  originalData,
  data,
  savedStatus,
  openDialog,
}: Readonly<SaveButtonProps>): JSX.Element {
  const dispatch = useAppDispatch();
  const formErrors = useAppSelector(selectErrors);

  return (
    <Button
      disabled={
        savedStatus !== 'utkast' ||
        !requiredFullfilled(data) ||
        isEqual(data, originalData) ||
        Object.keys(formErrors).length > 0
      }
      startIcon={<SaveSharp />}
      autoFocus
      color="primary"
      variant="contained"
      aria-label="Uppdatera"
      onClick={() => {
        if (data) {
          dispatch(
            actions.updateNode({
              data,
              nodeName: data.nodeName,
            })
          );
        }
        openDialog('CLOSE');
      }}
    >
      Spara
    </Button>
  );
}
