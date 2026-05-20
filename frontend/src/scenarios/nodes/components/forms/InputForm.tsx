import {
  FormControl,
  FormHelperText,
  InputLabel,
  OutlinedInput,
  OutlinedInputProps,
  SxProps,
  Theme,
} from '@mui/material';
import { sanitizeToPlainText } from 'Common/sanitize';
import { Validator } from 'Common/validators';
import { selectErrors } from 'Store/ducks/app/selectors';
import { useAppSelector } from 'Store/hooks';
import React, { useState } from 'react';

interface Props extends OutlinedInputProps {
  disabled?: boolean;
  name: string;
  value: string;
  onChangeHandler: (key: string, val: string, validators?: Validator[]) => void;
  maxLength: number;
  labelStyle?: SxProps<Theme>;
  validators?: Validator[];
}

const InputForm: React.FC<Props> = ({
  value = '',
  name,
  maxLength,
  title,
  disabled,
  onChangeHandler,
  labelStyle,
  validators,
  ...rest
}) => {
  const storeErrors = useAppSelector(selectErrors);
  const error = storeErrors[name];
  const maxChars = Number((maxLength ?? 300) + 10);
  const [pasted, setPasted] = useState(false);

  const errorMessage = () => {
    if (rest.required && value.length === 0)
      return 'Fältet får inte vara tomt.';
    if (error === 'MAXLENGTH') {
      return `Max ${maxLength} tecken tillåtna - Antal nu: ${
        String(value).length
      }`;
    }
    if (error === 'NUMBERS_ONLY') return 'Endast siffror är tillåtna.';
    if (error === 'DATE_FORMAT') return 'Datum måste anges som ÅÅÅÅ-MM-DD (t.ex. 2024-01-15).';
  };

  React.useEffect(() => {
    if (rest.required && value.length === 0 && !error) {
      onChangeHandler(name, value, validators);
    }
  }, [error, value]);

  return (
    <FormControl fullWidth variant="filled">
      <InputLabel
        aria-label={title}
        htmlFor={`filledInput-${title?.replace(' ', '-')}`}
        sx={labelStyle}
      >
        {title}
      </InputLabel>

      <OutlinedInput
        name={name}
        aria-label={title}
        inputProps={{ maxLength: maxChars }}
        disabled={disabled}
        id={`filledInput-${title?.replace(' ', '-')}`}
        value={value || ''}
        onPaste={() => setPasted(true)}
        onChange={(e) => {
          let text = sanitizeToPlainText(e.target.value);
          if (pasted) {
            text = text.trim();
            setPasted(false);
          }
          onChangeHandler(name, text, validators);
        }}
        sx={(theme) => ({
          borderColor:
            theme.palette.mode === 'light'
              ? theme.palette.error.dark
              : theme.palette.error.light,
        })}
        error={(rest.required && value.length === 0) || error !== undefined}
        {...rest}
      />

      <FormHelperText
        sx={(theme) => ({
          color:
            theme.palette.mode === 'light'
              ? theme.palette.error.dark
              : theme.palette.error.light,
          textTransform: 'uppercase',
          letterSpacing: '0.01rem',
        })}
      >
        {((rest.required && value.length === 0) || error) && errorMessage()}
      </FormHelperText>
    </FormControl>
  );
};

export default InputForm;

export const StyledInputForm: React.FC<Props> = ({
  style,
  disabled,
  multiline,
  sx,
  value,
  ...rest
}) => {
  const styles = multiline ? { lineHeight: '1.5', padding: 2, ...sx } : sx;

  return (
    <InputForm
      labelStyle={(theme) => ({
        ...theme.typography.h5,
        color: disabled ? '#c0c0c0' : theme.typography.h5.color,
        marginBottom: '0.5rem',
        ...style,
      })}
      value={value}
      multiline={multiline}
      sx={styles}
      disabled={disabled}
      {...rest}
    />
  );
};
export const NumberInputForm: React.FC<Props> = ({
  style,
  disabled,
  multiline,
  sx,
  value,
  onChangeHandler,
  ...rest
}) => {
  const styles = multiline ? { lineHeight: '1.5', padding: 2, ...sx } : sx;

  const handleNumberChange = (
    key: string,
    val: string,
    validators?: Validator[]
  ) => {
    // Allow only numeric input
    const numericValue = val.replace(/[^0-9]/g, '');
    onChangeHandler(key, numericValue, validators);
  };

  return (
    <InputForm
      labelStyle={(theme) => ({
        ...theme.typography.h5,
        color: disabled ? '#c0c0c0' : theme.typography.h5.color,
        marginBottom: '0.5rem',
        ...style,
      })}
      value={value}
      multiline={multiline}
      sx={styles}
      disabled={disabled}
      onChangeHandler={handleNumberChange}
      {...rest}
    />
  );
};
