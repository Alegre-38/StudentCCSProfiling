import { useState, useEffect, useRef, useCallback } from 'react';
import { cachedGet } from '../api/config';

/**
 * useFetch — cached data fetching hook
 * @param {string|null} url  - API endpoint (null = skip)
 * @param {number}      ttl  - Cache TTL in ms (default 60s)
 */
export function useFetch(url, ttl = 60000) {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(!!url);
  const [error, setError]     = useState(null);
  const abortRef              = useRef(null);

  const fetch = useCallback(async (forceUrl) => {
    const target = forceUrl || url;
    if (!target) return;

    // Cancel previous in-flight request
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();

    setLoading(true);
    setError(null);

    try {
      const res = await cachedGet(target, ttl);
      setData(res.data);
    } catch (err) {
      if (err.name !== 'CanceledError' && err.name !== 'AbortError') {
        setError(err?.response?.data?.message || 'Failed to load data.');
      }
    } finally {
      setLoading(false);
    }
  }, [url, ttl]);

  useEffect(() => {
    fetch();
    return () => { if (abortRef.current) abortRef.current.abort(); };
  }, [fetch]);

  return { data, loading, error, refetch: () => fetch() };
}
