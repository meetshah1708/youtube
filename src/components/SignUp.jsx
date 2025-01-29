import { useState } from 'react';
import { Box, TextField, Button, Typography, Paper, Alert, CircularProgress } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { useAuth } from '../contexts/AuthContext';

export default function SignUp() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        username: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const theme = useTheme();
    const { signup } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const result = await signup(formData);
            if (result.success) {
                navigate('/');
            } else {
                setError(result.error || 'Signup failed');
            }
        } catch (err) {
            setError('An error occurred during signup');
            console.error('Signup error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                bgcolor: theme.palette.background.default,
                padding: 2,
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                margin: 'auto',
                overflow: 'auto'
            }}
        >
            <Paper
                elevation={6}
                sx={{
                    p: 4,
                    width: '100%',
                    maxWidth: 400,
                    bgcolor: theme.palette.background.paper,
                    borderRadius: 2,
                    position: 'relative'
                }}
            >
                <Typography variant="h4" component="h1" gutterBottom align="center" 
                    sx={{ color: theme.palette.text.primary, mb: 4 }}>
                    Sign Up
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Username"
                        type="text"
                        required
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        sx={{
                            mb: 2,
                            '& .MuiOutlinedInput-root': {
                                '&:hover fieldset': {
                                    borderColor: theme.palette.primary.main,
                                },
                            },
                        }}
                    />
                    <TextField
                        fullWidth
                        label="Email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        sx={{
                            mb: 2,
                            '& .MuiOutlinedInput-root': {
                                '&:hover fieldset': {
                                    borderColor: theme.palette.primary.main,
                                },
                            },
                        }}
                    />
                    <TextField
                        fullWidth
                        label="Password"
                        type="password"
                        required
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        sx={{
                            mb: 3,
                            '& .MuiOutlinedInput-root': {
                                '&:hover fieldset': {
                                    borderColor: theme.palette.primary.main,
                                },
                            },
                        }}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={loading}
                        sx={{
                            mb: 2,
                            py: 1.5,
                            bgcolor: theme.palette.primary.main,
                            '&:hover': {
                                bgcolor: theme.palette.primary.dark,
                            },
                        }}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Sign Up'}
                    </Button>
                </form>

                <Typography 
                    variant="body2" 
                    align="center" 
                    sx={{ mt: 2 }} 
                    color={theme.palette.text.secondary}
                >
                    Already have an account?{' '}
                    <Link 
                        to="/login" 
                        style={{ 
                            color: theme.palette.primary.main,
                            textDecoration: 'none',
                            fontWeight: 500
                        }}
                    >
                        Login
                    </Link>
                </Typography>
            </Paper>
        </Box>
    );
} 