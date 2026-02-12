const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// Rate limiting configurations
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per windowMs for auth endpoints
    message: 'Too many authentication attempts, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs for API endpoints
    message: 'Too many requests, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

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

// Comment Schema
const commentSchema = new mongoose.Schema({
    videoId: {
        type: String,
        required: true,
        index: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    username: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true,
        trim: true,
        maxlength: 1000
    },
    parentCommentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
        default: null,
        index: true
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    dislikes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    isEdited: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: true
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Create compound index for faster video comment lookups
commentSchema.index({ videoId: 1, createdAt: -1 });
commentSchema.index({ videoId: 1, parentCommentId: 1 });

const Comment = mongoose.model('Comment', commentSchema);

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
app.post(`/api/signup`, authLimiter, async (req, res) => {
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
app.post(`/api/login`, authLimiter, async (req, res) => {
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
app.get('/api/user-data', apiLimiter, auth, async (req, res) => {
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
app.post('/api/watch-later', apiLimiter, auth, async (req, res) => {
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

app.delete('/api/watch-later/:videoId', apiLimiter, auth, async (req, res) => {
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
app.post('/api/history', apiLimiter, auth, async (req, res) => {
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

app.delete('/api/history/:videoId', apiLimiter, auth, async (req, res) => {
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

app.delete('/api/history', apiLimiter, auth, async (req, res) => {
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
app.post('/api/liked-videos', apiLimiter, auth, async (req, res) => {
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

app.delete('/api/liked-videos/:videoId', apiLimiter, auth, async (req, res) => {
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
app.get('/api/playlists', apiLimiter, auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        res.json({ playlists: user.playlists || [] });
    } catch (error) {
        console.error('Error fetching playlists:', error);
        res.status(500).json({ error: 'Error fetching playlists' });
    }
});

app.post('/api/playlists', apiLimiter, auth, async (req, res) => {
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

app.delete('/api/playlists/:playlistId', apiLimiter, auth, async (req, res) => {
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

app.post('/api/playlists/:playlistId/videos', apiLimiter, auth, async (req, res) => {
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

app.delete('/api/playlists/:playlistId/videos/:videoId', apiLimiter, auth, async (req, res) => {
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

// Comments endpoints
// Get all comments for a video
app.get('/api/comments/:videoId', apiLimiter, async (req, res) => {
    try {
        const { videoId } = req.params;
        
        // Get top-level comments (no parent) and populate replies
        const comments = await Comment.find({ 
            videoId, 
            parentCommentId: null 
        })
        .sort({ createdAt: -1 })
        .lean();
        
        // Get all replies for these comments
        const commentIds = comments.map(c => c._id);
        const replies = await Comment.find({ 
            parentCommentId: { $in: commentIds }
        })
        .sort({ createdAt: 1 })
        .lean();
        
        // Organize replies under their parent comments
        const commentsWithReplies = comments.map(comment => ({
            ...comment,
            id: comment._id.toString(),
            likesCount: comment.likes?.length || 0,
            dislikesCount: comment.dislikes?.length || 0,
            replies: replies
                .filter(r => r.parentCommentId.toString() === comment._id.toString())
                .map(r => ({ 
                    ...r, 
                    id: r._id.toString(),
                    likesCount: r.likes?.length || 0,
                    dislikesCount: r.dislikes?.length || 0
                }))
        }));
        
        res.json({ comments: commentsWithReplies });
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ error: 'Error fetching comments' });
    }
});

// Add a comment
app.post('/api/comments', apiLimiter, auth, async (req, res) => {
    try {
        const { videoId, text, parentCommentId } = req.body;
        
        // Validate input
        if (!videoId || !text || text.trim().length === 0) {
            return res.status(400).json({ error: 'Video ID and comment text are required' });
        }
        
        if (text.length > 1000) {
            return res.status(400).json({ error: 'Comment text must be 1000 characters or less' });
        }
        
        // If this is a reply, verify parent comment exists
        if (parentCommentId) {
            const parentComment = await Comment.findById(parentCommentId);
            if (!parentComment) {
                return res.status(404).json({ error: 'Parent comment not found' });
            }
        }
        
        const comment = new Comment({
            videoId,
            userId: req.user._id,
            username: req.user.username,
            text: text.trim(),
            parentCommentId: parentCommentId || null
        });
        
        await comment.save();
        
        const commentObj = comment.toObject();
        commentObj.id = commentObj._id.toString();
        
        res.status(201).json({ message: 'Comment added', comment: commentObj });
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ error: 'Error adding comment' });
    }
});

// Update a comment
app.put('/api/comments/:commentId', apiLimiter, auth, async (req, res) => {
    try {
        const { commentId } = req.params;
        const { text } = req.body;
        
        if (!text || text.trim().length === 0) {
            return res.status(400).json({ error: 'Comment text is required' });
        }
        
        if (text.length > 1000) {
            return res.status(400).json({ error: 'Comment text must be 1000 characters or less' });
        }
        
        const comment = await Comment.findById(commentId);
        
        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }
        
        // Only the comment author can edit
        if (comment.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Not authorized to edit this comment' });
        }
        
        comment.text = text.trim();
        comment.isEdited = true;
        comment.updatedAt = new Date();
        await comment.save();
        
        const commentObj = comment.toObject();
        commentObj.id = commentObj._id.toString();
        
        res.json({ message: 'Comment updated', comment: commentObj });
    } catch (error) {
        console.error('Error updating comment:', error);
        res.status(500).json({ error: 'Error updating comment' });
    }
});

// Delete a comment
app.delete('/api/comments/:commentId', apiLimiter, auth, async (req, res) => {
    try {
        const { commentId } = req.params;
        
        const comment = await Comment.findById(commentId);
        
        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }
        
        // Only the comment author can delete
        if (comment.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Not authorized to delete this comment' });
        }
        
        // Delete the comment and all its replies
        await Comment.deleteMany({
            $or: [
                { _id: commentId },
                { parentCommentId: commentId }
            ]
        });
        
        res.json({ message: 'Comment deleted' });
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({ error: 'Error deleting comment' });
    }
});

// Like a comment
app.post('/api/comments/:commentId/like', apiLimiter, auth, async (req, res) => {
    try {
        const { commentId } = req.params;
        const comment = await Comment.findById(commentId);
        
        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }
        
        const userId = req.user._id;
        const hasLiked = comment.likes.some(id => id.toString() === userId.toString());
        const hasDisliked = comment.dislikes.some(id => id.toString() === userId.toString());
        
        // Remove from dislikes if disliked
        if (hasDisliked) {
            comment.dislikes = comment.dislikes.filter(id => id.toString() !== userId.toString());
        }
        
        // Toggle like
        if (hasLiked) {
            comment.likes = comment.likes.filter(id => id.toString() !== userId.toString());
        } else {
            comment.likes.push(userId);
        }
        
        await comment.save();
        
        res.json({ 
            message: hasLiked ? 'Like removed' : 'Comment liked',
            likesCount: comment.likes.length,
            dislikesCount: comment.dislikes.length
        });
    } catch (error) {
        console.error('Error liking comment:', error);
        res.status(500).json({ error: 'Error liking comment' });
    }
});

// Dislike a comment
app.post('/api/comments/:commentId/dislike', apiLimiter, auth, async (req, res) => {
    try {
        const { commentId } = req.params;
        const comment = await Comment.findById(commentId);
        
        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }
        
        const userId = req.user._id;
        const hasLiked = comment.likes.some(id => id.toString() === userId.toString());
        const hasDisliked = comment.dislikes.some(id => id.toString() === userId.toString());
        
        // Remove from likes if liked
        if (hasLiked) {
            comment.likes = comment.likes.filter(id => id.toString() !== userId.toString());
        }
        
        // Toggle dislike
        if (hasDisliked) {
            comment.dislikes = comment.dislikes.filter(id => id.toString() !== userId.toString());
        } else {
            comment.dislikes.push(userId);
        }
        
        await comment.save();
        
        res.json({ 
            message: hasDisliked ? 'Dislike removed' : 'Comment disliked',
            likesCount: comment.likes.length,
            dislikesCount: comment.dislikes.length
        });
    } catch (error) {
        console.error('Error disliking comment:', error);
        res.status(500).json({ error: 'Error disliking comment' });
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