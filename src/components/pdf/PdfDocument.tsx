/**
 * PdfDocument - Shared PDF layout and section rendering.
 * Used by ClassicPdf, ModernPdf, CompactPdf with different templateType.
 */
import React from 'react';
import { Document, Page, View, Text, Image } from '@react-pdf/renderer';
import {
  commonStyles,
  TEMPLATE_COLORS,
  getLayoutSections,
  getLocale,
} from './PdfBase';
import { formatAddress, getGenderLabel, formatAge, formatWeight, withFallback, sanitizeForPdf } from '../../utils/documentHelpers';
import type { TemplateType } from '../../types/form';

export interface PdfDocumentProps {
  data: Record<string, unknown>;
  t: Record<string, unknown>;
  logoUrl?: string;
  qrUrl?: string | null;
  templateType: TemplateType;
}

const PdfDocument: React.FC<PdfDocumentProps> = ({ data, t, logoUrl, qrUrl, templateType = 'classic' }) => {
  const colors = TEMPLATE_COLORS[templateType] || TEMPLATE_COLORS.classic;
  const isCompact = templateType === 'compact';
  const isModern = templateType === 'modern';

  const s = (val: unknown) => sanitizeForPdf(withFallback(val));

  const textColor = '#334155';
  const backgroundColor = '#ffffff';
  const headerFontWeight = 'bold';
  const headerFontStyle = 'normal';
  const bodyFontWeight = 'normal';
  const bodyFontStyle = 'normal';
  const headerFontSize = 9;
  const bodyFontSize = 10;

  const { sidebarSections, mainSections } = getLayoutSections();
  const { streetLine, cityLine } = formatAddress(
    data?.street as string,
    data?.houseNumber as string,
    data?.postal as string,
    data?.city as string
  );

  const today = new Date().toLocaleDateString(getLocale(data?.lang as string));
  const photoHeight = isCompact ? 220 : 240;

  const pageStyle = [
    commonStyles.page,
    { backgroundColor, color: textColor },
    isCompact && { padding: 32, fontSize: 9 },
  ];

  const headerStyle = [commonStyles.header, { borderBottomColor: colors.primary }];
  const headingStyle = [
    commonStyles.sectionHeading,
    isModern && commonStyles.sectionHeadingModern,
    {
      borderBottomColor: isModern ? colors.border : colors.primary,
      color: colors.primary,
      fontWeight: headerFontWeight,
      fontStyle: headerFontStyle,
      fontSize: headerFontSize,
    },
  ];
  const textStyle = [
    commonStyles.text,
    { color: textColor, fontWeight: bodyFontWeight, fontStyle: bodyFontStyle, fontSize: bodyFontSize },
  ];
  const footerStyle = [commonStyles.footer, { borderTopColor: colors.primary }];
  const footerSignStyle = [commonStyles.footerSign];
  const boxStyle = [commonStyles.box, { borderColor: colors.light, backgroundColor: '#f8fafc' }];
  const headerIconStyle = [
    commonStyles.headerIcon,
    logoUrl && { backgroundColor: 'white', padding: 2 },
  ];

  const renderPhotoSection = () => (
    <View style={[commonStyles.sectionBlock, commonStyles.photoContainer, { height: photoHeight }]} key="photo">
      {data?.photo && typeof data.photo === 'string' && (data.photo.startsWith('data:') || data.photo.startsWith('blob:')) ? (
        <Image src={data.photo as string} style={[commonStyles.photoImg, { height: photoHeight }]} />
      ) : (
        <View style={[commonStyles.photoPlaceholder, { height: photoHeight }]}>
          <Text style={commonStyles.label}>{(t?.doc as Record<string, string>)?.petPhoto ?? 'Photo'}</Text>
        </View>
      )}
    </View>
  );

  const renderOwnerSection = () => (
    <View style={commonStyles.sectionBlock} key="owner">
      <Text style={headingStyle}>{(t?.doc as Record<string, string>)?.sectionOwner ?? 'Owner'}</Text>
      <View>
        <Text style={commonStyles.textBold}>{s(data?.ownerName)}</Text>
        <Text style={commonStyles.text}>{sanitizeForPdf(streetLine)}</Text>
        <Text style={commonStyles.text}>{sanitizeForPdf(cityLine)}</Text>
        <Text style={[commonStyles.text, { marginTop: 6 }]}>{s(data?.email)}</Text>
        <Text style={commonStyles.text}>{s(data?.phone)}</Text>
      </View>
      {qrUrl && (
        <View style={{ marginTop: 10, flexDirection: 'row', alignItems: 'center', gap: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: colors.light, borderTopStyle: 'dashed' }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 7, color: colors.muted, textTransform: 'uppercase', letterSpacing: 0.3 }}>
              {(t?.doc as Record<string, string>)?.qrLabel ?? 'Kontakt scannen'}
            </Text>
            <Text style={{ fontSize: 6, color: colors.muted, marginTop: 2 }}>
              {(t?.doc as Record<string, string>)?.qrHint ?? 'vCard hinzufügen'}
            </Text>
          </View>
          <Image src={qrUrl} style={{ width: 75, height: 75 }} />
        </View>
      )}
    </View>
  );

  const renderBehaviorSection = () => (
    <View style={commonStyles.sectionBlock} key="behavior">
      <Text style={headingStyle}>{(t?.labels as Record<string, string>)?.behaviorTitle ?? (t?.doc as Record<string, string>)?.sectionBehavior ?? 'Behavior'}</Text>
      <View style={commonStyles.gridRow}>
        <View style={commonStyles.gridHalf}>
          <Text style={commonStyles.label}>{(t?.labels as Record<string, string>)?.noiseLevel ?? 'Noise'}</Text>
          <Text style={commonStyles.text}>
            {data?.noiseLevel === 'low'
              ? ((t?.labels as Record<string, string>)?.noiseLow ?? (t?.labels as Record<string, string>)?.low ?? 'Low')
              : data?.noiseLevel === 'high'
                ? ((t?.labels as Record<string, string>)?.noiseHigh ?? (t?.labels as Record<string, string>)?.high ?? 'High')
                : ((t?.labels as Record<string, string>)?.noiseMedium ?? (t?.labels as Record<string, string>)?.medium ?? 'Medium')}
          </Text>
        </View>
        <View style={commonStyles.gridHalf}>
          <Text style={commonStyles.label}>{(t?.labels as Record<string, string>)?.aloneTime ?? 'Alone'}</Text>
          <Text style={commonStyles.text}>
            {data?.aloneTime ? `${sanitizeForPdf(String(data.aloneTime))}h` : '—'}
          </Text>
        </View>
      </View>
      {data?.activeHours && (
        <View style={[commonStyles.gridRow, { marginTop: 4 }]}>
          <View style={commonStyles.gridHalf}>
            <Text style={commonStyles.label}>{(t?.labels as Record<string, string>)?.activeHours ?? 'Active hours'}</Text>
            <Text style={commonStyles.text}>{sanitizeForPdf(data.activeHours as string)}</Text>
          </View>
        </View>
      )}
      {(data?.behaviorWithChildren || data?.behaviorWithPets) && (
        <View style={[commonStyles.gridRow, { marginTop: 4 }]}>
          {data?.behaviorWithChildren && (
            <View style={commonStyles.gridHalf}>
              <Text style={commonStyles.label}>{(t?.labels as Record<string, string>)?.behaviorWithChildren ?? 'With children'}</Text>
              <Text style={commonStyles.text}>
                {data.behaviorWithChildren === 'good'
                  ? ((t?.labels as Record<string, string>)?.behaviorGood ?? 'Good')
                  : data.behaviorWithChildren === 'neutral'
                    ? ((t?.labels as Record<string, string>)?.behaviorNeutral ?? 'Neutral')
                    : ((t?.labels as Record<string, string>)?.behaviorAvoid ?? 'Avoid')}
              </Text>
            </View>
          )}
          {data?.behaviorWithPets && (
            <View style={commonStyles.gridHalf}>
              <Text style={commonStyles.label}>{(t?.labels as Record<string, string>)?.behaviorWithPets ?? 'With pets'}</Text>
              <Text style={commonStyles.text}>
                {data.behaviorWithPets === 'good'
                  ? ((t?.labels as Record<string, string>)?.behaviorGood ?? 'Good')
                  : data.behaviorWithPets === 'neutral'
                    ? ((t?.labels as Record<string, string>)?.behaviorNeutral ?? 'Neutral')
                    : ((t?.labels as Record<string, string>)?.behaviorAvoid ?? 'Avoid')}
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );

  const renderDetailsSection = () => (
    <View style={commonStyles.sectionBlock} key="details">
      <Text style={headingStyle}>{(t?.doc as Record<string, string>)?.sectionPet ?? 'Pet'}</Text>
      <View style={commonStyles.gridRow}>
        <View style={commonStyles.gridHalf}>
          <Text style={commonStyles.label}>{(t?.labels as Record<string, string>)?.petName ?? 'Name'}</Text>
          <Text style={commonStyles.textBold}>{s(data?.name)}</Text>
        </View>
        <View style={commonStyles.gridHalf}>
          <Text style={commonStyles.label}>{(t?.labels as Record<string, string>)?.breed ?? 'Breed'}</Text>
          <Text style={commonStyles.text}>{s(data?.breed)}</Text>
        </View>
      </View>
      <View style={commonStyles.gridRow}>
        <View style={commonStyles.gridHalf}>
          <Text style={commonStyles.label}>{(t?.labels as Record<string, string>)?.gender ?? 'Gender'} / {(t?.labels as Record<string, string>)?.age ?? 'Age'}</Text>
          <Text style={commonStyles.text}>
            {getGenderLabel(data?.gender, t)} / {formatAge(data?.age, t)}
          </Text>
        </View>
        <View style={commonStyles.gridHalf}>
          <Text style={commonStyles.label}>{(t?.labels as Record<string, string>)?.weight ?? 'Weight'}</Text>
          <Text style={commonStyles.text}>{formatWeight(data?.weight, t)}</Text>
        </View>
      </View>
    </View>
  );

  const renderDescriptionSection = () => (
    <View style={commonStyles.descriptionBlock} key="description">
      <Text style={headingStyle}>{(t?.doc as Record<string, string>)?.sectionAbout ?? 'About'}</Text>
      <Text style={textStyle}>{sanitizeForPdf(data?.generatedText) || ((t?.ui as Record<string, string>)?.noDescription ?? '—')}</Text>
    </View>
  );

  const renderLegalSection = () => (
    <View style={commonStyles.sectionBlock} key="legal">
      <View style={boxStyle}>
        <Text style={[headingStyle, { marginBottom: 4 }]}>{(t?.doc as Record<string, string>)?.sectionLegal ?? 'Insurance & Legal'}</Text>
        <View style={commonStyles.gridRow}>
          <View style={commonStyles.gridHalf}>
            <Text style={[commonStyles.label, { fontSize: 7 }]}>{(t?.labels as Record<string, string>)?.chipId ?? 'Chip ID'}</Text>
            <Text style={[commonStyles.text, { fontSize: 9 }]}>{s(data?.chipId)}</Text>
          </View>
          <View style={commonStyles.gridHalf}>
            <Text style={[commonStyles.label, { fontSize: 7 }]}>{(t?.labels as Record<string, string>)?.insurance ?? 'Insurance'}</Text>
            <Text style={[commonStyles.text, { fontSize: 9 }]}>{s(data?.insuranceProvider)}</Text>
          </View>
        </View>
        <View style={commonStyles.gridRow}>
          <View style={commonStyles.gridHalf}>
            <Text style={[commonStyles.label, { fontSize: 7 }]}>{(t?.labels as Record<string, string>)?.vet ?? 'Vet'}</Text>
            <Text style={[commonStyles.text, { fontSize: 9 }]}>
              {[data?.vetName, data?.vetPhone].filter(Boolean).map((v) => sanitizeForPdf(v)).join(' · ') || '—'}
            </Text>
          </View>
          <View style={commonStyles.gridHalf}>
            <Text style={[commonStyles.label, { fontSize: 7 }]}>{(t?.labels as Record<string, string>)?.neutered ?? 'Neutered'}</Text>
            <Text style={[commonStyles.text, { fontSize: 9 }]}>{data?.isNeutered ? ((t?.labels as Record<string, string>)?.yes ?? 'Yes') : ((t?.labels as Record<string, string>)?.no ?? 'No')}</Text>
          </View>
        </View>
        <View style={[commonStyles.gridRow, { marginTop: 2 }]}>
          <View style={commonStyles.gridHalf}>
            <Text style={[commonStyles.label, { fontSize: 7 }]}>{(t?.labels as Record<string, string>)?.vaccination ?? 'Vaccinated'}</Text>
            <Text style={[commonStyles.text, { fontSize: 9 }]}>{data?.hasVaccination ? ((t?.labels as Record<string, string>)?.yes ?? 'Yes') : ((t?.labels as Record<string, string>)?.no ?? 'No')}</Text>
          </View>
          <View style={commonStyles.gridHalf}>
            <Text style={[commonStyles.label, { fontSize: 7 }]}>{(t?.labels as Record<string, string>)?.registration ?? 'Registered'}</Text>
            <Text style={[commonStyles.text, { fontSize: 9 }]}>{data?.hasRegistration ? ((t?.labels as Record<string, string>)?.yes ?? 'Yes') : ((t?.labels as Record<string, string>)?.no ?? 'No')}</Text>
          </View>
        </View>
        <View style={commonStyles.gridRow}>
          <View style={{ flex: 1 }}>
            <Text style={[commonStyles.label, { fontSize: 7 }]}>{(t?.labels as Record<string, string>)?.willingToPayDeposit ?? 'Pet Deposit'}</Text>
            <Text style={[commonStyles.text, { fontSize: 9 }]}>{data?.willingToPayDeposit ? ((t?.labels as Record<string, string>)?.yes ?? 'Yes') : ((t?.labels as Record<string, string>)?.no ?? 'No')}</Text>
          </View>
        </View>
        {data?.medicalConditions && (
          <View style={{ marginTop: 4, paddingTop: 4, borderTopWidth: 1, borderTopColor: colors.light }}>
            <Text style={[commonStyles.label, { fontSize: 7 }]}>{(t?.labels as Record<string, string>)?.medicalConditions ?? (t?.step2Emergency as Record<string, string>)?.displayMedical ?? 'Medizinische Angaben'}</Text>
            <Text style={[commonStyles.text, { fontSize: 8 }]}>{sanitizeForPdf(data.medicalConditions)}</Text>
          </View>
        )}
      </View>
    </View>
  );

  const renderReferenceSection = () => {
    const hasLandlordInfo = data?.previousLandlordName || data?.previousLandlordPhone || data?.previousLandlordEmail;
    const hasEmergencyInfo = data?.emergencyContactName || data?.emergencyContactPhone;
    if (!hasLandlordInfo && !hasEmergencyInfo && !data?.secondaryEmergencyContact) return null;
    const lbl = t?.labels as Record<string, string>;
    return (
      <View style={[commonStyles.sectionBlock, { backgroundColor: '#eff6ff', padding: 8, borderWidth: 1, borderColor: '#bfdbfe' }]} key="reference">
        <Text style={[headingStyle, { marginBottom: 6, paddingBottom: 4, borderBottomWidth: 1, borderBottomColor: '#bfdbfe' }]}>
          {lbl?.referenceTitle ?? (t?.doc as Record<string, string>)?.sectionReference ?? 'References'}
        </Text>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          {hasLandlordInfo && (
            <View style={{ flex: 1 }}>
              <Text style={[commonStyles.label, { marginBottom: 2, fontSize: 7, color: '#1e40af' }]}>{lbl?.previousLandlord ?? 'Previous landlord'}</Text>
              {data?.previousLandlordName && <Text style={[commonStyles.text, { fontWeight: 'bold', fontSize: 9 }]}>{s(data.previousLandlordName)}</Text>}
              {data?.previousDuration && <Text style={[commonStyles.text, { fontSize: 8 }]}>{lbl?.previousDuration ?? 'Duration'}: {s(data.previousDuration)}</Text>}
              {data?.previousLandlordPhone && <Text style={[commonStyles.text, { fontSize: 8 }]}>{s(data.previousLandlordPhone)}</Text>}
              {data?.previousLandlordEmail && <Text style={[commonStyles.text, { fontSize: 8 }]}>{s(data.previousLandlordEmail)}</Text>}
            </View>
          )}
          {hasEmergencyInfo && (
            <View style={{ flex: 1 }}>
              <Text style={[commonStyles.label, { marginBottom: 2, fontSize: 7, color: '#1e40af' }]}>{lbl?.emergencyContact ?? 'Emergency contact'}</Text>
              {data?.emergencyContactName && <Text style={[commonStyles.text, { fontWeight: 'bold', fontSize: 9 }]}>{s(data.emergencyContactName)}</Text>}
              {data?.emergencyContactRelation && <Text style={[commonStyles.text, { fontSize: 8 }]}>{lbl?.emergencyContactRelation ?? 'Relation'}: {s(data.emergencyContactRelation)}</Text>}
              {data?.emergencyContactPhone && <Text style={[commonStyles.text, { fontSize: 8 }]}>{s(data.emergencyContactPhone)}</Text>}
            </View>
          )}
        </View>
        {data?.secondaryEmergencyContact && (
          <View style={{ marginTop: 6, paddingTop: 4, borderTopWidth: 1, borderTopColor: '#bfdbfe' }}>
            <Text style={[commonStyles.text, { fontSize: 8 }]}>{lbl?.secondaryEmergencyContact ?? 'Zweiter Kontakt'}: {s(data.secondaryEmergencyContact)}</Text>
          </View>
        )}
      </View>
    );
  };

  const SECTION_RENDERERS: Record<string, () => React.ReactNode> = {
    photo: renderPhotoSection,
    owner: renderOwnerSection,
    behavior: renderBehaviorSection,
    details: renderDetailsSection,
    description: renderDescriptionSection,
    legal: renderLegalSection,
    reference: renderReferenceSection,
  };

  const renderSection = (sectionId: string) => {
    const renderer = SECTION_RENDERERS[sectionId];
    return renderer ? renderer() : null;
  };

  const footerBranding = ((t?.doc as Record<string, string>)?.footer ?? 'DOKUMENT GENERIERT VIA PET-BEWERBUNG.CH').toUpperCase();

  return (
    <Document title={(t?.doc as Record<string, string>)?.title ?? 'Pet CV'}>
      <Page size="A4" style={pageStyle} wrap>
        <View style={headerStyle}>
          <View style={commonStyles.headerLeft}>
            <View style={headerIconStyle}>
              {logoUrl ? <Image src={logoUrl} style={{ width: 28, height: 28, objectFit: 'contain' }} /> : <Text style={{ color: 'white', fontSize: 14 }}>•</Text>}
            </View>
            <View>
              <Text style={[commonStyles.headerTitle, { color: colors.primary }]}>{(t?.doc as Record<string, string>)?.title ?? 'Pet Dossier'}</Text>
              <Text style={commonStyles.headerSubtitle}>{(t?.doc as Record<string, string>)?.subtitle ?? 'Application document'}</Text>
            </View>
          </View>
          <Text style={commonStyles.headerDate}>{today}</Text>
        </View>

        <View style={commonStyles.mainRow}>
          <View style={commonStyles.sidebar}>{sidebarSections.map((sectionId) => renderSection(sectionId))}</View>
          <View style={commonStyles.main}>{mainSections.map((sectionId) => renderSection(sectionId))}</View>
        </View>

        <View style={footerStyle}>
          {templateType === 'classic' ? (
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Text style={commonStyles.footerBrandingFree}>✦ {footerBranding} ✦</Text>
            </View>
          ) : (
            <Text style={commonStyles.footerBrandingAlt}>pet-bewerbung.ch</Text>
          )}
          <View style={footerSignStyle}>
            <Text>{(t?.doc as Record<string, string>)?.sign ?? 'Signature'}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default PdfDocument;
