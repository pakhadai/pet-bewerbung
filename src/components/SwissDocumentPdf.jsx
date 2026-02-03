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

// Use system fonts so no network required (Helvetica is built-in in react-pdf)
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
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
    marginBottom: 10,
  },
  sectionBlock: {
    marginBottom: 10,
    minHeight: 36,
  },
  descriptionBlock: {
    marginBottom: 10,
    minHeight: 100,
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
    marginBottom: 6,
    gap: 8,
  },
  gridHalf: {
    flex: 1,
  },
  box: {
    backgroundColor: '#f8fafc',
    padding: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 10,
  },
  footer: {
    marginTop: 'auto',
    paddingTop: 12,
    borderTopWidth: 2,
    borderTopColor: '#0f172a',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  footerGenerated: {
    fontSize: 7,
    textTransform: 'uppercase',
    color: '#64748b',
    letterSpacing: 0.5,
  },
  footerSign: {
    width: 120,
    borderTopWidth: 1,
    borderTopColor: '#94a3b8',
    paddingTop: 4,
    fontSize: 8,
    textTransform: 'uppercase',
    color: '#475569',
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
};

/**
 * Vector PDF document (react-pdf). Selectable text, small file size, print quality.
 * Supports classic, modern, compact, swiss templates.
 */
const SwissDocumentPdf = ({ data, t, templateType = 'classic', logoUrl, qrUrl }) => {
  const today = new Date().toLocaleDateString(
    data?.lang === 'de' ? 'de-CH' : data?.lang === 'fr' ? 'fr-CH' : data?.lang === 'it' ? 'it-CH' : 'en-GB'
  );
  const { streetLine, cityLine } = formatAddress(
    data?.street,
    data?.houseNumber,
    data?.postal,
    data?.city
  );
  const colors = TEMPLATE_COLORS[templateType] || TEMPLATE_COLORS.classic;
  const isSwiss = templateType === 'swiss';
  const isCompact = templateType === 'compact';
  const isModern = templateType === 'modern';

  const pageStyle = [
    styles.page,
    isCompact && { padding: 32, fontSize: 9 },
    isSwiss && { borderTopWidth: 4, borderTopColor: '#dc2626' },
  ];
  const headerStyle = [styles.header, { borderBottomColor: colors.primary }];
  const headingStyle = [
    styles.sectionHeading,
    isModern && styles.sectionHeadingModern,
    { borderBottomColor: isModern ? colors.border : colors.primary, color: colors.primary },
  ];
  const footerStyle = [styles.footer, { borderTopColor: colors.primary }];
  const footerSignStyle = [styles.footerSign, isSwiss && { borderTopColor: '#f87171' }];
  const boxStyle = [styles.box, { borderColor: colors.light, backgroundColor: isSwiss ? '#fef2f2' : '#f8fafc' }];
  // 3:4 portrait aspect (matches preview PetPhoto aspect-[3/4])
  const photoHeight = isCompact ? 220 : 240;
  const headerIconStyle = [
    styles.headerIcon,
    logoUrl && { backgroundColor: 'white', padding: 2 },
    isSwiss && { borderWidth: 1, borderColor: colors.primary },
  ];

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

        {/* Main: sidebar + content */}
        <View style={styles.mainRow}>
          <View style={styles.sidebar}>
            {/* Photo: 3:4 portrait rectangle (matches preview PetPhoto aspect-[3/4]) */}
            <View style={[styles.sectionBlock, styles.photoContainer, { height: photoHeight }]}>
              {data?.photo && typeof data.photo === 'string' && data.photo.startsWith('data:') ? (
                <Image src={data.photo} style={[styles.photoImg, { height: photoHeight }]} />
              ) : (
                <View style={[styles.photoPlaceholder, { height: photoHeight }]}>
                  <Text style={styles.label}>{t?.doc?.petPhoto ?? 'Photo'}</Text>
                </View>
              )}
            </View>
            {/* Owner */}
            <View style={styles.sectionBlock}>
              <Text style={headingStyle}>{t?.doc?.sectionOwner ?? 'Owner'}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8 }}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.textBold}>{withFallback(data?.ownerName)}</Text>
                  <Text style={styles.text}>{streetLine}</Text>
                  <Text style={styles.text}>{cityLine}</Text>
                  <Text style={[styles.text, { marginTop: 6 }]}>{withFallback(data?.email)}</Text>
                  <Text style={styles.text}>{withFallback(data?.phone)}</Text>
                </View>
                {qrUrl && (
                  <Image src={qrUrl} style={{ width: 110, height: 110, flexShrink: 0 }} />
                )}
              </View>
            </View>
            {/* Behavior */}
            <View style={styles.sectionBlock}>
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
          </View>

          <View style={styles.main}>
            {/* Pet details */}
            <View style={styles.sectionBlock}>
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

            {/* Description – fixed block for 470 chars */}
            <View style={styles.descriptionBlock}>
              <Text style={headingStyle}>{t?.doc?.sectionAbout ?? 'About'}</Text>
              <Text style={styles.text}>
                {sanitizeForPdf(data?.generatedText) || (t?.ui?.noDescription ?? '—')}
              </Text>
            </View>

            {/* Legal / Insurance */}
            <View style={styles.sectionBlock}>
              <View style={boxStyle}>
                <Text style={[headingStyle, { marginBottom: 8 }]}>{t?.doc?.sectionLegal ?? 'Insurance & Legal'}</Text>
                <View style={styles.gridRow}>
                  <View style={styles.gridHalf}>
                    <Text style={styles.label}>{t?.labels?.chipId ?? 'Chip ID'}</Text>
                    <Text style={styles.text}>{withFallback(data?.chipId)}</Text>
                  </View>
                  <View style={styles.gridHalf}>
                    <Text style={styles.label}>{t?.labels?.insurance ?? 'Insurance'}</Text>
                    <Text style={styles.text}>{withFallback(data?.insuranceProvider)}</Text>
                  </View>
                </View>
                <View style={styles.gridRow}>
                  <View style={styles.gridHalf}>
                    <Text style={styles.label}>{t?.labels?.vet ?? 'Vet'}</Text>
                    <Text style={styles.text}>
                      {[data?.vetName, data?.vetPhone].filter(Boolean).join(' · ') || '—'}
                    </Text>
                  </View>
                  <View style={styles.gridHalf}>
                    <Text style={styles.label}>{t?.labels?.neutered ?? 'Neutered'}</Text>
                    <Text style={styles.text}>{data?.isNeutered ? (t?.labels?.yes ?? 'Yes') : (t?.labels?.no ?? 'No')}</Text>
                  </View>
                </View>
                <View style={[styles.gridRow, { marginTop: 6 }]}>
                  <View style={styles.gridHalf}>
                    <Text style={styles.label}>{t?.labels?.vaccination ?? 'Vaccinated'}</Text>
                    <Text style={styles.text}>{data?.hasVaccination ? (t?.labels?.yes ?? 'Yes') : (t?.labels?.no ?? 'No')}</Text>
                  </View>
                  <View style={styles.gridHalf}>
                    <Text style={styles.label}>{t?.labels?.registration ?? 'Registered'}</Text>
                    <Text style={styles.text}>{data?.hasRegistration ? (t?.labels?.yes ?? 'Yes') : (t?.labels?.no ?? 'No')}</Text>
                  </View>
                </View>
                {data?.medicalConditions ? (
                  <View style={{ marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: colors.light }}>
                    <Text style={styles.label}>{t?.labels?.medicalConditions ?? t?.step2Emergency?.displayMedical ?? 'Medizinische Angaben'}</Text>
                    <Text style={styles.text}>{sanitizeForPdf(data.medicalConditions)}</Text>
                  </View>
                ) : null}
              </View>
            </View>

            {/* Reference (if any) – matches preview structure */}
            {(data?.previousLandlordName || data?.previousLandlordPhone || data?.previousLandlordEmail || data?.emergencyContactName || data?.emergencyContactPhone || data?.secondaryEmergencyContact) && (
              <View style={[styles.sectionBlock, ...boxStyle]}>
                <Text style={headingStyle}>{t?.labels?.referenceTitle ?? t?.doc?.sectionReference ?? 'References'}</Text>
                {(data?.previousLandlordName || data?.previousLandlordPhone || data?.previousLandlordEmail) && (
                  <View style={{ marginBottom: 8 }}>
                    <Text style={[styles.label, { marginBottom: 4 }]}>{t?.labels?.previousLandlord ?? 'Previous landlord'}</Text>
                    {data?.previousLandlordName && <Text style={styles.text}>{data.previousLandlordName}</Text>}
                    {data?.previousDuration && <Text style={styles.text}>{t?.labels?.previousDuration ?? 'Duration'}: {data.previousDuration}</Text>}
                    {data?.previousLandlordPhone && <Text style={styles.text}>{data.previousLandlordPhone}</Text>}
                    {data?.previousLandlordEmail && <Text style={styles.text}>{data.previousLandlordEmail}</Text>}
                  </View>
                )}
                {(data?.emergencyContactName || data?.emergencyContactPhone || data?.secondaryEmergencyContact) && (
                  <View>
                    <Text style={[styles.label, { marginBottom: 4 }]}>{t?.labels?.emergencyContact ?? 'Emergency contact'}</Text>
                    {data?.emergencyContactName && <Text style={styles.text}>{data.emergencyContactName}</Text>}
                    {data?.emergencyContactRelation && <Text style={styles.text}>{t?.labels?.emergencyContactRelation ?? 'Relation'}: {data.emergencyContactRelation}</Text>}
                    {data?.emergencyContactPhone && <Text style={styles.text}>{data.emergencyContactPhone}</Text>}
                    {data?.secondaryEmergencyContact && <Text style={[styles.text, { marginTop: 4 }]}>{t?.labels?.secondaryEmergencyContact ?? 'Zweiter Kontakt'}: {data.secondaryEmergencyContact}</Text>}
                  </View>
                )}
              </View>
            )}
          </View>
        </View>

        {/* Footer */}
        <View style={footerStyle}>
          <Text style={[styles.footerGenerated, isSwiss && { color: '#64748b' }]}>
            {t?.doc?.footer ?? 'Dokument generiert via Pet-Bewerbung.ch'}
          </Text>
          <View style={footerSignStyle}>
            <Text>{t?.doc?.sign ?? 'Signature'}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default SwissDocumentPdf;
