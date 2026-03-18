/**
 * WizardContext - Provides form data, translations, and theme to all wizard steps
 * Eliminates prop drilling through AppContainer -> WizardRoute -> StepX
 */
import React, { createContext, useContext, ReactNode } from 'react';

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
}

const WizardContext = createContext<WizardContextValue | null>(null);

export const WizardProvider: React.FC<{
  value: WizardContextValue;
  children: ReactNode;
}> = ({ value, children }) => (
  <WizardContext.Provider value={value}>{children}</WizardContext.Provider>
);

export const useWizardContext = (): WizardContextValue => {
  const ctx = useContext(WizardContext);
  if (!ctx) throw new Error('useWizardContext must be used within WizardProvider');
  return ctx;
};
