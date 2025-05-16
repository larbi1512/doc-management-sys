// src/services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
});

import type { InternalAxiosRequestConfig } from 'axios';

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    console.log('[api] token=', token, '→', config.method, config.url);
    // Only add Authorization header if token exists and it's not a login request
    if (token && config.url !== '/auth/login') {
      config.headers = config.headers ?? {};
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    // Always set Content-Type for POST requests
    config.headers = config.headers ?? {};
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
