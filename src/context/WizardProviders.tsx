/**
 * WizardProviders - Translation, navigation, theme, toast.
 * Form data: Zustand store (useFormStore) - no Context.
 */

import React, { createContext, useContext, ReactNode, useEffect, useRef } from 'react';
import {
  useTranslation,
  useWizardNavigation,
  useTheme,
  useToast,
} from '../hooks';
import { useFormStore, STORAGE_FAILED_EVENT, flushFormStoreSync, isFormStoreSaving } from '../stores/formStore';

type TranslationContextValue = ReturnType<typeof useTranslation>;
type WizardNavigationContextValue = ReturnType<typeof useWizardNavigation>;
type ThemeContextValue = ReturnType<typeof useTheme>;
type ToastContextValue = ReturnType<typeof useToast>;

const TranslationContext = createContext<TranslationContextValue | null>(null);
const WizardNavigationContext = createContext<WizardNavigationContextValue | null>(null);
const ThemeContext = createContext<ThemeContextValue | null>(null);
const ToastContext = createContext<ToastContextValue | null>(null);

export const useTranslationContext = (): TranslationContextValue => {
  const ctx = useContext(TranslationContext);
  if (!ctx) {
    // During Vite HMR / Fast Refresh the provider-consumer boundary can briefly desync.
    // Returning a safe fallback prevents the entire app from crashing.
    if (import.meta.env.DEV) console.warn('useTranslationContext: missing provider, using fallback');
    return {
      t: {} as TranslationContextValue['t'],
      lang: 'de' as TranslationContextValue['lang'],
      setLang: () => undefined,
      isLoading: true,
    } as TranslationContextValue;
  }
  return ctx;
};

export const useWizardNavigationContext = (): WizardNavigationContextValue => {
  const ctx = useContext(WizardNavigationContext);
  if (!ctx) {
    if (import.meta.env.DEV) console.warn('useWizardNavigationContext: missing provider, using fallback');
    return {
      step: 0,
      animDir: 'left',
      goToStep: () => undefined,
      nextStep: () => undefined,
      prevStep: () => undefined,
      setStep: () => undefined,
    } as WizardNavigationContextValue;
  }
  return ctx;
};

export const useThemeContext = (): ThemeContextValue => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    if (import.meta.env.DEV) console.warn('useThemeContext: missing provider, using fallback');
    return {
      darkMode: false,
    } as ThemeContextValue;
  }
  return ctx;
};

export const useToastContext = (): ToastContextValue => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    if (import.meta.env.DEV) console.warn('useToastContext: missing provider, using fallback');
    return {
      showToast: () => undefined,
    } as ToastContextValue;
  }
  return ctx;
};

let saveErrorShownAt = 0;
const SAVE_ERROR_THROTTLE_MS = 60000;

export const WizardProviders: React.FC<{ children: ReactNode }> = ({ children }) => {
  const translation = useTranslation();
  const toast = useToast();
  const wizardNav = useWizardNavigation();
  const theme = useTheme();

  // Load draft only once on mount - lang is passed so initial data has correct lang fallback.
  // Do NOT re-load on lang change: that would overwrite unsaved form state.
  const hasLoadedRef = useRef(false);
  useEffect(() => {
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;
    useFormStore.getState().loadDraft(translation.lang);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const handler = () => {
      const now = Date.now();
      if (now - saveErrorShownAt < SAVE_ERROR_THROTTLE_MS) return;
      saveErrorShownAt = now;
      toast.showToast(
        translation.t?.labels?.storageQuotaError ?? 'Privatmodus: Daten werden nicht gespeichert. Seite nicht aktualisieren!',
        'warning'
      );
    };
    window.addEventListener(STORAGE_FAILED_EVENT, handler);
    return () => window.removeEventListener(STORAGE_FAILED_EVENT, handler);
  }, [toast, translation.t]);

  useEffect(() => {
    const save = () => flushFormStoreSync();
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      save();
      if (isFormStoreSaving()) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') save();
    };
    const handleEmergencyFlush = () => save();
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('emergency-flush', handleEmergencyFlush);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('emergency-flush', handleEmergencyFlush);
    };
  }, []);

  return (
    <TranslationContext.Provider value={translation}>
      <WizardNavigationContext.Provider value={wizardNav}>
        <ThemeContext.Provider value={theme}>
          <ToastContext.Provider value={toast}>
            {children}
          </ToastContext.Provider>
        </ThemeContext.Provider>
      </WizardNavigationContext.Provider>
    </TranslationContext.Provider>
  );
};
