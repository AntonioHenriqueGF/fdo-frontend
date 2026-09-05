import { createTheme, ThemeProvider, type PaletteOptions } from '@mui/material';

export const FdoCustomPallete = {
  primary: {
    main: '#245b8f',
  },
  warning: {
    main: '#FFA400',
    contrastText: '#ffffff',
  },
  error: {
    main: '#FB4D3D',
  },
} satisfies PaletteOptions;

const theme = createTheme({
  components: {
    MuiInputBase: {
      styleOverrides: {
        root: {
          height: 36,
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          top: -3,
        },
      },
    },
    MuiButtonBase: {
      styleOverrides: {
        root: {
          height: 36,
        },
      },
    },
  },
  palette: FdoCustomPallete,
});

export const MuiStyleProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};
