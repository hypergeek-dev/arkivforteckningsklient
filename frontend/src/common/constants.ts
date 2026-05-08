type statusHashMap = {
  [key: string]: statusObject;
};

type statusObject = {
  key: string;
  label: string;
};

export const STATUS: statusHashMap = {
  NY: { key: 'ny', label: 'Ny' },
  UTKAST: { key: 'utkast', label: 'Utkast' },
  KLAR: { key: 'klar', label: 'Klar' },
  GODKAND: { key: 'godkand', label: 'Godkänd' },
  FASTSTALLD: { key: 'faststalld', label: 'Fastställd' },
};

export const STATUS_SV = {
  utkast: 'Utkast',
  klar: 'Klar',
  godkand: 'Godkänd',
  faststalld: 'Fastställd',
};

export const CHILDREN_NOT_READY = 'CHILDREN_NOT_READY';
export const FORM_ERROR = 'FORM_ERROR';

const verksamhetsskyddAlternatives = [
  { label: 'Ej klassificerad', value: 0 },
  { label: 'Inte skyddsvärd', value: 1 },
  { label: 'Mindre skyddsvärd ', value: 2 },
  { label: 'Skyddsvärd ', value: 3 },
  { label: 'Mycket skyddsvärd ', value: 4 },
];

const sakerhetsskyddAlternatives = [
  { label: 'Ej klassificerad', value: 0 },
  { label: 'Begränsat hemlig', value: 5 },
  { label: 'Konfidentiell', value: 6 },
  { label: 'Hemlig ', value: 7 },
  { label: 'Kvalificerat hemlig ', value: 8 },
];

export const informationsecurityclassAlternatives = [
  ...verksamhetsskyddAlternatives,
  ...sakerhetsskyddAlternatives,
];

export const getStatusText = (status?: string) => {
  let label = 'NO_LABEL';
  Object.entries(STATUS).find(([, value]) => {
    if (value.key === status) {
      label = value.label;
    }
  });
  return label;
};

export const getStatusString = (status: string) =>
  STATUS[status.toUpperCase()].label;
