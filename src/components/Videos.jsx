import PropTypes from "prop-types"
import { Box, Stack } from "@mui/material"
import VideoCard from "./VideoCard"
import ChannelCard from "./ChannelCard"

function Videos({ videos }) {
    return (
        <Stack
            direction='row'
            flexWrap='wrap'
            justifyContent="start"
            gap={2}
        >
            {videos && videos.map((item, idx) => {   //cannot read properties of undefined map --> videos&& (if there is any null value then)
                return (
                    <Box key={idx}>
                        {item.id.videoId && <VideoCard video={item} />}
                        {item.snippet.ChannelId && <ChannelCard channelDetail={item} />}
                    </Box>
                )
            }


            )}
        </Stack>
    )
}
Videos.propTypes = {                    //to solve  props validation 
    videos: PropTypes.any
}
export default Videos
