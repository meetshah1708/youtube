import { Stack, Typography, Box } from "@mui/material"
import SideBar from "./SideBar"
import { useEffect, useState } from "react"
import Navbar from "./Navbar"
import Videos from './Videos'
import InfiniteScroll from 'react-infinite-scroll-component'
import SkeletonCard from './SkeletonCard'
const key = import.meta.env.VITE_RAPID_API_YOUTUBE_KEY

function Feed() {
    const [ selectedCategory, setSelectedCategory ] = useState("New")
    const [ videos, setVideos ] = useState([])
    const [ page, setPage ] = useState(1)
    const [ hasMore, setHasMore ] = useState(true)
    const [ isLoading, setIsLoading ] = useState(false)

    useEffect(() => {
        setVideos([])
        setPage(1)
        fetchVideos(selectedCategory, 1)
    }, [ selectedCategory ])

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
        <>
            <Navbar />
            <Stack
                sx={{
                    direction: 'row',
                    flexDirection: { xs: 'column', md: 'row' },
                    paddingTop: '80px'
                }}>
                <Box sx={{
                    height: { xs: 'auto', md: '95vh' },
                    borderRight: '1px solid white',
                    px: { sx: 0, md: 2 },
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
                <Box p={2} sx={{
                    overflowY: 'auto',
                    height: "90vh",
                    flex: 2,
                    mt: "100px"
                }}>
                    <Typography variant="h4"
                        fontWeight='bold' mb={2}
                        color="#000"
                    >
                        {selectedCategory}  <span style={{
                            color: 'red'
                        }}>
                            Videos
                        </span>
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
                    >
                        <Videos videos={videos} isLoading={isLoading} />
                    </InfiniteScroll>
                </Box>
            </Stack>
        </>
    )
}

export default Feed