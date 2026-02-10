// contexts/PlaylistContext.jsx
import { createContext, useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { userDataAPI } from '../utils/api';
import { useAuth } from './AuthContext';

const PlaylistContext = createContext();

export function usePlaylist() {
    return useContext(PlaylistContext);
}

export function PlaylistProvider({ children }) {
    const { user } = useAuth();
    const [playlists, setPlaylists] = useState(() => {
        const savedPlaylists = localStorage.getItem('playlists');
        return savedPlaylists ? JSON.parse(savedPlaylists) : [];
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
        localStorage.setItem('playlists', JSON.stringify(playlists));
    }, [playlists]);

    const loadFromBackend = async () => {
        try {
            setLoading(true);
            const data = await userDataAPI.getUserData();
            setPlaylists(data.playlists || []);
        } catch (error) {
            console.error('Error loading playlists from backend:', error);
            // Keep using localStorage data as fallback
        } finally {
            setLoading(false);
        }
    };

    const createPlaylist = async (name, description = '') => {
        const tempId = crypto.randomUUID();
        const newPlaylist = {
            id: tempId,
            name,
            description,
            videos: [],
            createdAt: new Date().toISOString()
        };
        
        // Optimistically update UI
        setPlaylists(prev => [newPlaylist, ...prev]);

        // Sync with backend if user is logged in
        if (user) {
            try {
                const response = await userDataAPI.createPlaylist({ name, description });
                // Update with server-generated ID
                setPlaylists(prev => prev.map(p => 
                    p.id === tempId ? { ...p, id: response.playlist.id } : p
                ));
                return response.playlist.id;
            } catch (error) {
                console.error('Error creating playlist:', error);
                // Revert on error
                setPlaylists(prev => prev.filter(p => p.id !== tempId));
                return null;
            }
        }
        
        return tempId;
    };

    const deletePlaylist = async (playlistId) => {
        // Optimistically update UI
        const previousPlaylists = playlists;
        setPlaylists(prev => prev.filter(p => p.id !== playlistId));

        // Sync with backend if user is logged in
        if (user) {
            try {
                await userDataAPI.deletePlaylist(playlistId);
            } catch (error) {
                console.error('Error deleting playlist:', error);
                // Revert on error
                setPlaylists(previousPlaylists);
            }
        }
    };

    const addVideoToPlaylist = async (playlistId, video) => {
        const videoData = {
            id: video.id,
            title: video.title || video.snippet?.title,
            thumbnail: video.thumbnail || video.snippet?.thumbnails?.medium?.url,
            channelTitle: video.channelTitle || video.snippet?.channelTitle
        };

        // Optimistically update UI
        const previousPlaylists = playlists;
        setPlaylists(prev => prev.map(p => {
            if (p.id === playlistId) {
                if (p.videos.some(v => v.id === videoData.id)) {
                    return p; // Already exists
                }
                return {
                    ...p,
                    videos: [...p.videos, { ...videoData, addedAt: new Date().toISOString() }]
                };
            }
            return p;
        }));

        // Sync with backend if user is logged in
        if (user) {
            try {
                await userDataAPI.addVideoToPlaylist(playlistId, videoData);
            } catch (error) {
                console.error('Error adding video to playlist:', error);
                // Revert on error
                setPlaylists(previousPlaylists);
            }
        }
    };

    const removeVideoFromPlaylist = async (playlistId, videoId) => {
        // Optimistically update UI
        const previousPlaylists = playlists;
        setPlaylists(prev => prev.map(p => {
            if (p.id === playlistId) {
                return {
                    ...p,
                    videos: p.videos.filter(v => v.id !== videoId)
                };
            }
            return p;
        }));

        // Sync with backend if user is logged in
        if (user) {
            try {
                await userDataAPI.removeVideoFromPlaylist(playlistId, videoId);
            } catch (error) {
                console.error('Error removing video from playlist:', error);
                // Revert on error
                setPlaylists(previousPlaylists);
            }
        }
    };

    const renamePlaylist = (playlistId, newName) => {
        setPlaylists(prev => prev.map(p => {
            if (p.id === playlistId) {
                return { ...p, name: newName };
            }
            return p;
        }));
    };

    return (
        <PlaylistContext.Provider value={{
            playlists,
            createPlaylist,
            deletePlaylist,
            addVideoToPlaylist,
            removeVideoFromPlaylist,
            renamePlaylist,
            loading
        }}>
            {children}
        </PlaylistContext.Provider>
    );
}

PlaylistProvider.propTypes = {
    children: PropTypes.node.isRequired
};
