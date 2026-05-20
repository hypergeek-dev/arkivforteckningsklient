import { DateValidationError } from '@mui/x-date-pickers';

const REQUIRE_NUMBERS_ONLY = 'NUMBERS_ONLY';
const REQUIRE = 'REQUIRED';
const REQUIRE_MAXLENGTH = 'MAXLENGTH';
const REQUIRE_DATE_FORMAT = 'DATE_FORMAT';

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export const requireMaxLength = (val: number): Validator => ({
  type: REQUIRE_MAXLENGTH,
  value: val,
});

export const requiredField = (): Validator => ({
  type: REQUIRE,
});

/** Validates that a non-empty string matches YYYY-MM-DD. */
export const requireDateFormat = (): Validator => ({
  type: REQUIRE_DATE_FORMAT,
});

export type Validator = {
  type: 'NUMBERS_ONLY' | 'REQUIRED' | 'MAXLENGTH' | 'DATE_FORMAT' | DateValidationError;
  value?: number;
};

export const validate = (
  value: string,
  validators: Validator[]
): 'NUMBERS_ONLY' | 'REQUIRED' | 'MAXLENGTH' | 'DATE_FORMAT' | DateValidationError | null => {
  for (const validator of validators) {
    if (validator.type === REQUIRE_MAXLENGTH && validator.value) {
      if (value.trim().length > validator.value) {
        return 'MAXLENGTH';
      }
    }
    if (validator.type === REQUIRE) {
      if (value.trim().length === 0) return 'REQUIRED';
    }
    if (validator.type === REQUIRE_DATE_FORMAT) {
      if (value.trim().length > 0 && !ISO_DATE_RE.test(value.trim())) {
        return 'DATE_FORMAT';
      }
    }
    if (validator.type === REQUIRE_NUMBERS_ONLY) {
      if (!/^\d+$/.test(value)) return 'NUMBERS_ONLY';
    } else if (
      validator.type === 'invalidDate' ||
      validator.type === 'maxDate' ||
      validator.type === 'minDate'
    ) {
      return validator.type;
    }
  }
  return null;
};
