import { useEffect, useState } from "react";
import { Stack, Typography, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import InfiniteScroll from "react-infinite-scroll-component";

import SideBar from "./SideBar";
import Videos from "./Videos";
import SkeletonCard from "./SkeletonCard";

const key = import.meta.env.VITE_RAPID_API_YOUTUBE_KEY;

export default function Feed() {
    const [selectedCategory, setSelectedCategory] = useState("New");
    const [videos, setVideos] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const theme = useTheme();

    useEffect(() => {
        // Reset videos and pages whenever the category changes
        setVideos([]);
        setPage(1);
        fetchVideos(selectedCategory, 1);
    }, [selectedCategory]);

    const fetchVideos = async (category, pageNum) => {
        setIsLoading(true);
        try {
            const url = `https://youtube-v311.p.rapidapi.com/search?part=snippet&q=${category}&maxResults=20&page=${pageNum}`;
            const options = {
                method: 'GET',
                headers: {
                    'x-rapidapi-key': key,
                    'x-rapidapi-host': 'youtube-v311.p.rapidapi.com',
                },
            };
            const response = await fetch(url, options);
            const data = await response.json();
            if (!data.items || data.items.length === 0) {
                setHasMore(false);
                return;
            }
            setVideos((prev) => [...prev, ...data.items]);
        } catch (error) {
            setHasMore(false);
            console.error("Error fetching videos:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchMoreVideos = () => {
        const nextPage = page + 1;
        fetchVideos(selectedCategory, nextPage);
        setPage(nextPage);
    };

    return (
        <Stack sx={{ minHeight: "100vh" }}>
            {/* This Stack is set to be responsive: column on small screens, row on larger */}
            <Stack
                direction={{ xs: "column", md: "row" }}
                sx={{ flex: 1, mt: { xs: 8, md: 8 } }}
            >
                {/* Sidebar: always visible but width changes with breakpoints */}
                <Box
                    sx={{
                        width: { xs: "100%", md: 240 },
                        borderRight: { xs: "none", md: `1px solid ${theme.palette.divider}` },
                        overflowY: "auto",
                        bgcolor: theme.palette.background.paper,
                    }}
                >
                    <SideBar
                        selectedCategory={selectedCategory}
                        setSelectedCategory={setSelectedCategory}
                    />
                    <Typography variant="body2" sx={{ mt: 1, color: "#fff", p: 1 }}>
                        © MeetEnterprise 2026
                    </Typography>
                </Box>

                {/* Main feed area */}
                <Box
                    id="scrollableDiv"
                    sx={{
                        flex: 1,
                        overflowY: "auto",
                        px: { xs: 2, md: 4 },
                        py: 3,
                        bgcolor: theme.palette.background.default,
                    }}
                >
                    <Typography
                        variant="h4"
                        fontWeight="bold"
                        mb={2}
                        color={theme.palette.text.primary}
                    >
                        {selectedCategory}{" "}
                        <span style={{ color: theme.palette.primary.main }}>Videos</span>
                    </Typography>
                    <InfiniteScroll
                        dataLength={videos.length}
                        next={fetchMoreVideos}
                        hasMore={hasMore}
                        loader={<SkeletonCard />}
                        endMessage={
                            <Typography
                                variant="body2"
                                sx={{ textAlign: "center", color: "#fff", mt: 2 }}
                            >
                                {/* <b>Yay! You have seen it all</b> */}
                            </Typography>
                        }
                        scrollableTarget="scrollableDiv"
                        style={{ overflow: "visible" }}
                    >
                        <Videos videos={videos} isLoading={isLoading} />
                    </InfiniteScroll>
                </Box>
            </Stack>
        </Stack>
    );
}