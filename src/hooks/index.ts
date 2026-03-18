/**
 * Hooks index
 * Central export point for all application hooks
 */

// Individual hooks - use context hooks from WizardProviders for composition
export { useWizardNavigation } from './useWizardNavigation';
export type { UseWizardNavigationReturn, AnimationDirection } from './useWizardNavigation';

export { useFormData } from './useFormData';
export type { UseFormDataReturn, UseFormDataOptions } from './useFormData';

export { useAIGeneration } from './useAIGeneration';
export type { UseAIGenerationReturn } from './useAIGeneration';

export { useTranslation } from './useTranslation';
export type { UseTranslationReturn, Language } from './useTranslation';

export { useTheme } from './useTheme';
export type { UseThemeReturn } from './useTheme';

export { useToast } from './useToast';
export type { UseToastReturn, Toast, ToastType } from './useToast';

export { useCsrf } from './useCsrf';

// Additional utility hooks
export { useTemplateSelection } from './useTemplateSelection';
export type { UseTemplateSelectionReturn } from './useTemplateSelection';

export { useScrollVisibility } from './useScrollVisibility';

export { useFormValidation, validateStep } from './useFormValidation';
export type { FormValidationResult, FormValidationErrors } from './useFormValidation';
