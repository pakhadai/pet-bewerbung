import { Text, View } from '@react-pdf/renderer'
import React from 'react'
import type { PdfTranslations } from '../../../services/pdfService'
import type { PetData } from '../../../types/form'
import {
  formatAge,
  formatWeight,
  getGenderLabel,
  sanitizeForPdf,
  withFallback,
} from '../../../utils/documentHelpers'
import { commonStyles } from '../PdfBase'
import {
  buildPdfSectionHeadingStyle,
  type PdfTemplateConfig,
} from '../templates/getPdfTemplateConfig'

export interface PdfDetailsProps {
  data: PetData
  t: PdfTranslations
  templateConfig: PdfTemplateConfig
}

const s = (val: unknown) => sanitizeForPdf(withFallback(val))

export const PdfDetails: React.FC<PdfDetailsProps> = ({ data, t, templateConfig }) => {
  const headingStyle = buildPdfSectionHeadingStyle(templateConfig)

  const textColor = templateConfig.colors.bodyText
  const textStyle = [commonStyles.text, { color: textColor, fontSize: 10 }]

  return (
    <View style={commonStyles.sectionBlock} key="details">
      <Text style={headingStyle}>{t.doc.sectionPet ?? 'Pet'}</Text>

      <View style={commonStyles.gridRow}>
        <View style={commonStyles.gridHalf}>
          <Text style={commonStyles.label}>{t.labels.petName ?? 'Name'}</Text>
          <Text style={commonStyles.textBold}>{s(data.name)}</Text>
        </View>
        <View style={commonStyles.gridHalf}>
          <Text style={commonStyles.label}>{t.labels.breed ?? 'Breed'}</Text>
          <Text style={textStyle}>{s(data.breed)}</Text>
        </View>
      </View>

      <View style={commonStyles.gridRow}>
        <View style={commonStyles.gridHalf}>
          <Text style={commonStyles.label}>
            {t.labels.gender ?? 'Gender'} / {t.labels.age ?? 'Age'}
          </Text>
          <Text style={textStyle}>
            {getGenderLabel(data.gender, t)} / {formatAge(data.age, t)}
          </Text>
        </View>
        <View style={commonStyles.gridHalf}>
          <Text style={commonStyles.label}>{t.labels.weight ?? 'Weight'}</Text>
          <Text style={textStyle}>{formatWeight(data.weight, t)}</Text>
        </View>
      </View>
    </View>
  )
}
