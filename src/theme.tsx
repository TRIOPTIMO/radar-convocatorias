import { createTheme } from '@mui/material/styles';


const Theme = createTheme({
    palette: {
        primary: { main: '#ced4da' },
        secondary: { main: '#e9ecef', },
        background: { paper: '#ffffff' },
        info: { main: "#0062cc" }
    },
    typography: {
        fontFamily: '-apple-system,BlinkMacSystemFont, Segoe UI, sans-serif',
    },
    shape: {
        borderRadius: 10
    }
});

export default Theme;