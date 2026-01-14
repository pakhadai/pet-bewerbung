import React from 'react';
import { Phone, Mail, User, AlertCircle } from 'lucide-react';
import { withFallback } from '../../utils/documentHelpers.jsx';

/**
 * ReferenceSection component - displays previous landlord and emergency contact
 * @param {Object} data - Reference data
 * @param {Object} t - Translations object
 * @param {string} variant - Template variant
 */
const ReferenceSection = ({ data, t, variant = 'classic' }) => {
  const hasLandlordInfo = data.previousLandlordName || data.previousLandlordPhone || data.previousLandlordEmail;
  const hasEmergencyInfo = data.emergencyContactName || data.emergencyContactPhone;

  if (!hasLandlordInfo && !hasEmergencyInfo) {
    return null; // Don't render if no data
  }

  const getVariantStyles = () => {
    switch (variant) {
      case 'classic':
        return {
          container: 'bg-blue-50 p-6 border-2 border-blue-200 mt-6',
          heading: 'font-black uppercase tracking-wider text-xs mb-4 text-blue-900',
          subsection: 'mb-4',
          subheading: 'text-[10px] font-bold uppercase tracking-wide mb-2 text-blue-700',
          grid: 'space-y-2 text-sm',
          fieldLabel: 'text-[10px] text-slate-600 uppercase tracking-wide font-semibold',
          fieldValue: 'font-medium text-slate-800',
          contactItem: 'flex items-center gap-2 text-xs text-slate-600',
          iconSize: 12
        };

      case 'modern':
      case 'colorful':
        return {
          container: 'bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-5 border-2 border-blue-200 mt-5',
          heading: 'font-bold text-blue-600 text-sm mb-4',
          subsection: 'mb-4',
          subheading: 'text-xs font-bold uppercase tracking-wide mb-2 text-blue-600',
          grid: 'space-y-2 text-sm',
          fieldLabel: 'text-xs text-blue-500 font-semibold',
          fieldValue: 'font-semibold text-slate-800',
          contactItem: 'flex items-center gap-2 text-xs text-slate-600',
          iconSize: 12
        };

      case 'professional':
        return {
          container: 'bg-slate-800 rounded-lg p-5 border border-blue-500/30 mt-5',
          heading: 'font-bold text-blue-400 text-sm mb-4',
          subsection: 'mb-4',
          subheading: 'text-xs font-bold uppercase tracking-wide mb-2 text-blue-400',
          grid: 'space-y-2 text-sm',
          fieldLabel: 'text-xs text-blue-300 font-semibold',
          fieldValue: 'font-medium text-slate-200',
          contactItem: 'flex items-center gap-2 text-xs text-slate-400',
          iconSize: 12
        };

      case 'minimal':
        return {
          container: 'border-t-2 border-gray-300 pt-4 mt-4',
          heading: 'text-xs uppercase tracking-widest mb-3 font-bold',
          subsection: 'mb-3',
          subheading: 'text-[10px] uppercase tracking-wider mb-2 font-semibold',
          grid: 'space-y-1 text-xs',
          fieldLabel: 'text-[10px] uppercase font-medium',
          fieldValue: 'font-medium',
          contactItem: 'flex items-center gap-1 text-xs',
          iconSize: 10
        };

      default:
        return {
          container: 'border-t border-slate-300 pt-3 mt-3',
          heading: 'text-[10px] font-bold uppercase tracking-wider mb-2',
          subsection: 'mb-3',
          subheading: 'text-[9px] uppercase tracking-wider mb-1 font-bold',
          grid: 'space-y-1 text-xs',
          fieldLabel: 'text-[9px] uppercase font-semibold',
          fieldValue: 'font-medium text-xs',
          contactItem: 'flex items-center gap-1 text-[10px]',
          iconSize: 10
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className={styles.container}>
      <h3 className={styles.heading}>{t.labels.previousLandlord} & {t.labels.emergencyContact}</h3>

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
                <Phone size={styles.iconSize} />
                <span>{data.previousLandlordPhone}</span>
              </div>
            )}
            {data.previousLandlordEmail && (
              <div className={styles.contactItem}>
                <Mail size={styles.iconSize} />
                <span>{data.previousLandlordEmail}</span>
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
                <AlertCircle size={styles.iconSize} />
                <span>{data.emergencyContactPhone}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReferenceSection;
