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
} from "@mui/material";
import { Menu, YouTube, Brightness4, Brightness7 } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { ColorModeContext } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";
import SearchBar from "./SearchBar";
import SideBar from "./SideBar";

function Navbar() {
    const { user, logout } = useAuth();
    const colorMode = useContext(ColorModeContext);
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    const [mobileOpen, setMobileOpen] = useState(false);
    const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

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
                © MeetEnterprise2023
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
                        {!isDesktop && (
                            <IconButton
                                size="large"
                                color="inherit"
                                onClick={handleDrawerToggle}
                                sx={{ mr: 1 }}
                            >
                                <Menu />
                            </IconButton>
                        )}
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
                        {user ? (
                            <>
                                {/* noWrap + ellipsis for user email on smaller widths */}
                                <Typography
                                    variant="body2"
                                    noWrap
                                    sx={{
                                        maxWidth: { xs: 80, sm: 140 },
                                        color: theme.palette.text.primary,
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                    }}
                                >
                                    {user.email}
                                </Typography>
                                <Button onClick={logout} variant="outlined" color="inherit">
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button component={Link} to="/login" color="inherit">
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
                        <IconButton
                            sx={{ ml: 1 }}
                            onClick={colorMode.toggleColorMode}
                            color="inherit"
                        >
                            {isDark ? <Brightness7 /> : <Brightness4 />}
                        </IconButton>
                        <IconButton sx={{ color: theme.palette.text.primary }}>
                            <i className="fa fa-user-circle" aria-hidden="true"></i>
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