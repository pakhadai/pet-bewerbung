import React from 'react';
import { Phone, Mail, AlertCircle } from 'lucide-react';
import { withFallback } from '../../utils/documentHelpers.jsx';

/**
 * ReferenceSection component - displays previous landlord and emergency contact
 * 2-column layout for better space usage on A4
 */
const ReferenceSection = ({ data, t, variant = 'classic' }) => {
  const hasLandlordInfo = data.previousLandlordName || data.previousLandlordPhone || data.previousLandlordEmail;
  const hasEmergencyInfo = data.emergencyContactName || data.emergencyContactPhone || data.secondaryEmergencyContact;

  if (!hasLandlordInfo && !hasEmergencyInfo) {
    return null;
  }

  const getVariantStyles = () => {
    const base = {
      container: 'bg-blue-50 p-2.5 border-2 border-blue-200 mt-2',
      heading: 'font-bold uppercase tracking-wider text-[9px] mb-2 text-blue-900 pb-1.5 border-b border-blue-200',
      columnsContainer: 'grid grid-cols-2 gap-3',
      subsection: '',
      subheading: 'text-[8px] font-semibold uppercase tracking-wide mb-1 text-blue-700',
      grid: 'space-y-0.5 text-[10px]',
      fieldLabel: 'text-[8px] text-slate-500 uppercase tracking-wide',
      fieldValue: 'font-medium text-slate-800 text-[10px]',
      contactItem: 'flex items-center gap-1 text-[10px] text-slate-600',
      iconSize: 9
    };

    switch (variant) {
      case 'modern':
        return { ...base, container: 'bg-blue-50 p-2.5 border border-blue-200 rounded-md mt-2' };
      case 'swiss':
        return { ...base, container: 'bg-blue-50 p-2.5 border-2 border-red-600 mt-2' };
      case 'compact':
        return { 
          ...base, 
          container: 'bg-blue-50 p-2 border border-blue-200 rounded mt-1.5',
          heading: 'text-[8px] font-bold uppercase tracking-wider mb-1.5 pb-1 border-b border-blue-200',
          grid: 'space-y-0.5 text-[9px]',
          fieldValue: 'font-medium text-[9px]',
          contactItem: 'flex items-center gap-1 text-[9px]',
          iconSize: 8
        };
      default:
        return base;
    }
  };

  const styles = getVariantStyles();

  return (
    <div className={styles.container}>
      <h3 className={styles.heading}>{t.labels.referenceTitle}</h3>
      
      <div className={styles.columnsContainer}>
        {/* Left column: Previous Landlord */}
        {hasLandlordInfo && (
          <div className={styles.subsection}>
            <h4 className={styles.subheading}>{t.labels.previousLandlord}</h4>
            <div className={styles.grid}>
              {data.previousLandlordName && (
                <div className={styles.fieldValue}>{data.previousLandlordName}</div>
              )}
              {data.previousDuration && (
                <div className="text-slate-600">
                  <span className={styles.fieldLabel}>{t.labels.previousDuration}: </span>
                  <span>{data.previousDuration}</span>
                </div>
              )}
              {data.previousLandlordPhone && (
                <div className={styles.contactItem}>
                  <Phone size={styles.iconSize} className="flex-shrink-0" />
                  <span>{data.previousLandlordPhone}</span>
                </div>
              )}
              {data.previousLandlordEmail && (
                <div className={styles.contactItem}>
                  <Mail size={styles.iconSize} className="flex-shrink-0" />
                  <span className="break-all">{data.previousLandlordEmail}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Right column: Emergency Contact */}
        {hasEmergencyInfo && (
          <div className={styles.subsection}>
            <h4 className={styles.subheading}>{t.labels.emergencyContact}</h4>
            <div className={styles.grid}>
              {data.emergencyContactName && (
                <div className={styles.fieldValue}>{data.emergencyContactName}</div>
              )}
              {data.emergencyContactRelation && (
                <div className="text-slate-600">
                  <span className={styles.fieldLabel}>{t.labels.emergencyContactRelation}: </span>
                  <span>{data.emergencyContactRelation}</span>
                </div>
              )}
              {data.emergencyContactPhone && (
                <div className={styles.contactItem}>
                  <AlertCircle size={styles.iconSize} className="flex-shrink-0" />
                  <span>{data.emergencyContactPhone}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Secondary contact - full width if exists */}
      {data.secondaryEmergencyContact && (
        <div className="mt-2 pt-1.5 border-t border-blue-200 text-[9px] text-slate-600">
          <span className={styles.fieldLabel}>{t.labels?.secondaryEmergencyContact ?? t.step2Emergency?.secondaryContact ?? 'Zweiter Kontakt'}: </span>
          <span className={styles.fieldValue}>{data.secondaryEmergencyContact}</span>
        </div>
      )}
    </div>
  );
};

export default ReferenceSection;
