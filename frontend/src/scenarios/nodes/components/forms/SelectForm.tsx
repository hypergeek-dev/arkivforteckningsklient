import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectProps } from '@mui/material/Select';
import { v4 as uuid } from 'uuid';
import * as React from 'react';
import { Validator, validate } from 'Common/validators';
import { actions as appactions } from 'Store/ducks/app';
import { useAppDispatch, useAppSelector } from 'Store/hooks';
import { selectErrors } from 'Store/ducks/app/selectors';

export interface SelectItem {
  value?: string | number;
  label: string;
}

type Props = SelectProps & {
  menuItems: SelectItem[];
  header?: string;
  title?: string;
  disabled?: boolean;
  value?: string | number;
  validators?: Validator[];
  name?: string;
};

const SelectFormCardContent: React.FC<Props> = ({
  menuItems,
  header,
  disabled,
  validators,
  ...rest
}) => {
  const id = `select-${uuid()}`;
  const dispatch = useAppDispatch();
  const formErrors = useAppSelector(selectErrors);
  const error = formErrors[rest.name ?? ''];

  React.useEffect(() => {
    if (rest.required) {
      if (validators && rest.name) {
        const error = validate('' + rest.value, validators);
        if (error !== null) {
          dispatch(appactions.setErrors({ ...formErrors, [rest.name]: error }));
        } else {
          dispatch(appactions.removeError(rest.name));
        }
      }
    }
  }, [formErrors, rest.value]);

  return (
    <FormControl fullWidth variant="outlined" sx={{ marginBlock: 1 }}>
      {header && (
        <InputLabel
          sx={(theme) => ({
            ...theme.typography.h5,
            color: disabled ? '#c0c0c0' : theme.typography.h5.color,
            marginBottom: '0.5rem',
          })}
          htmlFor={id}
        >
          {header}
        </InputLabel>
      )}

      <Select
        inputProps={{ id }}
        disabled={disabled}
        {...rest}
        error={rest.required && error !== undefined}
      >
        {menuItems.map((item) => (
          <MenuItem
            key={`menuitem-key-${item.value}`}
            id={`menuitem-id-${item.value}`}
            aria-label={item.label}
            value={item.value}
          >
            {item.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectFormCardContent;
