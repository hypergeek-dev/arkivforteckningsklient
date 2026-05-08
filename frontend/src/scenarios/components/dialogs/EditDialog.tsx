import CloseIcon from '@mui/icons-material/Close';
import { Box, Grid2 } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import Slide from '@mui/material/Slide';
import Toolbar from '@mui/material/Toolbar';
import { TransitionProps } from '@mui/material/transitions';
import * as React from 'react';
import ConfirmDialog from './ConfirmDialog';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

type Props = {
  open: boolean;
  handleClose: () => void;
  children?: JSX.Element | JSX.Element[];
  actionButton?: JSX.Element;
  middleContent?: JSX.Element | JSX.Element[];
  endContent?: JSX.Element | JSX.Element[];
  openConfirm?: boolean;
  confirmText?: string;
  setOpenConfirm?: (v: boolean) => void;
  confirmAction?: () => void;
};

const EditDialog: React.FC<Props> = ({
  open,
  handleClose,
  children,
  actionButton,
  middleContent,
  endContent,
  openConfirm,
  confirmText,
  setOpenConfirm,
  confirmAction,
}) => {
  return (
    <Dialog
      fullScreen
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
      PaperProps={{ sx: { backgroundColor: 'background.default' } }}
    >
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <Grid2
            container
            justifyContent="space-between"
            alignItems="center"
            width="100%"
          >
            <Grid2 size={{ xs: 3, sm: 3, md: 1, lg: 5 }} order={1}>
              <IconButton
                edge="start"
                color="inherit"
                onClick={handleClose}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
            </Grid2>

            <Grid2
              size={{ xs: 3, sm: 3, md: 3, lg: 2 }}
              justifyContent={{ md: 'center', lg: 'center' }}
              order={2}
              sx={{
                display: 'flex',
              }}
            >
              {middleContent}
            </Grid2>

            <Grid2
              size={{ xs: 12, sm: 12, md: 6, lg: 4 }}
              order={{ xs: 4, md: 3 }}
              justifyContent={{ md: 'center', lg: 'center' }}
              sx={{
                display: 'flex',
              }}
            >
              {endContent}
            </Grid2>
            <Grid2
              size={{ xs: 3, sm: 3, md: 2, lg: 1 }}
              order={{ xs: 3, md: 4 }}
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
              }}
            >
              {actionButton}
            </Grid2>
          </Grid2>
        </Toolbar>
      </AppBar>

      <Box
        sx={{ display: 'flex ', flexDirection: 'column', marginTop: '1rem' }}
      >
        {children}

        {openConfirm && confirmAction && setOpenConfirm && (
          <ConfirmDialog
            open={openConfirm}
            dialogContent={confirmText ?? 'Dialogtext'}
            handleClose={() => setOpenConfirm(false)}
            title="Uppdatera status"
            confirm={() => {
              confirmAction();
              setOpenConfirm(false);
            }}
          />
        )}
      </Box>
    </Dialog>
  );
};

export default EditDialog;
