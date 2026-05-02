/**
 * WizardProviders - Translation, navigation, theme, toast.
 * Form data: Zustand store (useFormStore) - no Context.
 */

import React, { createContext, ReactNode, useContext, useEffect, useRef } from 'react'
import { useTheme, useToast, useTranslation, useWizardNavigation } from '../hooks'
import {
  flushFormStoreSync,
  hasUnsavedPhoto,
  isFormStoreSaving,
  STORAGE_FAILED_EVENT,
  useFormStore,
} from '../stores/formStore'

type TranslationContextValue = ReturnType<typeof useTranslation>
type WizardNavigationContextValue = ReturnType<typeof useWizardNavigation>
type ThemeContextValue = ReturnType<typeof useTheme>
type ToastContextValue = ReturnType<typeof useToast>

const TranslationContext = createContext<TranslationContextValue | null>(null)
const WizardNavigationContext = createContext<WizardNavigationContextValue | null>(null)
const ThemeContext = createContext<ThemeContextValue | null>(null)
const ToastContext = createContext<ToastContextValue | null>(null)

export const useTranslationContext = (): TranslationContextValue => {
  const ctx = useContext(TranslationContext)
  if (!ctx) {
    // During Vite HMR / Fast Refresh the provider-consumer boundary can briefly desync.
    // Returning a safe fallback prevents the entire app from crashing.
    if (import.meta.env.DEV) console.warn('useTranslationContext: missing provider, using fallback')
    return {
      t: {} as TranslationContextValue['t'],
      lang: 'de' as TranslationContextValue['lang'],
      setLang: () => undefined,
      isLoading: true,
    } as TranslationContextValue
  }
  return ctx
}

export const useWizardNavigationContext = (): WizardNavigationContextValue => {
  const ctx = useContext(WizardNavigationContext)
  if (!ctx) {
    if (import.meta.env.DEV)
      console.warn('useWizardNavigationContext: missing provider, using fallback')
    return {
      step: 0,
      animDir: 'left',
      goToStep: () => undefined,
      nextStep: () => undefined,
      prevStep: () => undefined,
      setStep: () => undefined,
    } as WizardNavigationContextValue
  }
  return ctx
}

export const useThemeContext = (): ThemeContextValue => {
  const ctx = useContext(ThemeContext)
  if (!ctx) {
    if (import.meta.env.DEV) console.warn('useThemeContext: missing provider, using fallback')
    return {
      darkMode: false,
    } as ThemeContextValue
  }
  return ctx
}

export const useToastContext = (): ToastContextValue => {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    if (import.meta.env.DEV) console.warn('useToastContext: missing provider, using fallback')
    return {
      toast: null,
      showToast: () => undefined,
      hideToast: () => undefined,
    } as ToastContextValue
  }
  return ctx
}

let saveErrorShownAt = 0
const SAVE_ERROR_THROTTLE_MS = 60000

const toastTypeClass: Record<string, string> = {
  info: 'bg-slate-800/95 text-slate-100 border-slate-600',
  success: 'bg-emerald-900/95 text-emerald-50 border-emerald-600',
  error: 'bg-red-900/95 text-red-50 border-red-600',
  warning: 'bg-amber-900/95 text-amber-50 border-amber-600',
}

/** Toast UI + aria-live (must live inside ToastContext; defined here to avoid circular imports). */
const ToastViewport: React.FC = () => {
  const ctx = useContext(ToastContext)
  if (!ctx?.toast) return null
  const { toast, hideToast } = ctx

  const live = toast.type === 'error' || toast.type === 'warning' ? 'assertive' : 'polite'
  const role = toast.type === 'error' ? 'alert' : 'status'

  return (
    <div
      className="fixed bottom-24 sm:bottom-28 left-1/2 z-[100] max-w-[min(100%,24rem)] -translate-x-1/2 px-4 print:hidden"
      role={role}
      aria-live={live}
      aria-atomic="true"
    >
      <div
        className={`rounded-xl border px-4 py-3 text-sm shadow-lg backdrop-blur-sm ${
          toastTypeClass[toast.type] ?? toastTypeClass.info
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <p className="font-medium leading-snug">{toast.msg}</p>
          <button
            type="button"
            onClick={hideToast}
            className="shrink-0 rounded-md px-1.5 py-0.5 text-xs opacity-80 hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
            aria-label="Dismiss notification"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  )
}

export const WizardProviders: React.FC<{ children: ReactNode }> = ({ children }) => {
  const translation = useTranslation()
  const toast = useToast()
  const wizardNav = useWizardNavigation()
  const theme = useTheme()

  // Load draft only once on mount - lang is passed so initial data has correct lang fallback.
  // Do NOT re-load on lang change: that would overwrite unsaved form state.
  const hasLoadedRef = useRef(false)
  const initialLangRef = useRef(translation.lang)
  useEffect(() => {
    if (hasLoadedRef.current) return
    hasLoadedRef.current = true
    useFormStore.getState().loadDraft(initialLangRef.current)
  }, [])

  useEffect(() => {
    const handler = () => {
      const now = Date.now()
      if (now - saveErrorShownAt < SAVE_ERROR_THROTTLE_MS) return
      saveErrorShownAt = now
      toast.showToast(
        translation.t?.labels?.storageQuotaError ??
          'Privatmodus: Daten werden nicht gespeichert. Seite nicht aktualisieren!',
        'warning'
      )
    }
    window.addEventListener(STORAGE_FAILED_EVENT, handler)
    return () => window.removeEventListener(STORAGE_FAILED_EVENT, handler)
  }, [toast, translation.t])

  useEffect(() => {
    const save = () => flushFormStoreSync()
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      save()
      if (isFormStoreSaving() || hasUnsavedPhoto()) {
        e.preventDefault()
        e.returnValue = ''
      }
    }
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') save()
    }
    const handleEmergencyFlush = () => save()
    window.addEventListener('beforeunload', handleBeforeUnload)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('emergency-flush', handleEmergencyFlush)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('emergency-flush', handleEmergencyFlush)
    }
  }, [])

  return (
    <TranslationContext.Provider value={translation}>
      <WizardNavigationContext.Provider value={wizardNav}>
        <ThemeContext.Provider value={theme}>
          <ToastContext.Provider value={toast}>
            {children}
            <ToastViewport />
          </ToastContext.Provider>
        </ThemeContext.Provider>
      </WizardNavigationContext.Provider>
    </TranslationContext.Provider>
  )
}
