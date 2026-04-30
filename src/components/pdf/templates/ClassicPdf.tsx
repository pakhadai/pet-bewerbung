/**
 * Classic PDF Template - Free tier template with prominent branding
 * Thin wrapper around PdfDocument with templateType="classic"
 */
import React from 'react'
import type { PdfDocumentProps } from '../PdfDocument'
import PdfDocument from '../PdfDocument'

const ClassicPdf: React.FC<Omit<PdfDocumentProps, 'templateType'>> = (props) => (
  <PdfDocument {...props} templateType="classic" />
)

export default ClassicPdf
