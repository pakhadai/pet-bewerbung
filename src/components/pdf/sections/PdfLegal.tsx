import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { commonStyles, pdfBorderRadius } from '../PdfBase';
import type { PetData } from '../../../types/form';
import type { PdfTranslations } from '../../../services/pdfService';
import { buildPdfSectionHeadingStyle, type PdfTemplateConfig } from '../templates/getPdfTemplateConfig';
import { sanitizeForPdf, withFallback } from '../../../utils/documentHelpers';
import { getShowAdvancedHealthInfo } from '../../../utils/getShowAdvancedHealthInfo';

export interface PdfLegalProps {
  data: PetData;
  t: PdfTranslations;
  templateConfig: PdfTemplateConfig;
}

const s = (val: unknown) => sanitizeForPdf(withFallback(val));

export const PdfLegal: React.FC<PdfLegalProps> = ({ data, t, templateConfig }) => {
  if (!getShowAdvancedHealthInfo(data)) return null;
  const { colors } = templateConfig;

  const headingStyle = buildPdfSectionHeadingStyle(templateConfig);

  const textColor = '#334155';
  const textStyle = [
    commonStyles.text,
    { color: textColor, fontWeight: 'normal', fontStyle: 'normal', fontSize: 10 },
  ];

  const yes = t.labels.yes ?? 'Yes';
  const no = t.labels.no ?? 'No';

  return (
    <View style={commonStyles.sectionBlock} key="legal">
      <View
        style={[
          commonStyles.box,
          {
            borderColor: colors.border,
            backgroundColor: colors.light,
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
      >
        <Text style={[headingStyle, { marginBottom: 4 }]}>{t.doc.sectionLegal ?? 'Insurance & Legal'}</Text>

        <View style={commonStyles.gridRow}>
          <View style={commonStyles.gridHalf}>
            <Text style={[commonStyles.label, { fontSize: 7 }]}>{t.labels.chipId ?? 'Chip ID'}</Text>
            <Text style={[textStyle, { fontSize: 9 }]}>{s(data.chipId)}</Text>
          </View>
          <View style={commonStyles.gridHalf}>
            <Text style={[commonStyles.label, { fontSize: 7 }]}>{t.labels.insurance ?? 'Insurance'}</Text>
            <Text style={[textStyle, { fontSize: 9 }]}>{s(data.insuranceProvider)}</Text>
          </View>
        </View>

        <View style={commonStyles.gridRow}>
          <View style={commonStyles.gridHalf}>
            <Text style={[commonStyles.label, { fontSize: 7 }]}>{t.labels.vet ?? 'Vet'}</Text>
            <Text style={[textStyle, { fontSize: 9 }]}>
              {[data.vetName, data.vetPhone].filter(Boolean).map((v) => s(v)).join(' · ') || '—'}
            </Text>
          </View>
          <View style={commonStyles.gridHalf}>
            <Text style={[commonStyles.label, { fontSize: 7 }]}>{t.labels.neutered ?? 'Neutered'}</Text>
            <Text style={[textStyle, { fontSize: 9 }]}>{data.isNeutered ? yes : no}</Text>
          </View>
        </View>

        <View style={[commonStyles.gridRow, { marginTop: 2 }]}>
          <View style={commonStyles.gridHalf}>
            <Text style={[commonStyles.label, { fontSize: 7 }]}>{t.labels.vaccination ?? 'Vaccinated'}</Text>
            <Text style={[textStyle, { fontSize: 9 }]}>{data.hasVaccination ? yes : no}</Text>
          </View>
          <View style={commonStyles.gridHalf}>
            <Text style={[commonStyles.label, { fontSize: 7 }]}>{t.labels.registration ?? 'Registered'}</Text>
            <Text style={[textStyle, { fontSize: 9 }]}>{data.hasRegistration ? yes : no}</Text>
          </View>
        </View>

        <View style={commonStyles.gridRow}>
          <View style={{ flex: 1 }}>
            <Text style={[commonStyles.label, { fontSize: 7 }]}>{t.labels.willingToPayDeposit ?? 'Pet Deposit'}</Text>
            <Text style={[textStyle, { fontSize: 9 }]}>{data.willingToPayDeposit ? yes : no}</Text>
          </View>
        </View>

        {data.medicalConditions ? (
          <View
            style={{
              marginTop: 4,
              paddingTop: 4,
              borderTopWidth: 1,
              borderTopColor: colors.border,
              borderRadius: pdfBorderRadius(0),
            }}
          >
            <Text style={[commonStyles.label, { fontSize: 7 }]}>{t.labels.medicalConditions ?? t.step2Emergency.displayMedical}</Text>
            <Text style={[textStyle, { fontSize: 8 }]}>{sanitizeForPdf(data.medicalConditions)}</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
};

