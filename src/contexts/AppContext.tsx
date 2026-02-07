/**
 * App Context - Global State Management
 * Eliminates prop drilling for common values
 */

import React, { createContext, useContext, ReactNode } from 'react';

// Theme Context
interface ThemeContextValue {
  darkMode: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{
  children: ReactNode;
  value: ThemeContextValue;
}> = ({ children, value }) => {
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

// Translations Context
interface TranslationsContextValue {
  t: any;
  lang: string;
  setLang: (lang: string) => void;
}

const TranslationsContext = createContext<TranslationsContextValue | undefined>(undefined);

export const useTranslations = () => {
  const context = useContext(TranslationsContext);
  if (!context) {
    throw new Error('useTranslations must be used within TranslationsProvider');
  }
  return context;
};

export const TranslationsProvider: React.FC<{
  children: ReactNode;
  value: TranslationsContextValue;
}> = ({ children, value }) => {
  return (
    <TranslationsContext.Provider value={value}>
      {children}
    </TranslationsContext.Provider>
  );
};

// Premium Context
interface PremiumContextValue {
  isPremium: boolean;
  premiumToken: string | null;
  deviceId: string;
  activatePremium: (sessionId: string) => Promise<boolean>;
  clearPremium: () => void;
  timeRemaining: number;
}

const PremiumContext = createContext<PremiumContextValue | undefined>(undefined);

export const usePremium = () => {
  const context = useContext(PremiumContext);
  if (!context) {
    throw new Error('usePremium must be used within PremiumProvider');
  }
  return context;
};

export const PremiumProvider: React.FC<{
  children: ReactNode;
  value: PremiumContextValue;
}> = ({ children, value }) => {
  return <PremiumContext.Provider value={value}>{children}</PremiumContext.Provider>;
};

// Toast Context
interface ToastContextValue {
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{
  children: ReactNode;
  value: ToastContextValue;
}> = ({ children, value }) => {
  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
};

// Combined App Context Provider
interface AppContextProviderProps {
  children: ReactNode;
  theme: ThemeContextValue;
  translations: TranslationsContextValue;
  premium: PremiumContextValue;
  toast: ToastContextValue;
}

export const AppContextProvider: React.FC<AppContextProviderProps> = ({
  children,
  theme,
  translations,
  premium,
  toast,
}) => {
  return (
    <ThemeProvider value={theme}>
      <TranslationsProvider value={translations}>
        <PremiumProvider value={premium}>
          <ToastProvider value={toast}>{children}</ToastProvider>
        </PremiumProvider>
      </TranslationsProvider>
    </ThemeProvider>
  );
};
