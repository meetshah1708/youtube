import { useState } from 'react';
import PropTypes from 'prop-types';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Typography,
    Box,
    TextField,
    Button,
    Snackbar,
    Alert,
    Stack
} from '@mui/material';
import {
    Close,
    ContentCopy,
    Share as ShareIcon
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

export default function ShareDialog({ open, onClose, videoId, videoTitle }) {
    const theme = useTheme();
    const [copied, setCopied] = useState(false);
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(videoUrl);
            setCopied(true);
        } catch {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = videoUrl;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            setCopied(true);
        }
    };

    const shareLinks = [
        {
            name: 'Twitter / X',
            color: '#1DA1F2',
            url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(videoUrl)}&text=${encodeURIComponent(videoTitle)}`,
        },
        {
            name: 'Facebook',
            color: '#4267B2',
            url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(videoUrl)}`,
        },
        {
            name: 'WhatsApp',
            color: '#25D366',
            url: `https://wa.me/?text=${encodeURIComponent(videoTitle + ' ' + videoUrl)}`,
        },
        {
            name: 'Email',
            color: '#EA4335',
            url: `mailto:?subject=${encodeURIComponent(videoTitle)}&body=${encodeURIComponent('Check out this video: ' + videoUrl)}`,
        },
    ];

    return (
        <>
            <Dialog
                open={open}
                onClose={onClose}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        bgcolor: theme.palette.background.paper,
                        borderRadius: 3,
                    }
                }}
            >
                <DialogTitle sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    color: theme.palette.text.primary
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ShareIcon sx={{ color: theme.palette.primary.main }} />
                        Share Video
                    </Box>
                    <IconButton onClick={onClose} size="small">
                        <Close />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <Typography 
                        variant="body2" 
                        sx={{ 
                            color: theme.palette.text.secondary, 
                            mb: 2,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                        }}
                    >
                        {videoTitle}
                    </Typography>

                    {/* Copy link */}
                    <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                        <TextField
                            fullWidth
                            value={videoUrl}
                            InputProps={{
                                readOnly: true,
                                sx: {
                                    bgcolor: theme.palette.background.default,
                                    borderRadius: 2,
                                    fontSize: '0.875rem',
                                }
                            }}
                            size="small"
                        />
                        <Button
                            variant="contained"
                            onClick={handleCopy}
                            startIcon={<ContentCopy />}
                            sx={{
                                borderRadius: 2,
                                textTransform: 'none',
                                minWidth: 100,
                                bgcolor: theme.palette.primary.main,
                            }}
                        >
                            Copy
                        </Button>
                    </Box>

                    {/* Share buttons */}
                    <Typography variant="subtitle2" sx={{ mb: 2, color: theme.palette.text.primary }}>
                        Share to
                    </Typography>
                    <Stack direction="row" spacing={1.5} sx={{ flexWrap: 'wrap', gap: 1.5 }}>
                        {shareLinks.map((link) => (
                            <Button
                                key={link.name}
                                variant="outlined"
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{
                                    borderColor: link.color,
                                    color: link.color,
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    '&:hover': {
                                        bgcolor: link.color,
                                        color: '#fff',
                                        borderColor: link.color,
                                    },
                                }}
                            >
                                {link.name}
                            </Button>
                        ))}
                    </Stack>
                </DialogContent>
            </Dialog>

            <Snackbar
                open={copied}
                autoHideDuration={2000}
                onClose={() => setCopied(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity="success" variant="filled" sx={{ borderRadius: 2 }}>
                    Link copied to clipboard!
                </Alert>
            </Snackbar>
        </>
    );
}

ShareDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    videoId: PropTypes.string.isRequired,
    videoTitle: PropTypes.string.isRequired,
};
