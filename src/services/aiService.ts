/**
 * AI Service
 * Pure API layer for pet description generation.
 * No React dependencies - easily testable.
 */

import API_ENDPOINTS from '../config';

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

export interface GenerateDescriptionParams {
  petData: PetDataForAI;
  lang: string;
  tone: string;
  csrfToken: string;
}

export interface GenerateDescriptionResult {
  description: string;
  remaining?: number;
}

/**
 * Generate pet description via AI API
 * @throws Error on network/API failure
 */
export async function generatePetDescription(
  params: GenerateDescriptionParams
): Promise<GenerateDescriptionResult> {
  const { petData, lang, tone, csrfToken } = params;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-CSRF-Token': csrfToken,
  };

  const res = await fetch(API_ENDPOINTS.generatePetDescription, {
    method: 'POST',
    credentials: 'include',
    headers,
    body: JSON.stringify({
      petData,
      lang,
      tone: tone || 'formal',
    }),
  });

  const json = await res.json();
  const msg = json.error || json.message || 'AI generation failed';

  if (res.status === 429) {
    throw new Error(json.message || 'AI limit reached. Try again tomorrow.');
  }

  if (res.status === 503) {
    throw new Error('AI_SERVICE_UNAVAILABLE');
  }

  if (!res.ok) {
    // Pass through validation errors (400) - don't mask as "AI generation failed"
    const err = new Error(msg) as Error & { status?: number };
    err.status = res.status;
    throw err;
  }

  return {
    description: json.description,
    remaining: json.remaining,
  };
}
