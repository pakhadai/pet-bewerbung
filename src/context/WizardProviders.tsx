/**
 * WizardProviders - Split contexts so components can use useFormData, useTranslation etc directly
 * instead of the "God hook" useFormWizard.
 */

import React, { createContext, useContext, ReactNode } from 'react';
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
type TranslationContextValue = ReturnType<typeof useTranslation>;
type WizardNavigationContextValue = ReturnType<typeof useWizardNavigation>;
type ThemeContextValue = ReturnType<typeof useTheme>;
type ToastContextValue = ReturnType<typeof useToast>;
type AIGenerationContextValue = ReturnType<typeof useAIGeneration>;

const FormDataContext = createContext<FormDataContextValue | null>(null);
const TranslationContext = createContext<TranslationContextValue | null>(null);
const WizardNavigationContext = createContext<WizardNavigationContextValue | null>(null);
const ThemeContext = createContext<ThemeContextValue | null>(null);
const ToastContext = createContext<ToastContextValue | null>(null);
const AIGenerationContext = createContext<AIGenerationContextValue | null>(null);

// --- Consumer hooks (use directly in components instead of useFormWizard) ---
export const useFormDataContext = (): FormDataContextValue => {
  const ctx = useContext(FormDataContext);
  if (!ctx) throw new Error('useFormDataContext must be used within WizardProviders');
  return ctx;
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

// --- Provider component ---
export const WizardProviders: React.FC<{ children: ReactNode }> = ({ children }) => {
  const translation = useTranslation();
  const toast = useToast();
  const formData = useFormData(translation.lang, {
    onSaveError: (err) => {
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

  return (
    <TranslationContext.Provider value={translation}>
      <FormDataContext.Provider value={formData}>
        <WizardNavigationContext.Provider value={wizardNav}>
          <ThemeContext.Provider value={theme}>
            <ToastContext.Provider value={toast}>
              <AIGenerationContext.Provider value={ai}>
                {children}
              </AIGenerationContext.Provider>
            </ToastContext.Provider>
          </ThemeContext.Provider>
        </WizardNavigationContext.Provider>
      </FormDataContext.Provider>
    </TranslationContext.Provider>
  );
};
