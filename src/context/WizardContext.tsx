/**
 * WizardContext - Provides translations, theme, step state, and actions.
 * form data (data / updateData) is intentionally NOT in context:
 * step components subscribe to formStore directly with Zustand selectors,
 * so only the active step re-renders on keystrokes — not Header / Footer / nav.
 */
import React, { createContext, useContext, ReactNode, useMemo } from 'react';

export interface WizardContextValue {
  t: any;
  darkMode: boolean;
  step: number;
  animDir: 'left' | 'right';
  validationErrors?: Record<string, boolean>;
  onDownloadPDF: () => Promise<void>;
  onDownloadAllTemplates: () => Promise<void>;
  goToStep: (step: number) => void;
  setLang: (lang: string) => void;
  setDarkMode: (value: boolean) => void;
  showToast: (msg: string, type?: 'info' | 'success' | 'error' | 'warning') => void;
  resetForm: () => Promise<void>;
}

// Split into State (re-renders on t/darkMode/step changes) and Dispatch (stable refs)
type WizardStateValue = Pick<WizardContextValue, 't' | 'darkMode' | 'step' | 'animDir' | 'validationErrors'>;
type WizardDispatchValue = Omit<WizardContextValue, 't' | 'darkMode' | 'step' | 'animDir' | 'validationErrors'>;

const WizardStateContext = createContext<WizardStateValue | null>(null);
const WizardDispatchContext = createContext<WizardDispatchValue | null>(null);

export const WizardProvider: React.FC<{
  value: WizardContextValue;
  children: ReactNode;
}> = ({ value, children }) => {
  const stateValue: WizardStateValue = useMemo(
    () => ({
      t: value.t,
      darkMode: value.darkMode,
      step: value.step,
      animDir: value.animDir,
      validationErrors: value.validationErrors,
    }),
    [value.t, value.darkMode, value.step, value.animDir, value.validationErrors]
  );
  const dispatchValue: WizardDispatchValue = useMemo(
    () => ({
      onDownloadPDF: value.onDownloadPDF,
      onDownloadAllTemplates: value.onDownloadAllTemplates,
      goToStep: value.goToStep,
      setLang: value.setLang,
      setDarkMode: value.setDarkMode,
      showToast: value.showToast,
      resetForm: value.resetForm,
    }),
    [
      value.onDownloadPDF,
      value.onDownloadAllTemplates,
      value.goToStep,
      value.setLang,
      value.setDarkMode,
      value.showToast,
      value.resetForm,
    ]
  );
  return (
    <WizardStateContext.Provider value={stateValue}>
      <WizardDispatchContext.Provider value={dispatchValue}>
        {children}
      </WizardDispatchContext.Provider>
    </WizardStateContext.Provider>
  );
};

export const useWizardStateContext = (): WizardStateValue => {
  const ctx = useContext(WizardStateContext);
  if (!ctx) throw new Error('useWizardStateContext must be used within WizardProvider');
  return ctx;
};

export const useWizardDispatchContext = (): WizardDispatchValue => {
  const ctx = useContext(WizardDispatchContext);
  if (!ctx) throw new Error('useWizardDispatchContext must be used within WizardProvider');
  return ctx;
};

export const useWizardContext = (): WizardContextValue => {
  const state = useWizardStateContext();
  const dispatch = useWizardDispatchContext();
  return { ...state, ...dispatch };
};
