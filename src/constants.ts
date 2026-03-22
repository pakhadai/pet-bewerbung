import type { FormData } from './types/form';

export const INITIAL_DATA: FormData & Record<string, unknown> = {
  lang: 'de',
  petType: 'dog',
  ownerName: '',
  email: '',
  phone: '',
  street: '',
  houseNumber: '',
  postal: '',
  city: '',
  name: '',
  breed: '',
  age: '',
  weight: '',
  gender: 'm',
  photo: null,
  chipId: '',
  insuranceProvider: '',
  vetName: '',
  vetPhone: '',
  medicalConditions: '',
  isNeutered: false,
  hasVaccination: true,
  hasRegistration: true,
  keywords: '',
  generatedText: '',
  noiseLevel: 'low',
  aloneTime: '',
  activeHours: '',
  previousLandlordName: '',
  previousLandlordPhone: '',
  previousLandlordEmail: '',
  previousDuration: '',
  emergencyContactName: '',
  emergencyContactPhone: '',
  emergencyContactRelation: '',
  secondaryEmergencyContact: '',
  willingToPayDeposit: true,
  showAdvancedHealthInfo: false,
  behaviorWithChildren: '',
  behaviorWithPets: '',
  /** Persisted with draft — must match PDF / preview (see useTemplateSelection). */
  selectedTemplate: 'classic',
};

/** Generated / edited pet description (Step 3) */
export const MAX_DESCRIPTION_LENGTH = 1090;

/** Medical notes in advanced health step */
export const MAX_MEDICAL_CONDITIONS_LENGTH = 300;

export const TEMPLATE_OPTIONS = [
  { id: 'classic', label: 'Classic' },
  { id: 'modern', label: 'Modern' },
  { id: 'compact', label: 'Compact' },
  { id: 'buddy', label: 'Buddy' },
  { id: 'buddyTest', label: 'Buddy (test)' },
] as const;

/** Full-size logo in /public (WebP) — PDF, templates, previews. */
export const PUBLIC_LOGO_PATH = '/logo.webp';
/** Small WebP for header / LCP (~80px); generated from logo.webp via sharp-cli. */
export const PUBLIC_LOGO_HEADER_PATH = '/logo-header.webp';
