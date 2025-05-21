import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Box, Container, Typography, Alert } from '@mui/material'
import ChannelCard from './ChannelCard'
import Videos from './Videos'
import Navbar from './Navbar'
import { useTheme } from '@mui/material/styles'

const key = import.meta.env.VITE_RAPID_API_YOUTUBE_KEY

export default function ChannelDetail() {
    const theme = useTheme()
    const [channelDetail, setChannelDetail] = useState(null)
    const [videos, setVideos] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const { channelId } = useParams()
    const id = channelId

    useEffect(() => {
        const fetchChannelData = async () => {
            try {
                setIsLoading(true)
                setError(null)
                // Fetch channel details
                const channelResponse = await fetch(
                    `https://youtube-v311.p.rapidapi.com/channels?part=snippet,statistics&id=${id}`,
                    {
                        headers: {
                            'x-rapidapi-key': key,
                            'x-rapidapi-host': 'youtube-v311.p.rapidapi.com'
                        }
                    }
                )
                const channelData = await channelResponse.json()
                setChannelDetail(channelData.items[0])

                // Fetch channel videos
                const videosResponse = await fetch(
                    `https://youtube-v311.p.rapidapi.com/search?channelId=${id}&part=snippet,id&order=date&maxResults=50`,
                    {
                        headers: {
                            'x-rapidapi-key': key,
                            'x-rapidapi-host': 'youtube-v311.p.rapidapi.com'
                        }
                    }
                )
                const videosData = await videosResponse.json()
                setVideos(videosData.items)
            } catch (error) {
                setError('Failed to load channel data. Please try again later.')
                console.error('Error fetching channel data:', error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchChannelData()
    }, [id])
    if (error) {
        return (
            <Box minHeight='95vh'>
                <Navbar />
                <Container maxWidth="xl" sx={{ pt: 10 }}>
                    <Alert severity="error">{error}</Alert>
                </Container>
            </Box>
        )
    }
    if (!channelDetail?.snippet) return 'Loading...'


    return (
        <Box minHeight='95vh'>
            <Navbar />
            <Box>
                <div style={{
                    background: 'linear-gradient(90deg , rgba(0,238,247,1) 0%, rgba(206,3,184,1)100% , rgba(0,212,255,1)100% )',
                    zIndex: 10,
                    height: '300px'
                }} />
                <ChannelCard
                    channelDetail={{ ...channelDetail, id: { channelId: channelDetail.id } }}
                    marginTop="-110px"
                />
            </Box>
            <Container maxWidth="xl">
                <Box sx={{ margin: '30px 0' }}>
                    <Typography variant="h5" color={theme.palette.text.primary} mb={3}>
                        Channel Statistics
                    </Typography>
                    <Box
                        sx={{
                            display: 'flex',
                            gap: 4,
                            flexWrap: 'wrap',
                            color: theme.palette.text.primary,
                            mb: 4
                        }}
                    >
                        <Box>
                            <Typography variant="body2" color={theme.palette.text.primary}>
                                Subscribers
                            </Typography>
                            <Typography variant="h6">
                                {parseInt(channelDetail?.statistics?.subscriberCount).toLocaleString()}
                            </Typography>
                        </Box>
                        <Box>
                            <Typography variant="body2" color={theme.palette.text.primary}>
                                Total Videos
                            </Typography>
                            <Typography variant="h6">
                                {parseInt(channelDetail?.statistics?.videoCount).toLocaleString()}
                            </Typography>
                        </Box>
                        <Box>
                            <Typography variant="body2" color={theme.palette.text.primary}>
                                Total Views
                            </Typography>
                            <Typography variant="h6">
                                {parseInt(channelDetail?.statistics?.viewCount).toLocaleString()}
                            </Typography>
                        </Box>
                    </Box>
                    <Typography variant="h5" color={theme.palette.text.primary} mb={2}>
                        Videos
                    </Typography>
                    <Videos videos={videos} isLoading={isLoading} />
                </Box>
            </Container>
        </Box>
    )
}
