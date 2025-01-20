import PropTypes from "prop-types"
import { Box, Grid } from "@mui/material"
import VideoCard from "./VideoCard"
import ChannelCard from "./ChannelCard"
import SkeletonCard from "./SkeletonCard"

function Videos({ videos, isLoading }) {
    return (
        <Grid container spacing={2} sx={{ padding: '20px 0' }}>
            {isLoading ? (
                Array.from({ length: 8 }).map((_, idx) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={idx}>
                        <SkeletonCard />
                    </Grid>
                ))
            ) : (
                videos?.map((item, idx) => (// to resolve the error of undefined map
                    <Grid item xs={12} sm={6} md={4} lg={3} key={idx}>
                        {item.id?.videoId && <VideoCard video={item} />}
                        {item.id?.channelId && <ChannelCard channelDetail={item} />}
                    </Grid>
                ))
            )}
        </Grid>
    )
}
Videos.propTypes = {
    videos: PropTypes.array,
    isLoading: PropTypes.bool
}
export default Videos
