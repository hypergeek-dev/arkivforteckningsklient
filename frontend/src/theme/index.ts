import { createTheme, ThemeOptions } from '@mui/material/styles';
import { darkPalette, lightPalette } from './palette';
import { lightTypography, darkTypography } from './typography';
import { components } from './components';
import { svSE } from '@mui/material/locale';

const lightOptions: ThemeOptions = {
  palette: lightPalette,
  typography: lightTypography,
  components: {
    ...components,
    MuiTypography: {
      defaultProps: {
        variantMapping: {
          // Map the new variant to render a <h1> by default
          ihpcardbody_rowCapped: 'p',
        },
      },
    },
  },
};

const darkOptions: ThemeOptions = {
  palette: darkPalette,
  typography: darkTypography,
  components,
};

export const lightTheme = createTheme(lightOptions, svSE);
export const darkTheme = createTheme(darkOptions, svSE);
