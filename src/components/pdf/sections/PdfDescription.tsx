import { Text, View } from '@react-pdf/renderer'
import React from 'react'
import type { PdfTranslations } from '../../../services/pdfService'
import type { PetData } from '../../../types/form'
import { sanitizeForPdf } from '../../../utils/documentHelpers'
import { commonStyles } from '../PdfBase'
import {
  buildPdfSectionHeadingStyle,
  type PdfTemplateConfig,
} from '../templates/getPdfTemplateConfig'

export interface PdfDescriptionProps {
  data: PetData
  t: PdfTranslations
  templateConfig: PdfTemplateConfig
}

export const PdfDescription: React.FC<PdfDescriptionProps> = ({ data, t, templateConfig }) => {
  const headingStyle = buildPdfSectionHeadingStyle(templateConfig)

  const textColor = templateConfig.colors.bodyText
  const textStyle = [commonStyles.text, { color: textColor, fontSize: 10 }]

  const descriptionText = sanitizeForPdf(data.generatedText) || (t.ui?.noDescription ?? '—')

  return (
    <View style={commonStyles.descriptionBlock} key="description">
      <Text style={headingStyle}>{t.doc.sectionAbout ?? 'About'}</Text>
      <Text style={textStyle}>{descriptionText}</Text>
    </View>
  )
}
