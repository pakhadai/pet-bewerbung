/**
 * CSRF Token Hook
 * Fetches and manages CSRF tokens for secure API requests
 */

import { useState, useEffect } from 'react';
import API_ENDPOINTS from '../config';

export const useCsrf = () => {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchToken = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.csrfToken);
        if (!response.ok) {
          throw new Error('Failed to fetch CSRF token');
        }
        const data = await response.json();

        if (mounted) {
          setToken(data.token);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Unknown error'));
          console.error('Failed to fetch CSRF token:', err);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    fetchToken();

    return () => {
      mounted = false;
    };
  }, []);

  return { token, isLoading, error };
};
