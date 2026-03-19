import React from 'react';
import { View, Text, Image } from '@react-pdf/renderer';
import { commonStyles } from '../PdfBase';
import type { PdfTemplateConfig } from '../templates/getPdfTemplateConfig';
import type { PdfTranslations } from '../../../services/pdfService';

export interface PdfHeaderProps {
  today: string;
  city?: string;
  logoUrl?: string;
  t: PdfTranslations;
  templateConfig: PdfTemplateConfig;
}

export const PdfHeader: React.FC<PdfHeaderProps> = ({ today, city, logoUrl, t, templateConfig }) => {
  const colors = templateConfig.colors;
  const headerStyle = [commonStyles.header, { borderBottomColor: colors.primary }];
  const headerIconStyle = [
    commonStyles.headerIcon,
    logoUrl && { backgroundColor: 'white', padding: 2 },
  ];

  const dateText = city?.trim() ? `${city.trim()}, ${today}` : today;

  return (
    <View style={headerStyle}>
      <View style={commonStyles.headerLeft}>
        <View style={headerIconStyle}>
          {logoUrl ? (
            <Image src={logoUrl} style={{ width: 28, height: 28, objectFit: 'contain' }} />
          ) : (
            <Text style={{ color: 'white', fontSize: 14 }}>•</Text>
          )}
        </View>
        <View>
          <Text style={[commonStyles.headerTitle, { color: colors.primary }]}>{t.doc.title ?? 'Pet Dossier'}</Text>
          <Text style={commonStyles.headerSubtitle}>{t.doc.subtitle ?? 'Application document'}</Text>
        </View>
      </View>
      <Text style={commonStyles.headerDate}>{dateText}</Text>
    </View>
  );
};

