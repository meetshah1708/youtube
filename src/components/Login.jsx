import { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Paper, Alert, CircularProgress, Fade } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { useAuth } from '../contexts/AuthContext';
import { YouTube } from "@mui/icons-material";

export default function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showSlowServerMessage, setShowSlowServerMessage] = useState(false);

    const { login } = useAuth();
    const theme = useTheme();
    const navigate = useNavigate();

    useEffect(() => {
        let timer;
        if (loading) {
            timer = setTimeout(() => {
                setShowSlowServerMessage(true);
            }, 2000);
        } else {
            setShowSlowServerMessage(false);
        }
        return () => clearTimeout(timer);
    }, [loading]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await login(formData.email, formData.password);
            if (result.success) {
                navigate('/');
            } else {
                setError(result.error || 'Login failed');
            }
        } catch (error) {
            setError('An error occurred during login');
            console.error('Login error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            bgcolor: theme.palette.background.default,
            background: theme.palette.mode === 'dark'
                ? 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)'
                : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            padding: { xs: 2, sm: 4 }
        }}>
            <Paper elevation={10} sx={{
                p: { xs: 3, sm: 5 },
                width: '100%',
                maxWidth: 400,
                bgcolor: theme.palette.background.paper,
                borderRadius: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                 <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <YouTube sx={{ color: "red", fontSize: "40px", mr: 1 }} />
                    <Typography variant="h5" fontWeight="bold">
                        METube
                    </Typography>
                </Box>

                <Typography variant="h4" component="h1" gutterBottom align="center" 
                    sx={{ color: theme.palette.text.primary, mb: 1, fontWeight: 600 }}>
                    Welcome Back
                </Typography>

                <Typography variant="body2" color="textSecondary" sx={{ mb: 4 }}>
                    Please login to continue
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 3, width: '100%' }}>
                        {error}
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                    <TextField
                        fullWidth
                        label="Email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        sx={{ mb: 2.5 }}
                        variant="outlined"
                    />
                    <TextField
                        fullWidth
                        label="Password"
                        type="password"
                        required
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        sx={{ mb: 3 }}
                        variant="outlined"
                    />

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={loading}
                        size="large"
                        sx={{
                            mb: 2,
                            py: 1.5,
                            borderRadius: 2,
                            fontWeight: 'bold',
                            textTransform: 'none',
                            fontSize: '1rem'
                        }}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
                    </Button>
                </Box>

                <Fade in={showSlowServerMessage}>
                    <Alert severity="info" sx={{ mt: 2, width: '100%' }}>
                        Waking up the server... This might take up to 30 seconds.
                    </Alert>
                </Fade>

                <Typography 
                    variant="body2" 
                    align="center" 
                    sx={{ mt: 3 }}
                    color={theme.palette.text.secondary}
                >
                    Don&apos;t have an account?{' '}
                    <Link 
                        to="/signup" 
                        style={{ 
                            color: theme.palette.primary.main,
                            textDecoration: 'none',
                            fontWeight: 600
                        }}
                    >
                        Sign Up
                    </Link>
                </Typography>
            </Paper>
        </Box>
    );
}
