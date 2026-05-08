export const selectedValues = [
  { value: 'LETTER_ASC', label: 'Bokstavsordning' },
  { value: 'LATEST', label: 'Senast skapad' },
  { value: 'OLDEST', label: 'Tidigast skapad' },
  { value: 'START_DATE', label: 'Startdatum' },
  { value: 'PASSED_DATE', label: 'Utgångsdatum' },
];
type DataTypeElement = {
  [key: string]: string;
};
export const DATA_TYPE: DataTypeElement = {
  STRING: 'Text, (String)',
  BOOLEAN: 'Ja/Nej, (Boolean)',
  INTEGER: 'Heltal, (Integer)',
  FLOAT: 'Decimaltal, (Float)',
  TIMESTAMP_TZ: 'Datum, (TIMESTAMP_TZ)',
  DOCUMENT_TYPE: 'Text, (String)',
};
