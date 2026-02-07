import { useState, useCallback } from 'react';
import { TEMPLATE_OPTIONS } from '../constants';

export interface UseTemplateSelectionReturn {
  /** Currently selected template ID */
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

/**
 * Template selection hook
 * Manages template preview and selection state
 *
 * @param initialTemplate - Initial template ID (defaults to first template)
 * @returns Template selection state and handlers
 */
export const useTemplateSelection = (
  initialTemplate: string = TEMPLATE_OPTIONS[0].id
): UseTemplateSelectionReturn => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>(initialTemplate);
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
    closePreview
  };
};
