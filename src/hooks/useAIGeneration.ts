import { useState, useCallback, useEffect } from 'react';
import API_ENDPOINTS from '../config';

const AI_LIMIT = 5; // Server rate limit (per IP per 24h)

export interface UseAIGenerationReturn {
  generationCount: number;
  canGenerate: boolean;
  remainingGenerations: number;
  freeLimit: number;
  incrementGeneration: () => number;
  resetGenerationCount: () => void;
  generatePetDescription: (petData: any, csrfToken?: string | null) => Promise<string>;
}

/**
 * AI generation hook - uses server rate limit (5 per IP per 24h)
 * Fetches remaining from server on mount
 */
export const useAIGeneration = (): UseAIGenerationReturn => {
  const [remaining, setRemaining] = useState<number>(AI_LIMIT);
  const [limit, setLimit] = useState<number>(AI_LIMIT);

  const fetchRateLimit = useCallback(async () => {
    try {
      const res = await fetch(API_ENDPOINTS.aiRateLimit, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setRemaining(data.remaining ?? AI_LIMIT);
        setLimit(data.limit ?? AI_LIMIT);
      }
    } catch {
      return;
    }
  }, []);

  useEffect(() => {
    fetchRateLimit();
  }, [fetchRateLimit]);

  const incrementGeneration = useCallback((): number => {
    setRemaining((prev) => Math.max(0, prev - 1));
    return remaining - 1;
  }, [remaining]);

  const resetGenerationCount = useCallback(() => {
    fetchRateLimit();
  }, [fetchRateLimit]);

  const canGenerate = remaining > 0;

  const generatePetDescription = useCallback(async (petData: any, csrfToken?: string | null): Promise<string> => {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (csrfToken) headers['X-CSRF-Token'] = csrfToken;

    const res = await fetch(API_ENDPOINTS.generatePetDescription, {
      method: 'POST',
      credentials: 'include',
      headers,
      body: JSON.stringify({ petData, lang: 'de', tone: 'formal' }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to generate');
    if (data.remaining !== undefined) setRemaining(data.remaining);
    return data.description || '';
  }, []);

  return {
    generationCount: limit - remaining,
    canGenerate,
    remainingGenerations: remaining,
    freeLimit: AI_LIMIT,
    incrementGeneration,
    resetGenerationCount,
    generatePetDescription,
  };
};
