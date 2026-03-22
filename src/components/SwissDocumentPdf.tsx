/**
 * SwissDocumentPdf - Thin wrapper delegating to modular PDF templates
 * Uses pdfTemplateRegistry to select ClassicPdf, ModernPdf, or CompactPdf
 * based on templateType (mirrors HTML preview templateRegistry pattern)
 */
import React from 'react';
import { getPdfTemplate } from './pdf/pdfTemplateRegistry';
import type { PetData, TemplateType } from '../types/form';
import type { PdfTranslations } from '../services/pdfService';

export interface SwissDocumentPdfProps {
  data: PetData;
  t: PdfTranslations;
  logoUrl?: string;
  qrUrl?: string | null;
  templateType?: TemplateType;
}

const SwissDocumentPdf: React.FC<SwissDocumentPdfProps> = ({
  data,
  t,
  logoUrl,
  qrUrl,
  templateType = 'classic',
}) => {
  const Template = getPdfTemplate(templateType);
  return (
    <Template
      key={templateType}
      data={data}
      t={t}
      logoUrl={logoUrl}
      qrUrl={qrUrl}
    />
  );
};

export default SwissDocumentPdf;
