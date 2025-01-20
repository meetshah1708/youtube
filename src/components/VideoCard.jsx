import { Card, CardContent, CardMedia, Typography, Box } from "@mui/material";
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';
import { CheckCircle, ThumbUp, Visibility } from "@mui/icons-material";

// VideoCard component expects a video object with id and snippet properties
// Common errors: undefined videoId, missing snippet data, broken thumbnail URLs
export default function VideoCard({ video: { id: { videoId }, snippet } }) {
    return (
        <Card sx={{
            width: '100%',
            boxShadow: 'none',
            borderRadius: '12px',
            overflow: 'hidden',  // Prevents content from spilling out
            backgroundColor: '#1e1e1e',
            margin: '8px',
            // Smooth hover animation
            '&:hover': {
                transform: 'scale(1.02)',
                transition: 'transform 0.3s ease-in-out',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)'
            }
        }}>
            {/* Video thumbnail link - Ensure videoId exists */}
            <Link to={videoId ? `/video/${videoId}` : '#'}>
                <CardMedia
                    // Fallback empty string prevents broken image
                    image={snippet?.thumbnails?.high?.url || ''}
                    alt={snippet?.title || 'Video thumbnail'}
                    sx={{
                        width: '100%',
                        height: 180,
                        objectFit: 'cover'  // Prevents image distortion
                    }}
                />
            </Link>
            <CardContent sx={{
                backgroundColor: '#1e1e1e',
                height: 'auto',
                minHeight: '120px',  // Ensures consistent card height
                padding: '12px',
            }}>
                {/* Video title with ellipsis for long titles */}
                <Link to={videoId ? `/video/${videoId}` : '#'} style={{ textDecoration: 'none' }}>
                    <Typography 
                        variant="subtitle1" 
                        fontWeight="bold" 
                        color="#FFF"
                        sx={{
                            fontSize: '14px',
                            lineHeight: 1.2,
                            maxHeight: '2.4em',
                            overflow: 'hidden',
                            // Multi-line ellipsis configuration
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            mb: 1
                        }}
                    >
                        {/* Ensure title exists */}
                        {snippet?.title || 'Untitled Video'}
                    </Typography>
                </Link>

                {/* Channel link - Ensure channelId exists */}
                <Link to={snippet?.channelId ? `/channel/${snippet.channelId}` : '#'} 
                    style={{ textDecoration: 'none' }}
                >
                    <Typography 
                        variant="body2" 
                        sx={{
                            color: '#aaa',
                            fontSize: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            mb: 1,
                            '&:hover': { color: '#fff' }
                        }}
                    >
                        {/* Channel title with verification badge */}
                        {snippet?.channelTitle || 'Unknown Channel'}
                        <CheckCircle sx={{ fontSize: 12, color: 'gray', ml: '5px' }} />
                    </Typography>
                </Link>

                {/* Video statistics */}
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    mt: 1
                }}>
                    {/* View count */}
                    <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        color: '#aaa',
                        fontSize: '12px'
                    }}>
                        <Visibility sx={{ fontSize: '16px', mr: 0.5 }} />
                        <Typography variant="caption">123K</Typography>
                    </Box>
                    {/* Like count */}
                    <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        color: '#aaa',
                        fontSize: '12px'
                    }}>
                        <ThumbUp sx={{ fontSize: '16px', mr: 0.5 }} />
                        <Typography variant="caption">1.2K</Typography>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
}

// PropTypes validation to catch missing or invalid props during development
VideoCard.propTypes = {
    video: PropTypes.shape({
        id: PropTypes.shape({
            videoId: PropTypes.string
        }),
        snippet: PropTypes.shape({
            title: PropTypes.string,
            channelId: PropTypes.string,
            channelTitle: PropTypes.string,
            thumbnails: PropTypes.shape({
                high: PropTypes.shape({
                    url: PropTypes.string
                })
            })
        })
    }).isRequired
};
