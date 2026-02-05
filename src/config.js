// API URL configuration
function getApiUrl() {
  return import.meta.env.MODE === 'development'
    ? 'http://localhost:5000/api'
    : 'https://youtube-c8u0.onrender.com/api';
}

export const API_URL = getApiUrl(); 