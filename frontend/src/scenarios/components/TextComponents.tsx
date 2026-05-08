import React from 'react';
import { Box, SxProps, Theme, Typography } from '@mui/material';

const Paragraph = ({
  children,
  sx,
}: {
  children?: string;
  sx?: SxProps<Theme>;
}) => (
  <Box sx={sx}>
    {children?.split('\n').map((line, index) => (
      <Typography key={'text' + index} variant="body1" margin={'0.5rem 0'}>
        {line}
      </Typography>
    ))}
  </Box>
);

export default Paragraph;
