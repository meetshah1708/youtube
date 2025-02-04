import Feed from "./components/Feed"
import Videos from './components/Videos'
import VideoDetail from './components/VideoDetail'
import SearchFeed from './components/SearchFeed'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ChannelDetail from "./components/ChannelDetail"
import Login from "./components/Login"
import SignUp from "./components/SignUp"
import { Box, CssBaseline } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import ErrorBoundary from './components/ErrorBoundary'
import Navbar from "./components/Navbar.jsx";
import {WatchLaterProvider} from './contexts/WatchLaterContext'
import {WatchLater} from "./components/WatchLater.jsx";

function App() {
    const theme = useTheme();

    return (
        <ErrorBoundary>
        <AuthProvider>
            <WatchLaterProvider>
            <Box sx={{ 
                bgcolor: theme.palette.background.default,
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <CssBaseline />
                <BrowserRouter>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<SignUp />} />
                        <Route path="/" element={
                            <ProtectedRoute>
                                <Navbar/>
                                <Feed selectedCategory="new"/>
                            </ProtectedRoute>
                        } />
                        <Route path="/videos" exact element={<Videos />} />
                        <Route path="/video/:videoId" element={
                            <ProtectedRoute>
                                <VideoDetail />
                            </ProtectedRoute>
                        } />
                        <Route path="/watch-later" element={<WatchLater />} />

                        <Route path="/search/:searchTerm" exact element={<SearchFeed />} />
                        <Route path="/channel/:channelId" element={<ChannelDetail />} />
                    </Routes>
                </BrowserRouter>
            </Box>
            </WatchLaterProvider>
        </AuthProvider>
        </ErrorBoundary>
    )
}

export default App
