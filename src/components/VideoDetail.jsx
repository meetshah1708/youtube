import { CheckCircle } from "@mui/icons-material";
import { Box, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { Link, useParams } from "react-router-dom"
import Videos from './Videos'
const key = import.meta.env.VITE_RAPID_API_YOUTUBE_KEY



export default function VideoDetail() {
    const [ videoDetail, setVideoDetail ] = useState(null)
    const [ videos, setVideos ] = useState(null)
    const params = useParams();//to get the video id
    // console.log(params)
    const id = params.videoId
    useEffect(() => {
        const fetchVideo = async () => {
            const response = await fetch(`https://youtube-v31.p.rapidapi.com/videos?part=snippet,statistics,contentDetails&id=${id}&rapidapi-key=${key}`)
            const data = await response.json()
            // console.log(data?.items)
            setVideoDetail(data?.items[ 0 ])

            const getvideo = await fetch(`https://youtube-v31.p.rapidapi.com/search?part=snippet&relatedToVideoId=${id}&type=video&rapidapi-key=aae2ee2ccbmshf279c85ae14c4d3p1b6ad4jsn070466eba614`)
            const vid = await getvideo.json();
            setVideos(vid.items)
        }
       fetchVideo()
    }, [ id ])
    if (!videoDetail?.snippet) return 'Loading ...'
    const { snippet: { title, channelId, channelTitle }, statistics: { viewCount, likeCount }
    } = videoDetail
    return (
        <>
            <Box minHeight='95vh'>
                <Stack direction={{ xs: 'column', md: 'row' }}>
                    <Box flex={1}>
                        <Box sx={{ width: '100%', position: 'sticky', top: '86px' }}>
                            <ReactPlayer url={`https://youtu.be/${id}`} //to watch here use url ={https://www.youtube.com/watch&v=${id}}
                                className='react-player' controls />
                            <Typography color='#fff' variant='h5' fontWeight='bold' p={2} >
                                {title}
                            </Typography>
                            <Stack direction='row' justifyContent='space-between' color='#fff' py={1} px={2}>
                                <Link to={`/channel/${channelId}`}>
                                    <Typography variant={{ sm: 'subtitle1', md: 'h6' }}
                                        color='#fff'>
                                        {channelTitle}
                                        <CheckCircle sx={{
                                            fontSize: '12px', color: 'gray',
                                            ml: '5px'
                                        }} />
                                    </Typography>
                                </Link>
                                <Stack direction='row' gap='20px' alignItems='center'>
                                    <Typography variant='body1' sx={{ opacity: 0.7 }} >
                                        {parseInt(viewCount).toLocaleString()} views
                                    </Typography>
                                    <Typography variant='body1' sx={{ opacity: 0.7 }}>
                                        {parseInt(likeCount).toLocaleString()} likes
                                    </Typography>
                                    {/* tolocaleString( ) used to make numerical value readable */}
                                </Stack>
                            </Stack>
                        </Box>
                    </Box>
                    <Box px={2} py={{ md: 1, xs: 5 }} justifyContent='center' alignItems='center'>
                        
                        <Videos videos={videos} direction='column' />
                    </Box>
                </Stack>
            </Box>
        </>
    )
}
