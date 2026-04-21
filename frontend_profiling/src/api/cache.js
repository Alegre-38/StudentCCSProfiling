// Simple in-memory cache with TTL
const store = new Map();

const DEFAULT_TTL = 60 * 1000; // 1 minute

export const cache = {
  get(key) {
    const entry = store.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      store.delete(key);
      return null;
    }
    return entry.data;
  },

  set(key, data, ttl = DEFAULT_TTL) {
    store.set(key, { data, expiresAt: Date.now() + ttl });
  },

  invalidate(pattern) {
    // Invalidate all keys matching a string prefix or regex
    for (const key of store.keys()) {
      if (typeof pattern === 'string' ? key.startsWith(pattern) : pattern.test(key)) {
        store.delete(key);
      }
    }
  },

  clear() {
    store.clear();
  },
};
