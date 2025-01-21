import { Box, CircularProgress, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

export default function LoadingSpinner({ message = 'Loading...' }) {
    const theme = useTheme();
    
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '200px',
                gap: 2,
                color: theme.palette.text.primary
            }}
        >
            <CircularProgress 
                size={40} 
                thickness={4} 
                sx={{ 
                    color: theme.palette.primary.main 
                }} 
            />
            <Typography 
                variant="body1" 
                color={theme.palette.text.secondary}
            >
                {message}
            </Typography>
        </Box>
    );
} 