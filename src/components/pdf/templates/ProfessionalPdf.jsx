/**
 * Professional PDF Template - Premium business-style template
 * Layout: 2-column layout (42% left + 58% right) with modern corporate design
 * Theme: Black accent, clean lines, progress bars, status badges
 * Unique features: Reference ID, progress bars for behavior, status icons
 */

import React from 'react';
import {
  Document,
  Page,
  View,
  Text,
  Image,
  StyleSheet,
} from '@react-pdf/renderer';
import {
  TEMPLATE_COLORS,
  getCustomStyle,
  hasCustomDesign,
  getLocale,
  INITIAL_DATA,
  Watermark,
} from '../PdfBase';
import { formatAddress, getGenderLabel, withFallback, sanitizeForPdf } from '../../../utils/documentHelpers';

const professionalColors = {
  primary: '#000000',
  accent: '#000000',
  text: '#111827',
  muted: '#6b7280',
  border: '#e5e7eb',
  light: '#f3f4f6',
};

/**
 * Get Professional template configuration
 */
export const getPdfProfessionalConfig = (data, t) => {
  const today = new Date().toLocaleDateString(getLocale(data?.lang));
  return {
    templateType: 'professional',
    dateLabel: today,
  };
};

/**
 * Create Professional styles
 */
const createProfessionalStyles = (colors) => StyleSheet.create({
  page: {
    padding: 28,
    fontSize: 10,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 4,
    borderBottomColor: colors.primary || professionalColors.primary,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIcon: {
    width: 36,
    height: 36,
    backgroundColor: colors.primary || professionalColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: professionalColors.text,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  headerSubtitle: {
    fontSize: 8,
    color: professionalColors.muted,
    marginTop: 2,
  },
  headerDate: {
    textAlign: 'right',
  },
  headerDateLabel: {
    fontSize: 7,
    color: professionalColors.muted,
    textTransform: 'uppercase',
  },
  headerDateValue: {
    fontSize: 10,
    fontWeight: 'bold',
    color: professionalColors.text,
  },
  content: {
    flexDirection: 'row',
    gap: 20,
    flex: 1,
  },
  leftColumn: {
    width: '42%',
    gap: 12,
  },
  rightColumn: {
    width: '58%',
    gap: 12,
  },
  photoBox: {
    width: '100%',
    height: 200,
    backgroundColor: professionalColors.light,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    color: colors.primary || professionalColors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    borderBottomWidth: 2,
    borderBottomColor: colors.primary || professionalColors.primary,
    paddingBottom: 4,
    marginBottom: 8,
  },
  petName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: professionalColors.text,
    marginBottom: 2,
  },
  petRefId: {
    fontSize: 8,
    fontWeight: 'bold',
    color: colors.primary || professionalColors.accent,
    marginBottom: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderTopWidth: 1,
    borderTopColor: professionalColors.border,
    paddingTop: 8,
  },
  statItem: {
    width: '50%',
    marginBottom: 6,
  },
  statLabel: {
    fontSize: 7,
    color: professionalColors.muted,
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  statValue: {
    fontSize: 9,
    fontWeight: 'bold',
    color: professionalColors.text,
    marginTop: 1,
  },
  ownerBox: {
    backgroundColor: professionalColors.light,
    padding: 12,
    borderWidth: 1,
    borderColor: professionalColors.border,
  },
  ownerLabel: {
    fontSize: 7,
    color: professionalColors.muted,
    textTransform: 'uppercase',
    marginBottom: 1,
  },
  ownerValue: {
    fontSize: 9,
    fontWeight: 'bold',
    color: professionalColors.text,
    marginBottom: 4,
  },
  ownerContactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  ownerContactText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: professionalColors.text,
  },
  progressContainer: {
    marginBottom: 10,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  progressLabelText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#374151',
  },
  progressLabelValue: {
    fontSize: 7,
    color: professionalColors.muted,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#e5e7eb',
    width: '100%',
  },
  progressFill: {
    height: 4,
  },
  tag: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    backgroundColor: '#dcfce7',
    marginRight: 4,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 7,
    fontWeight: 'bold',
    color: '#15803d',
    textTransform: 'uppercase',
  },
  descriptionSection: {
    borderTopWidth: 1,
    borderTopColor: professionalColors.border,
    paddingTop: 12,
    marginTop: 4,
  },
  descriptionTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    color: professionalColors.text,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  descriptionText: {
    fontSize: 9,
    lineHeight: 1.5,
    color: '#374151',
  },
  bottomGrid: {
    flexDirection: 'row',
    gap: 20,
    borderTopWidth: 1,
    borderTopColor: professionalColors.border,
    paddingTop: 12,
    marginTop: 4,
  },
  legalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 3,
    borderBottomWidth: 1,
    borderBottomColor: professionalColors.border,
    borderBottomStyle: 'dashed',
  },
  legalLabel: {
    fontSize: 8,
    color: '#4b5563',
  },
  legalValue: {
    fontSize: 8,
    fontWeight: 'bold',
    color: professionalColors.text,
  },
  statusRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  statusBadge: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 2,
  },
  statusCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusCircleGreen: {
    backgroundColor: '#dcfce7',
  },
  statusText: {
    fontSize: 6,
    fontWeight: 'bold',
    color: professionalColors.muted,
    textTransform: 'uppercase',
  },
  referenceBox: {
    backgroundColor: '#eff6ff',
    padding: 8,
    borderWidth: 1,
    borderColor: '#bfdbfe',
    marginBottom: 6,
  },
  referenceLabel: {
    fontSize: 7,
    fontWeight: 'bold',
    color: '#1e40af',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  referenceName: {
    fontSize: 9,
    fontWeight: 'bold',
    color: professionalColors.text,
  },
  referenceDetail: {
    fontSize: 7,
    color: professionalColors.muted,
    marginTop: 1,
  },
  footer: {
    marginTop: 'auto',
    paddingTop: 12,
    borderTopWidth: 4,
    borderTopColor: colors.primary || professionalColors.primary,
  },
  footerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  footerText: {
    fontSize: 7,
    color: professionalColors.muted,
    fontFamily: 'Courier',
  },
  footerSign: {
    width: 140,
    borderBottomWidth: 1,
    borderBottomColor: '#d1d5db',
    paddingBottom: 6,
  },
  footerSignText: {
    fontSize: 7,
    color: professionalColors.muted,
    textAlign: 'center',
    marginTop: 4,
  },
  branding: {
    fontSize: 6,
    color: '#cbd5e1',
    textAlign: 'center',
    marginTop: 6,
  },
});

/**
 * Professional PDF Template Component
 */
const ProfessionalPdf = ({ data, t, logoUrl, qrUrl, showWatermark = false }) => {
  const customDesign = data?.customDesign || INITIAL_DATA.customDesign;
  const isCustomized = hasCustomDesign(customDesign);
  const customStyle = isCustomized ? getCustomStyle(customDesign) : null;

  const colors = customStyle || TEMPLATE_COLORS.professional;
  const profAccent = colors.primary || professionalColors.accent;

  const { streetLine, cityLine } = formatAddress(
    data?.street,
    data?.houseNumber,
    data?.postal,
    data?.city
  );

  const today = new Date().toLocaleDateString(getLocale(data?.lang));

  const professionalStyles = createProfessionalStyles(colors);

  const getNoiseLevelPercent = () => {
    if (data?.noiseLevel === 'low') return 20;
    if (data?.noiseLevel === 'high') return 80;
    return 50;
  };

  const getAloneTimePercent = () => {
    const hours = parseInt(data?.aloneTime) || 0;
    return Math.min(100, Math.max(10, (hours / 8) * 100));
  };

  return (
    <Document title={t?.doc?.title ?? 'Pet CV'}>
      <Page size="A4" style={professionalStyles.page} wrap>
        {/* Header */}
        <View style={professionalStyles.header}>
          <View style={professionalStyles.headerLeft}>
            <View style={professionalStyles.headerIcon}>
              {logoUrl ? (
                <Image src={logoUrl} style={{ width: 28, height: 28, objectFit: 'contain' }} />
              ) : (
                <Text style={{ color: '#ffffff', fontSize: 14, fontWeight: 'bold' }}>V</Text>
              )}
            </View>
            <View>
              <Text style={professionalStyles.headerTitle}>{t?.doc?.title ?? 'Pet Dossier'}</Text>
              <Text style={professionalStyles.headerSubtitle}>{t?.doc?.subtitle ?? 'Application document'}</Text>
            </View>
          </View>
          <View style={professionalStyles.headerDate}>
            <Text style={professionalStyles.headerDateLabel}>{t?.labels?.date || 'Datum'}</Text>
            <Text style={professionalStyles.headerDateValue}>{today}</Text>
          </View>
        </View>

        {/* Content: 2 columns */}
        <View style={professionalStyles.content}>
          {/* Left Column: Photo + Pet Stats */}
          <View style={professionalStyles.leftColumn}>
            {/* Photo */}
            <View style={professionalStyles.photoBox}>
              {data?.photo && typeof data.photo === 'string' && data.photo.startsWith('data:') ? (
                <Image src={data.photo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <View style={{ width: '100%', height: '100%', backgroundColor: professionalColors.light, justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ fontSize: 24, color: professionalColors.muted }}>PET</Text>
                </View>
              )}
            </View>

            {/* Pet Name & Reference ID */}
            <View>
              <Text style={professionalStyles.petName}>{data?.name || '---'}</Text>
              <Text style={professionalStyles.petRefId}>
                Referenz-ID: #{(data?.chipId || data?.name || 'XXXX').slice(-4).toUpperCase()}-PET
              </Text>
            </View>

            {/* Pet Stats Grid */}
            <View style={professionalStyles.statsGrid}>
              <View style={professionalStyles.statItem}>
                <Text style={professionalStyles.statLabel}>{t?.labels?.breed ?? 'Breed'}</Text>
                <Text style={professionalStyles.statValue}>{data?.breed || '---'}</Text>
              </View>
              <View style={professionalStyles.statItem}>
                <Text style={professionalStyles.statLabel}>{t?.labels?.gender ?? 'Gender'}</Text>
                <Text style={professionalStyles.statValue}>{getGenderLabel(data?.gender, t)}</Text>
              </View>
              <View style={professionalStyles.statItem}>
                <Text style={professionalStyles.statLabel}>{t?.labels?.age ?? 'Age'}</Text>
                <Text style={professionalStyles.statValue}>{data?.age ? `${data.age} ${t?.labels?.years || 'Jahre'}` : '---'}</Text>
              </View>
              <View style={professionalStyles.statItem}>
                <Text style={professionalStyles.statLabel}>{t?.labels?.weight ?? 'Weight'}</Text>
                <Text style={professionalStyles.statValue}>{data?.weight ? `${data.weight} kg` : '---'}</Text>
              </View>
            </View>
          </View>

          {/* Right Column: Owner + Behavior */}
          <View style={professionalStyles.rightColumn}>
            {/* Owner Info Box */}
            <View style={professionalStyles.ownerBox}>
              <Text style={professionalStyles.sectionTitle}>{t?.doc?.sectionOwner ?? 'Owner'}</Text>
              <View style={{ gap: 4, paddingRight: 60 }}>
                <View>
                  <Text style={professionalStyles.ownerLabel}>{t?.labels?.name ?? 'Name'}</Text>
                  <Text style={professionalStyles.ownerValue}>{data?.ownerName || '---'}</Text>
                </View>
                <View>
                  <Text style={professionalStyles.ownerLabel}>{t?.labels?.address ?? 'Address'}</Text>
                  <Text style={professionalStyles.ownerValue}>{streetLine}</Text>
                </View>
                <View>
                  <Text style={professionalStyles.ownerLabel}>{t?.labels?.city ?? 'City'}</Text>
                  <Text style={professionalStyles.ownerValue}>{cityLine}</Text>
                </View>
                <View style={{ flexDirection: 'row', gap: 16, marginTop: 4 }}>
                  <View style={professionalStyles.ownerContactRow}>
                    <Text style={{ fontSize: 8, color: professionalColors.muted }}>Tel:</Text>
                    <Text style={professionalStyles.ownerContactText}>{data?.phone || '---'}</Text>
                  </View>
                  <View style={professionalStyles.ownerContactRow}>
                    <Text style={{ fontSize: 8, color: professionalColors.muted }}>E-Mail:</Text>
                    <Text style={professionalStyles.ownerContactText}>{data?.email || '---'}</Text>
                  </View>
                </View>
              </View>
              {/* QR Code in owner box */}
              {qrUrl && (
                <View style={{ position: 'absolute', top: 30, right: 8 }}>
                  <Image src={qrUrl} style={{ width: 50, height: 50 }} />
                </View>
              )}
            </View>

            {/* Behavior & Routine */}
            <View>
              <Text style={[professionalStyles.sectionTitle, { borderBottomWidth: 2, borderBottomColor: colors.primary || professionalColors.primary }]}>
                {t?.labels?.behaviorTitle ?? t?.doc?.sectionBehavior ?? 'Behavior'}
              </Text>

              {/* Progress bars */}
              <View style={{ flexDirection: 'row', gap: 16 }}>
                <View style={{ flex: 1 }}>
                  <View style={professionalStyles.progressContainer}>
                    <View style={professionalStyles.progressLabelRow}>
                      <Text style={professionalStyles.progressLabelText}>{t?.labels?.noiseLevel ?? 'Noise'}</Text>
                      <Text style={professionalStyles.progressLabelValue}>
                        {data?.noiseLevel === 'low' ? (t?.labels?.noiseLow ?? 'Low') : data?.noiseLevel === 'high' ? (t?.labels?.noiseHigh ?? 'High') : (t?.labels?.noiseMedium ?? 'Medium')}
                      </Text>
                    </View>
                    <View style={professionalStyles.progressBar}>
                      <View style={[professionalStyles.progressFill, { width: `${getNoiseLevelPercent()}%`, backgroundColor: profAccent, opacity: 0.8 }]} />
                    </View>
                  </View>
                </View>
                <View style={{ flex: 1 }}>
                  <View style={professionalStyles.progressContainer}>
                    <View style={professionalStyles.progressLabelRow}>
                      <Text style={professionalStyles.progressLabelText}>{t?.labels?.aloneTime ?? 'Alone time'}</Text>
                      <Text style={professionalStyles.progressLabelValue}>{data?.aloneTime ? `${data.aloneTime}h` : '---'}</Text>
                    </View>
                    <View style={professionalStyles.progressBar}>
                      <View style={[professionalStyles.progressFill, { width: `${getAloneTimePercent()}%`, backgroundColor: '#3b82f6', opacity: 0.8 }]} />
                    </View>
                  </View>
                </View>
              </View>

              {/* Info boxes */}
              {(data?.aloneTime || data?.activeHours) && (
                <View style={{ flexDirection: 'row', gap: 8, marginBottom: 8 }}>
                  {data?.aloneTime && (
                    <View style={{ flex: 1, backgroundColor: professionalColors.light, padding: 6, borderWidth: 1, borderColor: professionalColors.border }}>
                      <Text style={{ fontSize: 7, color: professionalColors.muted }}>{t?.labels?.aloneTime ?? 'Alone'}</Text>
                      <Text style={{ fontSize: 10, fontWeight: 'bold', color: professionalColors.text }}>{data.aloneTime} Std.</Text>
                    </View>
                  )}
                  {data?.activeHours && (
                    <View style={{ flex: 1, backgroundColor: professionalColors.light, padding: 6, borderWidth: 1, borderColor: professionalColors.border }}>
                      <Text style={{ fontSize: 7, color: professionalColors.muted }}>{t?.labels?.activeHours ?? 'Active'}</Text>
                      <Text style={{ fontSize: 10, fontWeight: 'bold', color: professionalColors.text }}>{data.activeHours}</Text>
                    </View>
                  )}
                </View>
              )}

              {/* Behavior tags */}
              <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {data?.behaviorWithChildren === 'good' && (
                  <View style={professionalStyles.tag}>
                    <Text style={professionalStyles.tagText}>{t?.labels?.behaviorWithChildren ?? 'Kinderfreundlich'}</Text>
                  </View>
                )}
                {data?.behaviorWithPets === 'good' && (
                  <View style={professionalStyles.tag}>
                    <Text style={professionalStyles.tagText}>{t?.labels?.behaviorWithPets ?? 'Tierfreundlich'}</Text>
                  </View>
                )}
                <View style={professionalStyles.tag}>
                  <Text style={professionalStyles.tagText}>{t?.labels?.houseTrained ?? 'Stubenrein'}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Description - Full Width */}
        {data?.generatedText && (
          <View style={professionalStyles.descriptionSection}>
            <Text style={professionalStyles.descriptionTitle}>{t?.doc?.sectionDescription ?? t?.doc?.sectionAbout ?? 'About'}</Text>
            <Text style={professionalStyles.descriptionText}>
              {sanitizeForPdf(data.generatedText)}
            </Text>
          </View>
        )}

        {/* Bottom Grid: Legal & References */}
        <View style={professionalStyles.bottomGrid}>
          {/* Legal / Insurance */}
          <View style={{ flex: 1 }}>
            <Text style={[professionalStyles.sectionTitle, { fontSize: 8 }]}>
              {t?.doc?.sectionLegal ?? 'Insurance & Legal'}
            </Text>
            <View style={professionalStyles.legalRow}>
              <Text style={professionalStyles.legalLabel}>{t?.labels?.chipId ?? 'Chip ID'}</Text>
              <Text style={[professionalStyles.legalValue, { fontFamily: 'Courier' }]}>{withFallback(data?.chipId)}</Text>
            </View>
            <View style={professionalStyles.legalRow}>
              <Text style={professionalStyles.legalLabel}>{t?.labels?.insurance ?? 'Insurance'}</Text>
              <Text style={professionalStyles.legalValue}>{withFallback(data?.insuranceProvider)}</Text>
            </View>
            <View style={professionalStyles.legalRow}>
              <Text style={professionalStyles.legalLabel}>{t?.labels?.vet ?? 'Vet'}</Text>
              <Text style={professionalStyles.legalValue}>{withFallback(data?.vetName)}</Text>
            </View>
            {/* Status icons row */}
            <View style={professionalStyles.statusRow}>
              {data?.hasVaccination && (
                <View style={professionalStyles.statusBadge}>
                  <View style={[professionalStyles.statusCircle, professionalStyles.statusCircleGreen]}>
                    <Text style={{ fontSize: 10, color: '#15803d' }}>V</Text>
                  </View>
                  <Text style={professionalStyles.statusText}>{t?.labels?.vaccinated ?? 'Vaccinated'}</Text>
                </View>
              )}
              {data?.isNeutered && (
                <View style={professionalStyles.statusBadge}>
                  <View style={[professionalStyles.statusCircle, professionalStyles.statusCircleGreen]}>
                    <Text style={{ fontSize: 10, color: '#15803d' }}>N</Text>
                  </View>
                  <Text style={professionalStyles.statusText}>{t?.labels?.neutered ?? 'Neutered'}</Text>
                </View>
              )}
              {data?.hasRegistration && (
                <View style={professionalStyles.statusBadge}>
                  <View style={[professionalStyles.statusCircle, professionalStyles.statusCircleGreen]}>
                    <Text style={{ fontSize: 10, color: '#15803d' }}>R</Text>
                  </View>
                  <Text style={professionalStyles.statusText}>AMICUS</Text>
                </View>
              )}
            </View>
          </View>

          {/* References */}
          <View style={{ flex: 1 }}>
            <Text style={[professionalStyles.sectionTitle, { fontSize: 8 }]}>
              {t?.labels?.referenceTitle ?? t?.doc?.sectionReference ?? 'References'}
            </Text>
            {data?.previousLandlordName && (
              <View style={professionalStyles.referenceBox}>
                <Text style={professionalStyles.referenceLabel}>{t?.labels?.previousLandlord ?? 'Previous landlord'}</Text>
                <Text style={professionalStyles.referenceName}>{data.previousLandlordName}</Text>
                {data?.previousLandlordPhone && (
                  <Text style={professionalStyles.referenceDetail}>Tel: {data.previousLandlordPhone}</Text>
                )}
                {data?.previousDuration && (
                  <Text style={[professionalStyles.referenceDetail, { fontStyle: 'italic' }]}>
                    {t?.labels?.previousDuration ?? 'Duration'}: {data.previousDuration}
                  </Text>
                )}
              </View>
            )}
            {data?.emergencyContactName && (
              <View style={{ marginTop: data?.previousLandlordName ? 0 : 0 }}>
                <Text style={{ fontSize: 7, fontWeight: 'bold', color: professionalColors.muted, textTransform: 'uppercase', marginBottom: 2 }}>
                  {t?.labels?.emergencyContact ?? 'Emergency contact'}
                </Text>
                <Text style={{ fontSize: 9, fontWeight: 'bold', color: professionalColors.text }}>
                  {data.emergencyContactName}
                  {data?.emergencyContactRelation ? ` (${data.emergencyContactRelation})` : ''}
                </Text>
                {data?.emergencyContactPhone && (
                  <Text style={{ fontSize: 8, color: professionalColors.muted, marginTop: 1 }}>{data.emergencyContactPhone}</Text>
                )}
              </View>
            )}
          </View>
        </View>

        {/* Footer */}
        <View style={professionalStyles.footer}>
          <View style={professionalStyles.footerContent}>
            <Text style={professionalStyles.footerText}>
              {t?.doc?.footer ?? 'Dokument generiert via Pet-Bewerbung.ch'}
            </Text>
            <View>
              <View style={professionalStyles.footerSign} />
              <Text style={professionalStyles.footerSignText}>{t?.doc?.sign ?? 'Signature'}</Text>
            </View>
          </View>
          <Text style={professionalStyles.branding}>pet-bewerbung.ch</Text>
        </View>

        {/* Watermark overlay for unpaid premium templates */}
        {showWatermark && <Watermark />}
      </Page>
    </Document>
  );
};

export default ProfessionalPdf;
