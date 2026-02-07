/**
 * Hooks index
 * Central export point for all application hooks
 */

// Main wizard hook (combines all sub-hooks)
export { useFormWizard } from './useFormWizard';
export type { UseFormWizardReturn } from './useFormWizard';

// Individual hooks (can be used separately if needed)
export { useWizardNavigation } from './useWizardNavigation';
export type { UseWizardNavigationReturn, AnimationDirection } from './useWizardNavigation';

export { useFormData } from './useFormData';
export type { UseFormDataReturn } from './useFormData';

export { usePremiumSession } from './usePremiumSession';
export type { UsePremiumSessionReturn } from './usePremiumSession';

export { useAIGeneration } from './useAIGeneration';
export type { UseAIGenerationReturn } from './useAIGeneration';

export { useTranslation } from './useTranslation';
export type { UseTranslationReturn, Language } from './useTranslation';

export { useTheme } from './useTheme';
export type { UseThemeReturn } from './useTheme';

export { useToast } from './useToast';
export type { UseToastReturn, Toast, ToastType } from './useToast';

export { useDeviceId } from './useDeviceId';
export type { UseDeviceIdReturn } from './useDeviceId';

// Legacy hooks from original file (re-exported for backward compatibility)
export { useTemplateSelection, usePaymentFlow, useScrollVisibility, useFormValidation } from './useFormWizard.js';

// Alias exports for backward compatibility
export { usePremiumSession as usePremium } from './usePremiumSession';
export { useAIGeneration as useAIGenerations } from './useAIGeneration';
