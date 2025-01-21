import { Link } from "react-router-dom";
import { Typography, Card, CardContent, CardMedia, Box } from "@mui/material";
import { CheckCircle } from "@mui/icons-material";
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';

// VideoCard component expects a video object with id and snippet properties
// Common errors: undefined videoId, missing snippet data, broken thumbnail URLs
export default function VideoCard({ video }) {
    const theme = useTheme();
    const { id: { videoId }, snippet, statistics } = video;

    // Format view count
    const formatCount = (count) => {
        if (!count) return '0';
        if (count >= 1000000) {
            return `${(count / 1000000).toFixed(1)}M`;
        }
        if (count >= 1000) {
            return `${(count / 1000).toFixed(1)}K`;
        }
        return count;
    };

    return (
        <Card 
            sx={{
                width: '100%',
                boxShadow: 'none',
                borderRadius: 2,
                overflow: 'hidden',
                bgcolor: theme.palette.background.paper,
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[4],
                },
                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
            }}
        >
            <Link to={videoId ? `/video/${videoId}` : '#'}>
                <CardMedia
                    component="img"
                    image={snippet?.thumbnails?.high?.url}
                    alt={snippet?.title}
                    sx={{ 
                        width: '100%',
                        height: 180,
                        objectFit: 'cover',
                    }}
                />
            </Link>
            
            <CardContent 
                sx={{ 
                    bgcolor: theme.palette.background.paper,
                    padding: 2,
                    height: '140px', // Fixed height for consistency
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1
                }}
            >
                <Link to={videoId ? `/video/${videoId}` : '#'} style={{ textDecoration: 'none' }}>
                    <Typography 
                        variant="subtitle1" 
                        fontWeight="bold"
                        sx={{
                            color: theme.palette.text.primary,
                            lineHeight: 1.2,
                            mb: 1,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            height: '2.4em', // Limit to 2 lines
                        }}
                    >
                        {snippet?.title.slice(0, 60) || 'Untitled Video'}
                    </Typography>
                </Link>

                <Box sx={{ mt: 'auto' }}> {/* Push channel info to bottom */}
                    <Link 
                        to={snippet?.channelId ? `/channel/${snippet.channelId}` : '#'} 
                        style={{ textDecoration: 'none' }}
                    >
                        <Typography 
                            variant="body2"
                            sx={{
                                color: theme.palette.text.secondary,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5,
                                '&:hover': {
                                    color: theme.palette.primary.main,
                                }
                            }}
                        >
                            {snippet?.channelTitle || 'Unknown Channel'}
                            <CheckCircle sx={{ fontSize: 12, color: theme.palette.primary.main }} />
                        </Typography>
                    </Link>

                    <Typography 
                        variant="caption" 
                        sx={{ 
                            color: theme.palette.text.secondary,
                            mt: 0.5,
                            display: 'block'
                        }}
                    >
                        {/* Add published date or video duration if available */}
                        {new Date(snippet?.publishedAt).toLocaleDateString()}
                    </Typography>
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
