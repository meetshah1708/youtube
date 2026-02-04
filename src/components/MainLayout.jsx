import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Navbar from './Navbar';
import PropTypes from 'prop-types';

const MainLayout = ({ children }) => {
    const theme = useTheme();
    return (
        <Box sx={{ bgcolor: theme.palette.background.default, minHeight: '100vh' }}>
            <Navbar />
            <Box sx={{ pt: '80px' }}> {/* Padding for fixed Navbar */}
                {children}
            </Box>
        </Box>
    );
};

MainLayout.propTypes = {
    children: PropTypes.node.isRequired
};

export default MainLayout;
