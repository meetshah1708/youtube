import { AppBar, Toolbar, Typography, IconButton, useTheme, Box, Button } from "@mui/material"
import SearchBar from "./SearchBar"
import { YouTube, Brightness4, Brightness7 } from "@mui/icons-material"
import { Link } from 'react-router-dom'
import { useContext } from "react"
import { ColorModeContext } from "../contexts/ThemeContext"
import { useAuth } from "../contexts/AuthContext"

function Navbar() {
    const { user, logout } = useAuth();
    const colorMode = useContext(ColorModeContext)
    const theme = useTheme()

    return (
        <AppBar position="fixed">
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', padding: '0 20px' }}>
                <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                    <YouTube sx={{ color: 'red', fontSize: '40px' }} />
                    <Typography variant="h6" sx={{ ml: 1, color: theme.palette.text.primary }}>
                        METube
                    </Typography>
                </Link>
                <SearchBar />
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    {user ? (
                        <>
                            <Typography variant="body2">
                                {user.email}
                            </Typography>
                            <Button
                                onClick={logout}
                                variant="outlined"
                                color="inherit"
                            >
                                Logout
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                component={Link}
                                to="/login"
                                color="inherit"
                            >
                                Login
                            </Button>
                            <Button
                                component={Link}
                                to="/signup"
                                variant="contained"
                                color="primary"
                            >
                                Sign Up
                            </Button>
                        </>
                    )}
                    <IconButton sx={{ ml: 1 }} onClick={colorMode.toggleColorMode} color="inherit">
                        {theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
                    </IconButton>
                </Box>
                <IconButton sx={{ color: theme.palette.text.primary }}>
                    <i className="fa fa-user-circle" aria-hidden="true"></i>
                </IconButton>
            </Toolbar>
        </AppBar>
    )
}

export default Navbar
