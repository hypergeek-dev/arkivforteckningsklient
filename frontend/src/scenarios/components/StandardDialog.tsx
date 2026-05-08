import * as React from 'react';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import Container from '@mui/material/Container';
import { Box, SxProps, Theme } from '@mui/material';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface Props extends DialogProps {
  handleClose: () => void;
  children?: JSX.Element | JSX.Element[];
  toolBarContent?: JSX.Element;
  containerStyle?: SxProps<Theme>;
  backgroundStyle?: React.CSSProperties;
}

const StandardDialog: React.FC<Props> = ({
  handleClose,
  children,
  toolBarContent,
  containerStyle,
  backgroundStyle,
  ...rest
}) => {
  return (
    <Dialog
      PaperProps={{ style: backgroundStyle }}
      {...rest}
      onClose={() => {
        handleClose();
      }}
      TransitionComponent={Transition}
    >
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <Box display="flex" flexGrow={1}>
            <IconButton
              edge="start"
              color="inherit"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleClose();
              }}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          </Box>
          {toolBarContent}
        </Toolbar>
      </AppBar>
      <Container sx={containerStyle}>{children}</Container>
    </Dialog>
  );
};

export default StandardDialog;
