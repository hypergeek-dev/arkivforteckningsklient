import { TypographyOptions } from '@mui/material/styles/createTypography';

declare module '@mui/material/styles' {
  interface TypographyVariants {
    ihpcardbody_rowCapped: React.CSSProperties;
    smallText: React.CSSProperties;
  }

  // allow configuration using `createTheme`
  interface TypographyVariantsOptions {
    ihpcardbody_rowCapped?: React.CSSProperties;
    smallText?: React.CSSProperties;
  }
}

// Update the Typography's variant prop options
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    ihpcardbody_rowCapped: true;
    smallText: true;
  }
}

const generalTypographyStyles: TypographyOptions = {
  fontFamily: 'Poppins, sans-serif',
  button: {
    fontFamily: 'Poppins, sans-serif',
    fontSize: '1.125rem',
    lineHeight: '1.5rem',
    letterSpacing: '0.03rem',
    fontWeight: 400,
    textTransform: undefined,
    padding: '2rem',
  },
  h1: {
    fontFamily: 'Poppins, sans-serif',
    fontSize: '28.8px',
    lineHeight: '1.8em',
    fontWeight: 'normal',
  },
  h2: {
    fontFamily: 'Poppins, sans-serif',
    fontSize: '20px',
    lineHeight: '1.25em',
    fontWeight: 'bold',
  },
  h3: {
    fontFamily: 'Poppins, sans-serif',
    fontSize: '16px',
    lineHeight: '1.2em',
    fontWeight: '900',
  },
  h4: {
    fontFamily: 'Poppins, sans-serif',
    fontSize: '14px',
    lineHeight: '1.2em',
    fontWeight: 'bold',
  },
  h5: {
    fontFamily: 'Poppins, sans-serif',
    fontSize: '14px',
    lineHeight: '1.2em',
    fontWeight: '900',
  },
  h6: {
    fontFamily: 'Poppins, sans-serif',
    fontSize: '10px',
    lineHeight: '1.2em',
    fontWeight: 'bold',
  },
  subtitle1: {
    fontFamily: 'Poppins, sans-serif',
    fontSize: '16px',
    lineHeight: '1.2em',
    fontWeight: 'bold',
  },
  subtitle2: {
    fontFamily: 'Poppins, sans-serif',
    fontSize: '14px',
    lineHeight: '1.2em',
    fontWeight: 'bold',
  },
  body1: {
    fontFamily: 'Poppins, sans-serif',
    fontSize: '14px',
    lineHeight: '1.5rem',
    fontWeight: 'normal',
  },
  body2: {
    fontFamily: 'Poppins, sans-serif',
    fontSize: '12px',
    lineHeight: '1.2rem',
    fontWeight: 'normal',
  },
  caption: {
    fontFamily: 'Poppins, sans-serif',
    fontSize: '12px',
    lineHeight: '1.2rem',
    fontWeight: 'normal',
  },
  overline: { fontFamily: 'Poppins, sans-serif' },

  ihpcardbody_rowCapped: {
    fontFamily: 'Poppins, sans-serif',
    fontSize: '12px',
    marginBottom: '0.5rem',
    lineHeight: 1.25,
    display: '-webkit-box',
    WebkitLineClamp: '2',
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  smallText: {
    fontFamily: 'Arial, sans-serif',
    fontSize: '14px',
    lineHeight: '1.5rem',
    letterSpacing: '0.11px',
    color: '#000000B3',
  },
};

export const lightTypography: TypographyOptions = {
  ...generalTypographyStyles,
  h5: {
    ...generalTypographyStyles.h5,
    color: 'rgba(0, 0, 0, 0.6)',
  },
};

export const darkTypography = {
  ...generalTypographyStyles,
  color: 'white',
  h5: {
    ...generalTypographyStyles.h5,
    color: 'rgba(255, 255, 255, 0.7)',
  },
};
