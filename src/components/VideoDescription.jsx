import { useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Button } from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

export default function VideoDescription({ description, publishedAt }) {
    const [expanded, setExpanded] = useState(false);
    const theme = useTheme();

    if (!description) return null;

    const formattedDate = publishedAt
        ? new Date(publishedAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
        : null;

    return (
        <Box
            sx={{
                mx: 2,
                my: 1,
                p: 2,
                borderRadius: 2,
                bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                cursor: 'pointer',
                '&:hover': {
                    bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
                },
                transition: 'background-color 0.2s ease',
            }}
            onClick={() => setExpanded(!expanded)}
        >
            {formattedDate && (
                <Typography
                    variant="body2"
                    sx={{
                        fontWeight: 600,
                        color: theme.palette.text.primary,
                        mb: 1,
                    }}
                >
                    Published on {formattedDate}
                </Typography>
            )}
            <Typography
                variant="body2"
                sx={{
                    color: theme.palette.text.secondary,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    display: '-webkit-box',
                    WebkitLineClamp: expanded ? 'unset' : 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: expanded ? 'visible' : 'hidden',
                    lineHeight: 1.6,
                }}
            >
                {description}
            </Typography>
            <Button
                size="small"
                endIcon={expanded ? <ExpandLess /> : <ExpandMore />}
                sx={{
                    mt: 1,
                    textTransform: 'none',
                    color: theme.palette.text.primary,
                    fontWeight: 600,
                    p: 0,
                    minWidth: 'auto',
                    '&:hover': {
                        bgcolor: 'transparent',
                    },
                }}
            >
                {expanded ? 'Show less' : 'Show more'}
            </Button>
        </Box>
    );
}

VideoDescription.propTypes = {
    description: PropTypes.string,
    publishedAt: PropTypes.string,
};
