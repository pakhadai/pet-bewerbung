import React from 'react';
import { Phone, Mail, AlertCircle } from 'lucide-react';
import { withFallback } from '../../utils/documentHelpers.jsx';

/**
 * ReferenceSection component - displays previous landlord and emergency contact
 * Simplified for Swiss style 2026
 */
const ReferenceSection = ({ data, t, variant = 'classic' }) => {
  const hasLandlordInfo = data.previousLandlordName || data.previousLandlordPhone || data.previousLandlordEmail;
  const hasEmergencyInfo = data.emergencyContactName || data.emergencyContactPhone || data.secondaryEmergencyContact;

  if (!hasLandlordInfo && !hasEmergencyInfo) {
    return null;
  }

  const getVariantStyles = () => {
    switch (variant) {
      case 'classic':
        return {
          container: 'bg-blue-50 p-3 border-2 border-blue-200 mt-3',
          heading: 'font-bold uppercase tracking-wider text-[10px] mb-3 text-blue-900',
          subsection: 'mb-3',
          subheading: 'text-[9px] font-semibold uppercase tracking-wide mb-1.5 text-blue-700',
          grid: 'space-y-1.5 text-xs',
          fieldLabel: 'text-[9px] text-slate-600 uppercase tracking-wide font-semibold',
          fieldValue: 'font-medium text-slate-800 text-xs',
          contactItem: 'flex items-center gap-1.5 text-xs text-slate-600',
          iconSize: 10
        };

      case 'modern':
        return {
          container: 'bg-blue-50 p-3 border border-blue-200 rounded-md mt-3',
          heading: 'font-semibold text-xs mb-3 text-blue-700',
          subsection: 'mb-3',
          subheading: 'text-[9px] font-semibold uppercase tracking-wide mb-1.5 text-blue-600',
          grid: 'space-y-1.5 text-xs',
          fieldLabel: 'text-[9px] text-blue-600 font-medium',
          fieldValue: 'font-medium text-slate-800 text-xs',
          contactItem: 'flex items-center gap-1.5 text-xs text-slate-600',
          iconSize: 10
        };

      case 'swiss':
        return {
          container: 'bg-blue-50 p-3 border-2 border-red-600 mt-3',
          heading: 'font-bold uppercase tracking-wider text-[10px] mb-3 text-blue-900',
          subsection: 'mb-3',
          subheading: 'text-[9px] font-semibold uppercase tracking-wide mb-1.5 text-blue-700',
          grid: 'space-y-1.5 text-xs',
          fieldLabel: 'text-[9px] text-slate-600 uppercase tracking-wide font-semibold',
          fieldValue: 'font-medium text-slate-800 text-xs',
          contactItem: 'flex items-center gap-1.5 text-xs text-slate-600',
          iconSize: 10
        };

      case 'compact':
      default:
        return {
          container: 'bg-blue-50 p-2.5 border border-blue-200 rounded mt-3',
          heading: 'text-[10px] font-bold uppercase tracking-wider mb-2',
          subsection: 'mb-2',
          subheading: 'text-[9px] uppercase tracking-wider mb-1 font-semibold',
          grid: 'space-y-1 text-xs',
          fieldLabel: 'text-[9px] uppercase font-semibold',
          fieldValue: 'font-medium text-[10px]',
          contactItem: 'flex items-center gap-1 text-[10px]',
          iconSize: 9
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className={styles.container}>
      <h3 className={styles.heading}>{t.labels.referenceTitle}</h3>

      {hasLandlordInfo && (
        <div className={styles.subsection}>
          <h4 className={styles.subheading}>{t.labels.previousLandlord}</h4>
          <div className={styles.grid}>
            {data.previousLandlordName && (
              <div>
                <span className={styles.fieldLabel}>{t.labels.previousLandlordName}: </span>
                <span className={styles.fieldValue}>{data.previousLandlordName}</span>
              </div>
            )}
            {data.previousDuration && (
              <div>
                <span className={styles.fieldLabel}>{t.labels.previousDuration}: </span>
                <span className={styles.fieldValue}>{data.previousDuration}</span>
              </div>
            )}
            {data.previousLandlordPhone && (
              <div className={styles.contactItem}>
                <Phone size={styles.iconSize} className="flex-shrink-0" />
                <span className="break-words">{data.previousLandlordPhone}</span>
              </div>
            )}
            {data.previousLandlordEmail && (
              <div className={styles.contactItem}>
                <Mail size={styles.iconSize} className="flex-shrink-0" />
                <span className="break-words">{data.previousLandlordEmail}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {hasEmergencyInfo && (
        <div className={styles.subsection}>
          <h4 className={styles.subheading}>{t.labels.emergencyContact}</h4>
          <div className={styles.grid}>
            {data.emergencyContactName && (
              <div>
                <span className={styles.fieldLabel}>{t.labels.emergencyContactName}: </span>
                <span className={styles.fieldValue}>{data.emergencyContactName}</span>
              </div>
            )}
            {data.emergencyContactRelation && (
              <div>
                <span className={styles.fieldLabel}>{t.labels.emergencyContactRelation}: </span>
                <span className={styles.fieldValue}>{data.emergencyContactRelation}</span>
              </div>
            )}
            {data.emergencyContactPhone && (
              <div className={styles.contactItem}>
                <AlertCircle size={styles.iconSize} className="flex-shrink-0" />
                <span className="break-words">{data.emergencyContactPhone}</span>
              </div>
            )}
            {data.secondaryEmergencyContact && (
              <div>
                <span className={styles.fieldLabel}>{t.labels?.secondaryEmergencyContact ?? t.step2Emergency?.secondaryContact ?? 'Zweiter Kontakt'}: </span>
                <span className={styles.fieldValue}>{data.secondaryEmergencyContact}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReferenceSection;
