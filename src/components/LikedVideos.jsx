import { useLikedVideos } from '../contexts/LikedVideosContext';
import {
    Box,
    Typography,
    Card,
    CardContent,
    CardMedia,
    IconButton,
    Grid,
    Container,
    Chip
} from '@mui/material';
import { Delete, ThumbUp, PlayArrow } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import Navbar from './Navbar';

export const LikedVideos = () => {
    const { likedVideos, removeFromLikedVideos } = useLikedVideos();
    const theme = useTheme();

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
        if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
        return date.toLocaleDateString();
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: theme.palette.background.default }}>
            <Navbar />
            <Container maxWidth="lg" sx={{ pt: 12, pb: 4 }}>
                <Box sx={{ mb: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                        <ThumbUp sx={{ fontSize: 40, color: theme.palette.primary.main }} />
                        <Typography 
                            variant="h4" 
                            sx={{ 
                                fontWeight: 700,
                                color: theme.palette.text.primary
                            }}
                        >
                            Liked Videos
                        </Typography>
                    </Box>
                    <Chip
                        label={`${likedVideos.length} video${likedVideos.length !== 1 ? 's' : ''}`}
                        size="small"
                        sx={{ bgcolor: theme.palette.primary.main, color: '#fff' }}
                    />
                </Box>

                {likedVideos.length === 0 ? (
                    <Box 
                        sx={{ 
                            textAlign: 'center', 
                            py: 10,
                            bgcolor: theme.palette.background.paper,
                            borderRadius: 3,
                        }}
                    >
                        <ThumbUp sx={{ fontSize: 80, color: theme.palette.text.secondary, mb: 2 }} />
                        <Typography variant="h6" color="text.secondary">
                            No liked videos yet
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            Videos you like will appear here
                        </Typography>
                    </Box>
                ) : (
                    <Grid container spacing={3}>
                        {likedVideos.map((video) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={video.id}>
                                <Card 
                                    sx={{ 
                                        height: '100%', 
                                        display: 'flex', 
                                        flexDirection: 'column',
                                        bgcolor: theme.palette.background.paper,
                                        borderRadius: 2,
                                        overflow: 'hidden',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
                                        },
                                        '&:hover .play-overlay': {
                                            opacity: 1,
                                        }
                                    }}
                                >
                                    <Link to={`/video/${video.id}`} style={{ textDecoration: 'none', position: 'relative' }}>
                                        <Box sx={{ position: 'relative' }}>
                                            <CardMedia
                                                component="img"
                                                height="160"
                                                image={video.thumbnail}
                                                alt={video.title}
                                                sx={{ objectFit: 'cover' }}
                                            />
                                            <Box 
                                                className="play-overlay"
                                                sx={{
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    right: 0,
                                                    bottom: 0,
                                                    bgcolor: 'rgba(0,0,0,0.5)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    opacity: 0,
                                                    transition: 'opacity 0.3s ease',
                                                }}
                                            >
                                                <PlayArrow sx={{ fontSize: 50, color: '#fff' }} />
                                            </Box>
                                        </Box>
                                        <CardContent sx={{ flexGrow: 1, p: 2 }}>
                                            <Typography 
                                                variant="subtitle1" 
                                                sx={{ 
                                                    fontWeight: 600,
                                                    color: theme.palette.text.primary,
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: 'vertical',
                                                    overflow: 'hidden',
                                                    lineHeight: 1.3,
                                                    mb: 1
                                                }}
                                            >
                                                {video.title}
                                            </Typography>
                                            <Typography 
                                                variant="body2" 
                                                color="text.secondary"
                                                sx={{ mb: 0.5 }}
                                            >
                                                {video.channelTitle}
                                            </Typography>
                                            {video.likedAt && (
                                                <Typography 
                                                    variant="caption" 
                                                    color="text.secondary"
                                                    sx={{ fontStyle: 'italic' }}
                                                >
                                                    Liked {formatDate(video.likedAt)}
                                                </Typography>
                                            )}
                                        </CardContent>
                                    </Link>
                                    <Box sx={{ p: 1, pt: 0, display: 'flex', justifyContent: 'flex-end' }}>
                                        <IconButton
                                            onClick={() => removeFromLikedVideos(video.id)}
                                            sx={{ 
                                                color: theme.palette.error.main,
                                                '&:hover': {
                                                    bgcolor: 'rgba(244, 67, 54, 0.1)',
                                                }
                                            }}
                                            aria-label="remove from liked videos"
                                            size="small"
                                        >
                                            <Delete />
                                        </IconButton>
                                    </Box>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Container>
        </Box>
    );
};

export default LikedVideos;
