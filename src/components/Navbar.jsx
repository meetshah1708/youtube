import { AppBar, Toolbar, Typography } from "@mui/material"
import SearchBar from "./SearchBar"
import { YouTube } from "@mui/icons-material"
import { Link } from 'react-router-dom'
function Navbar() {
    return (
        <div>
            <AppBar position="fixed" sx={{
                background: '#000',
                direction:'row'
            }}>
                <Toolbar sx={{ justifyContent: 'space-between', }}>
                    <Link to="/">
                        <YouTube sx={{
                            color: 'red',
                            fontSize: '40px',
                            cursor: "pointer"
                        }} />
                    </Link>

                    <Typography
                        variant="title"
                        color="inherit"
                        style={{
                            display: 'flex',

                        }}
                    >
                        METube
                    </Typography>
                    <SearchBar />
                </Toolbar>
            </AppBar>
        </div>
    )
}

export default Navbar
