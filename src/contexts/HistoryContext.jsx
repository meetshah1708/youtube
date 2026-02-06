// contexts/HistoryContext.jsx
import { createContext, useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';

const HistoryContext = createContext();

export function useHistory() {
    return useContext(HistoryContext);
}

export function HistoryProvider({ children }) {
    const [historyItems, setHistoryItems] = useState(() => {
        const savedItems = localStorage.getItem('watchHistory');
        return savedItems ? JSON.parse(savedItems) : [];
    });

    useEffect(() => {
        localStorage.setItem('watchHistory', JSON.stringify(historyItems));
    }, [historyItems]);

    const addToHistory = (video) => {
        setHistoryItems(prev => {
            // Remove if already exists (will be re-added at the top)
            const filtered = prev.filter(item => item.id !== video.id);
            // Add to the beginning with timestamp
            const newItem = {
                ...video,
                watchedAt: new Date().toISOString()
            };
            // Keep only the last 100 items
            return [newItem, ...filtered].slice(0, 100);
        });
    };

    const removeFromHistory = (videoId) => {
        setHistoryItems(prev => prev.filter(item => item.id !== videoId));
    };

    const clearHistory = () => {
        setHistoryItems([]);
    };

    return (
        <HistoryContext.Provider value={{
            historyItems,
            addToHistory,
            removeFromHistory,
            clearHistory
        }}>
            {children}
        </HistoryContext.Provider>
    );
}

HistoryProvider.propTypes = {
    children: PropTypes.node.isRequired
};
