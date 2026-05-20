import { EventLoggAction, NodeName } from 'Models/typed';
import { FilterValue } from 'Scenarios/components/Filter';

export const selectedValues = [
  { value: 'LATEST', label: 'Senaste' },
  { value: 'OLDEST', label: 'Äldst' },
  { value: 'USERNAME_ASC', label: 'Användare stigande' },
  { value: 'USERNAME_DESC', label: 'Användare fallande' },
];

export const filterValues: FilterValue<
  EventLoggAction | NodeName | 'username'
>[] = [
  { value: 'klar', label: 'Klarmarkerat' },
  { value: 'godkand', label: 'Godkänt' },
  { value: 'utkast', label: 'Tillbaka till utkast' },
  { value: 'faststalld', label: 'Fastställt' },
  { value: 'create', label: 'Skapat' },
  { value: 'copy', label: 'Kopierat' },
  { value: 'delete', label: 'Raderat' },
  { value: 'update', label: 'Förändringar' },
  { value: 'comment', label: 'Kommentarer' },
  { value: 'move', label: 'Flyttad' },
  { value: 'documentnode', label: 'Volym' },
  { value: 'issuenode', label: 'Underserie' },
  { value: 'processnode', label: 'Serie' },
  { value: 'pgnode', label: 'Arkiv' },
  { value: 'oanode', label: 'Arkivbildare' },
];
