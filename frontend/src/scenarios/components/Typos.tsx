import { Typography } from '@mui/material';
import * as React from 'react';

type TextProps = {
  style?: React.CSSProperties;
  children?: React.ReactNode;
};

export const PageHeading: React.FC<TextProps> = ({ style, children }) => (
  <Typography
    align="center"
    variant="h1"
    sx={(theme) => ({
      font: 'normal normal 900 26px/37px Arial',
      marginBottom: '2rem',
      color: theme.palette.mode === 'light' ? 'black' : 'white',
      ...style,
    })}
  >
    {children}
  </Typography>
);
