/**
 * Form Data Types
 * Complete type definitions for pet CV form data
 */

export type Language = 'de' | 'en' | 'fr' | 'it' | 'rm';

export type PetType = 'dog' | 'cat' | 'other';

export type Gender = 'm' | 'f';

export type NoiseLevel = 'low' | 'medium' | 'high';

export type BehaviorLevel = 'good' | 'neutral' | 'bad';

export interface PetData {
  // Step 1: Basic Info
  ownerName: string;
  street: string;
  houseNumber: string;
  postal: string;
  city: string;
  phone: string;
  email: string;

  // Pet Basic Info
  name: string;
  petType: PetType;
  breed: string;
  age: number | string;
  weight: number | string;
  gender: Gender;

  // Step 2: Health & Insurance
  vetName: string;
  vetPhone: string;
  insuranceProvider: string;
  insuranceNumber: string;
  chipId: string;
  hasVaccination: boolean;
  isNeutered: boolean;
  hasRegistration: boolean;
  medicalConditions: string;

  // Behavior
  noiseLevel: NoiseLevel;
  aloneTime: number | string;
  activeHours: string;
  behaviorWithChildren: BehaviorLevel;
  behaviorWithPets: BehaviorLevel;
  behaviorNotes: string;

  // References
  previousLandlordName: string;
  previousLandlordPhone: string;
  previousDuration: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelation: string;

  // Step 3: AI Generated Description
  generatedText: string;

  // Step 4: Photo & Template
  photo: string; // Base64 or URL
  selectedTemplate: TemplateType;

  // Metadata
  lang: Language;
  createdAt?: string;
  updatedAt?: string;
}

export type TemplateType = 'classic' | 'modern' | 'compact';

export interface FormValidationError {
  field: keyof PetData;
  message: string;
}

export interface FormValidationResult {
  isValid: boolean;
  errors: FormValidationError[];
}
