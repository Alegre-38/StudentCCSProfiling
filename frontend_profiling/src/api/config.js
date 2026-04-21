import axios from 'axios';
import { cache } from './cache';

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 15000,
});

// Attach auth token on every request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-logout on 401
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// Cached GET helper — skips cache for mutations
export async function cachedGet(url, ttl = 60000) {
  const cached = cache.get(url);
  if (cached) return { data: cached };
  const res = await api.get(url);
  cache.set(url, res.data, ttl);
  return res;
}

// Invalidate cache after mutations
export function invalidateCache(pattern) {
  cache.invalidate(pattern);
}

export default api;
