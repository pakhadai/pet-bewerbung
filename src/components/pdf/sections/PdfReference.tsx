import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { commonStyles, pdfBorderRadius } from '../PdfBase';
import type { PetData } from '../../../types/form';
import type { PdfTranslations } from '../../../services/pdfService';
import {
  buildPdfSectionHeadingStyle,
  getPdfReferencePanelStyle,
  type PdfTemplateConfig,
} from '../templates/getPdfTemplateConfig';
import { sanitizeForPdf, withFallback } from '../../../utils/documentHelpers';
import { getShowAdvancedHealthInfo } from '../../../utils/getShowAdvancedHealthInfo';

export interface PdfReferenceProps {
  data: PetData;
  t: PdfTranslations;
  templateConfig: PdfTemplateConfig;
}

const s = (val: unknown) => sanitizeForPdf(withFallback(val));

export const PdfReference: React.FC<PdfReferenceProps> = ({ data, t, templateConfig }) => {
  if (!getShowAdvancedHealthInfo(data)) return null;

  const hasLandlordInfo =
    data.previousLandlordName || data.previousLandlordPhone || data.previousLandlordEmail;
  const hasEmergencyInfo = data.emergencyContactName || data.emergencyContactPhone;

  if (!hasLandlordInfo && !hasEmergencyInfo && !data.secondaryEmergencyContact) return null;

  const refPanel = getPdfReferencePanelStyle(templateConfig.templateType);
  const headingStyle = buildPdfSectionHeadingStyle(templateConfig);

  const textColor = '#334155';
  const textStyle = [
    commonStyles.text,
    { color: textColor, fontWeight: 'normal', fontStyle: 'normal', fontSize: 10 },
  ];

  return (
    <View
      style={[
        commonStyles.sectionBlock,
        {
          backgroundColor: refPanel.backgroundColor,
          padding: 8,
          borderWidth: 1,
          borderColor: refPanel.borderColor,
          borderRadius: pdfBorderRadius(
            templateConfig.templateType === 'modern' ||
            templateConfig.templateType === 'buddy' ||
            templateConfig.templateType === 'buddyTest'
              ? 4
              : templateConfig.templateType === 'compact'
                ? 2
                : 0,
          ),
        },
      ]}
      key="reference"
    >
      <Text
        style={[
          headingStyle,
          {
            marginBottom: 6,
            paddingBottom: 4,
            borderBottomWidth: 1,
            borderBottomColor: refPanel.headingRuleColor,
            color: refPanel.labelColor,
            borderRadius: pdfBorderRadius(0),
          },
        ]}
      >
        {t.labels.referenceTitle ?? t.doc.sectionReference ?? 'References'}
      </Text>

      <View style={{ flexDirection: 'row', gap: 12 }}>
        {hasLandlordInfo && (
          <View style={{ flex: 1 }}>
            <Text style={[commonStyles.label, { marginBottom: 2, fontSize: 7, color: refPanel.labelColor }]}>
              {t.labels.previousLandlord ?? 'Previous landlord'}
            </Text>
            {data.previousLandlordName ? (
              <Text style={[textStyle, { fontWeight: 'bold', fontSize: 9 }]}>{s(data.previousLandlordName)}</Text>
            ) : null}
            {data.previousDuration ? (
              <Text style={[textStyle, { fontSize: 8 }]}>
                {t.labels.previousDuration ?? 'Duration'}: {s(data.previousDuration)}
              </Text>
            ) : null}
            {data.previousLandlordPhone ? (
              <Text style={[textStyle, { fontSize: 8 }]}>{s(data.previousLandlordPhone)}</Text>
            ) : null}
            {data.previousLandlordEmail ? (
              <Text style={[textStyle, { fontSize: 8 }]}>{s(data.previousLandlordEmail)}</Text>
            ) : null}
          </View>
        )}

        {hasEmergencyInfo && (
          <View style={{ flex: 1 }}>
            <Text style={[commonStyles.label, { marginBottom: 2, fontSize: 7, color: refPanel.labelColor }]}>
              {t.labels.emergencyContact ?? 'Emergency contact'}
            </Text>
            {data.emergencyContactName ? (
              <Text style={[textStyle, { fontWeight: 'bold', fontSize: 9 }]}>{s(data.emergencyContactName)}</Text>
            ) : null}
            {data.emergencyContactRelation ? (
              <Text style={[textStyle, { fontSize: 8 }]}>
                {t.labels.emergencyContactRelation ?? 'Relation'}: {s(data.emergencyContactRelation)}
              </Text>
            ) : null}
            {data.emergencyContactPhone ? (
              <Text style={[textStyle, { fontSize: 8 }]}>{s(data.emergencyContactPhone)}</Text>
            ) : null}
          </View>
        )}
      </View>

      {data.secondaryEmergencyContact ? (
        <View
          style={{
            marginTop: 6,
            paddingTop: 4,
            borderTopWidth: 1,
            borderTopColor: refPanel.headingRuleColor,
            borderRadius: pdfBorderRadius(0),
          }}
        >
          <Text style={[commonStyles.text, { fontSize: 8, color: textColor }]}>
            {t.labels.secondaryEmergencyContact ?? 'Zweiter Kontakt'}: {s(data.secondaryEmergencyContact)}
          </Text>
        </View>
      ) : null}
    </View>
  );
};
