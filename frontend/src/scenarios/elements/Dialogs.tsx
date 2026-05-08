import { Button } from '@mui/material';
import StandardDialog from 'Scenarios/components/StandardDialog';
import { actions } from 'Store/ducks/elements';
import CreateElement from './CreateElement';
import React from 'react';
import { useAppDispatch, useAppSelector } from 'Store/hooks';
import {
  selectCompleteElement,
  selectEditElement,
  selectOpenEditDialog,
} from 'Store/ducks/elements/selectors';
import { selectAuthUser } from 'Store/ducks/user/selectors';

const Dialogs: React.FC = () => {
  const open = useAppSelector(selectOpenEditDialog);
  const editelement = useAppSelector(selectEditElement);
  const complete = useAppSelector(selectCompleteElement);
  const authorized = useAppSelector(selectAuthUser);
  const dispatch = useAppDispatch();
  return (
    <div>
      <StandardDialog
        fullScreen
        toolBarContent={
          <div>
            {complete && editelement.status === 'DRAFT' && authorized && (
              <Button
                sx={{ marginRight: '1rem' }}
                onClick={() => {
                  dispatch(actions.saveAndEstablish());
                  dispatch(actions.setOpenEditDialog(false));
                }}
                color="primary"
                variant="contained"
                aria-label="Fastställ"
              >
                Fastställ
              </Button>
            )}
            <Button
              disabled={!complete}
              onClick={() => {
                dispatch(actions.save());
                dispatch(actions.setOpenEditDialog(false));
              }}
              color="primary"
              variant="outlined"
              aria-label="Spara utkast"
            >
              {editelement.status === 'DRAFT'
                ? 'Spara utkast'
                : 'Spara fastställd'}
            </Button>
          </div>
        }
        handleClose={() => {
          dispatch(actions.setOpenEditDialog(false));
        }}
        open={open}
      >
        <CreateElement />
      </StandardDialog>
    </div>
  );
};

export default Dialogs;
