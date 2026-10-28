import axios from 'axios';

// Base URL for the REST API. Defaults to localhost; override with VITE_API_URL
// in client/.env.local (e.g. https://your-api.onrender.com/api).
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach the JWT to every outgoing request if a token is stored.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Unwrap axios errors into a readable message.
export const getErrorMessage = (err) => {
  if (err?.response?.data?.message) return err.response.data.message;
  if (err?.message === 'Network Error') return 'Network error — is the API running?';
  return 'Something went wrong. Please try again.';
};

export default api;
export { API_URL };
