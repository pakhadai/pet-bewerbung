import { useWizardNavigation } from './useWizardNavigation';
import { useFormData } from './useFormData';
import { usePremiumSession } from './usePremiumSession';
import { useAIGeneration } from './useAIGeneration';
import { useTranslation } from './useTranslation';
import { useTheme } from './useTheme';
import { useToast } from './useToast';
import { useDeviceId } from './useDeviceId';

export interface UseFormWizardReturn {
  // Wizard navigation
  step: number;
  animDir: 'left' | 'right';
  goToStep: (newStep: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setStep: (step: number) => void;

  // Form data
  data: any;
  updateData: (field: string, value: any) => void;
  updateMultipleData: (updates: Record<string, any>) => void;
  resetForm: () => void;
  setData: (data: any) => void;
  clearSavedData: () => void;
  isLoading: boolean;

  // Premium
  isPremium: boolean;
  premiumToken: string | null;
  premiumExpiresAt: number | null;
  premiumTimeRemaining: number;
  premiumPrice: number;
  activatePremium: (paymentId: string) => Promise<boolean>;
  clearPremium: () => void;
  verifyPremiumToken: () => Promise<boolean>;
  isTemplateAccessible: (templateId: string) => boolean;
  getTemplateInfo: (templateId: string) => any;

  // AI Generation
  aiGenerations: number;
  canGenerate: boolean;
  aiRemaining: number;
  generateDescription: (petData: any) => Promise<string>;
  resetAICount: () => void;

  // Translation
  t: any;
  lang: string;
  setLang: (lang: string) => void;

  // Theme
  darkMode: boolean;
  toggleTheme: () => void;
  setDarkMode: (value: boolean) => void;

  // Toast
  toast: any;
  showToast: (msg: string, type?: 'info' | 'success' | 'error' | 'warning') => void;
  hideToast: () => void;

  // Device
  deviceId: string;
}

/**
 * Main form wizard hook
 * Combines all sub-hooks into a single, cohesive interface
 * Manages the entire pet CV application state
 *
 * @returns Combined form wizard state and handlers
 */
export const useFormWizard = (): UseFormWizardReturn => {
  // Initialize all sub-hooks
  const wizardNav = useWizardNavigation();
  const translation = useTranslation();
  const formData = useFormData(translation.lang);
  const device = useDeviceId();
  const premium = usePremiumSession();
  const ai = useAIGeneration(premium.isPremium);
  const theme = useTheme();
  const toast = useToast();

  /**
   * Clear all saved data and reset to initial state
   * Legacy method for backward compatibility
   */
  const clearSavedData = () => {
    formData.resetForm();
    wizardNav.goToStep(0);
  };

  /**
   * Activate premium with device binding
   */
  const activatePremium = async (paymentId: string): Promise<boolean> => {
    return await premium.activate(paymentId, device.deviceId);
  };

  /**
   * Verify premium token with device binding
   */
  const verifyPremiumToken = async (): Promise<boolean> => {
    return await premium.verifyToken(device.deviceId);
  };

  /**
   * Generate pet description with premium status
   */
  const generateDescription = async (petData: any): Promise<string> => {
    return await ai.generatePetDescription(petData, premium.isPremium);
  };

  return {
    // Wizard navigation
    step: wizardNav.step,
    animDir: wizardNav.animDir,
    goToStep: wizardNav.goToStep,
    nextStep: wizardNav.nextStep,
    prevStep: wizardNav.prevStep,
    setStep: wizardNav.setStep,

    // Form data
    data: formData.data,
    updateData: formData.updateData,
    updateMultipleData: formData.updateMultipleData,
    resetForm: formData.resetForm,
    setData: formData.setData,
    clearSavedData,
    isLoading: formData.isLoading,

    // Premium
    isPremium: premium.isPremium,
    premiumToken: premium.token,
    premiumExpiresAt: premium.expiresAt,
    premiumTimeRemaining: premium.timeRemaining,
    premiumPrice: premium.premiumPrice,
    activatePremium,
    clearPremium: premium.clear,
    verifyPremiumToken,
    isTemplateAccessible: premium.isTemplateAccessible,
    getTemplateInfo: premium.getTemplateInfo,

    // AI Generation
    aiGenerations: ai.generationCount,
    canGenerate: ai.canGenerate,
    aiRemaining: ai.remainingGenerations,
    generateDescription,
    resetAICount: ai.resetGenerationCount,

    // Translation
    t: translation.t,
    lang: translation.lang,
    setLang: translation.setLang,

    // Theme
    darkMode: theme.darkMode,
    toggleTheme: theme.toggleTheme,
    setDarkMode: theme.setDarkMode,

    // Toast
    toast: toast.toast,
    showToast: toast.showToast,
    hideToast: toast.hideToast,

    // Device
    deviceId: device.deviceId,
  };
};
