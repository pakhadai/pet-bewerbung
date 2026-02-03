import React, { createContext, useContext } from 'react';

const TranslationContext = createContext(null);

export function TranslationProvider({ value, children }) {
  return <TranslationContext.Provider value={value}>{children}</TranslationContext.Provider>;
}

export function useTranslation() {
  const ctx = useContext(TranslationContext);
  if (!ctx) {
    throw new Error('useTranslation must be used within TranslationProvider');
  }
  return ctx;
}

export default TranslationContext;
