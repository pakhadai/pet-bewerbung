import React from 'react';
import { View, Text, Image } from '@react-pdf/renderer';
import { commonStyles } from '../PdfBase';
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

  const hasPhoto =
    data.photo &&
    typeof data.photo === 'string' &&
    (data.photo.startsWith('data:') || data.photo.startsWith('blob:'));

  return (
    <View style={[commonStyles.sectionBlock, commonStyles.photoContainer, { height: photoHeight }]} key="photo">
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

