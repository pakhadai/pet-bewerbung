/**
 * AI Generation Helper Functions
 * Extracted from App.tsx for better maintainability
 */

import { API_ENDPOINTS } from '../config';

export interface PetDataForAI {
  petName: string;
  petType: string;
  breed: string;
  age: string;
  gender: string;
  weight: string;
  traits: string;
  neutered: boolean;
  vaccinated: boolean;
}

export interface AIGenerationParams {
  petData: PetDataForAI;
  lang: string;
  premiumToken?: string | null;
  deviceId?: string;
  tone?: string;
}

export interface AIGenerationResponse {
  description?: string;
  length?: number;
  remaining?: number;
  resetTime?: number;
  model?: string;
  error?: string;
  message?: string;
}

/**
 * Generate pet description using AI
 * @param params - Generation parameters
 * @returns AI generated description or error
 */
export async function generatePetDescription(
  params: AIGenerationParams
): Promise<AIGenerationResponse> {
  const { petData, lang, premiumToken, deviceId, tone = 'formal' } = params;

  const res = await fetch(API_ENDPOINTS.generatePetDescription, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      petData,
      lang,
      premiumToken: premiumToken || null,
      deviceId: deviceId || null,
      tone,
    }),
  });

  const json = await res.json();

  if (res.status === 429) {
    // Rate limit exceeded
    return {
      error: 'rate_limit',
      message: json.message || 'AI limit reached. Try again tomorrow.',
      remaining: 0,
      resetTime: json.resetTime,
    };
  }

  if (res.status === 503) {
    // AI not configured
    return {
      error: 'service_unavailable',
      message: 'AI service not available',
    };
  }

  if (!res.ok) {
    return {
      error: 'generation_failed',
      message: json.error || 'AI generation failed',
    };
  }

  return json;
}

/**
 * Get AI rate limit status
 * @returns Rate limit information
 */
export async function getAIRateLimitStatus(): Promise<{
  limit: number;
  remaining: number;
  resetTime: number;
  configured: boolean;
}> {
  try {
    const res = await fetch(API_ENDPOINTS.getAIRateLimitStatus);
    if (!res.ok) {
      throw new Error('Failed to fetch rate limit status');
    }
    return await res.json();
  } catch (err) {
    console.error('Rate limit status error:', err);
    return {
      limit: 0,
      remaining: 0,
      resetTime: Date.now(),
      configured: false,
    };
  }
}

/**
 * Prepare pet data for AI generation from form data
 * @param data - Form data
 * @returns Pet data formatted for AI
 */
export function preparePetDataForAI(data: any): PetDataForAI {
  return {
    petName: data.name || '',
    petType: data.petType || '',
    breed: data.breed || '',
    age: data.age || '',
    gender: data.gender || '',
    weight: data.weight || '',
    traits: data.keywords || '',
    neutered: data.isNeutered || false,
    vaccinated: data.hasVaccination || false,
  };
}
