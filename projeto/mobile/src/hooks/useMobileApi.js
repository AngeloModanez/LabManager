import { useState, useCallback } from 'react';

export const useMobileApi = (service) => {
  const [loading, setLoading] = useState(false);

  const execute = useCallback(async (operation, ...args) => {
    setLoading(true);
    try {
      const result = await service[operation](...args);
      return result;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  }, [service]);

  return { execute, loading };
};