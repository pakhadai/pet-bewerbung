/**
 * Type Definitions Index
 * Central export point for all TypeScript types
 */

// Form Types
export type {
  Language,
  PetType,
  Gender,
  NoiseLevel,
  BehaviorLevel,
  PetData,
  TemplateType,
  CustomDesign,
  FontFamily,
  SectionId,
  FormValidationError,
  FormValidationResult,
} from './form';

// API Types
export type {
  AIGenerationRequest,
  AIGenerationResponse,
  AIRateLimitStatus,
  CSRFTokenResponse,
  ApiErrorResponse,
  ApiResponse,
} from './api';

// Template Types
export type {
  TemplateConfig,
  TemplateOption,
  TemplateProps,
  CustomColors,
  StyleOverrides,
  TranslationObject,
  TemplateConfigGetter,
  TemplateModule,
} from './template';

// Storage Types
export type {
  StorageType,
  StorageAdapter,
  StorageOptions,
  StorageMetadata,
  StorageEntry,
  StorageKey,
  StorageStrategy,
} from './storage';

export { STORAGE_STRATEGIES } from './storage';
