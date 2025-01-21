import PropTypes from "prop-types"
import { Box, Grid } from "@mui/material"
import VideoCard from "./VideoCard"
import ChannelCard from "./ChannelCard"
import SkeletonCard from "./SkeletonCard"
import { useTheme } from '@mui/material/styles'

// Videos component handles both loading state and video/channel rendering
// Common errors: undefined videos array, missing isLoading prop
function Videos({ videos, isLoading }) {
    const theme = useTheme();

    return (
        <Box sx={{ 
            width: '100%',
            padding: '20px 0',
            overflowX: 'hidden' // Prevent horizontal scroll
        }}>
            <Grid 
                container 
                spacing={3} // Increased spacing between items
                alignItems="stretch"
                sx={{
                    margin: 0,
                    width: '100%',
                }}
            >
                {/* Loading state - shows skeleton cards while fetching data */}
                {isLoading ? (
                    // Create array of 8 skeleton cards
                    Array.from({ length: 8 }).map((_, idx) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={idx}>
                            <SkeletonCard />
                        </Grid>
                    ))
                ) : (
                    // Render actual videos/channels when data is available
                    // Optional chaining prevents error if videos is undefined
                    videos?.map((item, idx) => (
                        <Grid 
                            item 
                            xs={12} 
                            sm={6} 
                            md={4} 
                            lg={3} 
                            key={idx}
                            sx={{
                                display: 'flex',
                                padding: theme.spacing(1.5), // Consistent padding
                            }}
                        >
                            <Box sx={{ 
                                width: '100%',
                                height: '100%',
                                display: 'flex'
                            }}>
                                {/* Conditionally render VideoCard or ChannelCard based on item type */}
                                {/* Optional chaining prevents errors if id is undefined */}
                                {item.id?.videoId && <VideoCard video={item} />}
                                {item.id?.channelId && <ChannelCard channelDetail={item} />}
                            </Box>
                        </Grid>
                    ))
                )}
            </Grid>
        </Box>
    )
}

// PropTypes validation
Videos.propTypes = {
    videos: PropTypes.array,  // Array of video/channel objects
    isLoading: PropTypes.bool // Loading state indicator
}

export default Videos
