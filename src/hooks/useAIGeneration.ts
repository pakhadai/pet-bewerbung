import { useState, useCallback } from 'react';
import API_ENDPOINTS from '../config';

const AI_GENERATIONS_KEY = 'pet-bewerbung-ai-generations';
const PREMIUM_AI_GENERATIONS_KEY = 'pet-bewerbung-premium-ai-generations';

const FREE_LIMIT = 1; // Free users get 1 generation per session
const PREMIUM_LIMIT = 20; // Premium users get 20 generations

interface GenerationData {
  count: number;
  date: string;
}

/**
 * Load generation count from localStorage
 * Resets count if from a different day
 */
const loadGenerationCount = (key: string): number => {
  try {
    const saved = localStorage.getItem(key);
    if (saved) {
      const parsed: GenerationData = JSON.parse(saved);
      // Reset if from a different day
      const today = new Date().toDateString();
      if (parsed.date === today) {
        return parsed.count;
      }
    }
  } catch (e) {
    // ignore
  }
  return 0;
};

/**
 * Save generation count to localStorage
 */
const saveGenerationCount = (key: string, count: number): void => {
  try {
    localStorage.setItem(key, JSON.stringify({
      count,
      date: new Date().toDateString()
    }));
  } catch (e) {
    console.error('Failed to save generation count:', e);
  }
};

export interface UseAIGenerationReturn {
  /** Current generation count */
  generationCount: number;
  /** Whether user can generate (hasn't hit limit) */
  canGenerate: boolean;
  /** Remaining generations allowed */
  remainingGenerations: number;
  /** Free user limit */
  freeLimit: number;
  /** Premium user limit */
  premiumLimit: number;
  /** Increment generation count (call after successful generation) */
  incrementGeneration: () => number;
  /** Reset generation count to 0 */
  resetGenerationCount: () => void;
  /** Generate pet description via API */
  generatePetDescription: (petData: any, isPremium: boolean, csrfToken?: string | null) => Promise<string>;
}

/**
 * AI generation limits hook for free users
 * Tracks local AI generation count (complementary to server-side rate limiting)
 * Premium users get more generations per day
 *
 * @param isPremium - Whether user has premium access
 * @returns Generation state and handlers
 */
export const useAIGeneration = (isPremium: boolean = false): UseAIGenerationReturn => {
  // Free user generation count
  const [generationCount, setGenerationCount] = useState<number>(() =>
    loadGenerationCount(AI_GENERATIONS_KEY)
  );

  // Premium user generation count
  const [premiumGenerationCount, setPremiumGenerationCount] = useState<number>(() =>
    loadGenerationCount(PREMIUM_AI_GENERATIONS_KEY)
  );

  /**
   * Increment generation count
   * Saves to localStorage and returns new count
   */
  const incrementGeneration = useCallback((): number => {
    if (isPremium) {
      const newCount = premiumGenerationCount + 1;
      saveGenerationCount(PREMIUM_AI_GENERATIONS_KEY, newCount);
      setPremiumGenerationCount(newCount);
      return newCount;
    } else {
      const newCount = generationCount + 1;
      saveGenerationCount(AI_GENERATIONS_KEY, newCount);
      setGenerationCount(newCount);
      return newCount;
    }
  }, [generationCount, premiumGenerationCount, isPremium]);

  /**
   * Reset generation count to 0
   */
  const resetGenerationCount = useCallback(() => {
    if (isPremium) {
      saveGenerationCount(PREMIUM_AI_GENERATIONS_KEY, 0);
      setPremiumGenerationCount(0);
    } else {
      saveGenerationCount(AI_GENERATIONS_KEY, 0);
      setGenerationCount(0);
    }
  }, [isPremium]);

  const canGenerate = isPremium
    ? premiumGenerationCount < PREMIUM_LIMIT
    : generationCount < FREE_LIMIT;

  const remainingGenerations = isPremium
    ? Math.max(0, PREMIUM_LIMIT - premiumGenerationCount)
    : Math.max(0, FREE_LIMIT - generationCount);

  /**
   * Generate pet description via API
   * Handles rate limiting, error messages, and generation count
   */
  const generatePetDescription = useCallback(async (petData: any, premium: boolean, csrfToken?: string | null): Promise<string> => {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (csrfToken) {
        headers['X-CSRF-Token'] = csrfToken;
      }

      const response = await fetch(API_ENDPOINTS.generatePetDescription, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          petData,
          isPremium: premium
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate description');
      }

      if (data.description) {
        // Increment count on success
        incrementGeneration();
        return data.description;
      } else {
        throw new Error('No description received');
      }
    } catch (error: any) {
      console.error('AI generation error:', error);
      throw error;
    }
  }, [incrementGeneration]);

  return {
    generationCount: isPremium ? premiumGenerationCount : generationCount,
    canGenerate,
    remainingGenerations,
    freeLimit: FREE_LIMIT,
    premiumLimit: PREMIUM_LIMIT,
    incrementGeneration,
    resetGenerationCount,
    generatePetDescription
  };
};
