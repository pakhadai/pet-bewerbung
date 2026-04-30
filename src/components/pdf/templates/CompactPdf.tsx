/**
 * Compact PDF Template - Dense layout for more content
 * Thin wrapper around PdfDocument with templateType="compact"
 */
import React from 'react'
import type { PdfDocumentProps } from '../PdfDocument'
import PdfDocument from '../PdfDocument'

const CompactPdf: React.FC<Omit<PdfDocumentProps, 'templateType'>> = (props) => (
  <PdfDocument {...props} templateType="compact" />
)

export default CompactPdf
