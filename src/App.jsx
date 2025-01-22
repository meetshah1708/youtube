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

function App() {
    const theme = useTheme();

    return (
        <AuthProvider>
            <Box sx={{ 
                bgcolor: theme.palette.background.default,
                minHeight: '100vh'
            }}>
                <CssBaseline />
                <BrowserRouter>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<SignUp />} />
                        <Route path="/" element={
                            <ProtectedRoute>
                                <Feed />
                            </ProtectedRoute>
                        } />
                        <Route path="/videos" exact element={<Videos />} />
                        <Route path="/video/:videoId" element={
                            <ProtectedRoute>
                                <VideoDetail />
                            </ProtectedRoute>
                        } />
                        <Route path="/search/:searchTerm" exact element={<SearchFeed />} />
                        <Route path="/channel/:channelId" element={<ChannelDetail />} />
                    </Routes>
                </BrowserRouter>
            </Box>
        </AuthProvider>
    )
}

export default App
