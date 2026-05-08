import {
  FormControl,
  FormControlLabel,
  FormGroup,
  Switch,
} from '@mui/material';
import React from 'react';

interface Props {
  value?: boolean;
  disabled?: boolean;
  header?: string;
  trueLabel: string;
  falseLabel: string;
  onChangeHandler: (value: boolean) => void;
}

const BooleanForm: React.FC<Props> = ({
  value,
  disabled,
  header,
  trueLabel,
  falseLabel,
  onChangeHandler,
}) => {
  return (
    <FormControl>
      <FormGroup>
        <FormControlLabel
          aria-label={trueLabel}
          control={
            <Switch
              checked={value}
              disabled={disabled}
              onChange={(e) => onChangeHandler(e.target.checked)}
            />
          }
          label={`${header}:  ${value ? trueLabel : falseLabel}`}
          labelPlacement="end"
        />
      </FormGroup>
    </FormControl>
  );
};
export default BooleanForm;
