/**
 * Buddy PDF — same PdfDocument pipeline with templateType="buddy"
 */
import React from 'react';
import PdfDocument from '../PdfDocument';
import type { PdfDocumentProps } from '../PdfDocument';

const BuddyPdf: React.FC<Omit<PdfDocumentProps, 'templateType'>> = (props) => (
  <PdfDocument {...props} templateType="buddy" />
);

export default BuddyPdf;
