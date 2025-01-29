import { useState } from 'react';
import { Box, TextField, Button, Typography, Paper, Alert, CircularProgress } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const theme = useTheme();
    const navigate = useNavigate();

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
            margin: 'auto',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            bgcolor: theme.palette.background.default,
            padding: { xs: 2, sm: 4 }
        }}>
            <Paper elevation={6} sx={{
                p: { xs: 2, sm: 4 },
                width: '100%',
                maxWidth: 400,
                bgcolor: theme.palette.background.paper,
                borderRadius: 2
            }}>
                <Typography variant="h4" component="h1" gutterBottom align="center" 
                    sx={{ color: theme.palette.text.primary, mb: 4 }}>
                    Login
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth
                        label="Password"
                        type="password"
                        required
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        sx={{ mb: 3 }}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={loading}
                        sx={{ mb: 2, py: 1.5 }}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Login'}
                    </Button>
                </form>

                <Typography 
                    variant="body2" 
                    align="center" 
                    sx={{ mt: 2 }} 
                    color={theme.palette.text.secondary}
                >
                    Don't have an account?{' '}
                    <Link 
                        to="/signup" 
                        style={{ 
                            color: theme.palette.primary.main,
                            textDecoration: 'none',
                            fontWeight: 500
                        }}
                    >
                        Sign Up
                    </Link>
                </Typography>
            </Paper>
        </Box>
    );
}
