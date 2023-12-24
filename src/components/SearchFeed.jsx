import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Box, Typography } from '@mui/material'
import Videos from './Videos'
const key = import.meta.env.VITE_RAPID_API_YOUTUBE_KEY

export default function SearchFeed() {
    const [ videos, setVideos ] = useState([])
    const params = useParams()
    console.log(params)
    const searchTerm = params.searchTerm

    useEffect(() => {
        const getData = async () => {
            const response = await fetch(`https://youtube-v31.p.rapidapi.com/search?part=snippet&rapidapi-key=${key}&q=${searchTerm}`)
            const data = await response.json()
            // console.log(data)
            setVideos(data.items)
        }
         getData()
    }, [ searchTerm ])
    return (
        <Box p={2} sx={{ overflowY: 'auto', height: '90vh', flex: 2 }}>
            <Typography variant='h4' fontWeight='bold' mb={2} sx={{ color: "white" }}>
                Search results for : <span style={{ color: '#f31503' }}>{searchTerm}  videos</span>
            </Typography>
            <Videos videos={videos} />
        </Box>
    )
}
