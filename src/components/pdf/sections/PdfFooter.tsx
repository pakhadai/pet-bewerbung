import { Link, Text, View } from '@react-pdf/renderer'
import React from 'react'
import type { PdfTranslations } from '../../../services/pdfService'
import { commonStyles, pdfBorderRadius } from '../PdfBase'
import type { PdfTemplateConfig } from '../templates/getPdfTemplateConfig'

export interface PdfFooterProps {
  t: PdfTranslations
  templateConfig: PdfTemplateConfig
}

export const PdfFooter: React.FC<PdfFooterProps> = ({ t, templateConfig }) => {
  const { colors, footerBrandingVariant, templateType } = templateConfig
  const isBuddyLike = templateType === 'buddy' || templateType === 'buddyTest'

  const footerRule =
    templateType === 'classic'
      ? { borderTopWidth: 2, borderTopColor: colors.primary, borderRadius: pdfBorderRadius(0) }
      : templateType === 'modern'
        ? { borderTopWidth: 1, borderTopColor: colors.accent, borderRadius: pdfBorderRadius(0) }
        : isBuddyLike
          ? {
              borderTopWidth: 0,
              backgroundColor: '#004541',
              paddingTop: 10,
              paddingBottom: 8,
              borderRadius: pdfBorderRadius(0),
            }
          : {
              borderTopWidth: 1,
              borderTopColor: colors.border,
              borderTopStyle: 'dashed' as const,
              borderRadius: pdfBorderRadius(0),
            }

  const footerStyle = [commonStyles.footer, footerRule]

  const footerSignStyle = isBuddyLike
    ? [commonStyles.footerSign, { borderTopColor: '#abefe8', borderTopWidth: 1 }]
    : commonStyles.footerSign
  const footerBranding = (t.doc.footer ?? 'Dokument generiert via Pet-Bewerbung.ch').toUpperCase()

  return (
    <View style={footerStyle}>
      {footerBrandingVariant === 'freeCentered' ? (
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Link src="https://pet-bewerbung.ch" style={commonStyles.footerBrandingFree}>
            {footerBranding}
          </Link>
        </View>
      ) : (
        <Link
          src="https://pet-bewerbung.ch"
          style={{
            ...commonStyles.footerBrandingAlt,
            ...(templateType === 'modern' ? { color: colors.accent } : {}),
            ...(templateType === 'compact' ? { color: colors.muted } : {}),
            ...(isBuddyLike ? { color: '#abefe8' } : {}),
          }}
        >
          pet-bewerbung.ch
        </Link>
      )}
      <View style={footerSignStyle}>
        <Text style={isBuddyLike ? { color: '#f8f9ff' } : undefined}>
          {t.doc.sign ?? 'Signature'}
        </Text>
      </View>
    </View>
  )
}
