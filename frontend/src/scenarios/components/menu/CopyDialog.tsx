import { Box, Button, Select, Typography } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import * as React from 'react';

import StandardDialog from '../StandardDialog';
import { useAppDispatch, useAppSelector } from 'Store/hooks';
import { actions } from 'Store/ducks/app';
import { NodeName } from 'Models/typed';
import { selectCopyDialog } from 'Store/ducks/app/selectors';

export type CopyDialogProps = {
  open: boolean;
  title: string;
  text: string;
  id: string;
  nodeName: NodeName;
  copyStruct: boolean;
};

const CopyDialog = () => {
  const [value, setValue] = React.useState(1);
  const openCopyDialog = useAppSelector(selectCopyDialog);
  const dispatch = useAppDispatch();

  const send = () => {
    const { id, nodeName, copyStruct } = openCopyDialog;
    dispatch(actions.closeCopyDialog());
    dispatch(actions.copyNode({ id, nodeName, copyStruct }));
  };

  return (
    <StandardDialog
      toolBarContent={
        <Box
          sx={{ width: '100%', display: 'flex', justifyContent: 'flex-start' }}
        >
          <Typography variant="h4">{openCopyDialog.title}</Typography>
        </Box>
      }
      open={openCopyDialog.open}
      handleClose={() => dispatch(actions.closeCopyDialog())}
    >
      <Box sx={{ width: '400px', padding: '16px' }}>
        <Typography variant="body1">{openCopyDialog.text}</Typography>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '20px',
          }}
        >
          <Typography variant="body1">
            <b>Hur många kopior vill ni ha?</b>
          </Typography>

          <Select
            inputProps={{ id: 'sort-select' }}
            value={value}
            onChange={(e) => setValue(parseInt(`${e.target.value}`))}
            sx={{ minWidth: '100px' }}
          >
            {Array.from({ length: 10 }, (_, i) => i + 1).map((s) => (
              <MenuItem key={`sortselected${s}`} value={s}>
                {s}
              </MenuItem>
            ))}
          </Select>
        </Box>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'flex-end',
            marginTop: '20px',
          }}
        >
          <Button
            onClick={() => {
              for (let i = 0; i < value; i++) {
                setTimeout(send, (i + 1) * 600);
              }
            }}
            variant="contained"
          >
            Kopiera {value} st
          </Button>
          <Button
            sx={{ marginLeft: '16px' }}
            onClick={() => dispatch(actions.closeCopyDialog())}
            variant="contained"
          >
            Stäng
          </Button>
        </Box>
      </Box>
    </StandardDialog>
  );
};

export default CopyDialog;
