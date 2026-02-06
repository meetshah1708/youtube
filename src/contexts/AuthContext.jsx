import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';


const AuthContext = createContext(null);
// API URL: use proxy in development, direct URL in production
const API_URL = import.meta.env.PROD 
  ? 'https://youtube-c8u0.onrender.com/api' 
  : '/api';

// Configure axios with timeout for auth requests
const authAxios = axios.create({
    timeout: 30000, // 30 second timeout
});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (token && storedUser) {
            setUser(JSON.parse(storedUser));
        }

        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await authAxios.post(`${API_URL}/login`, { email, password });
            if (response.data && response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                setUser(response.data.user);
                return { success: true };
            }
            return { success: false, error: 'Invalid response from server' };
        } catch (error) {
            const errorMessage = error.code === 'ECONNABORTED' 
                ? 'Server is starting up, please try again in a few seconds.'
                : error.response?.data?.error || 'Login failed. Please try again.';
            return {
                success: false,
                error: errorMessage
            };
        }
    };

    const signup = async (userData) => {
        try {
            const response = await authAxios.post(`${API_URL}/signup`, userData);
            if (response.data && response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                setUser(response.data.user);
                return { success: true };
            }
            return { success: false, error: 'Invalid response from server' };
        } catch (error) {
            const errorMessage = error.code === 'ECONNABORTED' 
                ? 'Server is starting up, please try again in a few seconds.'
                : error.response?.data?.error || 'Signup failed. Please try again.';
            return {
                success: false,
                error: errorMessage
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext); 