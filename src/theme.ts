import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: { main: '#1565C0' },
    secondary: { main: '#0288D1' },
    success: { main: '#2E7D32' },
    warning: { main: '#E65100' },
    error: { main: '#C62828' },
    background: {
      default: '#F8F9FC',
      paper: '#FFFFFF',
    },
  },
  shape: { borderRadius: 10 },
  typography: {
    h5: { fontWeight: 700 },
    h6: { fontWeight: 600 },
    body1: { fontWeight: 400 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          border: '1px solid #E0E4EF',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 600,
        },
      },
    },
  },
});
