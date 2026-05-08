import {
  CalendarMonthOutlined,
  GavelOutlined,
  Person,
  Label,
  Security,
  AutoDelete,
  AccountCircleOutlined,
  AdminPanelSettingsOutlined,
  Save,
  Subject,
  HowToRegOutlined,
  DeleteForever,
  PersonRemove,
  Key,
} from '@mui/icons-material';
import { useTheme } from '@mui/material';

import React from 'react';

export type SymbolOptions =
  | 'calendar'
  | 'informationResponsible'
  | 'contact'
  | 'contactCircle'
  | 'shield'
  | 'trashcan'
  | 'label'
  | 'dontDelete'
  | 'manualDelete'
  | 'hammer'
  | 'register'
  | 'save'
  | 'subject'
  | 'secret';
interface CardSymbolProps {
  symbol: SymbolOptions;
  ariaLabel: string;
}

const CardSymbol: React.FC<CardSymbolProps> = ({ symbol, ariaLabel }) => {
  const theme = useTheme();
  const standardStyle: React.CSSProperties = { width: '16px', height: '16px' };
  const highLighted: React.CSSProperties = {
    color: theme.palette.primary.main,
    ...standardStyle,
  };
  return (
    <>
      {symbol === 'calendar' && (
        <CalendarMonthOutlined aria-label={ariaLabel} sx={standardStyle} />
      )}
      {symbol === 'informationResponsible' && (
        <AdminPanelSettingsOutlined aria-label={ariaLabel} sx={standardStyle} />
      )}
      {symbol === 'contact' && (
        <Person aria-label={ariaLabel} sx={highLighted} />
      )}
      {symbol === 'contactCircle' && (
        <AccountCircleOutlined aria-label={ariaLabel} sx={standardStyle} />
      )}
      {symbol === 'shield' && (
        <Security aria-label={ariaLabel} sx={highLighted} />
      )}
      {symbol === 'trashcan' && (
        <AutoDelete aria-label={ariaLabel} sx={highLighted} />
      )}
      {symbol === 'dontDelete' && (
        <DeleteForever aria-label={ariaLabel} sx={highLighted} />
      )}
      {symbol === 'manualDelete' && (
        <PersonRemove aria-label={ariaLabel} sx={highLighted} />
      )}
      {symbol === 'label' && <Label aria-label={ariaLabel} sx={highLighted} />}
      {symbol === 'hammer' && (
        <GavelOutlined aria-label={ariaLabel} sx={standardStyle} />
      )}
      {symbol === 'secret' && <Key aria-label={ariaLabel} sx={highLighted} />}
      {symbol === 'save' && <Save aria-label={ariaLabel} sx={highLighted} />}
      {symbol === 'subject' && (
        <Subject aria-label={ariaLabel} sx={highLighted} />
      )}
      {symbol === 'register' && (
        <HowToRegOutlined aria-label={ariaLabel} sx={highLighted} />
      )}
    </>
  );
};

export default CardSymbol;
