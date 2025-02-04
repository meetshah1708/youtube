import { CheckCircle } from "@mui/icons-material";
import { Box, Stack, Typography, useTheme, IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { Link, useParams } from "react-router-dom"
import Videos from './Videos'
import Comments from './Comments'
import Navbar from './Navbar'
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import DeleteIcon from '@mui/icons-material/Delete';
import { useWatchLater } from '../contexts/WatchLaterContext';
const key = import.meta.env.VITE_RAPID_API_YOUTUBE_KEY



export default function VideoDetail() {
    const [ videoDetail, setVideoDetail ] = useState(null)
    const [ videos, setVideos ] = useState(null)
    const theme = useTheme();
    const params = useParams();//to get the video id
    // console.log(params)
    const id = params.videoId
    const { watchLaterItems, addToWatchLater, removeFromWatchLater } = useWatchLater();
    const [isInWatchLater, setIsInWatchLater] = useState(false);

    useEffect(() => {
        const fetchVideo = async () => {
            try {
                const response = await fetch(`https://youtube-v31.p.rapidapi.com/videos?part=snippet,statistics,contentDetails&id=${id}&rapidapi-key=${key}`)
                const data = await response.json()
                // console.log(data?.items)
                setVideoDetail(data?.items[ 0 ])

                const relatedResponse = await fetch(`https://youtube-v31.p.rapidapi.com/search?part=snippet&relatedToVideoId=${id}&type=video&rapidapi-key=${key}`)
                const relatedData = await relatedResponse.json()
                setVideos(relatedData.items)
            } catch (error) {
                console.error("Error fetching video details:", error)
            }
        }
       fetchVideo()
    }, [ id ])

    useEffect(() => {
        if (id) {
            setIsInWatchLater(watchLaterItems.some(item => item.id === id));
        }
    }, [watchLaterItems, id]);

    const handleWatchLater = () => {
        if (!videoDetail) return;
        const videoInfo = {
            id: id, // Use the id from params instead of videoDetail.id
            title: videoDetail.snippet.title,
            thumbnail: videoDetail.snippet.thumbnails.medium.url,
            channelTitle: videoDetail.snippet.channelTitle
        };
        if (isInWatchLater) {
            removeFromWatchLater(id);
        } else {
            addToWatchLater(videoInfo);
        }
    };

    if (!videoDetail?.snippet) return 'Loading ...'
    const { snippet: { title, channelId, channelTitle }, statistics: { viewCount, likeCount }
    } = videoDetail
    return (
        <Box 
            minHeight='95vh' 
            sx={{ 
                paddingTop: '80px',
                backgroundColor: theme.palette.mode === 'dark' ? '#0f0f0f' : '#f9f9f9'
            }}
        >
            <Navbar />
            <Stack direction={{ xs: 'column', md: 'row' }}>
                <Box flex={1}>
                    <Box sx={{ width: '100%', position: 'sticky', top: '86px' }}>
                        <ReactPlayer url={`https://youtu.be/${id}`} //to watch here use url ={https://www.youtube.com/watch&v=${id}}
                            className='react-player' controls />
                        <Typography 
                            color={theme.palette.mode === 'dark' ? '#fff' : '#000'} 
                            variant='h5' 
                            fontWeight='bold' 
                            p={2}
                        >
                            {title}
                        </Typography>
                        <Stack direction='row' justifyContent='space-between' py={1} px={2}>
                            <Link to={`/channel/${channelId}`} style={{ textDecoration: 'none' }}>
                                <Typography 
                                    variant="body1"
                                    color={theme.palette.mode === 'dark' ? '#fff' : '#000'}
                                    sx={{
                                        '&:hover': {
                                            color: theme.palette.primary.main
                                        }
                                    }}
                                >
                                    {channelTitle}
                                    <CheckCircle sx={{
                                        fontSize: '12px', color: 'gray',
                                        ml: '5px'
                                    }} />
                                </Typography>
                            </Link>
                            <Stack direction='row' gap='20px' alignItems='center'>
                                <Typography 
                                    variant='body1' 
                                    sx={{ 
                                        opacity: 0.7,
                                        color: theme.palette.mode === 'dark' ? '#fff' : '#000'
                                    }}
                                >
                                    {parseInt(viewCount).toLocaleString()} views
                                </Typography>
                                <Typography 
                                    variant='body1' 
                                    sx={{ 
                                        opacity: 0.7,
                                        color: theme.palette.mode === 'dark' ? '#fff' : '#000'
                                    }}
                                >
                                    {parseInt(likeCount).toLocaleString()} likes
                                </Typography>
                                <IconButton onClick={handleWatchLater}>
                                    {isInWatchLater ? <DeleteIcon /> : <WatchLaterIcon />}
                                </IconButton>
                                {/* tolocaleString( ) used to make numerical value readable */}
                            </Stack>
                        </Stack>
                        <Comments videoId={id} />
                    </Box>
                </Box>
                <Box 
                    px={2} 
                    py={{ md: 1, xs: 5 }} 
                    justifyContent='center' 
                    alignItems='center'
                    sx={{
                        backgroundColor: theme.palette.mode === 'dark' ? '#0f0f0f' : '#f9f9f9',
                        [theme.breakpoints.between('md','lg')]: {
                            px: 4,
                            py: 2
                        }
                    }}
                >
                    <Typography 
                        variant="h6" 
                        sx={{ 
                            mb: 2,
                            color: theme.palette.mode === 'dark' ? '#fff' : '#000'
                        }}
                    >
                        Related Videos
                    </Typography>
                    <Videos videos={videos} direction='column' />
                </Box>
            </Stack>
        </Box>
    )
}