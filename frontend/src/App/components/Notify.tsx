import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { ApiResponseTypes } from 'Store/ducks/app/reducer';
import { Slide, SlideProps } from '@mui/material';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return (
    <MuiAlert
      aria-label="Informations ruta"
      elevation={24}
      ref={ref}
      variant="filled"
      {...props}
    />
  );
});

const SlideTransition = (props: SlideProps) => {
  return <Slide {...props} direction="left" />;
};

type Props = {
  type?: ApiResponseTypes;
  message?: string;
};

const Notify: React.FC<Props> = ({ type, message }) => {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (type) {
      setOpen(true);
    }
  }, [type, message]);

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  if (!type || !message) {
    return null;
  }

  return (
    <Snackbar
      sx={{ zIndex: 1000000 }}
      open={open}
      anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
      autoHideDuration={type === 'error' ? 10000 : 2000}
      onClose={handleClose}
      TransitionComponent={SlideTransition}
    >
      <Alert onClose={handleClose} severity={type} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Notify;
