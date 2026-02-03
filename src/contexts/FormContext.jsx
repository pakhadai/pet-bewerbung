import React, { createContext, useContext } from 'react';

const FormContext = createContext(null);

export function FormProvider({ value, children }) {
  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
}

export function useForm() {
  const ctx = useContext(FormContext);
  if (!ctx) {
    throw new Error('useForm must be used within FormProvider');
  }
  return ctx;
}

export default FormContext;
