import { useWatchLater } from '../contexts/WatchLaterContext';
import {
    Box,
    Typography,
    Card,
    CardContent,
    CardMedia,
    IconButton,
    Grid,
    Container
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link } from 'react-router-dom';

export const WatchLater = () => {
    const { watchLaterItems, removeFromWatchLater } = useWatchLater();

    return (
        <Container maxWidth="lg" sx={{ mt: 2 }}>
            <Box sx={{ mt: 4, mb: 4 }}>
                <Typography variant="h4" sx={{ mb: 3 }}>
                    Watch Later ({watchLaterItems.length})
                </Typography>

                {watchLaterItems.length === 0 ? (
                    <Typography variant="body1">
                        No videos in your Watch Later list
                    </Typography>
                ) : (
                    <Grid container spacing={3}>
                        {watchLaterItems.map((video) => (
                            <Grid item xs={12} sm={6} md={4} key={video.id}>
                                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                    <Link to={`/video/${video.id}`} style={{ textDecoration: 'none' }}>
                                        <CardMedia
                                            component="img"
                                            height="140"
                                            image={video.thumbnail}
                                            alt={video.title}
                                        />
                                        <CardContent sx={{ flexGrow: 1 }}>
                                            <Typography variant="h6" component="div" noWrap>
                                                {video.title}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {video.channelTitle}
                                            </Typography>
                                        </CardContent>
                                    </Link>
                                    <Box sx={{ p: 1, display: 'flex', justifyContent: 'flex-end' }}>
                                        <IconButton
                                            onClick={() => removeFromWatchLater(video.id)}
                                            color="error"
                                            aria-label="remove from watch later"
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Box>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Box>
        </Container>
    );
};
