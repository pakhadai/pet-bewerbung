/**
 * Modern PDF Template - Clean minimal design
 * Thin wrapper around PdfDocument with templateType="modern"
 */
import React from 'react'
import type { PdfDocumentProps } from '../PdfDocument'
import PdfDocument from '../PdfDocument'

const ModernPdf: React.FC<Omit<PdfDocumentProps, 'templateType'>> = (props) => (
  <PdfDocument {...props} templateType="modern" />
)

export default ModernPdf
