import { Box } from '@mui/material'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ChannelCard from './ChannelCard'
import Videos from './Videos'
const key = import.meta.env.VITE_RAPID_API_YOUTUBE_KEY
export default function ChannelDetail() {
    const [ channelDetail, setChannelDetail ] = useState(null)
    const [ videos, setVideos ] = useState([])
    const params = useParams()
    // console.log(params)
    const id = params.channelId
    useEffect(() => {
        const getdata = async () => {
            const response = await fetch(`https://youtube-v31.p.rapidapi.com/channels?&part=snippet&id=${id}&rapidapi-key=${key}`)
            const data = await response.json()
            console.log(data.items[ 0 ]) //rendering many times because did not mentioned dependency
            setChannelDetail(data.items[ 0 ])

            const getVideo = await fetch(`https://youtube-v31.p.rapidapi.com/search?&part=snippet&channelId=${id}&order=date&rapidapi-key=${key}`)
            const vid = await getVideo.json()
            // console.log(vid.items)
            setVideos(vid.items)

        }

        return () => getdata()
    }, [ id ])
    return (
        <Box minHeight='95vh'>
            <Box>
                <div style={{
                    background: 'linear-gradient(90deg , rgba(0,238,247,1) 0%, rgba(206,3,184,1)100% , rgba(0,212,255,1)100% )',
                    zIndex: 10,
                    height: '300px'
                }} />
                <ChannelCard channelDetail={channelDetail} marginTop='-110px' />
            </Box>
            <Box>

                <Box />
                <Videos videos={videos} />
            </Box>
        </Box>
    )
}
