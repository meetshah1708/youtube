const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

// Use Helmet to set Content Security Policy
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      fontSrc: ["'self'", "data:", "https://youtube-c8u0.onrender.com"],
      connectSrc: ["'self'", "https:"],
      imgSrc: ["'self'", "data:"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  })
);

// CORS configuration
app.use(cors({
    origin: [
        'https://youtube-meet.vercel.app',
        'http://localhost:5173',
        'https://youtube-c8u0.onrender.com'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
}));

app.use(express.json());

// Add OPTIONS handling for preflight requests
app.options('*', cors());

// Check if environment variables are loaded
if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI is not defined in environment variables');
    process.exit(1);
}

if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET is not defined in environment variables');
    process.exit(1);
}

// MongoDB Connection with strictQuery setting and optimized pool
mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
    maxPoolSize: 10,
    minPoolSize: 2,
    socketTimeoutMS: 45000,
})
.then(() => console.log('MongoDB connected'))
.catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});

// User Schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        index: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    watchLater: [{
        id: String,
        title: String,
        thumbnail: String,
        channelTitle: String,
        addedAt: { type: Date, default: Date.now }
    }],
    history: [{
        id: String,
        title: String,
        thumbnail: String,
        channelTitle: String,
        watchedAt: { type: Date, default: Date.now }
    }],
    likedVideos: [{
        id: String,
        title: String,
        thumbnail: String,
        channelTitle: String,
        likedAt: { type: Date, default: Date.now }
    }],
    playlists: [{
        id: String,
        name: String,
        description: String,
        videos: [{
            id: String,
            title: String,
            thumbnail: String,
            channelTitle: String
        }],
        createdAt: { type: Date, default: Date.now }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create compound index for faster user lookups
userSchema.index({ email: 1, username: 1 });

const User = mongoose.model('User', userSchema);

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET;

// Authentication Middleware
const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            throw new Error('No authentication token found');
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.userId);
        
        if (!user) {
            throw new Error('User not found');
        }

        req.user = user;
        req.token = token;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Please authenticate' });
    }
};


// Signup Route
app.post(`/api/signup`, async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Validate input
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ 
            $or: [{ email }, { username }] 
        });
        
        if (existingUser) {
            return res.status(400).json({ 
                error: 'User already exists with this email or username' 
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const user = new User({
            username,
            email,
            password: hashedPassword
        });

        await user.save();

        // Generate JWT
        const token = jwt.sign(
            { userId: user._id }, 
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Return user data (excluding password) and token
        res.status(201).json({
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            },
            token
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ error: 'Server error during signup' });
    }
});

// Login Route
app.post(`/api/login`, async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate JWT
        const token = jwt.sign(
            { userId: user._id },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Return user data and token
        res.json({
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            },
            token
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error during login' });
    }
});

// Protected Route Example
app.get(`/profile`, auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching profile' });
    }
});

// Add this near your other routes
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

// =========================
// User Data API Endpoints
// =========================

// Get user data (watch later, history, liked videos, playlists)
app.get('/api/user-data', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.json({
            watchLater: user.watchLater || [],
            history: user.history || [],
            likedVideos: user.likedVideos || [],
            playlists: user.playlists || []
        });
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ error: 'Error fetching user data' });
    }
});

// Watch Later endpoints
app.post('/api/watch-later', auth, async (req, res) => {
    try {
        const { id, title, thumbnail, channelTitle, addedAt } = req.body;
        const user = await User.findById(req.user._id);
        
        // Check if video already exists
        const exists = user.watchLater.some(item => item.id === id);
        if (exists) {
            return res.status(400).json({ error: 'Video already in watch later' });
        }
        
        user.watchLater.push({ 
            id, 
            title, 
            thumbnail, 
            channelTitle, 
            addedAt: addedAt ? new Date(addedAt) : new Date() 
        });
        await user.save();
        
        res.json({ message: 'Video added to watch later', watchLater: user.watchLater });
    } catch (error) {
        console.error('Error adding to watch later:', error);
        res.status(500).json({ error: 'Error adding to watch later' });
    }
});

app.delete('/api/watch-later/:videoId', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        user.watchLater = user.watchLater.filter(item => item.id !== req.params.videoId);
        await user.save();
        
        res.json({ message: 'Video removed from watch later', watchLater: user.watchLater });
    } catch (error) {
        console.error('Error removing from watch later:', error);
        res.status(500).json({ error: 'Error removing from watch later' });
    }
});

// History endpoints
app.post('/api/history', auth, async (req, res) => {
    try {
        const { id, title, thumbnail, channelTitle, watchedAt } = req.body;
        const user = await User.findById(req.user._id);
        
        // Remove if already exists (will be re-added at the top)
        user.history = user.history.filter(item => item.id !== id);
        
        // Add to the beginning with client or server timestamp
        user.history.unshift({ 
            id, 
            title, 
            thumbnail, 
            channelTitle, 
            watchedAt: watchedAt ? new Date(watchedAt) : new Date() 
        });
        
        // Keep only the last 100 items
        user.history = user.history.slice(0, 100);
        
        await user.save();
        
        res.json({ message: 'Video added to history', history: user.history });
    } catch (error) {
        console.error('Error adding to history:', error);
        res.status(500).json({ error: 'Error adding to history' });
    }
});

app.delete('/api/history/:videoId', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        user.history = user.history.filter(item => item.id !== req.params.videoId);
        await user.save();
        
        res.json({ message: 'Video removed from history', history: user.history });
    } catch (error) {
        console.error('Error removing from history:', error);
        res.status(500).json({ error: 'Error removing from history' });
    }
});

app.delete('/api/history', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        user.history = [];
        await user.save();
        
        res.json({ message: 'History cleared' });
    } catch (error) {
        console.error('Error clearing history:', error);
        res.status(500).json({ error: 'Error clearing history' });
    }
});

// Liked Videos endpoints
app.post('/api/liked-videos', auth, async (req, res) => {
    try {
        const { id, title, thumbnail, channelTitle, likedAt } = req.body;
        const user = await User.findById(req.user._id);
        
        // Check if video already exists
        const exists = user.likedVideos.some(item => item.id === id);
        if (exists) {
            return res.status(400).json({ error: 'Video already liked' });
        }
        
        user.likedVideos.unshift({ 
            id, 
            title, 
            thumbnail, 
            channelTitle, 
            likedAt: likedAt ? new Date(likedAt) : new Date() 
        });
        await user.save();
        
        res.json({ message: 'Video added to liked videos', likedVideos: user.likedVideos });
    } catch (error) {
        console.error('Error adding to liked videos:', error);
        res.status(500).json({ error: 'Error adding to liked videos' });
    }
});

app.delete('/api/liked-videos/:videoId', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        user.likedVideos = user.likedVideos.filter(item => item.id !== req.params.videoId);
        await user.save();
        
        res.json({ message: 'Video removed from liked videos', likedVideos: user.likedVideos });
    } catch (error) {
        console.error('Error removing from liked videos:', error);
        res.status(500).json({ error: 'Error removing from liked videos' });
    }
});

// Playlists endpoints
app.get('/api/playlists', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        res.json({ playlists: user.playlists || [] });
    } catch (error) {
        console.error('Error fetching playlists:', error);
        res.status(500).json({ error: 'Error fetching playlists' });
    }
});

app.post('/api/playlists', auth, async (req, res) => {
    try {
        const { name, description } = req.body;
        const user = await User.findById(req.user._id);
        
        const newPlaylist = {
            id: new mongoose.Types.ObjectId().toString(),
            name,
            description: description || '',
            videos: [],
            createdAt: new Date()
        };
        
        user.playlists.push(newPlaylist);
        await user.save();
        
        res.json({ message: 'Playlist created', playlist: newPlaylist });
    } catch (error) {
        console.error('Error creating playlist:', error);
        res.status(500).json({ error: 'Error creating playlist' });
    }
});

app.delete('/api/playlists/:playlistId', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        user.playlists = user.playlists.filter(p => p.id !== req.params.playlistId);
        await user.save();
        
        res.json({ message: 'Playlist deleted', playlists: user.playlists });
    } catch (error) {
        console.error('Error deleting playlist:', error);
        res.status(500).json({ error: 'Error deleting playlist' });
    }
});

app.post('/api/playlists/:playlistId/videos', auth, async (req, res) => {
    try {
        const { id, title, thumbnail, channelTitle } = req.body;
        const user = await User.findById(req.user._id);
        
        const playlist = user.playlists.find(p => p.id === req.params.playlistId);
        if (!playlist) {
            return res.status(404).json({ error: 'Playlist not found' });
        }
        
        // Check if video already exists in playlist
        const exists = playlist.videos.some(v => v.id === id);
        if (exists) {
            return res.status(400).json({ error: 'Video already in playlist' });
        }
        
        playlist.videos.push({ id, title, thumbnail, channelTitle });
        await user.save();
        
        res.json({ message: 'Video added to playlist', playlist });
    } catch (error) {
        console.error('Error adding video to playlist:', error);
        res.status(500).json({ error: 'Error adding video to playlist' });
    }
});

app.delete('/api/playlists/:playlistId/videos/:videoId', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        
        const playlist = user.playlists.find(p => p.id === req.params.playlistId);
        if (!playlist) {
            return res.status(404).json({ error: 'Playlist not found' });
        }
        
        playlist.videos = playlist.videos.filter(v => v.id !== req.params.videoId);
        await user.save();
        
        res.json({ message: 'Video removed from playlist', playlist });
    } catch (error) {
        console.error('Error removing video from playlist:', error);
        res.status(500).json({ error: 'Error removing video from playlist' });
    }
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error('Unhandled Error:', err);
    res.status(500).json({ error: 'An unexpected error occurred' });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Export the Express API
module.exports = app; 