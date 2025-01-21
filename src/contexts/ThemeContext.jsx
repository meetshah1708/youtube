import { createContext, useState, useMemo } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";

export const ColorModeContext = createContext({ toggleColorMode: () => {} });

export default function ThemeContextProvider({ children }) {
    const [mode, setMode] = useState('dark');

    const colorMode = useMemo(
        () => ({
            toggleColorMode: () => {
                setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
            },
        }),
        [],
    );

    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode,
                    primary: {
                        main: '#fc1503',
                        light: '#ff4433',
                        dark: '#d41302',
                    },
                    background: {
                        default: mode === 'light' ? '#f9f9f9' : '#0f0f0f',
                        paper: mode === 'light' ? '#fff' : '#1e1e1e',
                        alternate: mode === 'light' ? '#f0f0f0' : '#2d2d2d',
                    },
                    text: {
                        primary: mode === 'light' ? '#0a0a0a' : '#ffffff',
                        secondary: mode === 'light' ? '#606060' : '#aaaaaa',
                        alternate: mode === 'light' ? '#757575' : '#909090',
                    },
                },
                typography: {
                    fontFamily: '"Roboto", "Arial", sans-serif',
                    h1: {
                        fontWeight: 700,
                        fontSize: '2.5rem',
                        lineHeight: 1.2,
                    },
                    h2: {
                        fontWeight: 600,
                        fontSize: '2rem',
                        lineHeight: 1.3,
                    },
                    h6: {
                        fontWeight: 500,
                        fontSize: '1.25rem',
                    },
                    subtitle1: {
                        fontSize: '1rem',
                        fontWeight: 500,
                        letterSpacing: '0.00938em',
                    },
                },
                components: {
                    MuiButton: {
                        styleOverrides: {
                            root: {
                                borderRadius: 20,
                                textTransform: 'none',
                                transition: 'all 0.3s ease',
                            },
                        },
                    },
                    MuiCard: {
                        styleOverrides: {
                            root: {
                                transition: 'transform 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                },
                            },
                        },
                    },
                    MuiPaper: {
                        styleOverrides: {
                            root: {
                                transition: 'all 0.3s ease',
                            },
                        },
                    },
                    MuiAppBar: {
                        styleOverrides: {
                            root: {
                                backgroundColor: mode === 'light' ? '#fff' : '#0f0f0f',
                            }
                        }
                    }
                }
            }),
        [mode],
    );

    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                {children}
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
} 