import { DateValidationError } from '@mui/x-date-pickers';

const REQUIRE_NUMBERS_ONLY = 'NUMBERS_ONLY';
const REQUIRE = 'REQUIRED';
const REQUIRE_MAXLENGTH = 'MAXLENGTH';

export const requireMaxLength = (val: number): Validator => ({
  type: REQUIRE_MAXLENGTH,
  value: val,
});

export const requiredField = (): Validator => ({
  type: REQUIRE,
});

export type Validator = {
  type: 'NUMBERS_ONLY' | 'REQUIRED' | 'MAXLENGTH' | DateValidationError;
  value?: number;
};

export const validate = (
  value: string,
  validators: Validator[]
): 'NUMBERS_ONLY' | 'REQUIRED' | 'MAXLENGTH' | DateValidationError | null => {
  for (const validator of validators) {
    if (validator.type === REQUIRE_MAXLENGTH && validator.value) {
      if (value.trim().length > validator.value) {
        return 'MAXLENGTH';
      }
    }
    if (validator.type === REQUIRE) {
      if (value.trim().length === 0) return 'REQUIRED';
    }

    if (validator.type === REQUIRE_NUMBERS_ONLY) {
      if (!/^\d+$/.test(value)) return 'NUMBERS_ONLY';
    } else if (
      validator.type === 'invalidDate' ||
      validator.type === 'maxDate' ||
      validator.type === 'minDate'
    ) {
      // Date validation error
      return validator.type;
    }
  }
  return null;
};
