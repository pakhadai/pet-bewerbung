/**
 * Classic PDF Template - Free tier template with prominent branding
 * Layout: Standard sidebar (35%) + main content (65%)
 * Theme: Black/slate colors, clean professional design
 * Branding: Prominent centered footer
 */

import React from 'react';
import {
  Document,
  Page,
  View,
  Text,
  Image,
} from '@react-pdf/renderer';
import {
  commonStyles,
  TEMPLATE_COLORS,
  getCustomStyle,
  hasCustomDesign,
  getLayoutSections,
  Watermark,
  getLocale,
  INITIAL_DATA,
} from '../PdfBase';
import { formatAddress, getGenderLabel, formatAge, formatWeight, withFallback, sanitizeForPdf } from '../../../utils/documentHelpers';

/**
 * Get Classic template configuration
 */
export const getPdfClassicConfig = (data, t) => {
  const today = new Date().toLocaleDateString(getLocale(data?.lang));
  return {
    templateType: 'classic',
    dateLabel: today,
    photoHeight: 240,
  };
};

/**
 * Classic PDF Template Component (also handles Modern, Compact, Swiss variants)
 */
const ClassicPdf = ({ data, t, logoUrl, qrUrl, showWatermark = false, templateType = 'classic' }) => {
  const customDesign = data?.customDesign || INITIAL_DATA.customDesign;
  const isCustomized = hasCustomDesign(customDesign);
  const customStyle = isCustomized ? getCustomStyle(customDesign) : null;

  // Use custom style if available, otherwise use template default colors
  const colors = customStyle || (TEMPLATE_COLORS[templateType] || TEMPLATE_COLORS.classic);

  // Template type flags
  const isSwiss = templateType === 'swiss';
  const isCompact = templateType === 'compact';
  const isModern = templateType === 'modern';

  // Text color and background
  const textColor = customStyle?.text || '#334155';
  const backgroundColor = customStyle?.background || '#ffffff';

  // Font weights & sizes (react-pdf uses 'bold' or 'normal')
  const headerFontWeight = customStyle?.headerBold ? 'bold' : 'normal';
  const headerFontStyle = customStyle?.headerItalic ? 'italic' : 'normal';
  const bodyFontWeight = customStyle?.bodyBold ? 'bold' : 'normal';
  const bodyFontStyle = customStyle?.bodyItalic ? 'italic' : 'normal';
  const headerFontSize = customDesign?.headerFontSize || 9;
  const bodyFontSize = customDesign?.bodyFontSize || 10;

  // Get layout sections
  const { sidebarSections, mainSections } = getLayoutSections(customDesign);

  // Format address
  const { streetLine, cityLine } = formatAddress(
    data?.street,
    data?.houseNumber,
    data?.postal,
    data?.city
  );

  const today = new Date().toLocaleDateString(getLocale(data?.lang));
  const photoHeight = isCompact ? 220 : 240;

  // Dynamic styles
  const pageStyle = [
    commonStyles.page,
    { backgroundColor: backgroundColor, color: textColor },
    isCompact && { padding: 32, fontSize: 9 },
    isSwiss && !isCustomized && { borderTopWidth: 4, borderTopColor: '#dc2626' },
    isCustomized && { borderTopWidth: 4, borderTopColor: colors.primary },
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
  const footerSignStyle = [commonStyles.footerSign, isSwiss && { borderTopColor: '#f87171' }];
  const boxStyle = [
    commonStyles.box,
    {
      borderColor: colors.light,
      backgroundColor: isCustomized ? colors.light : (isSwiss ? '#fef2f2' : '#f8fafc')
    }
  ];
  const headerIconStyle = [
    commonStyles.headerIcon,
    logoUrl && { backgroundColor: 'white', padding: 2 },
    isSwiss && { borderWidth: 1, borderColor: colors.primary },
  ];

  // ============= SECTION RENDER FUNCTIONS =============

  // Photo Section
  const renderPhotoSection = () => (
    <View style={[commonStyles.sectionBlock, commonStyles.photoContainer, { height: photoHeight }]} key="photo">
      {data?.photo && typeof data.photo === 'string' && data.photo.startsWith('data:') ? (
        <Image src={data.photo} style={[commonStyles.photoImg, { height: photoHeight }]} />
      ) : (
        <View style={[commonStyles.photoPlaceholder, { height: photoHeight }]}>
          <Text style={commonStyles.label}>{t?.doc?.petPhoto ?? 'Photo'}</Text>
        </View>
      )}
    </View>
  );

  // Owner Section
  const renderOwnerSection = () => (
    <View style={commonStyles.sectionBlock} key="owner">
      <Text style={headingStyle}>{t?.doc?.sectionOwner ?? 'Owner'}</Text>
      <View>
        <Text style={commonStyles.textBold}>{withFallback(data?.ownerName)}</Text>
        <Text style={commonStyles.text}>{streetLine}</Text>
        <Text style={commonStyles.text}>{cityLine}</Text>
        <Text style={[commonStyles.text, { marginTop: 6 }]}>{withFallback(data?.email)}</Text>
        <Text style={commonStyles.text}>{withFallback(data?.phone)}</Text>
      </View>
      {/* QR Code with label */}
      {qrUrl && (
        <View style={{
          marginTop: 10,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
          paddingTop: 8,
          borderTopWidth: 1,
          borderTopColor: colors.light,
          borderTopStyle: 'dashed'
        }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 7, color: colors.muted, textTransform: 'uppercase', letterSpacing: 0.3 }}>
              {t?.doc?.qrLabel ?? 'Kontakt scannen'}
            </Text>
            <Text style={{ fontSize: 6, color: colors.muted, marginTop: 2 }}>
              {t?.doc?.qrHint ?? 'vCard hinzufügen'}
            </Text>
          </View>
          <Image src={qrUrl} style={{ width: 75, height: 75 }} />
        </View>
      )}
    </View>
  );

  // Behavior Section
  const renderBehaviorSection = () => (
    <View style={commonStyles.sectionBlock} key="behavior">
      <Text style={headingStyle}>{t?.labels?.behaviorTitle ?? t?.doc?.sectionBehavior ?? 'Behavior'}</Text>
      <View style={commonStyles.gridRow}>
        <View style={commonStyles.gridHalf}>
          <Text style={commonStyles.label}>{t?.labels?.noiseLevel ?? 'Noise'}</Text>
          <Text style={commonStyles.text}>
            {data?.noiseLevel === 'low' ? (t?.labels?.noiseLow ?? t?.labels?.low ?? 'Low') : data?.noiseLevel === 'high' ? (t?.labels?.noiseHigh ?? t?.labels?.high ?? 'High') : (t?.labels?.noiseMedium ?? t?.labels?.medium ?? 'Medium')}
          </Text>
        </View>
        <View style={commonStyles.gridHalf}>
          <Text style={commonStyles.label}>{t?.labels?.aloneTime ?? 'Alone'}</Text>
          <Text style={commonStyles.text}>{data?.aloneTime ? `${data.aloneTime}h` : '—'}</Text>
        </View>
      </View>
      {data?.activeHours ? (
        <View style={[commonStyles.gridRow, { marginTop: 4 }]}>
          <View style={commonStyles.gridHalf}>
            <Text style={commonStyles.label}>{t?.labels?.activeHours ?? 'Active hours'}</Text>
            <Text style={commonStyles.text}>{data.activeHours}</Text>
          </View>
        </View>
      ) : null}
      {(data?.behaviorWithChildren || data?.behaviorWithPets) && (
        <View style={[commonStyles.gridRow, { marginTop: 4 }]}>
          {data?.behaviorWithChildren && (
            <View style={commonStyles.gridHalf}>
              <Text style={commonStyles.label}>{t?.labels?.behaviorWithChildren ?? 'With children'}</Text>
              <Text style={commonStyles.text}>
                {data.behaviorWithChildren === 'good' ? (t?.labels?.behaviorGood ?? 'Good') : data.behaviorWithChildren === 'neutral' ? (t?.labels?.behaviorNeutral ?? 'Neutral') : (t?.labels?.behaviorAvoid ?? 'Avoid')}
              </Text>
            </View>
          )}
          {data?.behaviorWithPets && (
            <View style={commonStyles.gridHalf}>
              <Text style={commonStyles.label}>{t?.labels?.behaviorWithPets ?? 'With pets'}</Text>
              <Text style={commonStyles.text}>
                {data.behaviorWithPets === 'good' ? (t?.labels?.behaviorGood ?? 'Good') : data.behaviorWithPets === 'neutral' ? (t?.labels?.behaviorNeutral ?? 'Neutral') : (t?.labels?.behaviorAvoid ?? 'Avoid')}
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );

  // Pet Details Section
  const renderDetailsSection = () => (
    <View style={commonStyles.sectionBlock} key="details">
      <Text style={headingStyle}>{t?.doc?.sectionPet ?? 'Pet'}</Text>
      <View style={commonStyles.gridRow}>
        <View style={commonStyles.gridHalf}>
          <Text style={commonStyles.label}>{t?.labels?.petName ?? 'Name'}</Text>
          <Text style={commonStyles.textBold}>{withFallback(data?.name)}</Text>
        </View>
        <View style={commonStyles.gridHalf}>
          <Text style={commonStyles.label}>{t?.labels?.breed ?? 'Breed'}</Text>
          <Text style={commonStyles.text}>{withFallback(data?.breed)}</Text>
        </View>
      </View>
      <View style={commonStyles.gridRow}>
        <View style={commonStyles.gridHalf}>
          <Text style={commonStyles.label}>{t?.labels?.gender ?? 'Gender'} / {t?.labels?.age ?? 'Age'}</Text>
          <Text style={commonStyles.text}>
            {getGenderLabel(data?.gender, t)} / {formatAge(data?.age, t)}
          </Text>
        </View>
        <View style={commonStyles.gridHalf}>
          <Text style={commonStyles.label}>{t?.labels?.weight ?? 'Weight'}</Text>
          <Text style={commonStyles.text}>{formatWeight(data?.weight, t)}</Text>
        </View>
      </View>
    </View>
  );

  // Description Section
  const renderDescriptionSection = () => (
    <View style={commonStyles.descriptionBlock} key="description">
      <Text style={headingStyle}>{t?.doc?.sectionAbout ?? 'About'}</Text>
      <Text style={textStyle}>
        {sanitizeForPdf(data?.generatedText) || (t?.ui?.noDescription ?? '—')}
      </Text>
    </View>
  );

  // Legal/Insurance Section
  const renderLegalSection = () => (
    <View style={commonStyles.sectionBlock} key="legal">
      <View style={boxStyle}>
        <Text style={[headingStyle, { marginBottom: 4 }]}>{t?.doc?.sectionLegal ?? 'Insurance & Legal'}</Text>
        <View style={commonStyles.gridRow}>
          <View style={commonStyles.gridHalf}>
            <Text style={[commonStyles.label, { fontSize: 7 }]}>{t?.labels?.chipId ?? 'Chip ID'}</Text>
            <Text style={[commonStyles.text, { fontSize: 9 }]}>{withFallback(data?.chipId)}</Text>
          </View>
          <View style={commonStyles.gridHalf}>
            <Text style={[commonStyles.label, { fontSize: 7 }]}>{t?.labels?.insurance ?? 'Insurance'}</Text>
            <Text style={[commonStyles.text, { fontSize: 9 }]}>{withFallback(data?.insuranceProvider)}</Text>
          </View>
        </View>
        <View style={commonStyles.gridRow}>
          <View style={commonStyles.gridHalf}>
            <Text style={[commonStyles.label, { fontSize: 7 }]}>{t?.labels?.vet ?? 'Vet'}</Text>
            <Text style={[commonStyles.text, { fontSize: 9 }]}>
              {[data?.vetName, data?.vetPhone].filter(Boolean).join(' · ') || '—'}
            </Text>
          </View>
          <View style={commonStyles.gridHalf}>
            <Text style={[commonStyles.label, { fontSize: 7 }]}>{t?.labels?.neutered ?? 'Neutered'}</Text>
            <Text style={[commonStyles.text, { fontSize: 9 }]}>{data?.isNeutered ? (t?.labels?.yes ?? 'Yes') : (t?.labels?.no ?? 'No')}</Text>
          </View>
        </View>
        <View style={[commonStyles.gridRow, { marginTop: 2 }]}>
          <View style={commonStyles.gridHalf}>
            <Text style={[commonStyles.label, { fontSize: 7 }]}>{t?.labels?.vaccination ?? 'Vaccinated'}</Text>
            <Text style={[commonStyles.text, { fontSize: 9 }]}>{data?.hasVaccination ? (t?.labels?.yes ?? 'Yes') : (t?.labels?.no ?? 'No')}</Text>
          </View>
          <View style={commonStyles.gridHalf}>
            <Text style={[commonStyles.label, { fontSize: 7 }]}>{t?.labels?.registration ?? 'Registered'}</Text>
            <Text style={[commonStyles.text, { fontSize: 9 }]}>{data?.hasRegistration ? (t?.labels?.yes ?? 'Yes') : (t?.labels?.no ?? 'No')}</Text>
          </View>
        </View>
        <View style={commonStyles.gridRow}>
          <View style={{ flex: 1 }}>
            <Text style={[commonStyles.label, { fontSize: 7 }]}>{t?.labels?.willingToPayDeposit ?? 'Pet Deposit'}</Text>
            <Text style={[commonStyles.text, { fontSize: 9 }]}>{data?.willingToPayDeposit ? (t?.labels?.yes ?? 'Yes') : (t?.labels?.no ?? 'No')}</Text>
          </View>
        </View>
        {data?.medicalConditions ? (
          <View style={{ marginTop: 4, paddingTop: 4, borderTopWidth: 1, borderTopColor: colors.light }}>
            <Text style={[commonStyles.label, { fontSize: 7 }]}>{t?.labels?.medicalConditions ?? t?.step2Emergency?.displayMedical ?? 'Medizinische Angaben'}</Text>
            <Text style={[commonStyles.text, { fontSize: 8 }]}>{sanitizeForPdf(data.medicalConditions)}</Text>
          </View>
        ) : null}
      </View>
    </View>
  );

  // Reference Section
  const renderReferenceSection = () => {
    const hasLandlordInfo = data?.previousLandlordName || data?.previousLandlordPhone || data?.previousLandlordEmail;
    const hasEmergencyInfo = data?.emergencyContactName || data?.emergencyContactPhone;

    if (!hasLandlordInfo && !hasEmergencyInfo && !data?.secondaryEmergencyContact) return null;

    return (
      <View style={[commonStyles.sectionBlock, { backgroundColor: '#eff6ff', padding: 8, borderWidth: 1, borderColor: '#bfdbfe' }]} key="reference">
        <Text style={[headingStyle, { marginBottom: 6, paddingBottom: 4, borderBottomWidth: 1, borderBottomColor: '#bfdbfe' }]}>
          {t?.labels?.referenceTitle ?? t?.doc?.sectionReference ?? 'References'}
        </Text>

        <View style={{ flexDirection: 'row', gap: 12 }}>
          {hasLandlordInfo && (
            <View style={{ flex: 1 }}>
              <Text style={[commonStyles.label, { marginBottom: 2, fontSize: 7, color: '#1e40af' }]}>
                {t?.labels?.previousLandlord ?? 'Previous landlord'}
              </Text>
              {data?.previousLandlordName && (
                <Text style={[commonStyles.text, { fontWeight: 'bold', fontSize: 9 }]}>{data.previousLandlordName}</Text>
              )}
              {data?.previousDuration && (
                <Text style={[commonStyles.text, { fontSize: 8 }]}>{t?.labels?.previousDuration ?? 'Duration'}: {data.previousDuration}</Text>
              )}
              {data?.previousLandlordPhone && (
                <Text style={[commonStyles.text, { fontSize: 8 }]}>{data.previousLandlordPhone}</Text>
              )}
              {data?.previousLandlordEmail && (
                <Text style={[commonStyles.text, { fontSize: 8 }]}>{data.previousLandlordEmail}</Text>
              )}
            </View>
          )}

          {hasEmergencyInfo && (
            <View style={{ flex: 1 }}>
              <Text style={[commonStyles.label, { marginBottom: 2, fontSize: 7, color: '#1e40af' }]}>
                {t?.labels?.emergencyContact ?? 'Emergency contact'}
              </Text>
              {data?.emergencyContactName && (
                <Text style={[commonStyles.text, { fontWeight: 'bold', fontSize: 9 }]}>{data.emergencyContactName}</Text>
              )}
              {data?.emergencyContactRelation && (
                <Text style={[commonStyles.text, { fontSize: 8 }]}>{t?.labels?.emergencyContactRelation ?? 'Relation'}: {data.emergencyContactRelation}</Text>
              )}
              {data?.emergencyContactPhone && (
                <Text style={[commonStyles.text, { fontSize: 8 }]}>{data.emergencyContactPhone}</Text>
              )}
            </View>
          )}
        </View>

        {data?.secondaryEmergencyContact && (
          <View style={{ marginTop: 6, paddingTop: 4, borderTopWidth: 1, borderTopColor: '#bfdbfe' }}>
            <Text style={[commonStyles.text, { fontSize: 8 }]}>
              {t?.labels?.secondaryEmergencyContact ?? 'Zweiter Kontakt'}: {data.secondaryEmergencyContact}
            </Text>
          </View>
        )}
      </View>
    );
  };

  // Section renderer map
  const SECTION_RENDERERS = {
    photo: renderPhotoSection,
    owner: renderOwnerSection,
    behavior: renderBehaviorSection,
    details: renderDetailsSection,
    description: renderDescriptionSection,
    legal: renderLegalSection,
    reference: renderReferenceSection,
  };

  // Render a section by ID
  const renderSection = (sectionId) => {
    const renderer = SECTION_RENDERERS[sectionId];
    return renderer ? renderer() : null;
  };

  return (
    <Document title={t?.doc?.title ?? 'Pet CV'}>
      <Page size="A4" style={pageStyle} wrap>
        {/* Header */}
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
              <Text style={[commonStyles.headerTitle, { color: colors.primary }]}>{t?.doc?.title ?? 'Pet Dossier'}</Text>
              <Text style={commonStyles.headerSubtitle}>{t?.doc?.subtitle ?? 'Application document'}</Text>
            </View>
          </View>
          <Text style={commonStyles.headerDate}>{today}</Text>
        </View>

        {/* Main: sidebar + content */}
        <View style={commonStyles.mainRow}>
          <View style={commonStyles.sidebar}>
            {sidebarSections.map(sectionId => renderSection(sectionId))}
          </View>

          <View style={commonStyles.main}>
            {mainSections.map(sectionId => renderSection(sectionId))}
          </View>
        </View>

        {/* Footer - Prominent branding for classic, subtle for premium */}
        <View style={footerStyle}>
          {templateType === 'classic' ? (
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Text style={commonStyles.footerBrandingFree}>
                ✦ DOKUMENT GENERIERT VIA PET-BEWERBUNG.CH ✦
              </Text>
            </View>
          ) : (
            <Text style={commonStyles.footerBrandingPremium}>
              pet-bewerbung.ch
            </Text>
          )}
          <View style={footerSignStyle}>
            <Text>{t?.doc?.sign ?? 'Signature'}</Text>
          </View>
        </View>

        {/* Watermark overlay for unpaid premium templates */}
        {showWatermark && <Watermark />}
      </Page>
    </Document>
  );
};

export default ClassicPdf;
