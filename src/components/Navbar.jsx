/* Example Updated Navbar.jsx */
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    useTheme,
    Box,
    Button,
    Drawer,
    useMediaQuery,
    MenuItem,
    Menu as MuiMenu
} from "@mui/material";
import { Menu, YouTube, Brightness4, Brightness7,AccountCircle } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { ColorModeContext } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";
import SearchBar from "./SearchBar";


function Navbar() {
    const { user, logout } = useAuth();
    const colorMode = useContext(ColorModeContext);
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const [anchorEl, setAnchorEl] = useState(null);
    
    const [mobileOpen, setMobileOpen] = useState(false);
    const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
    const handleAccountClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    // Content shown in the small-screen Drawer
    const drawerContent = (
        <Box
            sx={{
                width: 250,
                overflowY: "auto",
                bgcolor: theme.palette.background.paper,
                height: "100%",
            }}
        >

            <Typography variant="body2" sx={{ mt: 1, color: "#fff", px: 2 }}>
            </Typography>
        </Box>
    );

    // This styling helps with a nice background gradient for the Navbar
    const appBarStyle = {
        background: isDark
            ? "linear-gradient(45deg, #333 20%, #555 90%)"
            : "linear-gradient(45deg, #2196F3 20%, #21CBF3 90%)",
    };

    return (
        <>
            <AppBar position="fixed" sx={appBarStyle}>
                {/* Allow it to wrap content for small screens */}
                <Toolbar sx={{ flexWrap: "wrap", justifyContent: "space-between" }}>
                    {/* Left section: brand logo, and (on small screens) the hamburger menu */}
                    <Box sx={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
                        <Link
                            to="/"
                            style={{
                                display: "flex",
                                alignItems: "center",
                                textDecoration: "none",
                            }}
                        >
                            <YouTube sx={{ color: "red", fontSize: "40px" }} />
                            <Typography
                                variant="h6"
                                sx={{
                                    ml: 1,
                                    color: theme.palette.text.primary,
                                    whiteSpace: "nowrap",
                                }}
                            >
                                METube
                            </Typography>
                        </Link>
                    </Box>

                    {/* Middle section: search bar (let it resize or wrap on small screens) */}
                    <Box
                        sx={{
                            flexGrow: 1,
                            minWidth: { xs: "100%", sm: 200 },
                            mx: { xs: 0, sm: 2 },
                            mt: { xs: 1, sm: 0 },
                        }}
                    >
                        <SearchBar />
                    </Box>

                    {/* Right section: user info, theme toggle, etc. */}
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            flexShrink: 0,
                            gap: 2,
                            mt: { xs: 1, sm: 0 },
                            overflow: "hidden",
                        }}
                    >
                        <IconButton
                            onClick={handleAccountClick}
                            sx={{ color: theme.palette.text.primary }}
                        >
                            <AccountCircle />
                        </IconButton>
                        <MuiMenu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                        >
                            {user ? [
                                <MenuItem key="email" disabled>
                                    {user.email}
                                </MenuItem>,
                                <MenuItem 
                                    key="watchlater" 
                                    component={Link} 
                                    to="/watch-later"
                                    onClick={handleClose}
                                >
                                    Watch Later
                                </MenuItem>,
                                <MenuItem 
                                    key="logout" 
                                    onClick={() => {
                                        handleClose();
                                        logout();
                                    }}
                                >
                                    Logout
                                </MenuItem>
                            ] : [
                                <MenuItem 
                                    key="login" 
                                    component={Link} 
                                    to="/login"
                                    onClick={handleClose}
                                >
                                    Login
                                </MenuItem>,
                                <MenuItem 
                                    key="signup" 
                                    component={Link} 
                                    to="/signup"
                                    onClick={handleClose}
                                >
                                    Sign Up
                                </MenuItem>
                            ]}
                        </MuiMenu>
                        <IconButton
                            sx={{ ml: 1 }}
                            onClick={colorMode.toggleColorMode}
                            color="inherit"
                        >
                            {isDark ? <Brightness7 /> : <Brightness4 />}
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Drawer for small screens */}
            {!isDesktop && (
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        "& .MuiDrawer-paper": {
                            boxSizing: "border-box",
                            width: 250,
                        },
                    }}
                >
                    {drawerContent}
                </Drawer>
            )}
        </>
    );
}

export default Navbar;