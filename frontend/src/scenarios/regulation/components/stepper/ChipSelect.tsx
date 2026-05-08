import { CheckCircleRounded, Circle } from '@mui/icons-material';
import { Paper } from '@mui/material';
import React from 'react';
import { v4 as uuid } from 'uuid';

interface ChipSelectValue {
  label: string;
  value: string | number;
}

interface ChipSelectProps {
  onChange: React.ChangeEventHandler<HTMLSelectElement> | undefined;
  values: ChipSelectValue[];
  value: string | number;
  selected?: boolean;
  style?: React.CSSProperties | undefined;
  disabled?: boolean;
  autoFocus: boolean;
  tabIndex: number;
}

const ChipSelect: React.FC<ChipSelectProps> = ({
  onChange,
  values,
  value,
  selected,
  style,
  disabled,
  autoFocus,
  tabIndex,
}) => {
  const id = `chip-select-${uuid()}`;
  return (
    <Paper
      elevation={0}
      sx={(theme) => ({
        border: `1px solid ${theme.palette.divider}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '4px 10px 4px 4px',
        borderRadius: '15px',
        ...style,
      })}
    >
      {selected && !disabled ? (
        <CheckCircleRounded color="primary" />
      ) : (
        <Circle color="disabled" />
      )}
      <label style={{ display: 'none' }} htmlFor={id}>
        välj tid
      </label>
      <select
        id={id}
        tabIndex={tabIndex || 0}
        disabled={disabled}
        style={{ border: 'none' }}
        value={value}
        onChange={onChange}
        autoFocus={autoFocus}
      >
        {values.map((v) => (
          <option key={uuid()} value={v.value}>
            {v.label}
          </option>
        ))}
      </select>
    </Paper>
  );
};

export default ChipSelect;
