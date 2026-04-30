import { Image, Text, View } from '@react-pdf/renderer'
import React from 'react'
import type { PdfTranslations } from '../../../services/pdfService'
import { commonStyles, pdfBorderRadius } from '../PdfBase'
import type { PdfTemplateConfig } from '../templates/getPdfTemplateConfig'

export interface PdfHeaderProps {
  today: string
  city?: string
  logoUrl?: string
  t: PdfTranslations
  templateConfig: PdfTemplateConfig
}

export const PdfHeader: React.FC<PdfHeaderProps> = ({
  today,
  city,
  logoUrl,
  t,
  templateConfig,
}) => {
  const colors = templateConfig.colors
  const tt = templateConfig.templateType
  const isBuddyLike = tt === 'buddy' || tt === 'buddyTest'

  type ViewStyle = React.ComponentProps<typeof View>['style']
  type TextStyle = React.ComponentProps<typeof Text>['style']

  const headerRule =
    tt === 'classic'
      ? {
          borderBottomWidth: 2,
          borderBottomColor: colors.primary,
          borderRadius: pdfBorderRadius(0),
        }
      : tt === 'modern'
        ? {
            borderBottomWidth: 1,
            borderBottomColor: colors.accent,
            borderRadius: pdfBorderRadius(0),
          }
        : isBuddyLike
          ? {
              borderBottomWidth: 1,
              borderBottomColor: colors.primary,
              backgroundColor: '#eff4ff',
              borderRadius: pdfBorderRadius(0),
            }
          : {
              borderBottomWidth: 1,
              borderBottomColor: colors.border,
              borderBottomStyle: 'dashed' as const,
              borderRadius: pdfBorderRadius(0),
            }

  const headerStyle = [commonStyles.header, headerRule]

  const headerIconStyle: ViewStyle = [
    commonStyles.headerIcon,
    ...(tt === 'classic' ? [{ backgroundColor: colors.primary }] : []),
    ...(tt === 'modern'
      ? [
          {
            backgroundColor: colors.light,
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 8,
          },
        ]
      : []),
    ...(tt === 'compact'
      ? [
          {
            backgroundColor: '#ffffff',
            borderWidth: 1,
            borderColor: colors.accent,
            borderRadius: pdfBorderRadius(0),
          },
        ]
      : []),
    ...(isBuddyLike
      ? [
          {
            backgroundColor: '#ffffff',
            borderWidth: 1,
            borderColor: '#bec9c7',
            borderRadius: 8,
          },
        ]
      : []),
    ...(logoUrl && tt === 'classic' ? [{ backgroundColor: 'white', padding: 2 }] : []),
    ...(logoUrl && tt === 'modern' ? [{ backgroundColor: 'white' }] : []),
    ...(logoUrl && isBuddyLike ? [{ backgroundColor: 'white' }] : []),
  ]

  const titleStyle: TextStyle = [
    commonStyles.headerTitle,
    ...(tt === 'classic'
      ? [{ color: colors.primary, textTransform: 'uppercase' as const, fontSize: 16 }]
      : []),
    ...(tt === 'modern'
      ? [
          {
            color: '#0f172a',
            textTransform: 'none' as const,
            fontSize: 17,
            fontWeight: 'bold' as const,
          },
        ]
      : []),
    ...(tt === 'compact'
      ? [
          {
            color: colors.primary,
            textTransform: 'uppercase' as const,
            fontSize: 13,
            letterSpacing: 2,
          },
        ]
      : []),
    ...(isBuddyLike
      ? [
          {
            color: colors.primary,
            textTransform: 'none' as const,
            fontSize: 17,
            fontWeight: 'bold' as const,
          },
        ]
      : []),
  ]

  const subtitleStyle: TextStyle = [
    commonStyles.headerSubtitle,
    ...(tt === 'modern'
      ? [{ color: colors.accent, textTransform: 'none' as const, fontSize: 10 }]
      : []),
    ...(tt === 'compact' ? [{ letterSpacing: 1, fontSize: 8 }] : []),
    ...(isBuddyLike
      ? [
          {
            color: '#3f4947',
            textTransform: 'uppercase' as const,
            fontSize: 9,
            letterSpacing: 1.5,
          },
        ]
      : []),
  ]

  const dateText = city?.trim() ? `${city.trim()}, ${today}` : today

  return (
    <View style={headerStyle}>
      <View style={commonStyles.headerLeft}>
        <View style={headerIconStyle}>
          {logoUrl ? (
            <Image src={logoUrl} style={{ width: 28, height: 28, objectFit: 'contain' }} />
          ) : (
            <Text style={{ color: tt === 'classic' ? 'white' : colors.primary, fontSize: 14 }}>
              •
            </Text>
          )}
        </View>
        <View>
          <Text style={titleStyle}>{t.doc.title ?? 'Pet Dossier'}</Text>
          <Text style={subtitleStyle}>{t.doc.subtitle ?? 'Application document'}</Text>
        </View>
      </View>
      <Text style={commonStyles.headerDate}>{dateText}</Text>
    </View>
  )
}
