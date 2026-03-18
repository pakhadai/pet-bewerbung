/**
 * CSRF Token Hook
 * Fetches and manages CSRF tokens for secure API requests
 */

import { useState, useEffect } from 'react';
import API_ENDPOINTS from '../config';

/**
 * Fetch with timeout to prevent hanging requests
 * @param url - URL to fetch
 * @param options - Fetch options
 * @param timeoutMs - Timeout in milliseconds (default: 5000ms)
 * @returns Promise that resolves to Response or rejects on timeout
 */
const fetchWithTimeout = async (url: string, options: RequestInit = {}, timeoutMs: number = 5000): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error(`Request timeout after ${timeoutMs}ms`);
    }
    throw err;
  }
};

export const useCsrf = () => {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchToken = async () => {
      try {
        // SECURITY: Add 5-second timeout to prevent hanging app initialization
        const response = await fetchWithTimeout(API_ENDPOINTS.csrfToken, {}, 5000);
        if (!response.ok) {
          throw new Error('Failed to fetch CSRF token');
        }
        const data = await response.json();

        if (mounted) {
          setToken(data.csrfToken);
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
