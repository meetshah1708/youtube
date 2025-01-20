import { Card, CardContent, CardMedia, Typography, Box, IconButton } from "@mui/material";
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';
import { CheckCircle, ThumbUp, Visibility } from "@mui/icons-material";

export default function VideoCard({ video: { id: { videoId }, snippet } }) {
    return (
        <Card sx={{
            width: '100%',
            boxShadow: 'none',
            borderRadius: '12px',
            overflow: 'hidden',
            backgroundColor: '#1e1e1e',
            margin: '8px',
            '&:hover': {
                transform: 'scale(1.02)',
                transition: 'transform 0.3s ease-in-out',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)'
            }
        }}>
            <Link to={`/video/${videoId}`}>
                <CardMedia
                    image={snippet?.thumbnails?.high?.url || ''}
                    alt={snippet?.title}
                    sx={{
                        width: '100%',
                        height: 180,
                        objectFit: 'cover'
                    }}
                />
            </Link>
            <CardContent sx={{
                backgroundColor: '#1e1e1e',
                height: 'auto',
                minHeight: '120px',
                padding: '12px',
            }}>
                <Link to={`/video/${videoId}`} style={{ textDecoration: 'none' }}>
                    <Typography 
                        variant="subtitle1" 
                        fontWeight="bold" 
                        color="#FFF"
                        sx={{
                            fontSize: '14px',
                            lineHeight: 1.2,
                            maxHeight: '2.4em',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            mb: 1
                        }}
                    >
                        {snippet?.title}
                    </Typography>
                </Link>
                <Link to={`/channel/${snippet?.channelId}`} style={{ textDecoration: 'none' }}>
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
                        {snippet?.channelTitle}
                        <CheckCircle sx={{ fontSize: 12, color: 'gray', ml: '5px' }} />
                    </Typography>
                </Link>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    mt: 1
                }}>
                    <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        color: '#aaa',
                        fontSize: '12px'
                    }}>
                        <Visibility sx={{ fontSize: '16px', mr: 0.5 }} />
                        <Typography variant="caption">123K</Typography>
                    </Box>
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

VideoCard.propTypes = {
    video: PropTypes.shape({
        id: PropTypes.shape({
            videoId: PropTypes.string
        }),
        snippet: PropTypes.object
    }).isRequired
};
