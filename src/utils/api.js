// API utility functions for user data operations
import axios from 'axios';

const API_URL = import.meta.env.MODE === 'development'
  ? 'http://localhost:5000/api'
  : 'https://youtube-c8u0.onrender.com/api';

// Helper to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
};

// User Data API
export const userDataAPI = {
  // Get all user data
  getUserData: async () => {
    const response = await axios.get(`${API_URL}/user-data`, getAuthHeaders());
    return response.data;
  },

  // Watch Later
  addToWatchLater: async (video) => {
    const response = await axios.post(`${API_URL}/watch-later`, video, getAuthHeaders());
    return response.data;
  },
  
  removeFromWatchLater: async (videoId) => {
    const response = await axios.delete(`${API_URL}/watch-later/${videoId}`, getAuthHeaders());
    return response.data;
  },

  // History
  addToHistory: async (video) => {
    const response = await axios.post(`${API_URL}/history`, video, getAuthHeaders());
    return response.data;
  },
  
  removeFromHistory: async (videoId) => {
    const response = await axios.delete(`${API_URL}/history/${videoId}`, getAuthHeaders());
    return response.data;
  },
  
  clearHistory: async () => {
    const response = await axios.delete(`${API_URL}/history`, getAuthHeaders());
    return response.data;
  },

  // Liked Videos
  addToLikedVideos: async (video) => {
    const response = await axios.post(`${API_URL}/liked-videos`, video, getAuthHeaders());
    return response.data;
  },
  
  removeFromLikedVideos: async (videoId) => {
    const response = await axios.delete(`${API_URL}/liked-videos/${videoId}`, getAuthHeaders());
    return response.data;
  },

  // Playlists
  getPlaylists: async () => {
    const response = await axios.get(`${API_URL}/playlists`, getAuthHeaders());
    return response.data;
  },
  
  createPlaylist: async (playlist) => {
    const response = await axios.post(`${API_URL}/playlists`, playlist, getAuthHeaders());
    return response.data;
  },
  
  deletePlaylist: async (playlistId) => {
    const response = await axios.delete(`${API_URL}/playlists/${playlistId}`, getAuthHeaders());
    return response.data;
  },
  
  addVideoToPlaylist: async (playlistId, video) => {
    const response = await axios.post(`${API_URL}/playlists/${playlistId}/videos`, video, getAuthHeaders());
    return response.data;
  },
  
  removeVideoFromPlaylist: async (playlistId, videoId) => {
    const response = await axios.delete(`${API_URL}/playlists/${playlistId}/videos/${videoId}`, getAuthHeaders());
    return response.data;
  }
};
