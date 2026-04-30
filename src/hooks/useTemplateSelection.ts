import { useCallback, useState } from 'react'
import { TEMPLATE_OPTIONS } from '../constants'
import { useFormStore } from '../stores/formStore'
import type { TemplateType } from '../types/form'

export interface UseTemplateSelectionReturn {
  /** Currently selected template ID (persisted in form store — same as PDF download) */
  selectedTemplate: TemplateType
  /** Set the selected template */
  setSelectedTemplate: (templateId: TemplateType) => void
  /** Whether preview modal is open */
  previewOpen: boolean
  /** Template ID being previewed */
  previewTemplate: TemplateType
  /** Open preview modal for a template */
  openPreview: (templateId: TemplateType) => void
  /** Close preview modal */
  closePreview: () => void
}

const defaultId = TEMPLATE_OPTIONS[0].id

/**
 * Template selection — source of truth is Zustand `data.selectedTemplate` (saved with draft).
 * Previously only React state was used, so after reload / remount the PDF fell back to classic
 * while the on-screen preview could still show the last chosen design from a child view.
 */
export const useTemplateSelection = (
  initialTemplate: TemplateType = defaultId
): UseTemplateSelectionReturn => {
  const selectedTemplate = useFormStore((s) => {
    const id = s.data.selectedTemplate
    return typeof id === 'string' && id.length > 0 ? (id as TemplateType) : initialTemplate
  })
  const updateData = useFormStore((s) => s.updateData)

  const setSelectedTemplate = useCallback(
    (templateId: TemplateType) => {
      updateData('selectedTemplate', templateId)
    },
    [updateData]
  )

  const [previewOpen, setPreviewOpen] = useState<boolean>(false)
  const [previewTemplate, setPreviewTemplate] = useState<TemplateType>(initialTemplate)

  const openPreview = useCallback((templateId: TemplateType) => {
    setPreviewTemplate(templateId)
    setPreviewOpen(true)
  }, [])

  const closePreview = useCallback(() => {
    setPreviewOpen(false)
  }, [])

  return {
    selectedTemplate,
    setSelectedTemplate,
    previewOpen,
    previewTemplate,
    openPreview,
    closePreview,
  }
}
