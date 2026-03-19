/**
 * SwissDocumentPdf - Thin wrapper delegating to modular PDF templates
 * Uses pdfTemplateRegistry to select ClassicPdf, ModernPdf, or CompactPdf
 * based on templateType (mirrors HTML preview templateRegistry pattern)
 */
import React from 'react';
import { getPdfTemplate } from './pdf/pdfTemplateRegistry';
import type { TemplateType } from '../types/form';

export interface SwissDocumentPdfProps {
  data: Record<string, unknown>;
  t: Record<string, unknown>;
  logoUrl?: string;
  qrUrl?: string | null;
  templateType?: TemplateType | string;
}

const SwissDocumentPdf: React.FC<SwissDocumentPdfProps> = ({
  data,
  t,
  logoUrl,
  qrUrl,
  templateType = 'classic',
}) => {
  const Template = getPdfTemplate((templateType as TemplateType) || 'classic');
  return (
    <Template
      data={data}
      t={t}
      logoUrl={logoUrl}
      qrUrl={qrUrl}
    />
  );
};

export default SwissDocumentPdf;
