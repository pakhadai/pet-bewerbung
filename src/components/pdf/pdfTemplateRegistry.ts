/**
 * PDF Template Registry - Maps templateType to PDF component
 * Mirrors the HTML preview templateRegistry pattern for consistency
 */
import type { ComponentType } from 'react';
import ClassicPdf from './templates/ClassicPdf';
import ModernPdf from './templates/ModernPdf';
import CompactPdf from './templates/CompactPdf';
import type { TemplateType } from '../../types/form';
import type { PdfDocumentProps } from './PdfDocument';

export type PdfTemplateComponent = ComponentType<Omit<PdfDocumentProps, 'templateType'>>;

export const pdfTemplateRegistry: Record<TemplateType, PdfTemplateComponent> = {
  classic: ClassicPdf,
  modern: ModernPdf,
  compact: CompactPdf,
};

export function getPdfTemplate(templateType: TemplateType): PdfTemplateComponent {
  return pdfTemplateRegistry[templateType] ?? pdfTemplateRegistry.classic;
}
