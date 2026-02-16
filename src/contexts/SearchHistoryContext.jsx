// contexts/SearchHistoryContext.jsx
import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

const SearchHistoryContext = createContext();

const MAX_SEARCH_HISTORY = 20;
const STORAGE_KEY = 'searchHistory';

export function useSearchHistory() {
    return useContext(SearchHistoryContext);
}

export function SearchHistoryProvider({ children }) {
    const [searchHistory, setSearchHistory] = useState(() => {
        try {
            const savedItems = localStorage.getItem(STORAGE_KEY);
            return savedItems ? JSON.parse(savedItems) : [];
        } catch {
            return [];
        }
    });

    // Keep localStorage in sync
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(searchHistory));
    }, [searchHistory]);

    const addSearchTerm = useCallback((term) => {
        const trimmed = term.trim();
        if (!trimmed) return;
        setSearchHistory(prev => {
            const filtered = prev.filter(item => item.toLowerCase() !== trimmed.toLowerCase());
            return [trimmed, ...filtered].slice(0, MAX_SEARCH_HISTORY);
        });
    }, []);

    const removeSearchTerm = useCallback((term) => {
        setSearchHistory(prev => prev.filter(item => item !== term));
    }, []);

    const clearSearchHistory = useCallback(() => {
        setSearchHistory([]);
    }, []);

    const getFilteredHistory = useCallback((query) => {
        if (!query.trim()) return searchHistory;
        const lower = query.toLowerCase();
        return searchHistory.filter(item => item.toLowerCase().includes(lower));
    }, [searchHistory]);

    return (
        <SearchHistoryContext.Provider value={{
            searchHistory,
            addSearchTerm,
            removeSearchTerm,
            clearSearchHistory,
            getFilteredHistory
        }}>
            {children}
        </SearchHistoryContext.Provider>
    );
}

SearchHistoryProvider.propTypes = {
    children: PropTypes.node.isRequired
};
