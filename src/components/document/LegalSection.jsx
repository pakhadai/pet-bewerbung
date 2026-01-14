import React from 'react';
import StatusItem from '../StatusItem';
import { withFallback } from '../../utils/documentHelpers.jsx';

/**
 * LegalSection component - displays insurance and legal status
 * @param {Object} data - Legal data (chipId, insuranceProvider, isNeutered, hasVaccination, hasRegistration, vet)
 * @param {Object} t - Translations object
 * @param {string} variant - Template variant
 */
const LegalSection = ({ data, t, variant = 'classic' }) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'classic':
        return {
          container: 'bg-stone-50 p-6 border-2 border-slate-200',
          heading: 'font-black uppercase tracking-wider text-xs mb-4',
          grid: 'grid grid-cols-2 gap-6 text-sm',
          fieldLabel: 'block text-[10px] text-slate-600 uppercase tracking-wide mb-2 font-bold',
          fieldValue: 'font-mono bg-white px-2 py-1 border border-slate-200 inline-block',
          fieldValueText: 'font-medium',
          statusContainer: 'col-span-2 flex flex-wrap gap-6 mt-2 pt-4 border-t-2 border-slate-200'
        };

      case 'modern':
        return {
          container: 'bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-5 border-2 border-rose-200',
          heading: 'font-bold text-rose-600 text-sm mb-4',
          grid: 'grid grid-cols-2 gap-4 text-sm',
          fieldLabel: 'block text-xs text-rose-400 uppercase tracking-wide mb-2 font-semibold',
          fieldValue: 'font-mono bg-white px-3 py-1.5 border border-rose-200 rounded-lg inline-block',
          fieldValueText: 'font-semibold',
          statusContainer: 'col-span-2 flex flex-wrap gap-4 mt-3'
        };

      case 'elegant':
        return {
          container: 'bg-amber-50 p-5 border-2 border-amber-300 rounded-lg',
          heading: 'font-bold text-amber-700 text-sm mb-4',
          grid: 'grid grid-cols-2 gap-4 text-sm',
          fieldLabel: 'block text-xs text-amber-600 uppercase tracking-wide mb-2 font-bold',
          fieldValue: 'font-mono bg-white px-2 py-1 border border-amber-300 rounded inline-block',
          fieldValueText: 'font-medium',
          statusContainer: 'col-span-2 flex flex-wrap gap-4 mt-3 pt-3 border-t border-amber-300'
        };

      case 'minimal':
        return {
          container: 'border-t border-gray-200 pt-4',
          heading: 'text-xs uppercase tracking-widest mb-3 font-bold',
          grid: 'grid grid-cols-2 gap-3 text-xs',
          fieldLabel: 'block text-[10px] uppercase tracking-wider mb-1 font-semibold',
          fieldValue: 'font-mono bg-gray-100 px-2 py-1 inline-block',
          fieldValueText: 'font-medium',
          statusContainer: 'col-span-2 flex flex-wrap gap-3 mt-2'
        };

      case 'colorful':
        return {
          container: 'bg-white rounded-2xl p-5 shadow-md border-2 border-purple-200',
          heading: 'font-black text-purple-600 text-base mb-4',
          grid: 'grid grid-cols-2 gap-4 text-sm',
          fieldLabel: 'block text-xs text-purple-500 uppercase tracking-wide mb-2 font-bold',
          fieldValue: 'font-mono bg-purple-50 px-3 py-1.5 border border-purple-200 rounded-lg inline-block',
          fieldValueText: 'font-bold',
          statusContainer: 'col-span-2 flex flex-wrap gap-4 mt-3'
        };

      case 'professional':
        return {
          container: 'bg-slate-700 rounded-lg p-5 border border-slate-600',
          heading: 'font-bold text-blue-400 text-sm mb-4',
          grid: 'grid grid-cols-2 gap-4 text-sm',
          fieldLabel: 'block text-xs text-blue-300 uppercase tracking-wide mb-2 font-semibold',
          fieldValue: 'font-mono bg-slate-800 px-2 py-1 border border-slate-600 rounded inline-block text-slate-200',
          fieldValueText: 'font-medium text-slate-200',
          statusContainer: 'col-span-2 flex flex-wrap gap-4 mt-3'
        };

      case 'playful':
        return {
          container: 'bg-white rounded-3xl p-5 shadow-lg border-2 border-orange-200',
          heading: 'font-black text-orange-600 text-base mb-4',
          grid: 'grid grid-cols-2 gap-4 text-sm',
          fieldLabel: 'block text-xs text-orange-500 uppercase tracking-wide mb-2 font-bold',
          fieldValue: 'font-mono bg-orange-50 px-3 py-1.5 border-2 border-orange-200 rounded-xl inline-block',
          fieldValueText: 'font-bold',
          statusContainer: 'col-span-2 flex flex-wrap gap-4 mt-3'
        };

      case 'swiss':
        return {
          container: 'border-2 border-red-600 p-5',
          heading: 'font-bold uppercase text-xs mb-4',
          grid: 'grid grid-cols-2 gap-4 text-sm',
          fieldLabel: 'block text-[10px] uppercase tracking-wider mb-2 font-bold text-slate-600',
          fieldValue: 'font-mono bg-gray-50 px-2 py-1 border border-gray-300 inline-block',
          fieldValueText: 'font-medium',
          statusContainer: 'col-span-2 flex flex-wrap gap-4 mt-3 pt-3 border-t border-gray-300'
        };

      case 'compact':
      default:
        return {
          container: 'border border-slate-300 p-3',
          heading: 'text-[10px] font-bold uppercase tracking-wider mb-2',
          grid: 'grid grid-cols-2 gap-2 text-xs',
          fieldLabel: 'block text-[9px] text-slate-500 uppercase tracking-wider mb-1 font-bold',
          fieldValue: 'font-mono bg-slate-50 px-1.5 py-0.5 text-[10px] border border-slate-200 inline-block',
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
        {data.vet && (
          <div className="col-span-2">
            <span className={styles.fieldLabel}>{t.labels.vet}</span>
            <span className={styles.fieldValueText}>{withFallback(data.vet)}</span>
          </div>
        )}
        <div className={styles.statusContainer}>
          <StatusItem label={t.labels.neutered} active={data.isNeutered} />
          <StatusItem label={t.labels.vaccination} active={data.hasVaccination} />
          <StatusItem label={t.labels.registration} active={data.hasRegistration} />
        </div>
      </div>
    </div>
  );
};

export default LegalSection;
