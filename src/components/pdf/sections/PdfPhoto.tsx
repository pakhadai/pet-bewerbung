import React from 'react';
import { View, Text, Image } from '@react-pdf/renderer';
import { commonStyles, pdfBorderRadius, pdfBorderWidth } from '../PdfBase';
import type { PdfTemplateConfig } from '../templates/getPdfTemplateConfig';
import type { PetData } from '../../../types/form';
import type { PdfTranslations } from '../../../services/pdfService';

export interface PdfPhotoProps {
  data: PetData;
  t: PdfTranslations;
  templateConfig: PdfTemplateConfig;
}

export const PdfPhoto: React.FC<PdfPhotoProps> = ({ data, t, templateConfig }) => {
  const photoHeight = templateConfig.photoHeight;
  const { colors, templateType } = templateConfig;
  const isBuddyLike = templateType === 'buddy' || templateType === 'buddyTest';

  const frameStyle = [
    commonStyles.photoContainer,
    { height: photoHeight, overflow: 'hidden' },
    templateType === 'classic' && {
      borderWidth: 2,
      borderColor: colors.primary,
      borderRadius: pdfBorderRadius(0),
      backgroundColor: colors.light,
    },
    templateType === 'modern' && {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      backgroundColor: colors.light,
    },
    templateType === 'compact' && {
      borderWidth: 1,
      borderColor: colors.accent,
      borderRadius: pdfBorderRadius(0),
      backgroundColor: '#ffffff',
    },
    isBuddyLike && {
      borderWidth: pdfBorderWidth(0),
      backgroundColor: colors.light,
      borderBottomRightRadius: 40,
      overflow: 'hidden',
    },
  ].filter(Boolean);

  const hasPhoto =
    data.photo &&
    typeof data.photo === 'string' &&
    (data.photo.startsWith('data:') || data.photo.startsWith('blob:'));

  return (
    <View style={frameStyle} key="photo">
      {hasPhoto ? (
        <Image src={data.photo} style={[commonStyles.photoImg, { height: photoHeight }]} />
      ) : (
        <View style={[commonStyles.photoPlaceholder, { height: photoHeight }]}>
          <Text style={commonStyles.label}>{t.doc.petPhoto ?? 'Photo'}</Text>
        </View>
      )}
    </View>
  );
};
