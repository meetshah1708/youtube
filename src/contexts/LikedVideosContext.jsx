// contexts/LikedVideosContext.jsx
import { createContext, useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';

const LikedVideosContext = createContext();

export function useLikedVideos() {
    return useContext(LikedVideosContext);
}

export function LikedVideosProvider({ children }) {
    const [likedVideos, setLikedVideos] = useState(() => {
        const savedItems = localStorage.getItem('likedVideos');
        return savedItems ? JSON.parse(savedItems) : [];
    });

    useEffect(() => {
        localStorage.setItem('likedVideos', JSON.stringify(likedVideos));
    }, [likedVideos]);

    const addToLikedVideos = (video) => {
        setLikedVideos(prev => {
            if (!prev.some(item => item.id === video.id)) {
                return [{ ...video, likedAt: new Date().toISOString() }, ...prev];
            }
            return prev;
        });
    };

    const removeFromLikedVideos = (videoId) => {
        setLikedVideos(prev => prev.filter(item => item.id !== videoId));
    };

    const isVideoLiked = (videoId) => {
        return likedVideos.some(item => item.id === videoId);
    };

    return (
        <LikedVideosContext.Provider value={{
            likedVideos,
            addToLikedVideos,
            removeFromLikedVideos,
            isVideoLiked
        }}>
            {children}
        </LikedVideosContext.Provider>
    );
}

LikedVideosProvider.propTypes = {
    children: PropTypes.node.isRequired
};
