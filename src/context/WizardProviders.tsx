/**
 * WizardProviders - Split contexts so components can use useFormData, useTranslation etc directly
 * instead of the "God hook" useFormWizard.
 *
 * FormData split: State vs Dispatch - components using only updateData don't re-render on data change.
 */

import React, { createContext, useContext, ReactNode, useMemo } from 'react';
import {
  useFormData,
  useTranslation,
  useWizardNavigation,
  useTheme,
  useToast,
  useAIGeneration,
} from '../hooks';

// --- Context types ---
type FormDataContextValue = ReturnType<typeof useFormData>;
type FormDataStateValue = Pick<FormDataContextValue, 'data' | 'isLoading'>;
type FormDataDispatchValue = Omit<FormDataContextValue, 'data' | 'isLoading'>;
type TranslationContextValue = ReturnType<typeof useTranslation>;
type WizardNavigationContextValue = ReturnType<typeof useWizardNavigation>;
type ThemeContextValue = ReturnType<typeof useTheme>;
type ToastContextValue = ReturnType<typeof useToast>;
type AIGenerationContextValue = ReturnType<typeof useAIGeneration>;

const FormDataStateContext = createContext<FormDataStateValue | null>(null);
const FormDataDispatchContext = createContext<FormDataDispatchValue | null>(null);
const TranslationContext = createContext<TranslationContextValue | null>(null);
const WizardNavigationContext = createContext<WizardNavigationContextValue | null>(null);
const ThemeContext = createContext<ThemeContextValue | null>(null);
const ToastContext = createContext<ToastContextValue | null>(null);
const AIGenerationContext = createContext<AIGenerationContextValue | null>(null);

// --- Consumer hooks ---
export const useFormDataStateContext = (): FormDataStateValue => {
  const ctx = useContext(FormDataStateContext);
  if (!ctx) throw new Error('useFormDataStateContext must be used within WizardProviders');
  return ctx;
};

export const useFormDataDispatchContext = (): FormDataDispatchValue => {
  const ctx = useContext(FormDataDispatchContext);
  if (!ctx) throw new Error('useFormDataDispatchContext must be used within WizardProviders');
  return ctx;
};

export const useFormDataContext = (): FormDataContextValue => {
  const state = useFormDataStateContext();
  const dispatch = useFormDataDispatchContext();
  return { ...state, ...dispatch };
};

export const useTranslationContext = (): TranslationContextValue => {
  const ctx = useContext(TranslationContext);
  if (!ctx) throw new Error('useTranslationContext must be used within WizardProviders');
  return ctx;
};

export const useWizardNavigationContext = (): WizardNavigationContextValue => {
  const ctx = useContext(WizardNavigationContext);
  if (!ctx) throw new Error('useWizardNavigationContext must be used within WizardProviders');
  return ctx;
};

export const useThemeContext = (): ThemeContextValue => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useThemeContext must be used within WizardProviders');
  return ctx;
};

export const useToastContext = (): ToastContextValue => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToastContext must be used within WizardProviders');
  return ctx;
};

export const useAIGenerationContext = (): AIGenerationContextValue => {
  const ctx = useContext(AIGenerationContext);
  if (!ctx) throw new Error('useAIGenerationContext must be used within WizardProviders');
  return ctx;
};

// Throttle save-error toasts (Safari Private / quota = toast bomb every 500ms)
let saveErrorShownAt = 0;
const SAVE_ERROR_THROTTLE_MS = 60000;

// --- Provider component ---
export const WizardProviders: React.FC<{ children: ReactNode }> = ({ children }) => {
  const translation = useTranslation();
  const toast = useToast();
  const formData = useFormData(translation.lang, {
    onSaveError: (err) => {
      const now = Date.now();
      if (now - saveErrorShownAt < SAVE_ERROR_THROTTLE_MS) return;
      saveErrorShownAt = now;
      const msg =
        err.name === 'QuotaExceededError' || err.message?.includes('quota')
          ? translation.t?.labels?.storageQuotaError ?? 'Speicher voll oder Privatmodus. Daten konnten nicht gespeichert werden.'
          : translation.t?.labels?.storageError ?? 'Daten konnten nicht gespeichert werden.';
      toast.showToast(msg, 'error');
    },
  });
  const wizardNav = useWizardNavigation();
  const ai = useAIGeneration();
  const theme = useTheme();

  const formState = useMemo(() => ({ data: formData.data, isLoading: formData.isLoading }), [formData.data, formData.isLoading]);
  const formDispatch = useMemo(
    () => ({
      updateData: formData.updateData,
      updateMultipleData: formData.updateMultipleData,
      resetForm: formData.resetForm,
      saveData: formData.saveData,
      loadSavedData: formData.loadSavedData,
      setData: formData.setData,
    }),
    [
      formData.updateData,
      formData.updateMultipleData,
      formData.resetForm,
      formData.saveData,
      formData.loadSavedData,
      formData.setData,
    ]
  );

  return (
    <TranslationContext.Provider value={translation}>
      <FormDataStateContext.Provider value={formState}>
        <FormDataDispatchContext.Provider value={formDispatch}>
        <WizardNavigationContext.Provider value={wizardNav}>
          <ThemeContext.Provider value={theme}>
            <ToastContext.Provider value={toast}>
              <AIGenerationContext.Provider value={ai}>
                {children}
              </AIGenerationContext.Provider>
            </ToastContext.Provider>
          </ThemeContext.Provider>
        </WizardNavigationContext.Provider>
        </FormDataDispatchContext.Provider>
      </FormDataStateContext.Provider>
    </TranslationContext.Provider>
  );
};
