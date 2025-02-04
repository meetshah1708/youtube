// contexts/WatchLaterContext.jsx
import  { createContext, useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';

const WatchLaterContext = createContext();

export function useWatchLater() {
  return useContext(WatchLaterContext);
}

export function WatchLaterProvider({ children }) {
  const [watchLaterItems, setWatchLaterItems] = useState(() => {
    const savedItems = localStorage.getItem('watchLater');
    return savedItems ? JSON.parse(savedItems) : [];
  });

  useEffect(() => {
    localStorage.setItem('watchLater', JSON.stringify(watchLaterItems));
  }, [watchLaterItems]);

  const addToWatchLater = (video) => {
    setWatchLaterItems(prev => {
      if (!prev.some(item => item.id === video.id)) {
        return [...prev, video];
      }
      return prev;
    });
  };

  const removeFromWatchLater = (videoId) => {
    setWatchLaterItems(prev => prev.filter(item => item.id !== videoId));
  };

  return (
      <WatchLaterContext.Provider value={{
        watchLaterItems,
        addToWatchLater,
        removeFromWatchLater
      }}>
        {children}
      </WatchLaterContext.Provider>
  );
}

WatchLaterProvider.propTypes = {
  children: PropTypes.node.isRequired
};