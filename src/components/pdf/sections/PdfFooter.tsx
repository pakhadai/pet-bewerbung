import React from 'react';
import { View, Text, Link } from '@react-pdf/renderer';
import { commonStyles } from '../PdfBase';
import type { PdfTemplateConfig } from '../templates/getPdfTemplateConfig';
import type { PdfTranslations } from '../../../services/pdfService';

export interface PdfFooterProps {
  t: PdfTranslations;
  templateConfig: PdfTemplateConfig;
}

export const PdfFooter: React.FC<PdfFooterProps> = ({ t, templateConfig }) => {
  const { colors, footerBrandingVariant } = templateConfig;
  const footerStyle = [commonStyles.footer, { borderTopColor: colors.primary }];

  const footerSignStyle = [commonStyles.footerSign];
  const footerBranding = (t.doc.footer ?? 'Dokument generiert via Pet-Bewerbung.ch').toUpperCase();

  return (
    <View style={footerStyle}>
      {footerBrandingVariant === 'freeCentered' ? (
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Link
            src="https://pet-bewerbung.ch"
            style={commonStyles.footerBrandingFree}
          >
            ✦ {footerBranding} ✦
          </Link>
        </View>
      ) : (
        <Link
          src="https://pet-bewerbung.ch"
          style={commonStyles.footerBrandingAlt}
        >
          pet-bewerbung.ch
        </Link>
      )}
      <View style={footerSignStyle}>
        <Text>{t.doc.sign ?? 'Signature'}</Text>
      </View>
    </View>
  );
};

