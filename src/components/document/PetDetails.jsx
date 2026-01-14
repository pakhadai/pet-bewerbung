import React from 'react';
import { getGenderLabel, formatAge, formatWeight, withFallback } from '../../utils/documentHelpers.jsx';

/**
 * PetDetails component - displays pet information grid
 * @param {Object} data - Pet data (name, breed, age, weight, gender)
 * @param {Object} t - Translations object
 * @param {string} variant - Template variant
 */
const PetDetails = ({ data, t, variant = 'classic' }) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'classic':
        return {
          container: '',
          heading: 'font-black uppercase tracking-wider text-xs mb-4 border-b-2 border-slate-900 pb-2',
          grid: 'grid grid-cols-2 gap-y-6 gap-x-8',
          fieldLabel: 'block text-[10px] text-slate-600 uppercase tracking-wide mb-1 font-bold',
          fieldValueLarge: 'font-black text-2xl',
          fieldValue: 'text-base font-medium'
        };

      case 'modern':
        return {
          container: '',
          heading: 'font-bold text-rose-600 text-sm mb-4 pb-2 border-b-2 border-rose-200',
          grid: 'grid grid-cols-2 gap-4',
          fieldLabel: 'block text-xs text-rose-400 uppercase tracking-wide mb-1 font-semibold',
          fieldValueLarge: 'font-black text-xl',
          fieldValue: 'text-base font-semibold'
        };

      case 'elegant':
        return {
          container: '',
          heading: 'font-bold text-amber-700 text-sm mb-4 border-b-2 border-amber-400 pb-2',
          grid: 'grid grid-cols-2 gap-5',
          fieldLabel: 'block text-xs text-amber-600 uppercase tracking-wide mb-1 font-bold',
          fieldValueLarge: 'font-bold text-xl text-amber-900',
          fieldValue: 'text-base font-medium text-slate-800'
        };

      case 'minimal':
        return {
          container: 'border-b border-gray-200 pb-4',
          heading: 'text-xs uppercase tracking-widest mb-3 font-bold',
          grid: 'grid grid-cols-2 gap-3',
          fieldLabel: 'block text-[10px] uppercase tracking-wider mb-1 font-semibold',
          fieldValueLarge: 'font-bold text-lg',
          fieldValue: 'text-sm font-medium'
        };

      case 'colorful':
        return {
          container: '',
          heading: 'font-black text-purple-600 text-base mb-4',
          grid: 'grid grid-cols-2 gap-4',
          fieldLabel: 'block text-xs text-purple-500 uppercase tracking-wide mb-1 font-bold',
          fieldValueLarge: 'font-black text-2xl text-purple-900',
          fieldValue: 'text-base font-bold text-slate-800'
        };

      case 'professional':
        return {
          container: '',
          heading: 'font-bold text-blue-400 text-sm mb-4 border-b border-slate-600 pb-2',
          grid: 'grid grid-cols-2 gap-4',
          fieldLabel: 'block text-xs text-blue-300 uppercase tracking-wide mb-1 font-semibold',
          fieldValueLarge: 'font-bold text-xl text-white',
          fieldValue: 'text-base font-medium text-slate-200'
        };

      case 'playful':
        return {
          container: '',
          heading: 'font-black text-orange-600 text-base mb-4',
          grid: 'grid grid-cols-2 gap-4',
          fieldLabel: 'block text-xs text-orange-500 uppercase tracking-wide mb-1 font-bold',
          fieldValueLarge: 'font-black text-2xl text-orange-900',
          fieldValue: 'text-base font-bold'
        };

      case 'swiss':
        return {
          container: '',
          heading: 'font-bold uppercase text-xs mb-4 border-b-2 border-red-600 pb-2',
          grid: 'grid grid-cols-2 gap-4',
          fieldLabel: 'block text-[10px] uppercase tracking-wider mb-1 font-bold text-slate-600',
          fieldValueLarge: 'font-bold text-xl',
          fieldValue: 'text-sm font-medium'
        };

      case 'compact':
      default:
        return {
          container: '',
          heading: 'text-[10px] font-bold uppercase tracking-wider mb-2 border-b border-slate-300 pb-1',
          grid: 'grid grid-cols-2 gap-3 text-xs',
          fieldLabel: 'block text-[9px] text-slate-500 uppercase tracking-wider mb-0.5 font-bold',
          fieldValueLarge: 'font-bold text-base',
          fieldValue: 'text-xs font-medium'
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className={styles.container}>
      <h3 className={styles.heading}>{t.doc.sectionPet}</h3>
      <div className={styles.grid}>
        <div>
          <span className={styles.fieldLabel}>{t.labels.petName}</span>
          <span className={styles.fieldValueLarge}>{withFallback(data.name)}</span>
        </div>
        <div>
          <span className={styles.fieldLabel}>{t.labels.breed}</span>
          <span className={styles.fieldValue}>{withFallback(data.breed)}</span>
        </div>
        <div>
          <span className={styles.fieldLabel}>{t.labels.gender} / {t.labels.age}</span>
          <span className={styles.fieldValue}>
            {getGenderLabel(data.gender, t)} / {formatAge(data.age, t)}
          </span>
        </div>
        <div>
          <span className={styles.fieldLabel}>{t.labels.weight}</span>
          <span className={styles.fieldValue}>{formatWeight(data.weight, t)}</span>
        </div>
      </div>
    </div>
  );
};

export default PetDetails;
