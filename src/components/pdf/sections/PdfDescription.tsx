import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { commonStyles } from '../PdfBase';
import type { PetData } from '../../../types/form';
import type { PdfTranslations } from '../../../services/pdfService';
import { buildPdfSectionHeadingStyle, type PdfTemplateConfig } from '../templates/getPdfTemplateConfig';
import { sanitizeForPdf, withFallback } from '../../../utils/documentHelpers';

export interface PdfDescriptionProps {
  data: PetData;
  t: PdfTranslations;
  templateConfig: PdfTemplateConfig;
}

const s = (val: unknown) => sanitizeForPdf(withFallback(val));

export const PdfDescription: React.FC<PdfDescriptionProps> = ({ data, t, templateConfig }) => {
  const headingStyle = buildPdfSectionHeadingStyle(templateConfig);

  const textColor = '#334155';
  const textStyle = [
    commonStyles.text,
    { color: textColor, fontWeight: 'normal', fontStyle: 'normal', fontSize: 10 },
  ];

  const descriptionText = sanitizeForPdf(data.generatedText) || (t.ui?.noDescription ?? '—');

  return (
    <View style={commonStyles.descriptionBlock} key="description">
      <Text style={headingStyle}>{t.doc.sectionAbout ?? 'About'}</Text>
      <Text style={textStyle}>{descriptionText}</Text>
    </View>
  );
};

