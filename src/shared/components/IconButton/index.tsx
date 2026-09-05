import {
  Button,
  createTheme,
  ThemeProvider,
  Tooltip,
  type ButtonProps,
} from '@mui/material';
import { FdoCustomPallete } from '../../../MuiStyleProvider';

interface IconButtonProps extends ButtonProps {
  tooltipTitle?: React.ReactNode;
}

const ICON_BUTTON_SIZE = 36;

const theme = createTheme({
  palette: FdoCustomPallete,
  components: {
    MuiButtonBase: {
      styleOverrides: {
        root: {
          width: ICON_BUTTON_SIZE,
          height: ICON_BUTTON_SIZE,
          minWidth: `${ICON_BUTTON_SIZE}px !important`,
          minHeight: ICON_BUTTON_SIZE,
          maxWidth: ICON_BUTTON_SIZE,
          maxHeight: ICON_BUTTON_SIZE,
        },
      },
    },
  },
});

export const IconButton: React.FC<IconButtonProps> = ({
  children,
  tooltipTitle,
  ...props
}) => {
  return (
    <ThemeProvider theme={theme}>
      <Tooltip title={tooltipTitle} placement="top" arrow>
        <Button variant="contained" {...props}>
          {children}
        </Button>
      </Tooltip>
    </ThemeProvider>
  );
};
