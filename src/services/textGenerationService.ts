import { MAX_DESCRIPTION_LENGTH } from '../constants'
import type { PetData } from '../types/form'
import type { TranslationObject } from '../types/template'

interface GenerationPack {
  openings: [string, string, string]
  noise: { low: string; medium: string; high: string }
  social: { childrenGood: string; childrenNeutral: string; petsGood: string; petsNeutral: string }
  routines: [string, string, string]
  responsibility: string
  closings: [string, string, string]
  extras: [string, string, string]
}

const FALLBACK_PACK: GenerationPack = {
  openings: [
    '{name} has proven to be a gentle yet attentive companion who enriches any living situation with a natural sense of calm and reliability.',
    'With {name}, every home gains a loyal and perceptive companion who integrates effortlessly into daily life and radiates genuine warmth.',
    'Those who meet {name} quickly discover a pet with remarkable character – dependable, adaptable, and blessed with a warm-hearted nature that inspires trust.',
  ],
  noise: {
    low: '{name} is notably calm and composed – noise or restlessness are simply not part of the picture, making coexistence particularly pleasant for everyone involved.',
    medium:
      '{name} has a well-balanced temperament and only vocalizes in understandable situations, such as when visitors arrive – in everyday life, noise levels remain comfortably low.',
    high: '{name} communicates actively and attentively, though consistent routines and thoughtful training ensure that vocalizations remain controlled and predictable.',
  },
  social: {
    childrenGood:
      'Around children, {name} shows remarkable patience and sensitivity – a natural gentleness that families especially appreciate.',
    childrenNeutral:
      '{name} behaves respectfully and calmly around children, maintaining a polite distance without being intrusive.',
    petsGood:
      '{name} approaches other animals with friendly curiosity and strong social compatibility, ensuring a harmonious coexistence.',
    petsNeutral:
      'With other animals, {name} displays a composed independence – neither anxious nor dominant, but calmly self-assured.',
  },
  routines: [
    'Daily life follows a well-established structure: rest periods alternate harmoniously with active times, ensuring a predictable and disturbance-free routine.',
    '{name} has learned to handle time alone with composure – a sign of emotional maturity and independence that makes everyday life smoother for everyone.',
    'Clear feeding, play, and rest schedules define each day, creating a balance that benefits not only the pet but the entire living environment.',
  ],
  responsibility:
    'Regular veterinary check-ups, complete vaccination coverage, and consistent care reflect a strong sense of responsibility and ensure that health risks are kept to a minimum.',
  closings: [
    '{name} is a pet that earns trust – through reliability, adaptability, and a fundamentally friendly nature that gives any landlord confidence.',
    'Overall, {name} presents as an ideal housemate: well-groomed, socially compatible, and ready to fit harmoniously into any living situation.',
    'Choosing {name} means choosing a companion who embodies both responsibility and quality of life – a genuine asset to any home.',
  ],
  extras: [
    'Cleanliness and consideration for the shared living environment are among the natural strengths that make daily life easier for everyone.',
    'The close bond between owner and pet is reflected in balanced, stress-free behavior that neighbors notice and appreciate.',
    'Loving yet consistent guidance has shaped a personality that behaves respectfully and unobtrusively in multi-tenant buildings.',
  ],
}

const str = (v: unknown, fb: string): string => (typeof v === 'string' && v.length > 0 ? v : fb)

const tri = (v: unknown, fb: [string, string, string]): [string, string, string] => {
  if (!Array.isArray(v) || v.length < 3) return fb
  const [a, b, c] = v
  if (typeof a !== 'string' || typeof b !== 'string' || typeof c !== 'string') return fb
  return [a, b, c]
}

export const getGenerationPack = (raw: unknown): GenerationPack => {
  const o = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {}
  const n = o.noise && typeof o.noise === 'object' ? (o.noise as Record<string, unknown>) : {}
  const s = o.social && typeof o.social === 'object' ? (o.social as Record<string, unknown>) : {}
  return {
    openings: tri(o.openings, FALLBACK_PACK.openings),
    noise: {
      low: str(n.low, FALLBACK_PACK.noise.low),
      medium: str(n.medium, FALLBACK_PACK.noise.medium),
      high: str(n.high, FALLBACK_PACK.noise.high),
    },
    social: {
      childrenGood: str(s.childrenGood, FALLBACK_PACK.social.childrenGood),
      childrenNeutral: str(s.childrenNeutral, FALLBACK_PACK.social.childrenNeutral),
      petsGood: str(s.petsGood, FALLBACK_PACK.social.petsGood),
      petsNeutral: str(s.petsNeutral, FALLBACK_PACK.social.petsNeutral),
    },
    routines: tri(o.routines, FALLBACK_PACK.routines),
    responsibility: str(o.responsibility, FALLBACK_PACK.responsibility),
    closings: tri(o.closings, FALLBACK_PACK.closings),
    extras: tri(o.extras, FALLBACK_PACK.extras),
  }
}

export const generatePetDescriptionText = (
  data: PetData,
  t: TranslationObject | undefined,
  variantIndex: number
): { text: string; nextVariantIndex: number } => {
  const lbl = (t?.labels as Record<string, string | undefined> | undefined) ?? {}
  const pack = getGenerationPack(t?.generationText)

  const variant = variantIndex % 3
  const petName = data.name?.trim() || lbl.petName || 'Pet'
  const r = (s: string) => s.replace(/\{name\}/g, petName)

  const body: string[] = []
  body.push(r(pack.openings[variant]))

  const noiseKey =
    data.noiseLevel === 'high' ? 'high' : data.noiseLevel === 'medium' ? 'medium' : 'low'
  body.push(r(pack.noise[noiseKey]))

  if (data.behaviorWithChildren && data.behaviorWithChildren !== 'avoid') {
    body.push(
      r(data.behaviorWithChildren === 'good' ? pack.social.childrenGood : pack.social.childrenNeutral)
    )
  }

  if (data.behaviorWithPets && data.behaviorWithPets !== 'avoid') {
    body.push(r(data.behaviorWithPets === 'good' ? pack.social.petsGood : pack.social.petsNeutral))
  }

  body.push(r(pack.routines[variant]))
  body.push(r(pack.responsibility))

  const closing = r(pack.closings[variant])
  const target = Math.floor(MAX_DESCRIPTION_LENGTH * 0.88)
  let assembled = body.join(' ')
  let ei = 0
  while (assembled.length + closing.length + 1 < target && ei < pack.extras.length) {
    assembled += ' ' + r(pack.extras[(variant + ei) % pack.extras.length])
    ei += 1
  }

  const fullText = (assembled + ' ' + closing).replace(/\s+/g, ' ').trim()
  return {
    text: fullText.slice(0, MAX_DESCRIPTION_LENGTH),
    nextVariantIndex: variantIndex + 1,
  }
}

