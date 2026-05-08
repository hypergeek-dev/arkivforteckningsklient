import { SearchRegulationFilter } from 'Store/ducks/regulation/reducer';

export const filterOptions: { value: SearchRegulationFilter; label: string }[] =
  [
    { value: 'DEFAULT_RULE', label: 'Gallringsregler' },
    { value: 'EXCEPTION_RULE', label: 'Undantagsregler' },
    { value: 'TEXT_RULE', label: 'Referensregler' },
    { value: 'COMMENT', label: 'Kommenterade gallringsregler' },
    { value: 'ZERO_THREE', label: '0-3 år' },
    { value: 'THREE_FIVE', label: '3-5 år' },
    { value: 'FIVE_+', label: '5+ år' },
  ];
