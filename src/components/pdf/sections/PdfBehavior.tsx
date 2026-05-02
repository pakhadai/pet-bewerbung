import { Text, View } from '@react-pdf/renderer'
import React from 'react'
import type { PdfTranslations } from '../../../services/pdfService'
import type { PetData } from '../../../types/form'
import { sanitizeForPdf } from '../../../utils/documentHelpers'
import { getShowAdvancedHealthInfo } from '../../../utils/getShowAdvancedHealthInfo'
import { commonStyles } from '../PdfBase'
import {
  buildPdfSectionHeadingStyle,
  type PdfTemplateConfig,
} from '../templates/getPdfTemplateConfig'

export interface PdfBehaviorProps {
  data: PetData
  t: PdfTranslations
  templateConfig: PdfTemplateConfig
}

export const PdfBehavior: React.FC<PdfBehaviorProps> = ({ data, t, templateConfig }) => {
  if (!getShowAdvancedHealthInfo(data)) return null
  const headingStyle = buildPdfSectionHeadingStyle(templateConfig)

  const textColor = templateConfig.colors.bodyText

  const textStyle = [commonStyles.text, { color: textColor, fontSize: 10 }]

  return (
    <View style={commonStyles.sectionBlock} key="behavior">
      <Text style={headingStyle}>
        {t.labels.behaviorTitle ?? t.doc.sectionBehavior ?? 'Behavior'}
      </Text>

      <View style={commonStyles.gridRow}>
        <View style={commonStyles.gridHalf}>
          <Text style={commonStyles.label}>{t.labels.noiseLevel ?? 'Noise'}</Text>
          <Text style={textStyle}>
            {data.noiseLevel === 'low'
              ? (t.labels.noiseLow ?? t.labels.low ?? 'Low')
              : data.noiseLevel === 'high'
                ? (t.labels.noiseHigh ?? t.labels.high ?? 'High')
                : (t.labels.noiseMedium ?? t.labels.medium ?? 'Medium')}
          </Text>
        </View>
        <View style={commonStyles.gridHalf}>
          <Text style={commonStyles.label}>{t.labels.aloneTime ?? 'Alone'}</Text>
          <Text style={textStyle}>
            {data.aloneTime ? `${sanitizeForPdf(String(data.aloneTime))}h` : '—'}
          </Text>
        </View>
      </View>

      {data.activeHours ? (
        <View style={[commonStyles.gridRow, { marginTop: 4 }]}>
          <View style={commonStyles.gridHalf}>
            <Text style={commonStyles.label}>{t.labels.activeHours ?? 'Active hours'}</Text>
            <Text style={textStyle}>{sanitizeForPdf(data.activeHours)}</Text>
          </View>
        </View>
      ) : null}

      {data.behaviorWithChildren || data.behaviorWithPets ? (
        <View style={[commonStyles.gridRow, { marginTop: 4 }]}>
          {data.behaviorWithChildren ? (
            <View style={commonStyles.gridHalf}>
              <Text style={commonStyles.label}>
                {t.labels.behaviorWithChildren ?? 'With children'}
              </Text>
              <Text style={textStyle}>
                {data.behaviorWithChildren === 'good'
                  ? (t.labels.behaviorGood ?? 'Good')
                  : data.behaviorWithChildren === 'neutral'
                    ? (t.labels.behaviorNeutral ?? 'Neutral')
                    : (t.labels.behaviorAvoid ?? 'Avoid')}
              </Text>
            </View>
          ) : null}

          {data.behaviorWithPets ? (
            <View style={commonStyles.gridHalf}>
              <Text style={commonStyles.label}>{t.labels.behaviorWithPets ?? 'With pets'}</Text>
              <Text style={textStyle}>
                {data.behaviorWithPets === 'good'
                  ? (t.labels.behaviorGood ?? 'Good')
                  : data.behaviorWithPets === 'neutral'
                    ? (t.labels.behaviorNeutral ?? 'Neutral')
                    : (t.labels.behaviorAvoid ?? 'Avoid')}
              </Text>
            </View>
          ) : null}
        </View>
      ) : null}
    </View>
  )
}
