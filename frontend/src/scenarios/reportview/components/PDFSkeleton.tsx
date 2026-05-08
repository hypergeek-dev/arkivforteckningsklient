import { Box, Skeleton, Typography } from '@mui/material';
import React from 'react';

const WIDTH = '210mm';
const HEIGHT = '600px';

export const PDFSkeleton: React.FC<{ error?: string }> = ({ error }) => (
  <Box sx={{ minHeight: HEIGHT, minWidth: WIDTH }}>
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '1rem',
        backgroundColor: '#424649',
      }}
    >
      <Box component="span" display="flex" width="60%" gap="1rem">
        <Skeleton
          variant="rectangular"
          width={32}
          height={32}
          sx={{ backgroundColor: 'rgba(220, 220, 220, 0.13)' }}
        />
        <Skeleton variant="text" sx={{ fontSize: '1rem', width: '50%' }} />
        <Skeleton variant="text" sx={{ fontSize: '1rem' }} width="40%" />
      </Box>

      <Box component="span" display="flex" gap="1rem">
        <Skeleton
          variant="rectangular"
          width={32}
          height={32}
          sx={{ backgroundColor: 'rgba(220, 220, 220, 0.13)' }}
        />
        <Skeleton
          variant="rectangular"
          width={32}
          height={32}
          sx={{ backgroundColor: 'rgba(220, 220, 220, 0.13)' }}
        />
        <Skeleton
          variant="rectangular"
          width={16}
          height={32}
          sx={{ backgroundColor: 'rgba(220, 220, 220, 0.13)' }}
        />
      </Box>
    </Box>

    <Box
      display="flex"
      justifyContent="center"
      marginTop="0.5rem"
      sx={{ backgroundColor: '#424649' }}
    >
      <Skeleton
        animation={error ? false : 'pulse'}
        variant="rectangular"
        height="80vh"
        width="94%"
        sx={{ backgroundColor: 'rgba(220, 220, 220, 0.13)' }}
      >
        <Typography
          variant="h2"
          sx={{ color: '#fff', visibility: 'visible' }}
          margin="6rem 3rem"
        >
          {error} Laddar...
        </Typography>
      </Skeleton>
    </Box>
  </Box>
);
