import { createTheme } from '@mui/material/styles';

const Theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },      // Azul institucional
    secondary: { main: '#009688' },    // Verde azulado (teal)
    background: {
      default: '#f4f6f8',              // Gris claro para fondo general
      paper: '#ffffff',                // Tarjetas blancas
    },
    info: { main: '#0288d1' },         // Azul más brillante para acentos
    success: { main: '#2e7d32' },      // Verde accesible
    warning: { main: '#ed6c02' },      // Naranja vivo
    error: { main: '#d32f2f' },        // Rojo
    text: {
      primary: '#212121',              // Gris oscuro (mejor legibilidad)
      secondary: '#546e7a',            // Gris azulado para subtítulos
    },
  },
  typography: {
    fontFamily: '-apple-system,BlinkMacSystemFont, Segoe UI, sans-serif',
    h6: { fontWeight: 600 },
    body2: { lineHeight: 1.5 },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        },
      },
    },
  },
});

export default Theme;
