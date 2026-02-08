import { CheckCircle } from "@mui/icons-material";
import { Box, Stack, Typography, useTheme, IconButton, Alert, Container } from "@mui/material";
import { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { Link, useParams } from "react-router-dom"
import Videos from './Videos'
import Comments from './Comments'
import Navbar from './Navbar'
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import DeleteIcon from '@mui/icons-material/Delete';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import { useWatchLater } from '../contexts/WatchLaterContext';
import { useHistory } from '../contexts/HistoryContext';
import { useLikedVideos } from '../contexts/LikedVideosContext';
const key = import.meta.env.VITE_RAPID_API_YOUTUBE_KEY



export default function VideoDetail() {
    const [ videoDetail, setVideoDetail ] = useState(null)
    const [ videos, setVideos ] = useState([]) // Fix: initialize as []
    const [ error, setError ] = useState(null)
    const [ relatedError, setRelatedError] = useState(null);
    const theme = useTheme();
    const params = useParams();//to get the video id
    // console.log(params)
    const id = params.videoId
    const { watchLaterItems, addToWatchLater, removeFromWatchLater } = useWatchLater();
    const { addToHistory } = useHistory();
    const { isVideoLiked, addToLikedVideos, removeFromLikedVideos } = useLikedVideos();
    const [isInWatchLater, setIsInWatchLater] = useState(false);

    useEffect(() => {
        const fetchVideo = async () => {
            try {
                setError(null)
                setRelatedError(null)
                const options = {
                    method: 'GET',
                    headers: {
                        'x-rapidapi-key': key,
                        'x-rapidapi-host': 'youtube-v311.p.rapidapi.com'
                    }
                }
                const response = await fetch(`https://youtube-v311.p.rapidapi.com/videos?part=snippet,statistics,contentDetails&id=${id}`, options)
                const data = await response.json()
                // console.log(data?.items)
                setVideoDetail(data?.items[ 0 ])

                try {
                    const relatedResponse = await fetch(`https://youtube-v311.p.rapidapi.com/search?part=snippet&relatedToVideoId=${id}&type=video`, options);
                    const relatedData = await relatedResponse.json();
                    // Normalize related videos data
                    const normalized = (relatedData.items || []).map(item => {
                        if (typeof item.id === 'string') {
                            return { ...item, id: { videoId: item.id } };
                        } else if (item.id && item.id.videoId) {
                            return item;
                        } else {
                            return item;
                        }
                    });
                    setVideos(normalized);
                } catch (err) {
                    setRelatedError('Failed to load related videos. Please try again later.');
                    setVideos([]); // Always set to [] on error
                    console.error('Error fetching related videos:', err);
                }
            } catch (error) {
                setError('Failed to load video details. Please try again later.')
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

    // Track video in watch history when video details are loaded
    useEffect(() => {
        if (videoDetail?.snippet) {
            addToHistory({
                id: id,
                title: videoDetail.snippet.title,
                thumbnail: videoDetail.snippet.thumbnails?.medium?.url || videoDetail.snippet.thumbnails?.default?.url,
                channelTitle: videoDetail.snippet.channelTitle
            });
        }
    }, [videoDetail, id, addToHistory]);

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

    const handleLike = () => {
        if (!videoDetail) return;
        const videoInfo = {
            id: id,
            title: videoDetail.snippet.title,
            thumbnail: videoDetail.snippet.thumbnails.medium.url,
            channelTitle: videoDetail.snippet.channelTitle
        };
        if (isVideoLiked(id)) {
            removeFromLikedVideos(id);
        } else {
            addToLikedVideos(videoInfo);
        }
    };

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
                                <IconButton 
                                    onClick={handleLike}
                                    sx={{
                                        color: isVideoLiked(id) ? theme.palette.primary.main : 'inherit'
                                    }}
                                >
                                    {isVideoLiked(id) ? <ThumbUpIcon /> : <ThumbUpOutlinedIcon />}
                                </IconButton>
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
                    {relatedError && (
                        <Alert severity="warning" sx={{ mb: 2 }}>{relatedError}</Alert>
                    )}
                    <Videos videos={videos} direction='column' />
                </Box>
            </Stack>
        </Box>
    )
}