import { Circle, Done } from '@mui/icons-material';
import { Chip, ChipProps } from '@mui/material';
import React from 'react';

interface ChipSelectProps extends ChipProps {
  active: boolean;
  handleChipSelect: () => void;
}

const ChipSelect: React.FC<ChipSelectProps> = ({
  active,
  handleChipSelect,
  label,
  variant,
  title,
}) => (
  <Chip
    size="small"
    onClick={handleChipSelect}
    icon={active ? <Done /> : <Circle />}
    label={label}
    title={title}
    color={active ? 'primary' : 'default'}
    sx={(theme) => ({
      backgroundColor: !active ? theme.palette.background.paper : undefined,
      maxWidth: '60ch',
      textOverflow: 'ellipsis',
    })}
    variant={variant}
  />
);

export const SimpleChipSelect: React.FC<ChipSelectProps> = ({
  active,
  handleChipSelect,
  ...rest
}) => (
  <Chip
    size="small"
    onClick={handleChipSelect}
    color={active ? 'primary' : 'default'}
    sx={{
      maxWidth: '60ch',
      textOverflow: 'ellipsis',
    }}
    {...rest}
  />
);

export default ChipSelect;
