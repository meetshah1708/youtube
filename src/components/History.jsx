import { useHistory } from '../contexts/HistoryContext';
import {
    Box,
    Typography,
    Card,
    CardContent,
    CardMedia,
    IconButton,
    Grid,
    Container,
    Chip,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from '@mui/material';
import { Delete, History as HistoryIcon, PlayArrow, DeleteSweep } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import Navbar from './Navbar';
import { useState } from 'react';

export const History = () => {
    const { historyItems, removeFromHistory, clearHistory } = useHistory();
    const theme = useTheme();
    const [openDialog, setOpenDialog] = useState(false);

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

    const handleClearHistory = () => {
        clearHistory();
        setOpenDialog(false);
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: theme.palette.background.default }}>
            <Navbar />
            <Container maxWidth="lg" sx={{ pt: 12, pb: 4 }}>
                <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
                    <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                            <HistoryIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />
                            <Typography 
                                variant="h4" 
                                sx={{ 
                                    fontWeight: 700,
                                    color: theme.palette.text.primary
                                }}
                            >
                                Watch History
                            </Typography>
                        </Box>
                        <Chip
                            label={`${historyItems.length} video${historyItems.length !== 1 ? 's' : ''}`}
                            size="small"
                            sx={{ bgcolor: theme.palette.primary.main, color: '#fff' }}
                        />
                    </Box>
                    {historyItems.length > 0 && (
                        <Button
                            variant="outlined"
                            color="error"
                            startIcon={<DeleteSweep />}
                            onClick={() => setOpenDialog(true)}
                            sx={{ borderRadius: 2 }}
                        >
                            Clear All
                        </Button>
                    )}
                </Box>

                {historyItems.length === 0 ? (
                    <Box 
                        sx={{ 
                            textAlign: 'center', 
                            py: 10,
                            bgcolor: theme.palette.background.paper,
                            borderRadius: 3,
                        }}
                    >
                        <HistoryIcon sx={{ fontSize: 80, color: theme.palette.text.secondary, mb: 2 }} />
                        <Typography variant="h6" color="text.secondary">
                            No videos in your watch history
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            Videos you watch will appear here
                        </Typography>
                    </Box>
                ) : (
                    <Grid container spacing={3}>
                        {historyItems.map((video) => (
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
                                                <PlayArrow sx={{ fontSize: 60, color: '#fff' }} />
                                            </Box>
                                        </Box>
                                    </Link>
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
                                        <Typography 
                                            variant="caption" 
                                            color="text.secondary"
                                            sx={{ fontStyle: 'italic' }}
                                        >
                                            {formatDate(video.watchedAt)}
                                        </Typography>
                                    </CardContent>
                                    <Box sx={{ p: 1, pt: 0, display: 'flex', justifyContent: 'flex-end' }}>
                                        <IconButton
                                            onClick={(e) => {
                                                e.preventDefault();
                                                removeFromHistory(video.id);
                                            }}
                                            sx={{
                                                color: theme.palette.text.secondary,
                                                '&:hover': {
                                                    color: theme.palette.error.main,
                                                    bgcolor: 'rgba(255,0,0,0.1)',
                                                }
                                            }}
                                            size="small"
                                        >
                                            <Delete fontSize="small" />
                                        </IconButton>
                                    </Box>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Container>

            {/* Clear History Confirmation Dialog */}
            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                PaperProps={{
                    sx: {
                        bgcolor: theme.palette.background.paper,
                        borderRadius: 2,
                    }
                }}
            >
                <DialogTitle sx={{ color: theme.palette.text.primary }}>
                    Clear Watch History?
                </DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ color: theme.palette.text.secondary }}>
                        This will remove all {historyItems.length} video{historyItems.length !== 1 ? 's' : ''} from your watch history. This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button 
                        onClick={() => setOpenDialog(false)}
                        sx={{ borderRadius: 2 }}
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleClearHistory} 
                        color="error" 
                        variant="contained"
                        sx={{ borderRadius: 2 }}
                    >
                        Clear History
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default History;
