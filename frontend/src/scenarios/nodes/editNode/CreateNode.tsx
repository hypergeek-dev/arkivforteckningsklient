/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  Button,
  FormControlLabel,
  Radio,
  RadioGroup,
} from '@mui/material';
import { nodeTypeMapper } from 'Common/helper';
import { validate } from 'Common/validators';
import EditDialog from 'Scenarios/components/dialogs/EditDialog';
import { actions } from 'Store/ducks/app/reducer';
import {
  selectCreateNode,
  selectEditNode,
  selectErrors,
  selectOpenCreate,
} from 'Store/ducks/app/selectors';
import { useAppDispatch, useAppSelector } from 'Store/hooks';
import React from 'react';
import FormSwitch from './FormSwitch';

const CreateNode: React.FC = () => {
  const createNode = useAppSelector(selectCreateNode);
  const dispatch = useAppDispatch();
  const open = useAppSelector(selectOpenCreate);
  const data = useAppSelector(selectEditNode);
  const formErrors = useAppSelector(selectErrors);

  const hanteraAndring = (key: string, value: any, validators: any) => {
    if (data) {
      // set data
      dispatch(actions.setEditNode({ ...data, [key]: value }));
      // handle errors
      if (validators) {
        const error = validate(value, validators);
        if (error !== null) {
          dispatch(actions.setErrors({ [key]: error }));
        } else {
          dispatch(actions.removeError(key));
        }
      }
    }
  };

  function openDialog(command: 'OPEN' | 'CLOSE') {
    if (command === 'CLOSE') dispatch(actions.setEditCompare('EDIT'));
    dispatch(actions.setOpenCreate(command));
    dispatch(actions.clearErrors());
  }

  if (!createNode || !data) {
    return null;
  }

  const { nodeName } = data;

  return (
    <EditDialog
      open={open === 'OPEN'}
      handleClose={() => openDialog('CLOSE')}
      endContent={
        <Button
          disabled={Object.keys(formErrors).length !== 0}
          autoFocus
          color="primary"
          variant="contained"
          aria-label="Spara"
          onClick={() => {
            dispatch(actions.createNode({ data, nodeName }));
            openDialog('CLOSE');
          }}
        >
          Skapa {nodeTypeMapper(nodeName).name}
        </Button>
      }
    >
      <>
        {(createNode.nodeName === 'oanode' ||
          createNode.nodeName === 'pgnode') &&
          parent && (
            <Box marginX="auto" marginTop="1rem">
              <RadioGroup
                aria-label="Serie eller arkiv"
                defaultValue="processnode"
                value={nodeName}
                name="arkiv-serie"
                sx={{ flexDirection: 'row' }}
                onChange={(e: any) => {
                  dispatch(
                    actions.setEditNode({
                      ...data,
                      nodeName: e.target.value,
                    })
                  );
                }}
              >
                <FormControlLabel
                  value="processnode"
                  control={<Radio size="small" />}
                  label="Skapa serie"
                />
                <FormControlLabel
                  value="pgnode"
                  control={<Radio size="small" />}
                  label={'Skapa arkiv'}
                />
              </RadioGroup>
            </Box>
          )}
      </>
      <FormSwitch
        data={data}
        disabled={false}
        nodeName={nodeName}
        onChangeHandler={hanteraAndring}
      />
    </EditDialog>
  );
};

export default CreateNode;
