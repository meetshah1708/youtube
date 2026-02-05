import { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    Paper,
    Alert,
    CircularProgress,
    InputAdornment,
    IconButton,
    Divider
} from '@mui/material';
import { Visibility, VisibilityOff, YouTube, Email, Lock, Person } from '@mui/icons-material';
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
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const theme = useTheme();
    const { signup } = useAuth();
    const isDark = theme.palette.mode === 'dark';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validation
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }
        if (formData.username.length < 3) {
            setError('Username must be at least 3 characters');
            return;
        }

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
                width: '100vw',
                position: 'fixed',
                top: 0,
                left: 0,
                background: isDark
                    ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'
                    : 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                overflow: 'auto',
                py: 4,
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    width: '200%',
                    height: '200%',
                    top: '-50%',
                    left: '-50%',
                    background: isDark
                        ? 'radial-gradient(circle, rgba(255,0,0,0.1) 0%, transparent 50%)'
                        : 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 50%)',
                    animation: 'rotate 30s linear infinite',
                },
                '@keyframes rotate': {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' },
                },
            }}
        >
            {/* Floating shapes */}
            <Box
                sx={{
                    position: 'absolute',
                    width: 350,
                    height: 350,
                    borderRadius: '50%',
                    background: 'rgba(255,0,0,0.12)',
                    top: '5%',
                    right: '10%',
                    filter: 'blur(60px)',
                    animation: 'float 10s ease-in-out infinite',
                    '@keyframes float': {
                        '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
                        '50%': { transform: 'translateY(-40px) rotate(5deg)' },
                    },
                }}
            />
            <Box
                sx={{
                    position: 'absolute',
                    width: 250,
                    height: 250,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.08)',
                    bottom: '10%',
                    left: '5%',
                    filter: 'blur(50px)',
                    animation: 'float 7s ease-in-out infinite reverse',
                }}
            />
            <Box
                sx={{
                    position: 'absolute',
                    width: 150,
                    height: 150,
                    borderRadius: '30%',
                    background: 'rgba(255,87,34,0.1)',
                    top: '50%',
                    left: '20%',
                    filter: 'blur(40px)',
                    animation: 'float 5s ease-in-out infinite',
                }}
            />

            <Paper
                elevation={24}
                sx={{
                    p: { xs: 3, sm: 5 },
                    width: '100%',
                    maxWidth: 420,
                    mx: 2,
                    bgcolor: isDark ? 'rgba(30, 30, 50, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                    borderRadius: 4,
                    backdropFilter: 'blur(20px)',
                    border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(255,255,255,0.5)',
                    position: 'relative',
                    zIndex: 1,
                    boxShadow: isDark
                        ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                        : '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                }}
            >
                {/* Logo */}
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            p: 1.5,
                            borderRadius: 2,
                            bgcolor: isDark ? 'rgba(255,0,0,0.1)' : 'rgba(255,0,0,0.05)',
                        }}
                    >
                        <YouTube sx={{ color: '#FF0000', fontSize: 40 }} />
                        <Typography
                            variant="h5"
                            sx={{
                                fontWeight: 700,
                                background: 'linear-gradient(45deg, #FF0000, #FF5722)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            METube
                        </Typography>
                    </Box>
                </Box>

                <Typography
                    variant="h4"
                    component="h1"
                    align="center"
                    sx={{
                        fontWeight: 700,
                        color: theme.palette.text.primary,
                        mb: 1,
                    }}
                >
                    Create Account
                </Typography>
                <Typography
                    variant="body2"
                    align="center"
                    sx={{ color: theme.palette.text.secondary, mb: 4 }}
                >
                    Join METube to explore amazing videos
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
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
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Person sx={{ color: theme.palette.text.secondary }} />
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            mb: 2.5,
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                '&:hover fieldset': {
                                    borderColor: '#FF0000',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#FF0000',
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
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Email sx={{ color: theme.palette.text.secondary }} />
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            mb: 2.5,
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                '&:hover fieldset': {
                                    borderColor: '#FF0000',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#FF0000',
                                },
                            },
                        }}
                    />
                    <TextField
                        fullWidth
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        helperText="At least 6 characters"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Lock sx={{ color: theme.palette.text.secondary }} />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={() => setShowPassword(!showPassword)}
                                        edge="end"
                                        size="small"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            mb: 3,
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                '&:hover fieldset': {
                                    borderColor: '#FF0000',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#FF0000',
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
                            py: 1.5,
                            borderRadius: 2,
                            fontSize: '1rem',
                            fontWeight: 600,
                            textTransform: 'none',
                            background: 'linear-gradient(45deg, #FF0000 30%, #FF5722 90%)',
                            boxShadow: '0 4px 20px rgba(255, 0, 0, 0.3)',
                            '&:hover': {
                                background: 'linear-gradient(45deg, #CC0000 30%, #E64A19 90%)',
                                boxShadow: '0 6px 25px rgba(255, 0, 0, 0.4)',
                                transform: 'translateY(-1px)',
                            },
                            transition: 'all 0.2s ease-in-out',
                        }}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
                    </Button>
                </form>

                <Divider sx={{ my: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                        OR
                    </Typography>
                </Divider>

                <Typography variant="body2" align="center" color="text.secondary">
                    Already have an account?{' '}
                    <Link
                        to="/login"
                        style={{
                            color: '#FF0000',
                            textDecoration: 'none',
                            fontWeight: 600,
                        }}
                    >
                        Sign In
                    </Link>
                </Typography>
            </Paper>
        </Box>
    );
}
