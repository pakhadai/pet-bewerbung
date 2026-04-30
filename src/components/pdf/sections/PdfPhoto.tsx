import { Image, Text, View } from '@react-pdf/renderer'
import React from 'react'
import type { PdfTranslations } from '../../../services/pdfService'
import type { PetData } from '../../../types/form'
import { commonStyles, pdfBorderRadius, pdfBorderWidth } from '../PdfBase'
import type { PdfTemplateConfig } from '../templates/getPdfTemplateConfig'

export interface PdfPhotoProps {
  data: PetData
  t: PdfTranslations
  templateConfig: PdfTemplateConfig
}

export const PdfPhoto: React.FC<PdfPhotoProps> = ({ data, t, templateConfig }) => {
  const photoHeight = templateConfig.photoHeight
  const { colors, templateType } = templateConfig
  const isBuddyLike = templateType === 'buddy' || templateType === 'buddyTest'

  const frameStyle = [
    commonStyles.photoContainer,
    { height: photoHeight, overflow: 'hidden' as const },
    ...(templateType === 'classic'
      ? [
          {
            borderWidth: 2,
            borderColor: colors.primary,
            borderRadius: pdfBorderRadius(0),
            backgroundColor: colors.light,
          },
        ]
      : []),
    ...(templateType === 'modern'
      ? [
          {
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 8,
            backgroundColor: colors.light,
          },
        ]
      : []),
    ...(templateType === 'compact'
      ? [
          {
            borderWidth: 1,
            borderColor: colors.accent,
            borderRadius: pdfBorderRadius(0),
            backgroundColor: '#ffffff',
          },
        ]
      : []),
    ...(isBuddyLike
      ? [
          {
            borderWidth: pdfBorderWidth(0),
            backgroundColor: colors.light,
            borderBottomRightRadius: 40,
            overflow: 'hidden' as const,
          },
        ]
      : []),
  ]

  const isEmbeddedPhotoSrc = (photo: PetData['photo']): photo is string => {
    return (
      typeof photo === 'string' &&
      (photo.startsWith('data:') || photo.startsWith('blob:')) &&
      photo.length > 0
    )
  }

  const photoSrc = data.photo

  return (
    <View style={frameStyle as unknown as React.ComponentProps<typeof View>['style']} key="photo">
      {isEmbeddedPhotoSrc(photoSrc) ? (
        <Image src={photoSrc} style={[commonStyles.photoImg, { height: photoHeight }]} />
      ) : (
        <View style={[commonStyles.photoPlaceholder, { height: photoHeight }]}>
          <Text style={commonStyles.label}>{t.doc.petPhoto ?? 'Photo'}</Text>
        </View>
      )}
    </View>
  )
}
