import {
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Typography,
    Box,
    Divider
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';

const shortcuts = [
    { key: '/', description: 'Focus search bar' },
    { key: 'h', description: 'Go to Home' },
    { key: 't', description: 'Go to Trending' },
    { key: 'w', description: 'Go to Watch Later' },
    { key: 'y', description: 'Go to History' },
    { key: 'l', description: 'Go to Liked Videos' },
    { key: 'p', description: 'Go to Playlists' },
    { key: 'd', description: 'Toggle dark / light mode' },
    { key: '?', description: 'Show this help dialog' },
];

export default function KeyboardShortcutsDialog({ open, onClose }) {
    const theme = useTheme();

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xs"
            fullWidth
            PaperProps={{
                sx: {
                    bgcolor: theme.palette.background.paper,
                    borderRadius: 3,
                }
            }}
        >
            <DialogTitle
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    color: theme.palette.text.primary,
                    pb: 1
                }}
            >
                Keyboard Shortcuts
                <IconButton
                    onClick={onClose}
                    size="small"
                    sx={{ color: theme.palette.text.secondary }}
                    aria-label="close"
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <Divider />

            <DialogContent sx={{ pt: 2 }}>
                {shortcuts.map(({ key, description }) => (
                    <Box
                        key={key}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            py: 1,
                        }}
                    >
                        <Typography
                            variant="body2"
                            sx={{ color: theme.palette.text.primary }}
                        >
                            {description}
                        </Typography>

                        <Box
                            component="kbd"
                            sx={{
                                display: 'inline-block',
                                px: 1.5,
                                py: 0.5,
                                borderRadius: 1,
                                border: `1px solid ${theme.palette.divider}`,
                                bgcolor: theme.palette.mode === 'dark'
                                    ? 'rgba(255,255,255,0.08)'
                                    : 'rgba(0,0,0,0.06)',
                                fontFamily: 'monospace',
                                fontSize: '0.85rem',
                                fontWeight: 700,
                                color: theme.palette.text.primary,
                                minWidth: 28,
                                textAlign: 'center',
                            }}
                        >
                            {key}
                        </Box>
                    </Box>
                ))}
            </DialogContent>
        </Dialog>
    );
}

KeyboardShortcutsDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};
