import { Components } from '@mui/material/styles';
import { Theme } from '@mui/system';

export const components: Components<Theme> = {
  MuiAppBar: {
    styleOverrides: {
      root: ({ theme }) =>
        theme.palette.mode === 'light' && {
          backgroundColor: '#f5f5f5',
          color: 'GrayText',
        },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: '15px',
        borderColor:
          theme.palette.mode === 'light' ? 'rgba(0,0,0,0.3)' : '#303030',
      }),
    },
  },
  MuiCardHeader: {
    styleOverrides: {
      title: {
        fontWeight: 600,
        fontSize: '14px',
      },
      content: {
        display: 'flex',
        flexDirection: 'column',
        alignContent: 'center',
        alignItems: 'baseline',
      },
    },
  },
  MuiAvatar: {
    styleOverrides: {
      root: ({ theme }) =>
        theme.palette.mode === 'light' && {
          backgroundColor: 'rgba(0,0,0,0.7)',
          color: '#ffffff',
          fontSize: '14px',
        },
    },
  },
  MuiDrawer: {
    styleOverrides: {
      paper: ({ theme }) =>
        theme.palette.mode === 'light'
          ? {
              backgroundColor: '#f5f5f5',
              color: 'GrayText',
            }
          : { backgroundColor: '#272727' },
      root: ({ theme }) =>
        theme.palette.mode === 'light' && {
          backgroundColor: '#f5f5f5',
          color: 'GrayText',
        },
    },
  },
  MuiAccordion: {
    styleOverrides: {
      root: ({ theme }) =>
        theme.palette.mode === 'light' && {
          borderColor: '#5d5d5d',
        },
    },
  },

  MuiAccordionSummary: {
    styleOverrides: {
      root: ({ theme }) =>
        theme.palette.mode === 'light' && {
          padding: '0 15px',
          ':hover': {
            background: '#e6e6e6',
            textDecoration: 'underline',
          },
          '&.Mui-expanded': {
            background: '#e6e6e6',
            textDecoration: 'underline',
          },
        },
    },
  },
  MuiAlertTitle: {
    styleOverrides: {
      root: {
        fontWeight: 700,
      },
    },
  },
  MuiAlert: {
    styleOverrides: {
      standardError: ({ theme }) =>
        theme.palette.mode === 'light' && {
          backgroundColor: '#ffdfdf',
          borderColor: '#b01919',
        },
      standardWarning: ({ theme }) =>
        theme.palette.mode === 'light' && {
          backgroundColor: '#ffeed5',
          borderColor: '#8c6e01',
        },
      standardInfo: ({ theme }) =>
        theme.palette.mode === 'light' && {
          backgroundColor: '#e6f0fa',
          borderColor: '#204e88',
        },
      standardSuccess: ({ theme }) =>
        theme.palette.mode === 'light' && {
          backgroundColor: '#d1e3d7',
          borderColor: '#086826',
        },
      root: {
        borderLeft: '4px solid',
      },
    },
  },
  MuiButtonBase: {
    defaultProps: {
      disableRipple: true,
    },
    styleOverrides: {
      root: {
        // focus visible will only affect keyboard focus, not active events -> border will clear on mouseclick
        ':focus-visible': {
          backgroundColor: '#808080',
        },
      },
    },
  },
  MuiCheckbox: {
    styleOverrides: {
      root: {
        ':focus-within': {
          backgroundColor: '#808080',
        },
      },
    },
  },
  MuiSwitch: {
    styleOverrides: {
      root: {
        ':focus-within': {
          backgroundColor: '#808080',
        },
      },
    },
  },
  MuiTab: {
    defaultProps: {
      focusRipple: false,
    },
    styleOverrides: {
      root: ({ theme }) =>
        theme.palette.mode === 'light' && {
          color: '#303030',
        },
    },
  },
  MuiTabs: {
    styleOverrides: {
      indicator: {
        height: '5px',
        ':hover': {
          backgroundColor: '#808080',
        },
      },
    },
  },
  MuiInputLabel: {
    styleOverrides: {
      root: {
        position: 'relative',
        lineHeight: '1.2rem',
        transform: 'none',
      },
    },
  },
  MuiCssBaseline: {
    styleOverrides: {
      '*': {
        margin: 0,
        padding: 0,
      },
      'html, body, #root': {
        height: '100%',
      },
      ul: {
        listStyle: 'none',
      },
    },
  },

  MuiOutlinedInput: {
    styleOverrides: {
      root: {
        '& legend': { backgroundColor: 'transparent', width: 0 },
      },
    },
  },
};
