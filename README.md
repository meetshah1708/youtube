# METube - YouTube Clone

A modern YouTube clone built with React, Vite, and Material-UI featuring user authentication, video streaming, and a Watch Later feature.

## 🚀 Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool with HMR support
- **Material-UI (MUI)** - Component library for modern UI
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **React Player** - Video playback
- **React Infinite Scroll** - Infinite scrolling for feeds

### Backend
- **Node.js & Express** - Server framework
- **MongoDB & Mongoose** - Database and ODM
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Helmet** - Security middleware

## ⚙️ Features

- 🔐 **User Authentication** - Secure signup/login with JWT tokens
- 🎥 **Video Streaming** - Watch YouTube videos via RapidAPI
- 🔍 **Search Functionality** - Search for videos across YouTube
- 📺 **Channel Pages** - View channel details and videos
- ⏰ **Watch Later** - Save videos to watch later (persisted in localStorage)
- 🌓 **Dark/Light Mode** - Theme toggle for user preference
- 📱 **Responsive Design** - Works on mobile, tablet, and desktop
- 🔒 **Protected Routes** - Auth-required pages for logged-in users

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16+)
- MongoDB instance (local or cloud)
- RapidAPI key for YouTube API

### Frontend Setup

```bash
# Clone the repository
git clone https://github.com/meetshah1708/youtube.git

# Navigate to project directory
cd youtube

# Install dependencies
npm install

# Create .env file with your RapidAPI key
echo "VITE_RAPID_API_YOUTUBE_KEY=your_rapidapi_key_here" > .env

# Start development server
npm run dev
```

### Backend Setup

```bash
# Navigate to backend directory
cd src/backend

# Install backend dependencies
npm install

# Create .env file with required variables
cat > .env << EOF
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
EOF

# Start backend server
node server.js
```

## 🏗️ Project Structure

```
youtube/
├── public/
│   └── manifest.json
├── src/
│   ├── assets/
│   │   ├── FetchApi.js
│   │   └── youtube.js
│   ├── backend/
│   │   ├── server.js          # Express server & API routes
│   │   ├── middleware/
│   │   │   └── errorHandler.js
│   │   ├── package.json
│   │   └── render.yaml
│   ├── components/
│   │   ├── ChannelCard.jsx
│   │   ├── ChannelDetail.jsx
│   │   ├── Comments.jsx
│   │   ├── ErrorBoundary.jsx
│   │   ├── Feed.jsx
│   │   ├── LoadingSpinner.jsx
│   │   ├── Login.jsx
│   │   ├── Navbar.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── SearchBar.jsx
│   │   ├── SearchFeed.jsx
│   │   ├── SideBar.jsx
│   │   ├── SignUp.jsx
│   │   ├── SkeletonCard.jsx
│   │   ├── VideoCard.jsx
│   │   ├── VideoDetail.jsx
│   │   ├── Videos.jsx
│   │   └── WatchLater.jsx
│   ├── contexts/
│   │   ├── AuthContext.jsx    # Authentication state management
│   │   ├── ThemeContext.jsx   # Dark/Light mode toggle
│   │   └── WatchLaterContext.jsx
│   ├── hooks/
│   │   └── useResponsive.js
│   ├── styles/
│   │   └── animations.js
│   ├── theme/
│   │   └── theme.js
│   ├── App.jsx
│   ├── App.css
│   ├── config.js
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 📦 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |

## 🔧 Environment Variables

### Frontend (.env)
```
VITE_RAPID_API_YOUTUBE_KEY=your_rapidapi_key
```

### Backend (src/backend/.env)
```
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_secret_key
PORT=5000
```

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/signup` | Register new user |
| POST | `/api/login` | Authenticate user |
| GET | `/profile` | Get user profile (protected) |
| GET | `/health` | Health check endpoint |

## 📱 Responsive Breakpoints

- **Mobile**: < 600px
- **Tablet**: 600px - 960px
- **Desktop**: > 960px

## 🚀 Deployment

### Frontend (Vercel)
The frontend is deployed on Vercel at: `https://youtube-meet.vercel.app`

### Backend (Render)
The backend API is deployed on Render at: `https://youtube-c8u0.onrender.com`

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 📞 Contact

- GitHub: [@meetshah1708](https://github.com/meetshah1708)


