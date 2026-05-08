import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import * as React from 'react';

type Props = {
  open: boolean;
  title: string;
  handleClose: () => void;
  dialogContent: string;
  confirm: () => void;
};

const ConfirmDialog: React.FC<Props> = ({
  open,
  title,
  handleClose,
  dialogContent,
  confirm,
}) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle fontSize={18} id="alert-dialog-title">
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {dialogContent}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          aria-label="Avbryt och stäng"
          autoFocus
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleClose();
          }}
        >
          Avbryt
        </Button>
        <Button
          aria-label="Ok"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            confirm();
          }}
        >
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
