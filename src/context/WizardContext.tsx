/**
 * WizardContext - Provides form data, translations, and theme to all wizard steps
 * Split into State/Dispatch: components using only dispatch don't re-render on data change.
 */
import React, { createContext, useContext, ReactNode, useMemo } from 'react';

export interface WizardContextValue {
  data: any;
  updateData: (field: string, value: any) => void;
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

type WizardStateValue = Pick<WizardContextValue, 'data' | 't' | 'darkMode' | 'step' | 'animDir' | 'validationErrors'>;
type WizardDispatchValue = Omit<WizardContextValue, 'data' | 't' | 'darkMode' | 'step' | 'animDir' | 'validationErrors'>;

const WizardStateContext = createContext<WizardStateValue | null>(null);
const WizardDispatchContext = createContext<WizardDispatchValue | null>(null);

export const WizardProvider: React.FC<{
  value: WizardContextValue;
  children: ReactNode;
}> = ({ value, children }) => {
  const stateValue: WizardStateValue = useMemo(
    () => ({
      data: value.data,
      t: value.t,
      darkMode: value.darkMode,
      step: value.step,
      animDir: value.animDir,
      validationErrors: value.validationErrors,
    }),
    [value.data, value.t, value.darkMode, value.step, value.animDir, value.validationErrors]
  );
  const dispatchValue: WizardDispatchValue = useMemo(
    () => ({
      updateData: value.updateData,
      onDownloadPDF: value.onDownloadPDF,
      onDownloadAllTemplates: value.onDownloadAllTemplates,
      goToStep: value.goToStep,
      setLang: value.setLang,
      setDarkMode: value.setDarkMode,
      showToast: value.showToast,
      resetForm: value.resetForm,
    }),
    [
      value.updateData,
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
