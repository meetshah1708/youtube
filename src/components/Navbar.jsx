import { AppBar, Toolbar, Typography, IconButton } from "@mui/material"
import SearchBar from "./SearchBar"
import { YouTube, Brightness4, Brightness7 } from "@mui/icons-material"
import { Link } from 'react-router-dom'
import { useContext } from "react"
import { ColorModeContext } from "../contexts/ThemeContext"
import { useTheme } from "@mui/material/styles"

function Navbar() {
    const colorMode = useContext(ColorModeContext)
    const theme = useTheme()

    return (
        <AppBar position="fixed" sx={{ background: '#000', padding: '0 20px' }}>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                    <YouTube sx={{ color: 'red', fontSize: '40px' }} />
                    <Typography variant="h6" component="div" sx={{ ml: 1, color: '#fff' }}>
                        METube
                    </Typography>
                </Link>
                <SearchBar />
                <IconButton sx={{ ml: 1 }} onClick={colorMode.toggleColorMode} color="inherit">
                    {theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
                </IconButton>
                <IconButton sx={{ color: '#fff' }}>
                    <i className="fa fa-user-circle" aria-hidden="true"></i>
                </IconButton>
            </Toolbar>
        </AppBar>
    )
}

export default Navbar
