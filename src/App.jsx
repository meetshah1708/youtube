import Feed from "./components/Feed"
import Videos from './components/Videos'
import VideoDetail from './components/VideoDetail'
import SearchFeed from './components/SearchFeed'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ChannelDetail from "./components/ChannelDetail"
import Login from "./components/Login"
import SignUp from "./components/SignUp"
import { CssBaseline } from '@mui/material'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import ErrorBoundary from './components/ErrorBoundary'
import {WatchLaterProvider} from './contexts/WatchLaterContext'
import {WatchLater} from "./components/WatchLater.jsx";
import MainLayout from "./components/MainLayout";

function App() {
    return (
        <ErrorBoundary>
        <AuthProvider>
            <WatchLaterProvider>
                <CssBaseline />
                <BrowserRouter>
                    <Routes>
                        {/* Auth Routes - No MainLayout */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<SignUp />} />

                        {/* Protected Routes */}
                        <Route path="/" element={
                            <ProtectedRoute>
                                <MainLayout>
                                    <Feed selectedCategory="new"/>
                                </MainLayout>
                            </ProtectedRoute>
                        } />

                        <Route path="/videos" exact element={
                             <MainLayout>
                                <Videos />
                            </MainLayout>
                        } />

                        <Route path="/video/:videoId" element={
                            <ProtectedRoute>
                                <MainLayout>
                                    <VideoDetail />
                                </MainLayout>
                            </ProtectedRoute>
                        } />

                        <Route path="/watch-later" element={
                            <MainLayout>
                                <WatchLater />
                            </MainLayout>
                        } />

                        <Route path="/search/:searchTerm" exact element={
                            <MainLayout>
                                <SearchFeed />
                            </MainLayout>
                        } />

                        <Route path="/channel/:channelId" element={
                            <MainLayout>
                                <ChannelDetail />
                            </MainLayout>
                        } />
                    </Routes>
                </BrowserRouter>
            </WatchLaterProvider>
        </AuthProvider>
        </ErrorBoundary>
    )
}

export default App
