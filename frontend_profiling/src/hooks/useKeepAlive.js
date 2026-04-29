import { useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
const INTERVAL = 14 * 60 * 1000; // 14 minutes

export function useKeepAlive() {
  useEffect(() => {
    const ping = () => axios.get(`${API_URL}/ping`).catch(() => {});
    ping(); // ping immediately on mount
    const id = setInterval(ping, INTERVAL);
    return () => clearInterval(id);
  }, []);
}
