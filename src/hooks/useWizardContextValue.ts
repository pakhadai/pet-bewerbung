import { useCallback, useMemo } from 'react'
import type { WizardContextValue } from '../context/WizardContext'
import type { TemplateType } from '../types/form'
import type { Language } from './useTranslation'

export interface UseWizardContextValueInput {
  t: WizardContextValue['t']
  darkMode: boolean
  step: number
  animDir: 'left' | 'right'
  validationErrors?: Record<string, boolean>
  selectedTemplate: TemplateType
  onDownloadPDF: (templateType?: TemplateType) => Promise<void>
  onDownloadAllTemplates: () => Promise<void>
  goToStep: (step: number) => void
  setLang: (lang: Language) => void
  setDarkMode: (value: boolean) => void
  showToast: (msg: string, type?: 'info' | 'success' | 'error' | 'warning') => void
  resetForm: () => Promise<void>
}

export const useWizardContextValue = ({
  t,
  darkMode,
  step,
  animDir,
  validationErrors,
  selectedTemplate,
  onDownloadPDF,
  onDownloadAllTemplates,
  goToStep,
  setLang,
  setDarkMode,
  showToast,
  resetForm,
}: UseWizardContextValueInput): WizardContextValue => {
  const wrappedOnDownloadPDF = useCallback(
    () => onDownloadPDF(selectedTemplate),
    [onDownloadPDF, selectedTemplate]
  )

  return useMemo(
    () => ({
      t,
      darkMode,
      step,
      animDir,
      validationErrors,
      onDownloadPDF: wrappedOnDownloadPDF,
      onDownloadAllTemplates,
      goToStep,
      setLang,
      setDarkMode,
      showToast,
      resetForm,
    }),
    [
      t,
      darkMode,
      step,
      animDir,
      validationErrors,
      wrappedOnDownloadPDF,
      onDownloadAllTemplates,
      goToStep,
      setLang,
      setDarkMode,
      showToast,
      resetForm,
    ]
  )
}

