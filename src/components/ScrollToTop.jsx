import { useState, useEffect } from 'react';
import { Fab, Zoom } from '@mui/material';
import { KeyboardArrowUp } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

export default function ScrollToTop() {
    const [visible, setVisible] = useState(false);
    const theme = useTheme();

    useEffect(() => {
        const handleScroll = () => {
            setVisible(window.scrollY > 300);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <Zoom in={visible}>
            <Fab
                onClick={scrollToTop}
                size="medium"
                aria-label="scroll to top"
                sx={{
                    position: 'fixed',
                    bottom: 32,
                    right: 32,
                    bgcolor: theme.palette.primary.main,
                    color: '#fff',
                    zIndex: 1200,
                    '&:hover': {
                        bgcolor: theme.palette.primary.dark,
                    },
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                }}
            >
                <KeyboardArrowUp />
            </Fab>
        </Zoom>
    );
}
