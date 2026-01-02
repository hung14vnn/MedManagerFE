import axios from 'axios';

// Use VITE_API_BASE_URL when provided, otherwise default to a same-origin path '/api'.
// Using '/api' avoids mixed-content issues when the site is served over HTTPS —
// the dev server proxies '/api' to your backend (see vite.config.ts) and in
// production your web server should reverse-proxy '/api' to the backend.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
  ? import.meta.env.VITE_API_BASE_URL.trim()
  : '/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error
      console.error('API Error:', error.response.data);
    } else if (error.request) {
      // Request made but no response
      console.error('Network Error:', error.message);
    }
    return Promise.reject(error);
  }
);
