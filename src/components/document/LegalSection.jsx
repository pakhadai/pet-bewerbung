import React from 'react';
import StatusItem from '../StatusItem';
import { withFallback } from '../../utils/documentHelpers.jsx';

/**
 * LegalSection component - displays insurance and legal status
 * Simplified for Swiss style 2026 with proper alignment
 */
const LegalSection = ({ data, t, variant = 'classic' }) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'classic':
        return {
          container: 'bg-slate-50 p-4 border-2 border-slate-200',
          heading: 'font-bold uppercase tracking-wider text-xs mb-3',
          grid: 'grid grid-cols-2 gap-y-3 gap-x-4',
          fieldLabel: 'block text-[10px] text-slate-600 uppercase tracking-wide mb-1.5 font-semibold',
          fieldValue: 'font-mono bg-white px-2 py-1 border border-slate-200 text-xs inline-block',
          fieldValueText: 'font-medium text-sm',
          statusContainer: 'col-span-2 flex flex-wrap gap-4 mt-3 pt-3 border-t-2 border-slate-200'
        };

      case 'modern':
        return {
          container: 'bg-slate-50 p-4 border border-slate-200 rounded-md',
          heading: 'font-semibold text-sm mb-3',
          grid: 'grid grid-cols-2 gap-y-3 gap-x-4',
          fieldLabel: 'block text-xs text-slate-500 uppercase tracking-wide mb-1.5 font-medium',
          fieldValue: 'font-mono bg-white px-2 py-1 border border-slate-200 rounded text-xs inline-block',
          fieldValueText: 'font-medium text-sm',
          statusContainer: 'col-span-2 flex flex-wrap gap-4 mt-3 pt-3 border-t border-slate-200'
        };

      case 'swiss':
        return {
          container: 'bg-gray-50 p-4 border-2 border-red-600',
          heading: 'font-bold uppercase tracking-wider text-xs mb-3',
          grid: 'grid grid-cols-2 gap-y-3 gap-x-4',
          fieldLabel: 'block text-[10px] text-slate-600 uppercase tracking-wide mb-1.5 font-semibold',
          fieldValue: 'font-mono bg-white px-2 py-1 border border-gray-300 text-xs inline-block',
          fieldValueText: 'font-medium text-sm',
          statusContainer: 'col-span-2 flex flex-wrap gap-4 mt-3 pt-3 border-t-2 border-gray-300'
        };

      case 'compact':
      default:
        return {
          container: 'bg-slate-50 p-3 border border-slate-300 rounded',
          heading: 'text-[10px] font-bold uppercase tracking-wider mb-2',
          grid: 'grid grid-cols-2 gap-y-2 gap-x-3',
          fieldLabel: 'block text-[9px] text-slate-500 uppercase tracking-wider mb-1 font-semibold',
          fieldValue: 'font-mono bg-white px-1.5 py-0.5 border border-slate-200 text-[10px] inline-block',
          fieldValueText: 'font-medium text-xs',
          statusContainer: 'col-span-2 flex flex-wrap gap-2 mt-2 pt-2 border-t border-slate-300'
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className={styles.container}>
      <h3 className={styles.heading}>{t.doc.sectionLegal}</h3>
      <div className={styles.grid}>
        <div>
          <span className={styles.fieldLabel}>{t.labels.chipId}</span>
          <span className={styles.fieldValue}>{withFallback(data.chipId)}</span>
        </div>
        <div>
          <span className={styles.fieldLabel}>{t.labels.insurance}</span>
          <span className={styles.fieldValueText}>{withFallback(data.insuranceProvider)}</span>
        </div>
        {(data.vetName || data.vetPhone) && (
          <div className="col-span-2">
            <span className={styles.fieldLabel}>{t.labels.vet}</span>
            <span className={styles.fieldValueText}>
              {[data.vetName, data.vetPhone].filter(Boolean).join(' · ') || '—'}
            </span>
          </div>
        )}
        <div className={styles.statusContainer}>
          <StatusItem label={t.labels.neutered} active={data.isNeutered} />
          <StatusItem label={t.labels.vaccination} active={data.hasVaccination} />
          <StatusItem label={t.labels.registration} active={data.hasRegistration} />
        </div>
        {data.medicalConditions && (
          <div className="col-span-2 mt-3 pt-3 border-t-2 border-slate-200">
            <span className={styles.fieldLabel}>{t.step2Emergency?.displayMedical ?? t.labels?.medicalConditions ?? 'Medizinische Angaben'}</span>
            <p className={styles.fieldValueText}>{data.medicalConditions}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LegalSection;
