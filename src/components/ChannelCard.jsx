import { Box, Card, CardContent, CardMedia, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';
import { CheckCircle } from "@mui/icons-material";

// ChannelCard component displays channel information
// Common errors: missing channelDetail, undefined statistics, broken thumbnail URLs
export default function ChannelCard({ channelDetail, marginTop }) {
    // Early return if channelDetail is missing
    if (!channelDetail) {
        return null;
    }

    return (
        <Box sx={{
            boxShadow: 'none',
            borderRadius: '20px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: { xs: '356px', md: '320px' },
            height: '326px',
            margin: 'auto',
            marginTop: marginTop || 0  // Fallback to 0 if marginTop is undefined
        }}>
            {/* Channel link - Ensure channelId exists */}
            <Link to={channelDetail?.id?.channelId ? `/channel/${channelDetail.id.channelId}` : '#'}>
                <CardContent sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    textAlign: 'center',
                    color: '#fff',
                    padding: '20px'
                }}>
                    {/* Channel thumbnail */}
                    <CardMedia
                        image={channelDetail?.snippet?.thumbnails?.high?.url || ''}
                        alt={channelDetail?.snippet?.title || 'Channel thumbnail'}
                        sx={{
                            borderRadius: '50%',
                            height: '180px',
                            width: '180px',
                            mb: 2,
                            border: '1px solid #e3e3e3',
                            margin: 'auto'
                        }}
                    />
                    {/* Channel title with verification badge */}
                    <Typography variant="h6" sx={{
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '5px'
                    }}>
                        {channelDetail?.snippet?.title || 'Unknown Channel'}
                        <CheckCircle sx={{ fontSize: '14px', color: 'gray', ml: '5px' }} />
                    </Typography>

                    {/* Subscriber count - Only show if available */}
                    {channelDetail?.statistics?.subscriberCount && (
                        <Typography sx={{ color: 'gray' }}>
                            {parseInt(channelDetail.statistics.subscriberCount).toLocaleString('en-US')} Subscribers
                        </Typography>
                    )}

                    {/* Channel description with ellipsis */}
                    <Typography variant="body2" color="gray" sx={{ 
                        mt: 1, 
                        textAlign: 'center', 
                        maxWidth: '300px',
                        // Multi-line ellipsis configuration
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical'
                    }}>
                        {channelDetail?.snippet?.description?.slice(0, 100) || 'No description available'}
                        {channelDetail?.snippet?.description?.length > 100 ? '...' : ''}
                    </Typography>
                </CardContent>
            </Link>
        </Box>
    );
}

// PropTypes validation
ChannelCard.propTypes = {
    channelDetail: PropTypes.shape({
        id: PropTypes.shape({
            channelId: PropTypes.string
        }),
        snippet: PropTypes.shape({
            title: PropTypes.string,
            description: PropTypes.string,
            thumbnails: PropTypes.shape({
                high: PropTypes.shape({
                    url: PropTypes.string
                })
            })
        }),
        statistics: PropTypes.shape({
            subscriberCount: PropTypes.string
        })
    }).isRequired,
    marginTop: PropTypes.string
};
