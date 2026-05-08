import {
  Card,
  CardContent,
  Grid2,
  SxProps,
  Theme,
  Typography,
} from '@mui/material';
import React from 'react';

interface FormCardProps {
  header?: string;
  sx?: SxProps<Theme>;
  xs?: number;
  children?: React.ReactNode;
}
const FormCard: React.FC<FormCardProps> = ({ children, header, sx, xs }) => {
  return (
    <Grid2 size={{ xs }}>
      <Card variant="outlined">
        <CardContent
          sx={{
            flex: '1 0 auto',
            minHeight: '300px',
            padding: 3,
            ...sx,
          }}
        >
          {header && (
            <Typography gutterBottom variant="subtitle1" component="div">
              {header}
            </Typography>
          )}
          {children}
        </CardContent>
      </Card>
    </Grid2>
  );
};

export default FormCard;
