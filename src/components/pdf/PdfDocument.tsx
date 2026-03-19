/**
 * PdfDocument - Shared PDF layout and section rendering.
 * Compositional layout (header -> sidebar+main -> footer).
 * Template-specific differences are controlled by PdfTemplateConfig.
 */
import React from 'react';
import { Document, Page, View } from '@react-pdf/renderer';
import { getLayoutSections, getLocale, commonStyles } from './PdfBase';
import { formatAddress } from '../../utils/documentHelpers';
import type { PetData, TemplateType } from '../../types/form';
import type { PdfTranslations } from '../../services/pdfService';
import { getPdfTemplateConfig } from './templates/getPdfTemplateConfig';

import { PdfHeader } from './sections/PdfHeader';
import { PdfPhoto } from './sections/PdfPhoto';
import { PdfOwnerInfo } from './sections/PdfOwnerInfo';
import { PdfBehavior } from './sections/PdfBehavior';
import { PdfDetails } from './sections/PdfDetails';
import { PdfDescription } from './sections/PdfDescription';
import { PdfLegal } from './sections/PdfLegal';
import { PdfReference } from './sections/PdfReference';
import { PdfFooter } from './sections/PdfFooter';

export interface PdfDocumentProps {
  data: PetData;
  t: PdfTranslations;
  logoUrl?: string;
  qrUrl?: string | null;
  templateType: TemplateType;
}

const PdfDocument: React.FC<PdfDocumentProps> = ({ data, t, logoUrl, qrUrl, templateType }) => {
  const templateConfig = getPdfTemplateConfig(templateType);
  const today = new Date().toLocaleDateString(getLocale(data.lang));

  const pageStyle = [
    commonStyles.page,
    { backgroundColor: '#ffffff', color: '#334155' },
    templateConfig.pagePadding != null && templateConfig.pageFontSize != null
      ? { padding: templateConfig.pagePadding, fontSize: templateConfig.pageFontSize }
      : null,
  ].filter(Boolean);

  const addressLines = formatAddress(data.street, data.houseNumber, data.postal, data.city);
  const { sidebarSections, mainSections } = getLayoutSections();

  const SECTION_RENDERERS: Record<
    string,
    () => React.ReactNode
  > = {
    photo: () => <PdfPhoto data={data} t={t} templateConfig={templateConfig} />,
    owner: () => (
      <PdfOwnerInfo
        data={data}
        t={t}
        templateConfig={templateConfig}
        addressLines={addressLines}
        qrUrl={qrUrl}
      />
    ),
    behavior: () => <PdfBehavior data={data} t={t} templateConfig={templateConfig} />,
    details: () => <PdfDetails data={data} t={t} templateConfig={templateConfig} />,
    description: () => <PdfDescription data={data} t={t} templateConfig={templateConfig} />,
    legal: () => <PdfLegal data={data} t={t} templateConfig={templateConfig} />,
    reference: () => <PdfReference data={data} t={t} templateConfig={templateConfig} />,
  };

  return (
    <Document title={t.doc.title ?? 'Pet CV'}>
      <Page size="A4" style={pageStyle} wrap>
        <PdfHeader today={today} city={data.city} logoUrl={logoUrl} t={t} templateConfig={templateConfig} />

        <View style={commonStyles.mainRow}>
          <View style={commonStyles.sidebar}>
            {sidebarSections.map((id) => (
              <React.Fragment key={id}>{SECTION_RENDERERS[id]?.()}</React.Fragment>
            ))}
          </View>
          <View style={commonStyles.main}>
            {mainSections.map((id) => (
              <React.Fragment key={id}>{SECTION_RENDERERS[id]?.()}</React.Fragment>
            ))}
          </View>
        </View>

        <PdfFooter t={t} templateConfig={templateConfig} />
      </Page>
    </Document>
  );
};

export default PdfDocument;

