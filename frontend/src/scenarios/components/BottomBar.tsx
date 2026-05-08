import React from 'react';
import Box from '@mui/material/Box';
import { AppBar, Toolbar } from '@mui/material';

type BottomBarProps = {
  children?: JSX.Element | Array<JSX.Element>;
};

const BottomBar: React.FC<BottomBarProps> = ({ children }) => (
  <AppBar position="fixed" color="primary" sx={{ top: 'auto', bottom: 0 }}>
    <Toolbar>
      <Box sx={{ flexGrow: 1 }} />
      {children}
    </Toolbar>
  </AppBar>
);
export default BottomBar;
