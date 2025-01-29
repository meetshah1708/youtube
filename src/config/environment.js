const ENV = {
  development: {
    API_URL: 'http://localhost:5000/api'
  },
  production: {
    API_URL: 'https://youtube-meet.vercel.app/api'
  }
};

export const getApiUrl = () => {
  const environment = import.meta.env.MODE || 'development';
  return ENV[environment].API_URL;
}; 