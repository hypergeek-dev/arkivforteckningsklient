import {
  TableCell,
  TableRow,
  Typography,
  tableCellClasses,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';

interface RowProp {
  header: string | JSX.Element;
  text?: string | JSX.Element;
  variant?: 'caption';
  compared?: React.ReactNode;
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const headerStyles = {
  textTransform: 'uppercase',
  fontWeight: 'regular',
  color: '#707070',
};

const Row: React.FC<RowProp> = ({ header, text, compared, variant }) => {
  const textDiffers = text !== compared;
  return (
    <StyledTableRow>
      <StyledTableCell width={'50%'}>
        <Typography variant="h4" sx={headerStyles}>
          {header}
        </Typography>

        <Typography
          variant={variant && text ? variant : 'body1'}
          fontWeight={variant && text ? 'inherit' : 'bold'}
        >
          {text || 'Ej angivet'}
        </Typography>
      </StyledTableCell>

      <StyledTableCell>
        <Typography variant="h4" sx={headerStyles}>
          {header}
          {textDiffers ? <span style={{ color: 'red' }}> * </span> : null}
        </Typography>
        <Typography
          variant={variant && compared ? variant : 'body1'}
          fontWeight={variant && compared ? 'inherit' : 'bold'}
        >
          {compared || 'Ej angivet'}
        </Typography>
      </StyledTableCell>
    </StyledTableRow>
  );
};

export default Row;
