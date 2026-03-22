import { useState, useCallback } from 'react';
import { TEMPLATE_OPTIONS } from '../constants';
import { useFormStore } from '../stores/formStore';
import type { TemplateType } from '../types/form';

export interface UseTemplateSelectionReturn {
  /** Currently selected template ID (persisted in form store — same as PDF download) */
  selectedTemplate: string;
  /** Set the selected template */
  setSelectedTemplate: (templateId: string) => void;
  /** Whether preview modal is open */
  previewOpen: boolean;
  /** Template ID being previewed */
  previewTemplate: string;
  /** Open preview modal for a template */
  openPreview: (templateId: string) => void;
  /** Close preview modal */
  closePreview: () => void;
}

const defaultId = TEMPLATE_OPTIONS[0].id;

/**
 * Template selection — source of truth is Zustand `data.selectedTemplate` (saved with draft).
 * Previously only React state was used, so after reload / remount the PDF fell back to classic
 * while the on-screen preview could still show the last chosen design from a child view.
 */
export const useTemplateSelection = (
  initialTemplate: string = defaultId
): UseTemplateSelectionReturn => {
  const selectedTemplate = useFormStore((s) => {
    const id = s.data.selectedTemplate;
    return typeof id === 'string' && id.length > 0 ? id : initialTemplate;
  });
  const updateData = useFormStore((s) => s.updateData);

  const setSelectedTemplate = useCallback(
    (templateId: string) => {
      updateData('selectedTemplate', templateId as TemplateType);
    },
    [updateData]
  );

  const [previewOpen, setPreviewOpen] = useState<boolean>(false);
  const [previewTemplate, setPreviewTemplate] = useState<string>(initialTemplate);

  const openPreview = useCallback((templateId: string) => {
    setPreviewTemplate(templateId);
    setPreviewOpen(true);
  }, []);

  const closePreview = useCallback(() => {
    setPreviewOpen(false);
  }, []);

  return {
    selectedTemplate,
    setSelectedTemplate,
    previewOpen,
    previewTemplate,
    openPreview,
    closePreview,
  };
};
