/**
 * Buddy (test) PDF — окремий templateType для порівняння з production Buddy.
 */
import React from 'react';
import PdfDocument from '../PdfDocument';
import type { PdfDocumentProps } from '../PdfDocument';

const BuddyTestPdf: React.FC<Omit<PdfDocumentProps, 'templateType'>> = (props) => (
  <PdfDocument {...props} templateType="buddyTest" />
);

export default BuddyTestPdf;
