// contexts/PlaylistContext.jsx
import { createContext, useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';

const PlaylistContext = createContext();

export function usePlaylist() {
    return useContext(PlaylistContext);
}

export function PlaylistProvider({ children }) {
    const [playlists, setPlaylists] = useState(() => {
        const savedPlaylists = localStorage.getItem('playlists');
        return savedPlaylists ? JSON.parse(savedPlaylists) : [];
    });

    useEffect(() => {
        localStorage.setItem('playlists', JSON.stringify(playlists));
    }, [playlists]);

    const createPlaylist = (name) => {
        const newPlaylist = {
            id: crypto.randomUUID(),
            name,
            videos: [],
            createdAt: new Date().toISOString()
        };
        setPlaylists(prev => [newPlaylist, ...prev]);
        return newPlaylist.id;
    };

    const deletePlaylist = (playlistId) => {
        setPlaylists(prev => prev.filter(p => p.id !== playlistId));
    };

    const addVideoToPlaylist = (playlistId, video) => {
        setPlaylists(prev => prev.map(p => {
            if (p.id === playlistId) {
                if (p.videos.some(v => v.id === video.id)) {
                    return p; // Already exists
                }
                return {
                    ...p,
                    videos: [...p.videos, { ...video, addedAt: new Date().toISOString() }]
                };
            }
            return p;
        }));
    };

    const removeVideoFromPlaylist = (playlistId, videoId) => {
        setPlaylists(prev => prev.map(p => {
            if (p.id === playlistId) {
                return {
                    ...p,
                    videos: p.videos.filter(v => v.id !== videoId)
                };
            }
            return p;
        }));
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
            renamePlaylist
        }}>
            {children}
        </PlaylistContext.Provider>
    );
}

PlaylistProvider.propTypes = {
    children: PropTypes.node.isRequired
};
