import { usePlaylist } from '../contexts/PlaylistContext';
import { useState } from 'react';
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
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Collapse,
} from '@mui/material';
import {
    Delete,
    PlaylistPlay,
    PlayArrow,
    Add,
    ExpandMore,
    ExpandLess,
    Edit,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import Navbar from './Navbar';

export const Playlists = () => {
    const { playlists, createPlaylist, deletePlaylist, removeVideoFromPlaylist, renamePlaylist } = usePlaylist();
    const theme = useTheme();
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [newPlaylistName, setNewPlaylistName] = useState('');
    const [expandedPlaylist, setExpandedPlaylist] = useState(null);
    const [renameDialogOpen, setRenameDialogOpen] = useState(false);
    const [renameTarget, setRenameTarget] = useState(null);
    const [renameValue, setRenameValue] = useState('');

    const handleCreate = () => {
        if (newPlaylistName.trim()) {
            createPlaylist(newPlaylistName.trim());
            setNewPlaylistName('');
            setCreateDialogOpen(false);
        }
    };

    const handleRename = () => {
        if (renameValue.trim() && renameTarget) {
            renamePlaylist(renameTarget, renameValue.trim());
            setRenameDialogOpen(false);
            setRenameTarget(null);
            setRenameValue('');
        }
    };

    const toggleExpand = (playlistId) => {
        setExpandedPlaylist(prev => prev === playlistId ? null : playlistId);
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: theme.palette.background.default }}>
            <Navbar />
            <Container maxWidth="lg" sx={{ pt: 12, pb: 4 }}>
                <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
                    <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                            <PlaylistPlay sx={{ fontSize: 40, color: theme.palette.primary.main }} />
                            <Typography
                                variant="h4"
                                sx={{
                                    fontWeight: 700,
                                    color: theme.palette.text.primary
                                }}
                            >
                                My Playlists
                            </Typography>
                        </Box>
                        <Chip
                            label={`${playlists.length} playlist${playlists.length !== 1 ? 's' : ''}`}
                            size="small"
                            sx={{ bgcolor: theme.palette.primary.main, color: '#fff' }}
                        />
                    </Box>
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => setCreateDialogOpen(true)}
                        sx={{
                            borderRadius: 2,
                            textTransform: 'none',
                            bgcolor: theme.palette.primary.main,
                        }}
                    >
                        New Playlist
                    </Button>
                </Box>

                {playlists.length === 0 ? (
                    <Box
                        sx={{
                            textAlign: 'center',
                            py: 10,
                            bgcolor: theme.palette.background.paper,
                            borderRadius: 3,
                        }}
                    >
                        <PlaylistPlay sx={{ fontSize: 80, color: theme.palette.text.secondary, mb: 2 }} />
                        <Typography variant="h6" color="text.secondary">
                            No playlists yet
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            Create a playlist to organize your favorite videos
                        </Typography>
                        <Button
                            variant="outlined"
                            startIcon={<Add />}
                            onClick={() => setCreateDialogOpen(true)}
                            sx={{ mt: 3, borderRadius: 2, textTransform: 'none' }}
                        >
                            Create Your First Playlist
                        </Button>
                    </Box>
                ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        {playlists.map((playlist) => (
                            <Card
                                key={playlist.id}
                                sx={{
                                    bgcolor: theme.palette.background.paper,
                                    borderRadius: 2,
                                    overflow: 'hidden',
                                }}
                            >
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Box
                                            sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer', flex: 1 }}
                                            onClick={() => toggleExpand(playlist.id)}
                                        >
                                            <PlaylistPlay sx={{ color: theme.palette.primary.main }} />
                                            <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                                                {playlist.name}
                                            </Typography>
                                            <Chip
                                                label={`${playlist.videos.length} video${playlist.videos.length !== 1 ? 's' : ''}`}
                                                size="small"
                                                sx={{ ml: 1 }}
                                            />
                                            {expandedPlaylist === playlist.id ? <ExpandLess /> : <ExpandMore />}
                                        </Box>
                                        <Box>
                                            <IconButton
                                                size="small"
                                                onClick={() => {
                                                    setRenameTarget(playlist.id);
                                                    setRenameValue(playlist.name);
                                                    setRenameDialogOpen(true);
                                                }}
                                                sx={{ color: theme.palette.text.secondary }}
                                            >
                                                <Edit fontSize="small" />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                onClick={() => deletePlaylist(playlist.id)}
                                                sx={{
                                                    color: theme.palette.error.main,
                                                    '&:hover': { bgcolor: 'rgba(255,0,0,0.1)' }
                                                }}
                                            >
                                                <Delete fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    </Box>

                                    <Collapse in={expandedPlaylist === playlist.id}>
                                        {playlist.videos.length === 0 ? (
                                            <Typography variant="body2" color="text.secondary" sx={{ mt: 2, fontStyle: 'italic' }}>
                                                This playlist is empty. Add videos from the video detail page.
                                            </Typography>
                                        ) : (
                                            <Grid container spacing={2} sx={{ mt: 1 }}>
                                                {playlist.videos.map((video) => (
                                                    <Grid item xs={12} sm={6} md={4} lg={3} key={video.id}>
                                                        <Card
                                                            sx={{
                                                                bgcolor: theme.palette.background.default,
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
                                                            <Link to={`/video/${video.id}`} style={{ textDecoration: 'none' }}>
                                                                <Box sx={{ position: 'relative' }}>
                                                                    <CardMedia
                                                                        component="img"
                                                                        height="140"
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
                                                            </Link>
                                                            <CardContent sx={{ p: 1.5 }}>
                                                                <Typography
                                                                    variant="body2"
                                                                    sx={{
                                                                        fontWeight: 600,
                                                                        color: theme.palette.text.primary,
                                                                        display: '-webkit-box',
                                                                        WebkitLineClamp: 2,
                                                                        WebkitBoxOrient: 'vertical',
                                                                        overflow: 'hidden',
                                                                        fontSize: '0.8rem',
                                                                    }}
                                                                >
                                                                    {video.title}
                                                                </Typography>
                                                                <Typography variant="caption" color="text.secondary">
                                                                    {video.channelTitle}
                                                                </Typography>
                                                            </CardContent>
                                                            <Box sx={{ p: 0.5, pt: 0, display: 'flex', justifyContent: 'flex-end' }}>
                                                                <IconButton
                                                                    onClick={() => removeVideoFromPlaylist(playlist.id, video.id)}
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
                                    </Collapse>
                                </CardContent>
                            </Card>
                        ))}
                    </Box>
                )}
            </Container>

            {/* Create Playlist Dialog */}
            <Dialog
                open={createDialogOpen}
                onClose={() => setCreateDialogOpen(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        bgcolor: theme.palette.background.paper,
                        borderRadius: 2,
                    }
                }}
            >
                <DialogTitle sx={{ color: theme.palette.text.primary }}>
                    Create New Playlist
                </DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        fullWidth
                        label="Playlist Name"
                        value={newPlaylistName}
                        onChange={(e) => setNewPlaylistName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                        sx={{ mt: 1 }}
                    />
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setCreateDialogOpen(false)} sx={{ borderRadius: 2 }}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleCreate}
                        variant="contained"
                        disabled={!newPlaylistName.trim()}
                        sx={{ borderRadius: 2 }}
                    >
                        Create
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Rename Playlist Dialog */}
            <Dialog
                open={renameDialogOpen}
                onClose={() => setRenameDialogOpen(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        bgcolor: theme.palette.background.paper,
                        borderRadius: 2,
                    }
                }}
            >
                <DialogTitle sx={{ color: theme.palette.text.primary }}>
                    Rename Playlist
                </DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        fullWidth
                        label="Playlist Name"
                        value={renameValue}
                        onChange={(e) => setRenameValue(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleRename()}
                        sx={{ mt: 1 }}
                    />
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setRenameDialogOpen(false)} sx={{ borderRadius: 2 }}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleRename}
                        variant="contained"
                        disabled={!renameValue.trim()}
                        sx={{ borderRadius: 2 }}
                    >
                        Rename
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Playlists;
