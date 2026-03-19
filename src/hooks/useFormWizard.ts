import {
  useTranslationContext,
  useWizardNavigationContext,
  useThemeContext,
  useToastContext,
} from '../context/WizardProviders';
import { useFormStore } from '../stores/formStore';

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
  const wizardNav = useWizardNavigationContext();
  const translation = useTranslationContext();
  const toast = useToastContext();
  const formData = useFormStore();
  const theme = useThemeContext();

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
