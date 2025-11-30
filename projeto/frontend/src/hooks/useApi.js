import { useState, useCallback } from 'react';

export const useApi = (service) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (operation, ...args) => {
    setLoading(true);
    setError(null);
    try {
      const result = await service[operation](...args);
      return result;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [service]);

  return { execute, loading, error };
};