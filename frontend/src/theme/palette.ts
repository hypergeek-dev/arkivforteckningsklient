import { deepPurple, teal } from '@mui/material/colors';
import { PaletteOptions } from '@mui/material/styles';

export const lightPalette: MigraPalette = {
  mode: 'light',
  primary: {
    main: '#0066cc',
  },
  secondary: {
    /* dark: '#808080', */
    main: '#f2f2f2',
  },
  text: {
    primary: 'rgb(51, 51, 51)',
    onDark: 'rgba(255, 255, 255, 0.65)',
  },
  background: {
    paper: '#ffffff',
    default: '#dedede',
  },
  testColor: {
    main: teal[600],
    dark: deepPurple[600],
  },
};

export const darkPalette: MigraPalette = {
  mode: 'dark',

  secondary: {
    main: '#303030',
    dark: deepPurple[200],
  },
  testColor: {
    main: teal[300],
    dark: deepPurple[200],
  },
  text: {
    primary: 'rgb(220, 220, 220)',
    onDark: 'rgba(220, 220, 220, 0.65)',
  },
};

export interface MigraPalette extends PaletteOptions {
  testColor?: {
    main: string;
    dark: string;
    light?: string;
  };
  text: {
    primary: string;
    onDark: string;
  };
}
