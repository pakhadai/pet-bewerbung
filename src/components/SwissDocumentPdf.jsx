import React from 'react';
import {
  Document,
  Page,
  View,
  Text,
  Image,
  StyleSheet,
} from '@react-pdf/renderer';
import { formatAddress, getGenderLabel, formatAge, formatWeight, withFallback, sanitizeForPdf } from '../utils/documentHelpers';
import { INITIAL_DATA } from '../constants';

// Use system fonts so no network required (Helvetica is built-in in react-pdf)
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
    position: 'relative',
  },
  // Watermark overlay for unpaid premium templates
  watermarkOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  watermarkText: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#dc2626',
    opacity: 0.15,
    transform: 'rotate(-45deg)',
    textTransform: 'uppercase',
    letterSpacing: 8,
  },
  watermarkSubtext: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#dc2626',
    opacity: 0.2,
    marginTop: 20,
    transform: 'rotate(-45deg)',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#0f172a',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIcon: {
    width: 32,
    height: 32,
    backgroundColor: '#0f172a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
    textTransform: 'uppercase',
  },
  headerSubtitle: {
    fontSize: 9,
    color: '#64748b',
    marginTop: 2,
    textTransform: 'uppercase',
  },
  headerDate: {
    fontSize: 9,
    color: '#64748b',
  },
  mainRow: {
    flexDirection: 'row',
    flex: 1,
    gap: 24,
    marginTop: 8,
  },
  sidebar: {
    width: '35%',
    gap: 12,
  },
  main: {
    flex: 1,
    gap: 12,
  },
  section: {
    marginBottom: 6,
  },
  sectionBlock: {
    marginBottom: 6,
    minHeight: 30,
  },
  descriptionBlock: {
    marginBottom: 6,
    minHeight: 80,
  },
  sectionHeading: {
    fontSize: 9,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#0f172a',
    color: '#0f172a',
  },
  sectionHeadingModern: {
    borderBottomColor: '#e2e8f0',
  },
  text: {
    fontSize: 10,
    color: '#334155',
    lineHeight: 1.4,
  },
  textBold: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 2,
  },
  label: {
    fontSize: 8,
    textTransform: 'uppercase',
    color: '#64748b',
    marginBottom: 2,
  },
  gridRow: {
    flexDirection: 'row',
    marginBottom: 4,
    gap: 6,
  },
  gridHalf: {
    flex: 1,
  },
  box: {
    backgroundColor: '#f8fafc',
    padding: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 6,
  },
  footer: {
    marginTop: 'auto',
    paddingTop: 16,
    borderTopWidth: 2,
    borderTopColor: '#0f172a',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    minHeight: 50,
  },
  footerGenerated: {
    fontSize: 7,
    textTransform: 'uppercase',
    color: '#64748b',
    letterSpacing: 0.5,
  },
  // FREE template branding - more prominent
  footerBrandingFree: {
    fontSize: 9,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: '#94a3b8',
    letterSpacing: 1,
    textAlign: 'center',
    marginTop: 8,
  },
  // Premium template branding - subtle
  footerBrandingPremium: {
    fontSize: 6,
    color: '#cbd5e1',
    letterSpacing: 0.3,
  },
  footerSign: {
    width: 140,
    borderTopWidth: 1,
    borderTopColor: '#94a3b8',
    paddingTop: 6,
    fontSize: 8,
    textTransform: 'uppercase',
    color: '#475569',
    marginTop: 20,
  },
  photoContainer: {
    width: '100%',
    overflow: 'hidden',
  },
  photoPlaceholder: {
    width: '100%',
    backgroundColor: '#e2e8f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
});

// Template-specific accent colors (match SwissDocument)
const TEMPLATE_COLORS = {
  classic: { primary: '#0f172a', border: '#0f172a', muted: '#64748b', light: '#e2e8f0' },
  modern: { primary: '#334155', border: '#e2e8f0', muted: '#64748b', light: '#f1f5f9' },
  compact: { primary: '#334155', border: '#cbd5e1', muted: '#64748b', light: '#e2e8f0' },
  swiss: { primary: '#dc2626', border: '#dc2626', muted: '#64748b', light: '#fef2f2' },
  friendly: { primary: '#6400f0', border: '#efe5fd', muted: '#130c1d', light: '#efe5fd' },
  grid: { primary: '#D80000', border: '#D80000', muted: '#1a1a1a', light: '#f5f5f5' },
};

// Default customDesign values (Midnight Purple theme)
const DEFAULT_STYLE = {
  primaryColor: '#4a148c',
  secondaryColor: '#f3e5f5',
  backgroundColor: '#ffffff',
  textColor: '#1f2937',
  headerBold: true,
  headerItalic: false,
  bodyBold: false,
  bodyItalic: false,
};

// Default layout order (fixed - no drag & drop)
const DEFAULT_LAYOUT_ORDER = ['photo', 'owner', 'details', 'behavior', 'description', 'legal', 'reference'];

// Sidebar sections (left column)
const SIDEBAR_SECTION_IDS = ['photo', 'owner', 'behavior'];
// Main sections (right column)
const MAIN_SECTION_IDS = ['details', 'description', 'legal', 'reference'];

// Check if customDesign has been modified (isEdited flag from Visual Editor)
const hasCustomDesign = (customDesign) => {
  if (!customDesign) return false;
  return customDesign.isEdited === true;
};

// Helper to get custom style from data.customDesign
const getCustomStyle = (customDesign) => {
  if (!customDesign) return null;
  return {
    // Colors
    primary: customDesign.primaryColor || DEFAULT_STYLE.primaryColor,
    border: customDesign.primaryColor || DEFAULT_STYLE.primaryColor,
    muted: '#64748b',
    light: customDesign.secondaryColor || DEFAULT_STYLE.secondaryColor,
    text: customDesign.textColor || DEFAULT_STYLE.textColor,
    background: customDesign.backgroundColor || DEFAULT_STYLE.backgroundColor,
    // Text styles
    headerBold: customDesign.headerBold ?? DEFAULT_STYLE.headerBold,
    headerItalic: customDesign.headerItalic ?? DEFAULT_STYLE.headerItalic,
    bodyBold: customDesign.bodyBold ?? DEFAULT_STYLE.bodyBold,
    bodyItalic: customDesign.bodyItalic ?? DEFAULT_STYLE.bodyItalic,
  };
};

/**
 * Vector PDF document (react-pdf). Selectable text, small file size, print quality.
 * Supports classic, modern, compact, swiss templates with dynamic section ordering.
 * @param {boolean} showWatermark - If true, shows PREVIEW watermark on document (for unpaid premium)
 */
const SwissDocumentPdf = ({ data, t, templateType = 'classic', logoUrl, qrUrl, showWatermark = false }) => {
  const today = new Date().toLocaleDateString(data?.lang === 'de' ? 'de-CH' : data?.lang === 'fr' ? 'fr-CH' : 'en-GB');
  
  // formatAddress returns { streetLine, cityLine } - destructure correctly
  const { streetLine, cityLine } = formatAddress(
    data?.street,
    data?.houseNumber,
    data?.postal,
    data?.city
  );
  
  // Check if user has customized design (applies to any template)
  const customDesign = data?.customDesign || INITIAL_DATA.customDesign;
  const isCustomized = hasCustomDesign(customDesign);
  const customStyle = isCustomized ? getCustomStyle(customDesign) : null;
  
  // Use custom style if available, otherwise use template default colors
  const colors = customStyle || (TEMPLATE_COLORS[templateType] || TEMPLATE_COLORS.classic);
  
  // Text color (custom or default)
  const textColor = customStyle?.text || '#334155';
  const backgroundColor = customStyle?.background || '#ffffff';
  
  // Font weights (react-pdf uses 'bold' or 'normal')
  const headerFontWeight = customStyle?.headerBold ? 'bold' : 'normal';
  const headerFontStyle = customStyle?.headerItalic ? 'italic' : 'normal';
  const bodyFontWeight = customStyle?.bodyBold ? 'bold' : 'normal';
  const bodyFontStyle = customStyle?.bodyItalic ? 'italic' : 'normal';
  const isSwiss = templateType === 'swiss';
  const isCompact = templateType === 'compact';
  const isModern = templateType === 'modern';
  const isFriendly = templateType === 'friendly';
  const isGrid = templateType === 'grid';

  // Get layout order and hidden sections from customDesign
  const layoutOrder = customDesign?.layoutOrder || DEFAULT_LAYOUT_ORDER;
  const hiddenSections = customDesign?.hiddenSections || [];
  
  // Filter visible sections and split into sidebar/main
  const visibleSections = layoutOrder.filter(id => !hiddenSections.includes(id));
  const sidebarSections = visibleSections.filter(id => SIDEBAR_SECTION_IDS.includes(id));
  const mainSections = visibleSections.filter(id => MAIN_SECTION_IDS.includes(id));

  const pageStyle = [
    styles.page,
    { backgroundColor: backgroundColor, color: textColor },
    isCompact && { padding: 32, fontSize: 9 },
    isSwiss && !isCustomized && { borderTopWidth: 4, borderTopColor: '#dc2626' },
    isCustomized && { borderTopWidth: 4, borderTopColor: colors.primary },
  ];
  const headerStyle = [styles.header, { borderBottomColor: colors.primary }];
  const headingStyle = [
    styles.sectionHeading,
    isModern && styles.sectionHeadingModern,
    { 
      borderBottomColor: isModern ? colors.border : colors.primary, 
      color: colors.primary,
      fontWeight: headerFontWeight,
      fontStyle: headerFontStyle,
    },
  ];
  const textStyle = [
    styles.text,
    { color: textColor, fontWeight: bodyFontWeight, fontStyle: bodyFontStyle },
  ];
  const footerStyle = [styles.footer, { borderTopColor: colors.primary }];
  const footerSignStyle = [styles.footerSign, isSwiss && { borderTopColor: '#f87171' }];
  const boxStyle = [
    styles.box, 
    { 
      borderColor: colors.light, 
      backgroundColor: isCustomized ? colors.light : (isSwiss ? '#fef2f2' : '#f8fafc') 
    }
  ];
  // 3:4 portrait aspect (matches preview PetPhoto aspect-[3/4])
  const photoHeight = isCompact ? 220 : 240;
  const headerIconStyle = [
    styles.headerIcon,
    logoUrl && { backgroundColor: 'white', padding: 2 },
    isSwiss && { borderWidth: 1, borderColor: colors.primary },
  ];

  // ============= SECTION RENDER FUNCTIONS =============
  
  // Photo Section
  const renderPhotoSection = () => (
    <View style={[styles.sectionBlock, styles.photoContainer, { height: photoHeight }]} key="photo">
              {data?.photo && typeof data.photo === 'string' && data.photo.startsWith('data:') ? (
                <Image src={data.photo} style={[styles.photoImg, { height: photoHeight }]} />
              ) : (
                <View style={[styles.photoPlaceholder, { height: photoHeight }]}>
                  <Text style={styles.label}>{t?.doc?.petPhoto ?? 'Photo'}</Text>
                </View>
              )}
            </View>
  );

  // Owner Section
  const renderOwnerSection = () => (
    <View style={styles.sectionBlock} key="owner">
              <Text style={headingStyle}>{t?.doc?.sectionOwner ?? 'Owner'}</Text>
      <View>
                  <Text style={styles.textBold}>{withFallback(data?.ownerName)}</Text>
                  <Text style={styles.text}>{streetLine}</Text>
                  <Text style={styles.text}>{cityLine}</Text>
                  <Text style={[styles.text, { marginTop: 6 }]}>{withFallback(data?.email)}</Text>
                  <Text style={styles.text}>{withFallback(data?.phone)}</Text>
                </View>
      {/* QR Code with label - compact size for A4 readability */}
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
    <View style={styles.sectionBlock} key="behavior">
              <Text style={headingStyle}>{t?.labels?.behaviorTitle ?? t?.doc?.sectionBehavior ?? 'Behavior'}</Text>
              <View style={styles.gridRow}>
                <View style={styles.gridHalf}>
                  <Text style={styles.label}>{t?.labels?.noiseLevel ?? 'Noise'}</Text>
                  <Text style={styles.text}>
                    {data?.noiseLevel === 'low' ? (t?.labels?.noiseLow ?? t?.labels?.low ?? 'Low') : data?.noiseLevel === 'high' ? (t?.labels?.noiseHigh ?? t?.labels?.high ?? 'High') : (t?.labels?.noiseMedium ?? t?.labels?.medium ?? 'Medium')}
                  </Text>
                </View>
                <View style={styles.gridHalf}>
                  <Text style={styles.label}>{t?.labels?.aloneTime ?? 'Alone'}</Text>
                  <Text style={styles.text}>{data?.aloneTime ? `${data.aloneTime}h` : '—'}</Text>
                </View>
              </View>
              {data?.activeHours ? (
                <View style={[styles.gridRow, { marginTop: 4 }]}>
                  <View style={styles.gridHalf}>
                    <Text style={styles.label}>{t?.labels?.activeHours ?? 'Active hours'}</Text>
                    <Text style={styles.text}>{data.activeHours}</Text>
                  </View>
                </View>
              ) : null}
              {(data?.behaviorWithChildren || data?.behaviorWithPets) && (
                <View style={[styles.gridRow, { marginTop: 4 }]}>
                  {data?.behaviorWithChildren && (
                    <View style={styles.gridHalf}>
                      <Text style={styles.label}>{t?.labels?.behaviorWithChildren ?? 'With children'}</Text>
                      <Text style={styles.text}>
                        {data.behaviorWithChildren === 'good' ? (t?.labels?.behaviorGood ?? 'Good') : data.behaviorWithChildren === 'neutral' ? (t?.labels?.behaviorNeutral ?? 'Neutral') : (t?.labels?.behaviorAvoid ?? 'Avoid')}
                      </Text>
                    </View>
                  )}
                  {data?.behaviorWithPets && (
                    <View style={styles.gridHalf}>
                      <Text style={styles.label}>{t?.labels?.behaviorWithPets ?? 'With pets'}</Text>
                      <Text style={styles.text}>
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
    <View style={styles.sectionBlock} key="details">
              <Text style={headingStyle}>{t?.doc?.sectionPet ?? 'Pet'}</Text>
              <View style={styles.gridRow}>
                <View style={styles.gridHalf}>
                  <Text style={styles.label}>{t?.labels?.petName ?? 'Name'}</Text>
                  <Text style={styles.textBold}>{withFallback(data?.name)}</Text>
                </View>
                <View style={styles.gridHalf}>
                  <Text style={styles.label}>{t?.labels?.breed ?? 'Breed'}</Text>
                  <Text style={styles.text}>{withFallback(data?.breed)}</Text>
                </View>
              </View>
              <View style={styles.gridRow}>
                <View style={styles.gridHalf}>
                  <Text style={styles.label}>{t?.labels?.gender ?? 'Gender'} / {t?.labels?.age ?? 'Age'}</Text>
                  <Text style={styles.text}>
                    {getGenderLabel(data?.gender, t)} / {formatAge(data?.age, t)}
                  </Text>
                </View>
                <View style={styles.gridHalf}>
                  <Text style={styles.label}>{t?.labels?.weight ?? 'Weight'}</Text>
                  <Text style={styles.text}>{formatWeight(data?.weight, t)}</Text>
                </View>
              </View>
            </View>
  );

  // Description Section
  const renderDescriptionSection = () => (
    <View style={styles.descriptionBlock} key="description">
              <Text style={headingStyle}>{t?.doc?.sectionAbout ?? 'About'}</Text>
              <Text style={styles.text}>
                {sanitizeForPdf(data?.generatedText) || (t?.ui?.noDescription ?? '—')}
              </Text>
            </View>
  );

  // Legal/Insurance Section - more compact
  const renderLegalSection = () => (
    <View style={styles.sectionBlock} key="legal">
              <View style={boxStyle}>
        <Text style={[headingStyle, { marginBottom: 4 }]}>{t?.doc?.sectionLegal ?? 'Insurance & Legal'}</Text>
                <View style={styles.gridRow}>
                  <View style={styles.gridHalf}>
            <Text style={[styles.label, { fontSize: 7 }]}>{t?.labels?.chipId ?? 'Chip ID'}</Text>
            <Text style={[styles.text, { fontSize: 9 }]}>{withFallback(data?.chipId)}</Text>
                  </View>
                  <View style={styles.gridHalf}>
            <Text style={[styles.label, { fontSize: 7 }]}>{t?.labels?.insurance ?? 'Insurance'}</Text>
            <Text style={[styles.text, { fontSize: 9 }]}>{withFallback(data?.insuranceProvider)}</Text>
                  </View>
                </View>
                <View style={styles.gridRow}>
                  <View style={styles.gridHalf}>
            <Text style={[styles.label, { fontSize: 7 }]}>{t?.labels?.vet ?? 'Vet'}</Text>
            <Text style={[styles.text, { fontSize: 9 }]}>
                      {[data?.vetName, data?.vetPhone].filter(Boolean).join(' · ') || '—'}
                    </Text>
                  </View>
                  <View style={styles.gridHalf}>
            <Text style={[styles.label, { fontSize: 7 }]}>{t?.labels?.neutered ?? 'Neutered'}</Text>
            <Text style={[styles.text, { fontSize: 9 }]}>{data?.isNeutered ? (t?.labels?.yes ?? 'Yes') : (t?.labels?.no ?? 'No')}</Text>
                  </View>
                </View>
        {/* Status row - all 4 items */}
        <View style={[styles.gridRow, { marginTop: 2 }]}>
                  <View style={styles.gridHalf}>
            <Text style={[styles.label, { fontSize: 7 }]}>{t?.labels?.vaccination ?? 'Vaccinated'}</Text>
            <Text style={[styles.text, { fontSize: 9 }]}>{data?.hasVaccination ? (t?.labels?.yes ?? 'Yes') : (t?.labels?.no ?? 'No')}</Text>
                  </View>
                  <View style={styles.gridHalf}>
            <Text style={[styles.label, { fontSize: 7 }]}>{t?.labels?.registration ?? 'Registered'}</Text>
            <Text style={[styles.text, { fontSize: 9 }]}>{data?.hasRegistration ? (t?.labels?.yes ?? 'Yes') : (t?.labels?.no ?? 'No')}</Text>
          </View>
        </View>
        <View style={styles.gridRow}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.label, { fontSize: 7 }]}>{t?.labels?.willingToPayDeposit ?? 'Pet Deposit'}</Text>
            <Text style={[styles.text, { fontSize: 9 }]}>{data?.willingToPayDeposit ? (t?.labels?.yes ?? 'Yes') : (t?.labels?.no ?? 'No')}</Text>
                  </View>
                </View>
                {data?.medicalConditions ? (
          <View style={{ marginTop: 4, paddingTop: 4, borderTopWidth: 1, borderTopColor: colors.light }}>
            <Text style={[styles.label, { fontSize: 7 }]}>{t?.labels?.medicalConditions ?? t?.step2Emergency?.displayMedical ?? 'Medizinische Angaben'}</Text>
            <Text style={[styles.text, { fontSize: 8 }]}>{sanitizeForPdf(data.medicalConditions)}</Text>
                  </View>
                ) : null}
              </View>
            </View>
  );

  // Reference Section - 2 column layout for better space usage
  const renderReferenceSection = () => {
    const hasLandlordInfo = data?.previousLandlordName || data?.previousLandlordPhone || data?.previousLandlordEmail;
    const hasEmergencyInfo = data?.emergencyContactName || data?.emergencyContactPhone;
    
    if (!hasLandlordInfo && !hasEmergencyInfo && !data?.secondaryEmergencyContact) return null;
    
    return (
      <View style={[styles.sectionBlock, { backgroundColor: '#eff6ff', padding: 8, borderWidth: 1, borderColor: '#bfdbfe' }]} key="reference">
        <Text style={[headingStyle, { marginBottom: 6, paddingBottom: 4, borderBottomWidth: 1, borderBottomColor: '#bfdbfe' }]}>
          {t?.labels?.referenceTitle ?? t?.doc?.sectionReference ?? 'References'}
        </Text>
        
        {/* Two column layout */}
        <View style={{ flexDirection: 'row', gap: 12 }}>
          {/* Left: Previous Landlord */}
          {hasLandlordInfo && (
            <View style={{ flex: 1 }}>
              <Text style={[styles.label, { marginBottom: 2, fontSize: 7, color: '#1e40af' }]}>
                {t?.labels?.previousLandlord ?? 'Previous landlord'}
              </Text>
              {data?.previousLandlordName && (
                <Text style={[styles.text, { fontWeight: 'bold', fontSize: 9 }]}>{data.previousLandlordName}</Text>
              )}
              {data?.previousDuration && (
                <Text style={[styles.text, { fontSize: 8 }]}>{t?.labels?.previousDuration ?? 'Duration'}: {data.previousDuration}</Text>
              )}
              {data?.previousLandlordPhone && (
                <Text style={[styles.text, { fontSize: 8 }]}>{data.previousLandlordPhone}</Text>
              )}
              {data?.previousLandlordEmail && (
                <Text style={[styles.text, { fontSize: 8 }]}>{data.previousLandlordEmail}</Text>
              )}
                  </View>
                )}
          
          {/* Right: Emergency Contact */}
          {hasEmergencyInfo && (
            <View style={{ flex: 1 }}>
              <Text style={[styles.label, { marginBottom: 2, fontSize: 7, color: '#1e40af' }]}>
                {t?.labels?.emergencyContact ?? 'Emergency contact'}
              </Text>
              {data?.emergencyContactName && (
                <Text style={[styles.text, { fontWeight: 'bold', fontSize: 9 }]}>{data.emergencyContactName}</Text>
              )}
              {data?.emergencyContactRelation && (
                <Text style={[styles.text, { fontSize: 8 }]}>{t?.labels?.emergencyContactRelation ?? 'Relation'}: {data.emergencyContactRelation}</Text>
              )}
              {data?.emergencyContactPhone && (
                <Text style={[styles.text, { fontSize: 8 }]}>{data.emergencyContactPhone}</Text>
              )}
            </View>
          )}
        </View>
        
        {/* Secondary contact - full width */}
        {data?.secondaryEmergencyContact && (
          <View style={{ marginTop: 6, paddingTop: 4, borderTopWidth: 1, borderTopColor: '#bfdbfe' }}>
            <Text style={[styles.text, { fontSize: 8 }]}>
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

  // ============= FRIENDLY TEMPLATE SPECIFIC STYLES =============
  const friendlyColors = {
    primary: '#6400f0',
    accent: '#efe5fd',
    text: '#130c1d',
    muted: '#64748b',
    border: '#ece6f4',
  };

  const friendlyStyles = {
    page: {
      padding: 32,
      fontSize: 10,
      fontFamily: 'Helvetica',
      backgroundColor: '#ffffff',
    },
    // Header with photo
    header: {
      flexDirection: 'row',
      gap: 20,
      marginBottom: 20,
      alignItems: 'flex-start',
    },
    photoBox: {
      width: 110,
      height: 110,
      borderRadius: 12,
      overflow: 'hidden',
      borderWidth: 3,
      borderColor: friendlyColors.accent,
    },
    headerInfo: {
      flex: 1,
      justifyContent: 'center',
    },
    petName: {
      fontSize: 26,
      fontWeight: 'bold',
      color: friendlyColors.text,
      marginBottom: 2,
    },
    petBreed: {
      fontSize: 12,
      color: friendlyColors.primary,
      fontWeight: 'bold',
      marginBottom: 8,
    },
    infoGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
    infoItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    infoIcon: {
      fontSize: 10,
      color: friendlyColors.primary,
    },
    infoText: {
      fontSize: 9,
      color: friendlyColors.text,
      opacity: 0.8,
    },
    // Content area
    content: {
      flexDirection: 'row',
      gap: 16,
      flex: 1,
    },
    leftColumn: {
      width: '58%',
      gap: 12,
    },
    rightColumn: {
      width: '42%',
      gap: 12,
    },
    // Card style
    card: {
      padding: 12,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: friendlyColors.border,
    },
    cardAccent: {
      padding: 12,
      borderRadius: 12,
      backgroundColor: `${friendlyColors.accent}66`, // semi-transparent
      borderWidth: 1,
      borderColor: friendlyColors.accent,
    },
    cardGradient: {
      padding: 12,
      borderRadius: 12,
      backgroundColor: friendlyColors.primary,
    },
    cardTitle: {
      fontSize: 10,
      fontWeight: 'bold',
      color: friendlyColors.text,
      marginBottom: 8,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    cardTitleWhite: {
      fontSize: 10,
      fontWeight: 'bold',
      color: '#ffffff',
      marginBottom: 8,
    },
    // Tag style
    tag: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      backgroundColor: friendlyColors.accent,
      borderRadius: 12,
      marginRight: 6,
      marginBottom: 6,
    },
    tagText: {
      fontSize: 8,
      color: friendlyColors.primary,
      fontWeight: 'bold',
    },
    // Detail row
    detailRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 4,
      borderBottomWidth: 1,
      borderBottomColor: friendlyColors.border,
    },
    detailLabel: {
      fontSize: 8,
      color: friendlyColors.muted,
    },
    detailValue: {
      fontSize: 8,
      fontWeight: 'bold',
      color: friendlyColors.text,
    },
    // Status badge
    statusBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 6,
      paddingVertical: 3,
      borderRadius: 8,
      marginRight: 6,
    },
    statusBadgeGreen: {
      backgroundColor: '#dcfce7',
    },
    statusBadgeGray: {
      backgroundColor: '#f3f4f6',
    },
    statusText: {
      fontSize: 7,
      fontWeight: 'bold',
    },
    statusTextGreen: {
      color: '#15803d',
    },
    statusTextGray: {
      color: '#6b7280',
    },
    // Footer
    footer: {
      marginTop: 'auto',
      paddingTop: 12,
      borderTopWidth: 2,
      borderTopColor: friendlyColors.border,
      borderTopStyle: 'dashed',
    },
    footerContent: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    footerLeft: {
      flex: 1,
    },
    footerRight: {
      alignItems: 'flex-end',
    },
    signLine: {
      width: 100,
      borderTopWidth: 1,
      borderTopColor: friendlyColors.muted,
      paddingTop: 4,
    },
    signText: {
      fontSize: 7,
      color: friendlyColors.muted,
      textTransform: 'uppercase',
    },
    branding: {
      fontSize: 6,
      color: '#cbd5e1',
      textAlign: 'center',
      marginTop: 8,
    },
  };

  // ============= FRIENDLY TEMPLATE RENDER =============
  if (isFriendly) {
    return (
      <Document title={t?.doc?.title ?? 'Pet CV'}>
        <Page size="A4" style={friendlyStyles.page} wrap>
          {/* Header with Pet Photo */}
          <View style={friendlyStyles.header}>
            <View style={friendlyStyles.photoBox}>
              {data?.photo && typeof data.photo === 'string' && data.photo.startsWith('data:') ? (
                <Image src={data.photo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <View style={{ width: '100%', height: '100%', backgroundColor: friendlyColors.accent, justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ fontSize: 24, color: friendlyColors.primary }}>🐾</Text>
                </View>
              )}
            </View>
            <View style={friendlyStyles.headerInfo}>
              <Text style={friendlyStyles.petName}>{data?.petName || t?.labels?.petName || 'Mein Haustier'}</Text>
              <Text style={friendlyStyles.petBreed}>{data?.breed || t?.labels?.breed || 'Rasse'}</Text>
              <View style={friendlyStyles.infoGrid}>
                <View style={friendlyStyles.infoItem}>
                  <Text style={friendlyStyles.infoText}>🎂 {data?.petAge ? `${data.petAge} ${t?.labels?.years || 'Jahre'}` : '—'}</Text>
                </View>
                <View style={friendlyStyles.infoItem}>
                  <Text style={friendlyStyles.infoText}>⚖️ {data?.weight ? `${data.weight} kg` : '—'}</Text>
                </View>
                <View style={friendlyStyles.infoItem}>
                  <Text style={friendlyStyles.infoText}>
                    {data?.gender === 'male' ? '♂️' : data?.gender === 'female' ? '♀️' : '⚥'} {getGenderLabel(data?.gender, t)}
                  </Text>
                </View>
                <View style={friendlyStyles.infoItem}>
                  <Text style={friendlyStyles.infoText}>📍 {data?.city || '—'}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Content: 2 columns */}
          <View style={friendlyStyles.content}>
            {/* Left Column */}
            <View style={friendlyStyles.leftColumn}>
              {/* About Me */}
              <View style={friendlyStyles.cardAccent}>
                <Text style={friendlyStyles.cardTitle}>ℹ️ {t?.doc?.descTitle || 'Über mich'}</Text>
                <Text style={{ fontSize: 9, lineHeight: 1.4, color: friendlyColors.text, opacity: 0.85 }}>
                  {sanitizeForPdf(data?.description) || t?.doc?.defaultDescription || 'Hier könnte eine Beschreibung stehen...'}
                </Text>
              </View>

              {/* Temperament */}
              <View style={friendlyStyles.card}>
                <Text style={friendlyStyles.cardTitle}>😊 {t?.doc?.behavior || 'Temperament'}</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                  {data?.characteristics && data.characteristics.length > 0 ? (
                    data.characteristics.slice(0, 6).map((trait, i) => (
                      <View key={i} style={friendlyStyles.tag}>
                        <Text style={friendlyStyles.tagText}>{trait}</Text>
                      </View>
                    ))
                  ) : (
                    <>
                      <View style={friendlyStyles.tag}><Text style={friendlyStyles.tagText}>{t?.labels?.friendly || 'Freundlich'}</Text></View>
                      <View style={friendlyStyles.tag}><Text style={friendlyStyles.tagText}>{t?.labels?.playful || 'Verspielt'}</Text></View>
                      <View style={friendlyStyles.tag}><Text style={friendlyStyles.tagText}>{t?.labels?.calm || 'Ruhig'}</Text></View>
                    </>
                  )}
                </View>
                {/* Behavior indicators */}
                <View style={{ marginTop: 10, paddingTop: 8, borderTopWidth: 1, borderTopColor: friendlyColors.border, flexDirection: 'row', gap: 16 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Text style={{ fontSize: 8, color: data?.behaviorWithChildren === 'good' ? '#15803d' : friendlyColors.muted }}>
                      {data?.behaviorWithChildren === 'good' ? '✓' : '✗'}
                    </Text>
                    <Text style={{ fontSize: 8, color: friendlyColors.text, opacity: 0.7 }}>{t?.labels?.goodWithChildren || 'Kinderfreundlich'}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Text style={{ fontSize: 8, color: data?.behaviorWithPets === 'good' ? '#15803d' : friendlyColors.muted }}>
                      {data?.behaviorWithPets === 'good' ? '✓' : '✗'}
                    </Text>
                    <Text style={{ fontSize: 8, color: friendlyColors.text, opacity: 0.7 }}>{t?.labels?.goodWithAnimals || 'Tierfreundlich'}</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Right Column */}
            <View style={friendlyStyles.rightColumn}>
              {/* Owner Info - Gradient Card */}
              <View style={friendlyStyles.cardGradient}>
                <Text style={friendlyStyles.cardTitleWhite}>👤 {t?.doc?.ownerTitle || 'Halter'}</Text>
                <View style={{ gap: 6 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={{ fontSize: 9, color: 'rgba(255,255,255,0.8)' }}>🪪</Text>
                    <Text style={{ fontSize: 9, color: '#ffffff' }}>{data?.ownerName || '—'}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={{ fontSize: 9, color: 'rgba(255,255,255,0.8)' }}>🏠</Text>
                    <Text style={{ fontSize: 9, color: '#ffffff' }}>{streetLine}, {cityLine}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={{ fontSize: 9, color: 'rgba(255,255,255,0.8)' }}>📞</Text>
                    <Text style={{ fontSize: 9, color: '#ffffff' }}>{data?.phone || '—'}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={{ fontSize: 9, color: 'rgba(255,255,255,0.8)' }}>✉️</Text>
                    <Text style={{ fontSize: 9, color: '#ffffff' }}>{data?.email || '—'}</Text>
                  </View>
                </View>
              </View>

              {/* Pet Details Card */}
              <View style={friendlyStyles.card}>
                <Text style={friendlyStyles.cardTitle}>🐾 {t?.doc?.details || 'Details'}</Text>
                <View style={friendlyStyles.detailRow}>
                  <Text style={friendlyStyles.detailLabel}>{t?.labels?.chipId || 'Chip-ID'}</Text>
                  <Text style={friendlyStyles.detailValue}>{data?.chipId || '—'}</Text>
                </View>
                <View style={friendlyStyles.detailRow}>
                  <Text style={friendlyStyles.detailLabel}>{t?.labels?.vet || 'Tierarzt'}</Text>
                  <Text style={friendlyStyles.detailValue}>{data?.vetName || '—'}</Text>
                </View>
                <View style={friendlyStyles.detailRow}>
                  <Text style={friendlyStyles.detailLabel}>{t?.labels?.insurance || 'Versicherung'}</Text>
                  <Text style={friendlyStyles.detailValue}>{data?.insuranceCompany || '—'}</Text>
                </View>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 }}>
                  <View style={[friendlyStyles.statusBadge, data?.isVaccinated === 'yes' ? friendlyStyles.statusBadgeGreen : friendlyStyles.statusBadgeGray]}>
                    <Text style={[friendlyStyles.statusText, data?.isVaccinated === 'yes' ? friendlyStyles.statusTextGreen : friendlyStyles.statusTextGray]}>
                      {data?.isVaccinated === 'yes' ? '✓' : '✗'} {t?.labels?.vaccinated || 'Geimpft'}
                    </Text>
                  </View>
                  <View style={[friendlyStyles.statusBadge, data?.isNeutered === 'yes' ? friendlyStyles.statusBadgeGreen : friendlyStyles.statusBadgeGray]}>
                    <Text style={[friendlyStyles.statusText, data?.isNeutered === 'yes' ? friendlyStyles.statusTextGreen : friendlyStyles.statusTextGray]}>
                      {data?.isNeutered === 'yes' ? '✓' : '✗'} {t?.labels?.neutered || 'Kastriert'}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Footer */}
          <View style={friendlyStyles.footer}>
            <View style={friendlyStyles.footerContent}>
              {/* Reference Quote */}
              <View style={friendlyStyles.footerLeft}>
                {data?.previousLandlordName && (
                  <View style={{ backgroundColor: '#f7f5f8', padding: 8, borderRadius: 8, borderLeftWidth: 3, borderLeftColor: friendlyColors.primary }}>
                    <Text style={{ fontSize: 8, color: friendlyColors.muted, fontStyle: 'italic', marginBottom: 4 }}>
                      "{data?.landlordReference || t?.doc?.landlordReference || 'Guter Mieter mit wohlerzogenem Haustier.'}"
                    </Text>
                    <Text style={{ fontSize: 8, fontWeight: 'bold', color: friendlyColors.text }}>
                      — {data.previousLandlordName}
                    </Text>
                  </View>
                )}
              </View>
              {/* Signature */}
              <View style={friendlyStyles.footerRight}>
                <View style={friendlyStyles.signLine}>
                  <Text style={friendlyStyles.signText}>{data?.ownerName || t?.doc?.sign || 'Unterschrift'}</Text>
                </View>
              </View>
            </View>
            <Text style={friendlyStyles.branding}>pet-bewerbung.ch</Text>
          </View>

          {/* Watermark overlay for unpaid premium templates */}
          {showWatermark && (
            <View style={styles.watermarkOverlay} fixed>
              <Text style={styles.watermarkText}>MUSTER</Text>
              <Text style={styles.watermarkSubtext}>PREVIEW</Text>
            </View>
          )}
        </Page>
      </Document>
    );
  }

  // ============= GRID TEMPLATE SPECIFIC STYLES =============
  const gridColors = {
    primary: '#D80000',
    accent: '#f5f5f5',
    text: '#1a1a1a',
    muted: '#9ca3af',
    border: '#e5e7eb',
  };

  const gridStyles = {
    page: {
      padding: 32,
      fontSize: 10,
      fontFamily: 'Helvetica',
      backgroundColor: '#ffffff',
    },
    // Header
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      borderBottomWidth: 4,
      borderBottomColor: gridColors.primary,
      paddingBottom: 16,
      marginBottom: 20,
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    headerIcon: {
      width: 48,
      height: 48,
      backgroundColor: gridColors.primary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#000000',
      textTransform: 'uppercase',
      letterSpacing: -0.5,
    },
    headerSubtitle: {
      fontSize: 8,
      color: gridColors.muted,
      textTransform: 'uppercase',
      letterSpacing: 2,
      marginTop: 2,
    },
    headerDate: {
      fontSize: 18,
      fontWeight: 'bold',
      fontFamily: 'Courier',
    },
    headerDateLabel: {
      fontSize: 8,
      fontWeight: 'bold',
      color: gridColors.muted,
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginBottom: 2,
    },
    // Content
    content: {
      flexDirection: 'row',
      gap: 24,
      flex: 1,
    },
    leftColumn: {
      width: '33%',
      gap: 16,
    },
    rightColumn: {
      width: '67%',
      gap: 16,
    },
    // Photo
    photoBox: {
      width: '100%',
      aspectRatio: 0.75,
      backgroundColor: gridColors.accent,
      borderWidth: 1,
      borderColor: gridColors.border,
      padding: 6,
    },
    // Section
    sectionTitle: {
      fontSize: 8,
      fontWeight: 'bold',
      color: '#000000',
      textTransform: 'uppercase',
      letterSpacing: 1,
      borderBottomWidth: 2,
      borderBottomColor: '#000000',
      paddingBottom: 4,
      marginBottom: 8,
    },
    sectionTitleIcon: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      fontSize: 10,
      fontWeight: 'bold',
      color: '#000000',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      borderBottomWidth: 1,
      borderBottomColor: gridColors.border,
      paddingBottom: 6,
      marginBottom: 10,
    },
    // Pet name
    petName: {
      fontSize: 48,
      fontWeight: 'bold',
      color: '#000000',
      letterSpacing: -2,
      marginBottom: 4,
    },
    petTagContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 12,
    },
    petTag: {
      backgroundColor: gridColors.primary,
      color: '#ffffff',
      fontSize: 8,
      fontWeight: 'bold',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      paddingHorizontal: 6,
      paddingVertical: 2,
    },
    petLocation: {
      fontSize: 14,
      color: gridColors.muted,
      fontWeight: 'light',
    },
    // Description
    descriptionBox: {
      backgroundColor: gridColors.accent,
      padding: 14,
      borderLeftWidth: 4,
      borderLeftColor: gridColors.primary,
    },
    descriptionTitle: {
      fontSize: 8,
      fontWeight: 'bold',
      color: gridColors.primary,
      textTransform: 'uppercase',
      letterSpacing: 2,
      marginBottom: 6,
    },
    descriptionText: {
      fontSize: 9,
      lineHeight: 1.5,
      color: '#374151',
      textAlign: 'justify',
    },
    // Progress bar
    progressContainer: {
      marginBottom: 12,
    },
    progressLabel: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      fontSize: 8,
      fontWeight: 'bold',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginBottom: 4,
    },
    progressBar: {
      height: 6,
      backgroundColor: '#e5e7eb',
      width: '100%',
    },
    progressFill: {
      height: 6,
      backgroundColor: gridColors.primary,
    },
    // Tags
    tag: {
      paddingHorizontal: 6,
      paddingVertical: 3,
      backgroundColor: '#ffffff',
      borderWidth: 1,
      borderColor: gridColors.border,
      marginRight: 4,
      marginBottom: 4,
    },
    tagText: {
      fontSize: 7,
      fontWeight: 'bold',
      textTransform: 'uppercase',
      letterSpacing: 0.3,
      color: '#6b7280',
    },
    // Checkbox
    checkboxRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontSize: 9,
      fontWeight: 'medium',
      padding: 6,
      backgroundColor: gridColors.accent,
      borderWidth: 1,
      borderColor: gridColors.border,
      marginBottom: 4,
    },
    checkbox: {
      width: 14,
      height: 14,
      borderWidth: 1,
      borderColor: '#d1d5db',
      backgroundColor: '#ffffff',
      justifyContent: 'center',
      alignItems: 'center',
    },
    checkboxChecked: {
      fontSize: 10,
      fontWeight: 'bold',
      color: gridColors.primary,
    },
    // Detail row
    detailRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      borderBottomWidth: 1,
      borderBottomColor: gridColors.accent,
      paddingVertical: 3,
    },
    detailLabel: {
      fontSize: 8,
      fontWeight: 'bold',
      color: gridColors.muted,
      textTransform: 'uppercase',
    },
    detailValue: {
      fontSize: 9,
      fontWeight: 'bold',
      textAlign: 'right',
    },
    // Reference
    referenceBox: {
      backgroundColor: gridColors.accent,
      padding: 10,
      borderWidth: 1,
      borderColor: gridColors.border,
      marginBottom: 8,
    },
    referenceQuote: {
      fontSize: 9,
      fontStyle: 'italic',
      color: '#6b7280',
      marginBottom: 6,
    },
    referenceName: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    referenceBar: {
      width: 12,
      height: 2,
      backgroundColor: gridColors.primary,
    },
    referenceNameText: {
      fontSize: 8,
      fontWeight: 'bold',
      textTransform: 'uppercase',
    },
    // Footer
    footer: {
      marginTop: 'auto',
      paddingTop: 16,
      borderTopWidth: 2,
      borderTopColor: gridColors.border,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
    },
    footerBrand: {
      fontSize: 14,
      fontWeight: 'bold',
      color: gridColors.primary,
    },
    footerCopyright: {
      fontSize: 7,
      color: gridColors.muted,
      textTransform: 'uppercase',
      letterSpacing: 2,
      marginTop: 2,
    },
    footerSign: {
      width: 140,
      borderTopWidth: 1,
      borderTopColor: '#000000',
      paddingTop: 4,
    },
    footerSignText: {
      fontSize: 7,
      textTransform: 'uppercase',
      letterSpacing: 2,
      color: gridColors.muted,
      fontWeight: 'bold',
      textAlign: 'right',
    },
  };

  // ============= GRID TEMPLATE RENDER =============
  if (isGrid) {
    // Helper functions for progress bars
    const getNoiseLevelPercent = () => {
      if (data?.noiseLevel === 'low') return 20;
      if (data?.noiseLevel === 'high') return 85;
      return 50;
    };
    
    const getAloneTimePercent = () => {
      const hours = parseInt(data?.aloneTime) || 0;
      return Math.min(100, (hours / 8) * 100);
    };

    return (
      <Document title={t?.doc?.title ?? 'Pet CV'}>
        <Page size="A4" style={gridStyles.page} wrap>
          {/* Header */}
          <View style={gridStyles.header}>
            <View style={gridStyles.headerLeft}>
              <View style={gridStyles.headerIcon}>
                <Text style={{ fontSize: 24, color: '#ffffff' }}>🐾</Text>
              </View>
                  <View>
                <Text style={gridStyles.headerTitle}>Tierhalter-{'\n'}Referenzblatt</Text>
                <Text style={gridStyles.headerSubtitle}>Dokument-ID: #{data?.chipId?.slice(-4) || 'XXXX'}-CH</Text>
              </View>
            </View>
            <View style={{ textAlign: 'right' }}>
              <Text style={gridStyles.headerDateLabel}>{t?.labels?.date || 'Erstellungsdatum'}</Text>
              <Text style={gridStyles.headerDate}>{today}</Text>
            </View>
          </View>

          {/* Content: 2 columns */}
          <View style={gridStyles.content}>
            {/* Left Column */}
            <View style={gridStyles.leftColumn}>
              {/* Photo */}
              <View style={gridStyles.photoBox}>
                {data?.photo && typeof data.photo === 'string' && data.photo.startsWith('data:') ? (
                  <Image src={data.photo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <View style={{ width: '100%', height: '100%', backgroundColor: gridColors.accent, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 32, color: gridColors.muted }}>🐕</Text>
                  </View>
                )}
              </View>

              {/* Owner */}
              <View>
                <Text style={gridStyles.sectionTitle}>{t?.doc?.ownerTitle || 'Halter'} / Owner</Text>
                <View style={{ gap: 2 }}>
                  <Text style={{ fontSize: 12, fontWeight: 'bold' }}>{data?.ownerName || '—'}</Text>
                  <Text style={{ fontSize: 9 }}>{streetLine}</Text>
                  <Text style={{ fontSize: 9 }}>{cityLine}</Text>
                  <View style={{ marginTop: 6, gap: 3 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                      <Text style={{ fontSize: 10, color: gridColors.primary }}>📞</Text>
                      <Text style={{ fontSize: 9, fontWeight: 'medium' }}>{data?.phone || '—'}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                      <Text style={{ fontSize: 10, color: gridColors.primary }}>✉️</Text>
                      <Text style={{ fontSize: 9 }}>{data?.email || '—'}</Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Details */}
              <View>
                <Text style={gridStyles.sectionTitle}>{t?.doc?.details || 'Details'}</Text>
                <View style={gridStyles.detailRow}>
                  <Text style={gridStyles.detailLabel}>{t?.labels?.breed || 'Rasse'}</Text>
                  <Text style={gridStyles.detailValue}>{data?.breed || '—'}</Text>
                </View>
                <View style={gridStyles.detailRow}>
                  <Text style={gridStyles.detailLabel}>{t?.labels?.gender || 'Geschlecht'}</Text>
                  <Text style={gridStyles.detailValue}>{getGenderLabel(data?.gender, t)}</Text>
                </View>
                <View style={gridStyles.detailRow}>
                  <Text style={gridStyles.detailLabel}>{t?.labels?.age || 'Alter'}</Text>
                  <Text style={gridStyles.detailValue}>{data?.petAge ? `${data.petAge} Jahre` : '—'}</Text>
                </View>
                <View style={gridStyles.detailRow}>
                  <Text style={gridStyles.detailLabel}>{t?.labels?.weight || 'Gewicht'}</Text>
                  <Text style={gridStyles.detailValue}>{data?.weight ? `${data.weight} kg` : '—'}</Text>
                </View>
              </View>
            </View>

            {/* Right Column */}
            <View style={gridStyles.rightColumn}>
              {/* Pet Name */}
              <View>
                <Text style={gridStyles.petName}>{(data?.petName || 'NAME').toUpperCase()}</Text>
                <View style={gridStyles.petTagContainer}>
                  <View style={gridStyles.petTag}>
                    <Text style={{ color: '#ffffff', fontSize: 8, fontWeight: 'bold' }}>Available for Rent</Text>
                  </View>
                  <Text style={gridStyles.petLocation}>{data?.city || '—'}, Schweiz</Text>
                </View>
              </View>

              {/* Description */}
              <View style={gridStyles.descriptionBox}>
                <Text style={gridStyles.descriptionTitle}>{t?.doc?.descTitle || 'Charakterbeschreibung'}</Text>
                <Text style={gridStyles.descriptionText}>
                  {sanitizeForPdf(data?.description || data?.generatedText) || t?.doc?.defaultDescription || 'Hier könnte eine Beschreibung stehen...'}
                </Text>
              </View>

              {/* Behavior */}
              <View>
                <Text style={gridStyles.sectionTitleIcon}>🧠 {t?.doc?.behaviorTitle || 'Verhalten & Routine'}</Text>
                <View style={{ flexDirection: 'row', gap: 20 }}>
                  <View style={{ flex: 1 }}>
                    {/* Noise */}
                    <View style={gridStyles.progressContainer}>
                      <View style={gridStyles.progressLabel}>
                        <Text>{t?.labels?.noiseLevel || 'Lärmempfindlichkeit'}</Text>
                        <Text style={{ color: gridColors.primary }}>{data?.noiseLevel === 'low' ? 'Niedrig' : data?.noiseLevel === 'high' ? 'Hoch' : 'Mittel'}</Text>
                      </View>
                      <View style={gridStyles.progressBar}>
                        <View style={[gridStyles.progressFill, { width: `${getNoiseLevelPercent()}%` }]} />
                      </View>
                    </View>
                    {/* Alone Time */}
                    <View style={gridStyles.progressContainer}>
                      <View style={gridStyles.progressLabel}>
                        <Text>{t?.labels?.aloneTime || 'Alleine bleiben'}</Text>
                        <Text style={{ color: gridColors.primary }}>{data?.aloneTime ? `${data.aloneTime} Std.` : '—'}</Text>
                      </View>
                      <View style={gridStyles.progressBar}>
                        <View style={[gridStyles.progressFill, { width: `${getAloneTimePercent()}%` }]} />
                      </View>
                    </View>
                  </View>
                  <View style={{ flex: 1 }}>
                    {/* Activity */}
                    <View style={gridStyles.progressContainer}>
                      <View style={gridStyles.progressLabel}>
                        <Text>{t?.labels?.activityLevel || 'Aktivitätslevel'}</Text>
                        <Text style={{ color: gridColors.primary }}>Hoch</Text>
                      </View>
                      <View style={gridStyles.progressBar}>
                        <View style={[gridStyles.progressFill, { width: '85%' }]} />
                      </View>
                    </View>
                    {/* Tags */}
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 4 }}>
                      {data?.behaviorWithChildren === 'good' && (
                        <View style={gridStyles.tag}><Text style={gridStyles.tagText}>Kinderlieb</Text></View>
                      )}
                      {data?.behaviorWithPets === 'good' && (
                        <View style={gridStyles.tag}><Text style={gridStyles.tagText}>Sozial</Text></View>
                      )}
                      <View style={gridStyles.tag}><Text style={gridStyles.tagText}>Stubenrein</Text></View>
                    </View>
                  </View>
                </View>
              </View>

              {/* Legal */}
              <View>
                <Text style={gridStyles.sectionTitleIcon}>🛡️ {t?.doc?.legalTitle || 'Rechtliches & Gesundheit'}</Text>
                <View style={{ flexDirection: 'row', gap: 16 }}>
                  {/* Checkboxes */}
                  <View style={{ flex: 1 }}>
                    <View style={gridStyles.checkboxRow}>
                      <Text>{t?.labels?.chipped || 'Gechipt'}</Text>
                      <View style={gridStyles.checkbox}>
                        {data?.chipId && <Text style={gridStyles.checkboxChecked}>✓</Text>}
                      </View>
                    </View>
                    <View style={gridStyles.checkboxRow}>
                      <Text>{t?.labels?.vaccinated || 'Geimpft'}</Text>
                      <View style={gridStyles.checkbox}>
                        {data?.hasVaccination && <Text style={gridStyles.checkboxChecked}>✓</Text>}
                      </View>
                    </View>
                    <View style={gridStyles.checkboxRow}>
                      <Text>{t?.labels?.neutered || 'Kastriert'}</Text>
                      <View style={gridStyles.checkbox}>
                        {data?.isNeutered && <Text style={gridStyles.checkboxChecked}>✓</Text>}
                      </View>
                    </View>
                  </View>
                  {/* Details */}
                  <View style={{ flex: 1, borderLeftWidth: 2, borderLeftColor: gridColors.accent, paddingLeft: 12 }}>
                    <View style={{ marginBottom: 6 }}>
                      <Text style={{ fontSize: 7, fontWeight: 'bold', color: gridColors.muted, textTransform: 'uppercase', letterSpacing: 2 }}>{t?.labels?.chipId || 'Chip-Nummer'}</Text>
                      <Text style={{ fontSize: 9, fontFamily: 'Courier', fontWeight: 'medium' }}>{data?.chipId || '—'}</Text>
                    </View>
                    <View style={{ marginBottom: 6 }}>
                      <Text style={{ fontSize: 7, fontWeight: 'bold', color: gridColors.muted, textTransform: 'uppercase', letterSpacing: 2 }}>{t?.labels?.insurance || 'Versicherung'}</Text>
                      <Text style={{ fontSize: 9, fontWeight: 'medium' }}>{data?.insuranceProvider || '—'}</Text>
                    </View>
                    <View>
                      <Text style={{ fontSize: 7, fontWeight: 'bold', color: gridColors.muted, textTransform: 'uppercase', letterSpacing: 2 }}>{t?.labels?.vet || 'Tierarzt'}</Text>
                      <Text style={{ fontSize: 9, fontWeight: 'medium' }}>{data?.vetName || '—'}</Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* References */}
              {data?.previousLandlordName && (
                <View>
                  <Text style={gridStyles.sectionTitleIcon}>💬 {t?.doc?.referenceTitle || 'Referenzen'}</Text>
                  <View style={gridStyles.referenceBox}>
                    <Text style={gridStyles.referenceQuote}>
                      "{data?.landlordReference || t?.doc?.landlordQuote || 'War ein Vergnügen, dieses Tier im Gebäude zu haben.'}"
                    </Text>
                    <View style={gridStyles.referenceName}>
                      <View style={gridStyles.referenceBar} />
                      <Text style={gridStyles.referenceNameText}>{data.previousLandlordName}, Früherer Vermieter</Text>
                    </View>
                  </View>
                </View>
              )}
            </View>
          </View>

          {/* Footer */}
          <View style={gridStyles.footer}>
            <View>
              <Text style={gridStyles.footerBrand}>Pet-Bewerbung.ch</Text>
              <Text style={gridStyles.footerCopyright}>Swiss Standard Pet Resume • © {new Date().getFullYear()}</Text>
            </View>
            <View style={gridStyles.footerSign}>
              <Text style={gridStyles.footerSignText}>{t?.doc?.sign || 'Unterschrift Halter'}</Text>
            </View>
          </View>

          {/* Watermark overlay for unpaid premium templates */}
          {showWatermark && (
            <View style={styles.watermarkOverlay} fixed>
              <Text style={styles.watermarkText}>MUSTER</Text>
              <Text style={styles.watermarkSubtext}>PREVIEW</Text>
            </View>
          )}
        </Page>
      </Document>
    );
  }

  // ============= STANDARD TEMPLATES RENDER =============
  return (
    <Document title={t?.doc?.title ?? 'Pet CV'}>
      <Page size="A4" style={pageStyle} wrap>
        {/* Header */}
        <View style={headerStyle}>
          <View style={styles.headerLeft}>
            <View style={headerIconStyle}>
              {logoUrl ? (
                <Image src={logoUrl} style={{ width: 28, height: 28, objectFit: 'contain' }} />
              ) : (
                <Text style={{ color: 'white', fontSize: 14 }}>•</Text>
              )}
            </View>
            <View>
              <Text style={[styles.headerTitle, { color: colors.primary }]}>{t?.doc?.title ?? 'Pet Dossier'}</Text>
              <Text style={[styles.headerSubtitle, isSwiss && { color: colors.primary, fontWeight: 600 }]}>{t?.doc?.subtitle ?? 'Application document'}</Text>
            </View>
          </View>
          <Text style={styles.headerDate}>
            {today}
          </Text>
        </View>

        {/* Main: sidebar + content - Dynamic section rendering */}
        <View style={styles.mainRow}>
          <View style={styles.sidebar}>
            {sidebarSections.map(sectionId => renderSection(sectionId))}
          </View>

          <View style={styles.main}>
            {mainSections.map(sectionId => renderSection(sectionId))}
          </View>
        </View>

        {/* Footer */}
        <View style={footerStyle}>
          {/* FREE template (classic) - prominent branding centered under border */}
          {templateType === 'classic' ? (
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Text style={styles.footerBrandingFree}>
                ✦ DOKUMENT GENERIERT VIA PET-BEWERBUNG.CH ✦
          </Text>
            </View>
          ) : (
            /* Premium templates - subtle branding on left */
            <Text style={styles.footerBrandingPremium}>
              pet-bewerbung.ch
            </Text>
          )}
          <View style={footerSignStyle}>
            <Text>{t?.doc?.sign ?? 'Signature'}</Text>
          </View>
        </View>
        
        {/* Watermark overlay for unpaid premium templates */}
        {showWatermark && (
          <View style={styles.watermarkOverlay} fixed>
            <Text style={styles.watermarkText}>MUSTER</Text>
            <Text style={styles.watermarkSubtext}>PREVIEW</Text>
          </View>
        )}
      </Page>
    </Document>
  );
};

export default SwissDocumentPdf;
