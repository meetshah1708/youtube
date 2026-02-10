// contexts/WatchLaterContext.jsx
import  { createContext, useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { userDataAPI } from '../utils/api';
import { useAuth } from './AuthContext';

const WatchLaterContext = createContext();

export function useWatchLater() {
  return useContext(WatchLaterContext);
}

export function WatchLaterProvider({ children }) {
  const { user } = useAuth();
  const [watchLaterItems, setWatchLaterItems] = useState(() => {
    const savedItems = localStorage.getItem('watchLater');
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
    localStorage.setItem('watchLater', JSON.stringify(watchLaterItems));
  }, [watchLaterItems]);

  const loadFromBackend = async () => {
    try {
      setLoading(true);
      const data = await userDataAPI.getUserData();
      setWatchLaterItems(data.watchLater || []);
    } catch (error) {
      console.error('Error loading watch later from backend:', error);
      // Keep using localStorage data as fallback
    } finally {
      setLoading(false);
    }
  };

  const addToWatchLater = async (video) => {
    // Optimistically update UI
    if (watchLaterItems.some(item => item.id === video.id)) {
      return;
    }
    
    const newItem = { 
      id: video.id, 
      title: video.title || video.snippet?.title,
      thumbnail: video.thumbnail || video.snippet?.thumbnails?.medium?.url,
      channelTitle: video.channelTitle || video.snippet?.channelTitle
    };
    
    setWatchLaterItems(prev => [...prev, newItem]);

    // Sync with backend if user is logged in
    if (user) {
      try {
        await userDataAPI.addToWatchLater(newItem);
      } catch (error) {
        console.error('Error adding to watch later:', error);
        // Revert on error
        setWatchLaterItems(prev => prev.filter(item => item.id !== video.id));
      }
    }
  };

  const removeFromWatchLater = async (videoId) => {
    // Optimistically update UI
    const previousItems = watchLaterItems;
    setWatchLaterItems(prev => prev.filter(item => item.id !== videoId));

    // Sync with backend if user is logged in
    if (user) {
      try {
        await userDataAPI.removeFromWatchLater(videoId);
      } catch (error) {
        console.error('Error removing from watch later:', error);
        // Revert on error
        setWatchLaterItems(previousItems);
      }
    }
  };

  return (
      <WatchLaterContext.Provider value={{
        watchLaterItems,
        addToWatchLater,
        removeFromWatchLater,
        loading
      }}>
        {children}
      </WatchLaterContext.Provider>
  );
}

WatchLaterProvider.propTypes = {
  children: PropTypes.node.isRequired
};