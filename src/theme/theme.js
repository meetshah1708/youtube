import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#f44336',
        },
        background: {
            default: '#0f0f0f',
            paper: '#1e1e1e',
        },
        text: {
            primary: '#ffffff',
            secondary: '#aaaaaa',
        },
    },
    typography: {
        fontFamily: '"Roboto", "Arial", sans-serif',
        h6: {
            fontWeight: 500,
            fontSize: '1.25rem',
        },
        subtitle1: {
            fontSize: '1rem',
            fontWeight: 500,
        },
        body2: {
            fontSize: '0.875rem',
        },
        caption: {
            fontSize: '0.75rem',
        },
    },
    components: {
        MuiCard: {
            styleOverrides: {
                root: {
                    backgroundColor: '#1e1e1e',
                    borderRadius: 0,
                },
            },
        },
        MuiCardContent: {
            styleOverrides: {
                root: {
                    padding: '16px',
                    '&:last-child': {
                        paddingBottom: '16px',
                    },
                },
            },
        },
    },
}); 