import { Image, Text, View } from '@react-pdf/renderer'
import React from 'react'
import type { PdfTranslations } from '../../../services/pdfService'
import type { PetData } from '../../../types/form'
import { sanitizeForPdf, withFallback } from '../../../utils/documentHelpers'
import { commonStyles, pdfBorderRadius } from '../PdfBase'
import {
  buildPdfSectionHeadingStyle,
  type PdfTemplateConfig,
} from '../templates/getPdfTemplateConfig'

export interface PdfOwnerInfoProps {
  data: PetData
  t: PdfTranslations
  templateConfig: PdfTemplateConfig
  addressLines: { streetLine?: string; cityLine?: string }
  qrUrl?: string | null
}

const s = (val: unknown) => sanitizeForPdf(withFallback(val))

export const PdfOwnerInfo: React.FC<PdfOwnerInfoProps> = ({
  data,
  t,
  templateConfig,
  addressLines,
  qrUrl,
}) => {
  const { colors } = templateConfig

  const headingStyle = buildPdfSectionHeadingStyle(templateConfig)

  const textColor = templateConfig.colors.bodyText
  const textStyle = [commonStyles.text, { color: textColor, fontSize: 10 }]

  return (
    <View style={commonStyles.sectionBlock} key="owner">
      <Text style={headingStyle}>{t.doc.sectionOwner ?? 'Owner'}</Text>
      <View>
        <Text style={commonStyles.textBold}>{s(data.ownerName)}</Text>
        <Text style={textStyle}>{sanitizeForPdf(addressLines.streetLine)}</Text>
        <Text style={commonStyles.text}>{sanitizeForPdf(addressLines.cityLine)}</Text>
        <Text style={[commonStyles.text, { marginTop: 6, color: textColor }]}>{s(data.email)}</Text>
        <Text style={[commonStyles.text, { color: textColor }]}>{s(data.phone)}</Text>
      </View>

      {qrUrl && (
        <View
          style={{
            marginTop: 10,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            paddingTop: 8,
            borderTopWidth: 1,
            borderTopColor: colors.light,
            borderTopStyle: 'dashed',
            borderRadius: pdfBorderRadius(0),
          }}
        >
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 7,
                color: colors.muted,
                textTransform: 'uppercase',
                letterSpacing: 0.3,
              }}
            >
              {t.doc.qrLabel ?? 'Kontakt scannen'}
            </Text>
            <Text style={{ fontSize: 6, color: colors.muted, marginTop: 2 }}>
              {t.doc.qrHint ?? 'vCard hinzufügen'}
            </Text>
          </View>
          <Image src={qrUrl} style={{ width: 75, height: 75 }} />
        </View>
      )}
    </View>
  )
}
