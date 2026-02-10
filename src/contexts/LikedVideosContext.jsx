// contexts/LikedVideosContext.jsx
import { createContext, useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { userDataAPI } from '../utils/api';
import { useAuth } from './AuthContext';

const LikedVideosContext = createContext();

export function useLikedVideos() {
    return useContext(LikedVideosContext);
}

export function LikedVideosProvider({ children }) {
    const { user } = useAuth();
    const [likedVideos, setLikedVideos] = useState(() => {
        const savedItems = localStorage.getItem('likedVideos');
        return savedItems ? JSON.parse(savedItems) : [];
    });
    const [loading, setLoading] = useState(false);

    // Sync with backend when user logs in
    useEffect(() => {
        if (user) {
            loadFromBackend();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    // Keep localStorage in sync as fallback
    useEffect(() => {
        localStorage.setItem('likedVideos', JSON.stringify(likedVideos));
    }, [likedVideos]);

    const loadFromBackend = async () => {
        try {
            setLoading(true);
            const data = await userDataAPI.getUserData();
            setLikedVideos(data.likedVideos || []);
        } catch (error) {
            console.error('Error loading liked videos from backend:', error);
            // Keep using localStorage data as fallback
        } finally {
            setLoading(false);
        }
    };

    const addToLikedVideos = async (video) => {
        // Check if already exists
        if (likedVideos.some(item => item.id === video.id)) {
            return;
        }

        const newItem = {
            id: video.id,
            title: video.title || video.snippet?.title,
            thumbnail: video.thumbnail || video.snippet?.thumbnails?.medium?.url,
            channelTitle: video.channelTitle || video.snippet?.channelTitle,
            likedAt: new Date().toISOString()
        };

        // Optimistically update UI
        setLikedVideos(prev => [newItem, ...prev]);

        // Sync with backend if user is logged in
        if (user) {
            try {
                await userDataAPI.addToLikedVideos(newItem);
            } catch (error) {
                console.error('Error adding to liked videos:', error);
                // Revert on error
                setLikedVideos(prev => prev.filter(item => item.id !== video.id));
            }
        }
    };

    const removeFromLikedVideos = async (videoId) => {
        // Optimistically update UI
        const previousItems = likedVideos;
        setLikedVideos(prev => prev.filter(item => item.id !== videoId));

        // Sync with backend if user is logged in
        if (user) {
            try {
                await userDataAPI.removeFromLikedVideos(videoId);
            } catch (error) {
                console.error('Error removing from liked videos:', error);
                // Revert on error
                setLikedVideos(previousItems);
            }
        }
    };

    const isVideoLiked = (videoId) => {
        return likedVideos.some(item => item.id === videoId);
    };

    return (
        <LikedVideosContext.Provider value={{
            likedVideos,
            addToLikedVideos,
            removeFromLikedVideos,
            isVideoLiked,
            loading
        }}>
            {children}
        </LikedVideosContext.Provider>
    );
}

LikedVideosProvider.propTypes = {
    children: PropTypes.node.isRequired
};
