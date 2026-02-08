import React from "react";
import PropTypes from "prop-types";
import { Stack, Button, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { categories } from "../assets/youtube";
import WatchLater from '@mui/icons-material/WatchLater';
import HistoryIcon from '@mui/icons-material/History';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PlaylistPlayIcon from '@mui/icons-material/PlaylistPlay';
import { Link } from 'react-router-dom';

export default function SideBar({ selectedCategory, setSelectedCategory }) {
    const theme = useTheme();

    return (
        <Stack
            sx={{
                overflowY: "auto",
                height: { xs: "auto", md: "95vh" },
                flexDirection: { md: "column" },
                bgcolor: theme.palette.background.paper,
                paddingTop: "70px"
            }}
        >
            {categories.map((cat) => (
                <Button
                    key={cat.name}
                    onClick={() => setSelectedCategory(cat.name)}
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        backgroundColor: cat.name === selectedCategory ? theme.palette.primary.main : "transparent",
                        color: cat.name === selectedCategory ? "#fff" : theme.palette.text.primary,
                        textTransform: "none",
                        padding: "10px 20px",
                        "&:hover": {
                            backgroundColor: theme.palette.primary.main,
                            color: "#fff"
                        }
                    }}
                >
                     <i className={cat.icon} style={{ marginRight: "15px" }}></i>
                     {cat.name}
                </Button>
            ))}

            <Button
                component={Link}
                to="/trending"
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    backgroundColor: "transparent",
                    color: theme.palette.text.primary,
                    textTransform: "none",
                    padding: "10px 20px",
                    "&:hover": {
                        backgroundColor: theme.palette.primary.main,
                        color: "#fff"
                    }
                }}
            >
                <TrendingUpIcon sx={{ mr: 2 }} />
                Trending
            </Button>

            <Button
                component={Link}
                to="/watch-later"
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    backgroundColor: "transparent",
                    color: theme.palette.text.primary,
                    textTransform: "none",
                    padding: "10px 20px",
                    "&:hover": {
                        backgroundColor: theme.palette.primary.main,
                        color: "#fff"
                    }
                }}
            >
                <WatchLater sx={{ mr: 2 }} />
                Watch Later
            </Button>

            <Button
                component={Link}
                to="/history"
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    backgroundColor: "transparent",
                    color: theme.palette.text.primary,
                    textTransform: "none",
                    padding: "10px 20px",
                    "&:hover": {
                        backgroundColor: theme.palette.primary.main,
                        color: "#fff"
                    }
                }}
            >
                <HistoryIcon sx={{ mr: 2 }} />
                History
            </Button>

            <Button
                component={Link}
                to="/liked-videos"
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    backgroundColor: "transparent",
                    color: theme.palette.text.primary,
                    textTransform: "none",
                    padding: "10px 20px",
                    "&:hover": {
                        backgroundColor: theme.palette.primary.main,
                        color: "#fff"
                    }
                }}
            >
                <ThumbUpIcon sx={{ mr: 2 }} />
                Liked Videos
            </Button>

            <Button
                component={Link}
                to="/playlists"
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    backgroundColor: "transparent",
                    color: theme.palette.text.primary,
                    textTransform: "none",
                    padding: "10px 20px",
                    "&:hover": {
                        backgroundColor: theme.palette.primary.main,
                        color: "#fff"
                    }
                }}
            >
                <PlaylistPlayIcon sx={{ mr: 2 }} />
                Playlists
            </Button>

            <Typography 
                variant="caption" 
                sx={{ 
                    textAlign: "center",
                    padding: "10px",
                    color: theme.palette.text.secondary
                }}
            >
                {/* © 2024 MeetEnterprise */}
            </Typography>
        </Stack>
    );
}

SideBar.propTypes = {
    selectedCategory: PropTypes.string.isRequired,
    setSelectedCategory: PropTypes.func.isRequired
};