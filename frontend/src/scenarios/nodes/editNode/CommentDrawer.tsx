import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MuiDrawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import { CSSObject, Theme, styled } from '@mui/material/styles';
import * as React from 'react';

import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import { Box, Button, Stack, TextField } from '@mui/material';
import { NodeTypeCommentDto } from 'Models/index';
import CommentList from 'Scenarios/components/CommentList';

const drawerWidth = 400;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  zIndex: 1051,
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  zIndex: 1051,
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  zIndex: 900,
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}));

const numberCommentsStyle = {
  backgroundColor: 'primary.main',
  color: 'secondary.main',
  fontSize: '14px',
  height: '20px',
  width: '20px',
  display: 'grid',
  placeItems: 'center',
  borderRadius: '50%',
  position: 'absolute',
  top: '-2px',
  right: '-2px',
};

const openContentBoxStyles = {
  padding: 2,
  width: '100%',
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  overflowY: 'auto',
  gap: '2rem',
};

type CommentDrawerProps = {
  comment: string;
  comments: NodeTypeCommentDto[];
  setComment: (c: string) => void;
  send: (c: string) => void;
};

export default function MiniDrawer({
  comment,
  comments,
  send,
  setComment,
}: Readonly<CommentDrawerProps>) {
  const [open, setOpen] = React.useState(false);

  const toggleOpen = () => {
    setOpen((prevState) => !prevState);
  };

  const iconStyles = {
    borderRadius: '2px',
    marginTop: '5rem',
    alignSelf: open ? 'flex-start' : 'center',
    position: 'relative',
  };

  return (
    <Drawer variant="permanent" open={open} anchor="right" elevation={5000}>
      <IconButton onClick={toggleOpen} sx={iconStyles}>
        {comments.length > 0 && !open && (
          <Box component="span" sx={numberCommentsStyle}>
            {comments.length}
          </Box>
        )}
        {open ? <ChevronRightIcon /> : <ChatBubbleIcon />}
      </IconButton>
      {open && (
        <Box sx={openContentBoxStyles}>
          <Stack spacing={2}>
            <CommentList comments={comments} />
            <TextField
              id="commentTextField"
              label="Kommentera"
              value={comment}
              multiline
              rows={6}
              fullWidth
              onChange={(e) => setComment(e.target.value)}
              inputProps={{ maxLength: 900 }}
              sx={(theme) => ({
                '& .MuiInputBase-root': {
                  background: theme.palette.background.paper,
                },
                '.MuiFormLabel-root.MuiInputLabel-root': {
                  ...theme.typography.h5,
                  marginBottom: '0.5rem',
                },
                '.MuiInputBase-root.MuiOutlinedInput-root legend': {
                  width: 0,
                },
              })}
            />
            <Button
              variant="outlined"
              onClick={() => {
                if (comment && comment.length !== 0) send(comment);
              }}
            >
              Lägg till kommentar
            </Button>
          </Stack>
        </Box>
      )}
    </Drawer>
  );
}
