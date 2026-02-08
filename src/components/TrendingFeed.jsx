import { useEffect, useState } from "react";
import { Box, Typography, Container, Alert } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { TrendingUp } from "@mui/icons-material";
import Videos from "./Videos";
import Navbar from "./Navbar";
import SkeletonCard from "./SkeletonCard";

const key = import.meta.env.VITE_RAPID_API_YOUTUBE_KEY;

export default function TrendingFeed() {
    const [videos, setVideos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const theme = useTheme();

    useEffect(() => {
        const fetchTrending = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const url = `https://youtube-v311.p.rapidapi.com/search?part=snippet&q=trending&maxResults=40&order=viewCount`;
                const options = {
                    method: 'GET',
                    headers: {
                        'x-rapidapi-key': key,
                        'x-rapidapi-host': 'youtube-v311.p.rapidapi.com',
                    },
                };
                const response = await fetch(url, options);
                const data = await response.json();
                if (data.items) {
                    setVideos(data.items);
                }
            } catch (err) {
                setError('Failed to load trending videos. Please try again later.');
                console.error("Error fetching trending videos:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTrending();
    }, []);

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: theme.palette.background.default }}>
            <Navbar />
            <Container maxWidth="xl" sx={{ pt: 12, pb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <TrendingUp sx={{ fontSize: 40, color: theme.palette.primary.main }} />
                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 700,
                            color: theme.palette.text.primary
                        }}
                    >
                        Trending{" "}
                        <span style={{ color: theme.palette.primary.main }}>Videos</span>
                    </Typography>
                </Box>
                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
                )}
                {isLoading ? (
                    <SkeletonCard />
                ) : (
                    <Videos videos={videos} />
                )}
            </Container>
        </Box>
    );
}
