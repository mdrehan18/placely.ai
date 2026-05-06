import axios from 'axios';

console.log("API BASE URL:", import.meta.env.VITE_API_URL);

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Add a request interceptor to attach the JWT token
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
