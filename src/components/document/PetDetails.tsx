import React from 'react';
import { getGenderLabel, formatAge, formatWeight, withFallback } from '../../utils/documentHelpers';
import type { FormData } from '../../types/form';
import type { DocumentVariant } from './OwnerInfo';

export interface PetDetailsProps {
  data: FormData;
  t: Record<string, unknown>;
  variant?: DocumentVariant;
  customColors?: unknown;
}

interface VariantStyles {
  container: string;
  heading: string;
  grid: string;
  fieldLabel: string;
  fieldValueLarge: string;
  fieldValue: string;
}

/**
 * PetDetails component - displays pet information grid
 * Simplified for Swiss style 2026 with proper alignment
 */
const PetDetails: React.FC<PetDetailsProps> = ({ data, t, variant = 'classic' }) => {
  const getVariantStyles = (): VariantStyles => {
    switch (variant) {
      case 'classic':
        return {
          container: '',
          heading: 'font-bold uppercase tracking-wider text-xs mb-4 pb-2 border-b-2 border-slate-900',
          grid: 'grid grid-cols-2 gap-y-4 gap-x-6',
          fieldLabel: 'block text-[10px] text-slate-600 uppercase tracking-wide mb-1.5 font-semibold',
          fieldValueLarge: 'font-bold text-lg text-slate-900',
          fieldValue: 'text-sm font-medium text-slate-700'
        };

      case 'modern':
        return {
          container: '',
          heading: 'font-semibold text-sm mb-4 pb-2 border-b border-slate-200',
          grid: 'grid grid-cols-2 gap-y-3 gap-x-6',
          fieldLabel: 'block text-xs text-slate-500 uppercase tracking-wide mb-1.5 font-medium',
          fieldValueLarge: 'font-semibold text-lg text-slate-900',
          fieldValue: 'text-sm font-medium text-slate-700'
        };

      case 'swiss':
        return {
          container: '',
          heading: 'font-bold uppercase tracking-wider text-xs mb-4 pb-2 border-b-2 border-red-600',
          grid: 'grid grid-cols-2 gap-y-4 gap-x-6',
          fieldLabel: 'block text-[10px] text-slate-600 uppercase tracking-wide mb-1.5 font-semibold',
          fieldValueLarge: 'font-bold text-lg text-slate-900',
          fieldValue: 'text-sm font-medium text-slate-700'
        };

      case 'compact':
      default:
        return {
          container: '',
          heading: 'text-[10px] font-bold uppercase tracking-wider mb-3 pb-1 border-b border-slate-300',
          grid: 'grid grid-cols-2 gap-y-2 gap-x-4',
          fieldLabel: 'block text-[9px] text-slate-500 uppercase tracking-wider mb-1 font-semibold',
          fieldValueLarge: 'font-bold text-sm text-slate-900',
          fieldValue: 'text-xs font-medium text-slate-700'
        };
    }
  };

  const styles = getVariantStyles();
  const doc = t.doc as Record<string, string>;
  const labels = t.labels as Record<string, string>;

  return (
    <div className={styles.container}>
      <h3 className={styles.heading}>{doc.sectionPet}</h3>
      <div className={styles.grid}>
        <div>
          <span className={styles.fieldLabel}>{labels.petName}</span>
          <div className={styles.fieldValueLarge}>{withFallback(data.name)}</div>
        </div>
        <div>
          <span className={styles.fieldLabel}>{labels.breed}</span>
          <div className={styles.fieldValue}>{withFallback(data.breed)}</div>
        </div>
        <div>
          <span className={styles.fieldLabel}>{labels.gender} / {labels.age}</span>
          <div className={styles.fieldValue}>
            {getGenderLabel(data.gender, t)} / {formatAge(data.age, t)}
          </div>
        </div>
        <div>
          <span className={styles.fieldLabel}>{labels.weight}</span>
          <div className={styles.fieldValue}>{formatWeight(data.weight, t)}</div>
        </div>
      </div>
    </div>
  );
};

export default PetDetails;
