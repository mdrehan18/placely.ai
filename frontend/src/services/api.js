import axios from 'axios';

let baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Automatically append /api if it's missing from a custom URL
if (import.meta.env.VITE_API_URL && !import.meta.env.VITE_API_URL.endsWith('/api')) {
  baseURL = `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/api`;
}

const api = axios.create({
  baseURL,
});

// Add a request interceptor to attach the JWT token
api.interceptors.request.use(
  (config) => {
    // Assuming token is stored in localStorage after login
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
