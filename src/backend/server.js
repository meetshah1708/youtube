const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
const morgan = require('morgan');
const compression = require('compression');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Security and Performance Middleware
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

app.use(compression()); // Compress responses
app.use(morgan('dev')); // Logging

// CORS configuration
app.use(cors({
    origin: [
        'https://youtube-meet.vercel.app',
        'http://localhost:5173',
        'https://youtube-c8u0.onrender.com'
    ],
    credentials: true
}));

// Body parsing
app.use(express.json());

// Preflight checks
app.options('*', cors());

// Headers middleware (Explicit)
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
});

// Environment Check
if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI is not defined in environment variables');
    process.exit(1);
}

if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET is not defined in environment variables');
    process.exit(1);
}

// Routes
// Note: original routes were /api/signup and /api/login, but profile was /profile (no /api prefix).
// I will keep the original path structure to avoid breaking frontend if possible,
// but standardization is better.
// Frontend calls `${API_URL}/login` where API_URL ends in /api.
// So /api/login is correct.
// Profile route usage needs checking. Frontend likely calls /profile or /api/profile?
// Let's assume /profile based on original code `app.get('/profile'...)`

app.use('/api', authRoutes);
app.use('/', userRoutes); // This mounts /profile to /profile

// Health Check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', uptime: process.uptime() });
});

// Error Handling
app.use(errorHandler);

// Database Connection
mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
})
.then(() => console.log('MongoDB connected'))
.catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;
