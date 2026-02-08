import { useState } from 'react';
import PropTypes from 'prop-types';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Checkbox,
    Button,
    TextField,
    Box,
    Typography,
    Divider,
} from '@mui/material';
import { Add, PlaylistPlay } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { usePlaylist } from '../contexts/PlaylistContext';

export default function AddToPlaylistDialog({ open, onClose, video }) {
    const theme = useTheme();
    const { playlists, createPlaylist, addVideoToPlaylist, removeVideoFromPlaylist } = usePlaylist();
    const [showCreate, setShowCreate] = useState(false);
    const [newName, setNewName] = useState('');

    const isVideoInPlaylist = (playlist) => {
        return playlist.videos.some(v => v.id === video?.id);
    };

    const handleToggle = (playlist) => {
        if (!video) return;
        if (isVideoInPlaylist(playlist)) {
            removeVideoFromPlaylist(playlist.id, video.id);
        } else {
            addVideoToPlaylist(playlist.id, video);
        }
    };

    const handleCreate = () => {
        if (newName.trim()) {
            const playlistId = createPlaylist(newName.trim());
            if (video) {
                addVideoToPlaylist(playlistId, video);
            }
            setNewName('');
            setShowCreate(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xs"
            fullWidth
            PaperProps={{
                sx: {
                    bgcolor: theme.palette.background.paper,
                    borderRadius: 2,
                }
            }}
        >
            <DialogTitle sx={{ 
                color: theme.palette.text.primary,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
            }}>
                <PlaylistPlay sx={{ color: theme.palette.primary.main }} />
                Save to Playlist
            </DialogTitle>
            <DialogContent sx={{ p: 0 }}>
                {playlists.length === 0 && !showCreate ? (
                    <Box sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            No playlists yet. Create one to get started.
                        </Typography>
                    </Box>
                ) : (
                    <List sx={{ py: 0 }}>
                        {playlists.map((playlist) => (
                            <ListItem key={playlist.id} disablePadding>
                                <ListItemButton onClick={() => handleToggle(playlist)} dense>
                                    <ListItemIcon sx={{ minWidth: 36 }}>
                                        <Checkbox
                                            edge="start"
                                            checked={isVideoInPlaylist(playlist)}
                                            tabIndex={-1}
                                            disableRipple
                                            sx={{
                                                color: theme.palette.text.secondary,
                                                '&.Mui-checked': {
                                                    color: theme.palette.primary.main,
                                                },
                                            }}
                                        />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={playlist.name}
                                        secondary={`${playlist.videos.length} video${playlist.videos.length !== 1 ? 's' : ''}`}
                                        primaryTypographyProps={{
                                            sx: { color: theme.palette.text.primary }
                                        }}
                                    />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                )}

                <Divider />

                {showCreate ? (
                    <Box sx={{ p: 2, display: 'flex', gap: 1 }}>
                        <TextField
                            autoFocus
                            fullWidth
                            size="small"
                            label="Playlist name"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                        />
                        <Button
                            variant="contained"
                            onClick={handleCreate}
                            disabled={!newName.trim()}
                            sx={{ borderRadius: 2, textTransform: 'none' }}
                        >
                            Create
                        </Button>
                    </Box>
                ) : (
                    <Box sx={{ p: 1 }}>
                        <Button
                            fullWidth
                            startIcon={<Add />}
                            onClick={() => setShowCreate(true)}
                            sx={{ textTransform: 'none', justifyContent: 'flex-start' }}
                        >
                            Create new playlist
                        </Button>
                    </Box>
                )}
            </DialogContent>
            <DialogActions sx={{ p: 1.5 }}>
                <Button onClick={onClose} sx={{ borderRadius: 2, textTransform: 'none' }}>
                    Done
                </Button>
            </DialogActions>
        </Dialog>
    );
}

AddToPlaylistDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    video: PropTypes.shape({
        id: PropTypes.string,
        title: PropTypes.string,
        thumbnail: PropTypes.string,
        channelTitle: PropTypes.string,
    }),
};
