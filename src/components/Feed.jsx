import { Stack, Typography, Box } from "@mui/material"
import SideBar from "./SideBar"
import { useEffect, useState } from "react"
import Navbar from "./Navbar"
import Videos from './Videos'
const key = import.meta.env.VITE_RAPID_API_YOUTUBE_KEY

function Feed() {
    const [ selectedCategory, setSelectedCategory ] = useState("New")
    const [ videos, setVideos ] = useState([])
    useEffect(() => {
        async function getData() {
            const response = await fetch(`https://youtube-v31.p.rapidapi.com/search?part=snippet&q=${selectedCategory}&maxResults=50&rapidapi-key=${key}`);
            const data = await response.json()
            console.log(data.items)
            setVideos(data.items)
        }
     
         getData()
    }, [ selectedCategory ])

    return (
        <>
            <Navbar />
            <Stack
                sx={{
                    direction: 'column',
                    flexDirection: { xs: 'auto', md: 'row' },

                }}>
                <Box sx={{
                    height: { xs: 'auto', md: '92vh' },
                    borderRight: '1px solid white',
                    px: { sx: 0, md: 2 },
                    mt: '100px'
                }}>
                    <SideBar setSelectedCategory={setSelectedCategory} selectedCategory={selectedCategory} />

                    <Typography variant='body2' sx={{
                        mt: 1
                    }}>
                        Copyright <i className="fa fa-copyright" aria-hidden="true"></i><br />
                        MeetEterprise2023
                    </Typography>
                </Box>
                <Box p={2} sx={{
                    owerflowY: 'auto',
                    height: "90vh",
                    flex: 2,
                    mt: " 100px"
                }}>
                    <Typography variant="h4"
                        fontWeight='bold' mb={2}
                    >
                        {selectedCategory}  <span style={{
                            color: 'red'
                        }}>
                            Videos
                        </span>
                    </Typography>

                    <Videos videos={videos} />
                </Box>


            </Stack>
        </>

    )
}

export default Feed