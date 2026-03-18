import { useWizardNavigation } from './useWizardNavigation';
import { useFormData } from './useFormData';
import { useAIGeneration } from './useAIGeneration';
import { useTranslation } from './useTranslation';
import { useTheme } from './useTheme';
import { useToast } from './useToast';
export interface UseFormWizardReturn {
  step: number;
  animDir: 'left' | 'right';
  goToStep: (newStep: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setStep: (step: number) => void;

  data: any;
  updateData: (field: string, value: any) => void;
  updateMultipleData: (updates: Record<string, any>) => void;
  resetForm: () => void;
  setData: (data: any) => void;
  clearSavedData: () => void;
  isLoading: boolean;

  aiGenerations: number;
  canGenerate: boolean;
  aiRemaining: number;
  generateDescription: (petData: any) => Promise<string>;
  resetAICount: () => void;

  t: any;
  lang: string;
  setLang: (lang: string) => void;

  darkMode: boolean;
  toggleTheme: () => void;
  setDarkMode: (value: boolean) => void;

  toast: any;
  showToast: (msg: string, type?: 'info' | 'success' | 'error' | 'warning') => void;
  hideToast: () => void;
}

export const useFormWizard = (): UseFormWizardReturn => {
  const wizardNav = useWizardNavigation();
  const translation = useTranslation();
  const formData = useFormData(translation.lang);
  const ai = useAIGeneration();
  const theme = useTheme();
  const toast = useToast();

  const clearSavedData = () => {
    formData.resetForm();
    wizardNav.goToStep(0);
  };

  return {
    step: wizardNav.step,
    animDir: wizardNav.animDir,
    goToStep: wizardNav.goToStep,
    nextStep: wizardNav.nextStep,
    prevStep: wizardNav.prevStep,
    setStep: wizardNav.setStep,

    data: formData.data,
    updateData: formData.updateData,
    updateMultipleData: formData.updateMultipleData,
    resetForm: formData.resetForm,
    setData: formData.setData,
    clearSavedData,
    isLoading: formData.isLoading,

    aiGenerations: ai.generationCount,
    canGenerate: ai.canGenerate,
    aiRemaining: ai.remainingGenerations,
    generateDescription: ai.generatePetDescription,
    resetAICount: ai.resetGenerationCount,

    t: translation.t,
    lang: translation.lang,
    setLang: translation.setLang,

    darkMode: theme.darkMode,
    toggleTheme: theme.toggleTheme,
    setDarkMode: theme.setDarkMode,

    toast: toast.toast,
    showToast: toast.showToast,
    hideToast: toast.hideToast,
  };
};
