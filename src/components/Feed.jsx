import { Stack, Typography, Box } from "@mui/material"
import SideBar from "./SideBar"
import { useEffect, useState } from "react"
import Navbar from "./Navbar"
import Videos from './Videos'
import InfiniteScroll from 'react-infinite-scroll-component'
import SkeletonCard from './SkeletonCard'
import { useTheme } from '@mui/material/styles'
const key = import.meta.env.VITE_RAPID_API_YOUTUBE_KEY

function Feed() {
    const [selectedCategory, setSelectedCategory] = useState("New")
    const [videos, setVideos] = useState([])
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const [isLoading, setIsLoading] = useState(false)
    const theme = useTheme();

    useEffect(() => {
        setVideos([])
        setPage(1)
        fetchVideos(selectedCategory, 1)
    }, [selectedCategory])

    const fetchVideos = async (category, pageNum) => {
        setIsLoading(true)
        try {
            const response = await fetch(`https://youtube-v31.p.rapidapi.com/search?part=snippet&q=${category}&maxResults=20&page=${pageNum}&rapidapi-key=${key}`)
            const data = await response.json()
            if (data.items.length === 0) {
                setHasMore(false)
                return
            }
            setVideos(prev => [...prev, ...data.items])
        } catch (error) {
            console.error("Error fetching videos:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const fetchMoreVideos = () => {
        const nextPage = page + 1
        fetchVideos(selectedCategory, nextPage)
        setPage(nextPage)
    }
    return (
        <Stack sx={{ height: '100vh', overflow: 'hidden' }}> {/* Add overflow: 'hidden' here */}
            <Navbar />
            <Stack
                direction={{ xs: 'column', md: 'row' }}
                sx={{
                    height: 'calc(100vh - 64px)',
                    mt: '64px',
                    overflow: 'hidden',
                    bgcolor: theme.palette.background.default
                }}
            >
                <Box sx={{
                    width: { xs: '100%', md: '240px' },
                    height: '100%',
                    borderRight: `1px solid ${theme.palette.divider}`,
                    px: { xs: 0, md: 2 },
                    overflowY: 'auto',
                    bgcolor: theme.palette.background.paper,
                    flexShrink: 0, // Prevent sidebar from shrinking
                }}>
                    <SideBar setSelectedCategory={setSelectedCategory} selectedCategory={selectedCategory} />
                    <Typography variant='body2' sx={{
                        mt: 1,
                        color: '#fff'
                    }}>
                        Copyright <i className="fa fa-copyright" aria-hidden="true"></i><br />
                        MeetEnterprise2023
                    </Typography>
                </Box>

                <Box
                    id="scrollableDiv"
                    sx={{
                        flex: 1,
                        overflowY: 'auto',
                        height: '100%',
                        px: { xs: 2, md: 4 }, // Add horizontal padding
                        py: 3,
                        bgcolor: theme.palette.background.default,
                        '&::-webkit-scrollbar': {
                            width: '8px',
                        },
                        '&::-webkit-scrollbar-track': {
                            background: theme.palette.background.paper,
                        },
                        '&::-webkit-scrollbar-thumb': {
                            background: theme.palette.grey[600],
                            borderRadius: '4px',
                        },
                        '&::-webkit-scrollbar-thumb:hover': {
                            background: theme.palette.grey[700],
                        }
                    }}
                >
                    <Typography 
                        variant="h4"
                        fontWeight='bold'
                        mb={3}
                        color={theme.palette.text.primary}
                    >
                        {selectedCategory} <span style={{ color: theme.palette.primary.main }}>Videos</span>
                    </Typography>

                    <InfiniteScroll
                        dataLength={videos.length}
                        next={fetchMoreVideos}
                        hasMore={hasMore}
                        loader={<SkeletonCard />}
                        endMessage={
                            <p style={{ textAlign: 'center', color: '#fff' }}>
                                <b>Yay! You have seen it all</b>
                            </p>
                        }
                        scrollableTarget="scrollableDiv"
                        style={{ overflow: 'visible' }} // Add this line
                    >
                        <Videos videos={videos} isLoading={isLoading} />
                    </InfiniteScroll>
                </Box>
            </Stack>
        </Stack>
    )
}

export default Feed
