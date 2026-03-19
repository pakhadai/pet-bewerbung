/**
 * CSRF Token Hook
 * Fetches and manages CSRF tokens for secure API requests
 * Includes retry on failure (AbortError/timeout) to avoid silent 403 on flaky connections
 */

import { useState, useEffect, useCallback } from 'react';
import API_ENDPOINTS from '../config';

const MAX_RETRIES = 2;
const TIMEOUT_MS = 5000;

/**
 * Fetch with timeout to prevent hanging requests
 */
const fetchWithTimeout = async (url: string, options: RequestInit = {}, timeoutMs: number = TIMEOUT_MS): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timeoutId);
    return response;
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    if (err instanceof Error && err.name === 'AbortError') {
      throw new Error(`Request timeout after ${timeoutMs}ms`);
    }
    throw err;
  }
};

export const useCsrf = () => {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchToken = useCallback(async () => {
    let lastErr: Error | null = null;
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        const response = await fetchWithTimeout(API_ENDPOINTS.csrfToken, { credentials: 'include' }, TIMEOUT_MS);
        if (!response.ok) throw new Error('Failed to fetch CSRF token');
        const data = await response.json();
        setToken(data.csrfToken ?? null);
        setError(null);
        return;
      } catch (err) {
        lastErr = err instanceof Error ? err : new Error('Unknown error');
        if (attempt < MAX_RETRIES) {
          await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
        }
      }
    }
    setError(lastErr);
    setToken(null);
    console.error('Failed to fetch CSRF token after retries:', lastErr);
  }, []);

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      try {
        await fetchToken();
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    run();
    return () => { mounted = false; };
  }, [fetchToken]);

  const isFatal = !isLoading && !token && !!error;

  return { token, isLoading, error, refetch: fetchToken, isFatal };
};
