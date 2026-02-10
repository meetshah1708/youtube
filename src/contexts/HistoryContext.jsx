// contexts/HistoryContext.jsx
import { createContext, useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { userDataAPI } from '../utils/api';
import { useAuth } from './AuthContext';

const HistoryContext = createContext();

export function useHistory() {
    return useContext(HistoryContext);
}

export function HistoryProvider({ children }) {
    const { user } = useAuth();
    const [historyItems, setHistoryItems] = useState(() => {
        const savedItems = localStorage.getItem('watchHistory');
        return savedItems ? JSON.parse(savedItems) : [];
    });
    const [loading, setLoading] = useState(false);

    // Sync with backend when user logs in
    useEffect(() => {
        if (user) {
            loadFromBackend();
        }
    }, [user]);

    // Keep localStorage in sync as fallback
    useEffect(() => {
        localStorage.setItem('watchHistory', JSON.stringify(historyItems));
    }, [historyItems]);

    const loadFromBackend = async () => {
        try {
            setLoading(true);
            const data = await userDataAPI.getUserData();
            setHistoryItems(data.history || []);
        } catch (error) {
            console.error('Error loading history from backend:', error);
            // Keep using localStorage data as fallback
        } finally {
            setLoading(false);
        }
    };

    const addToHistory = async (video) => {
        const newItem = {
            id: video.id,
            title: video.title,
            thumbnail: video.thumbnail,
            channelTitle: video.channelTitle,
            watchedAt: new Date().toISOString()
        };

        // Optimistically update UI
        setHistoryItems(prev => {
            const filtered = prev.filter(item => item.id !== video.id);
            return [newItem, ...filtered].slice(0, 100);
        });

        // Sync with backend if user is logged in
        if (user) {
            try {
                await userDataAPI.addToHistory(newItem);
            } catch (error) {
                console.error('Error adding to history:', error);
            }
        }
    };

    const removeFromHistory = async (videoId) => {
        // Optimistically update UI
        const previousItems = historyItems;
        setHistoryItems(prev => prev.filter(item => item.id !== videoId));

        // Sync with backend if user is logged in
        if (user) {
            try {
                await userDataAPI.removeFromHistory(videoId);
            } catch (error) {
                console.error('Error removing from history:', error);
                // Revert on error
                setHistoryItems(previousItems);
            }
        }
    };

    const clearHistory = async () => {
        // Optimistically update UI
        const previousItems = historyItems;
        setHistoryItems([]);

        // Sync with backend if user is logged in
        if (user) {
            try {
                await userDataAPI.clearHistory();
            } catch (error) {
                console.error('Error clearing history:', error);
                // Revert on error
                setHistoryItems(previousItems);
            }
        }
    };

    return (
        <HistoryContext.Provider value={{
            historyItems,
            addToHistory,
            removeFromHistory,
            clearHistory,
            loading
        }}>
            {children}
        </HistoryContext.Provider>
    );
}

HistoryProvider.propTypes = {
    children: PropTypes.node.isRequired
};
