import React from 'react';
import { getGenderLabel, formatAge, formatWeight, withFallback } from '../../utils/documentHelpers';
import type { FormData } from '../../types/form';
import type { DocumentVariant } from './OwnerInfo';
import type { TranslationObject } from '../../types/template';

export interface PetDetailsProps {
  data: FormData;
  t: TranslationObject;
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
  const doc = t.doc;
  const labels = t.labels as Record<string, string | undefined> | undefined;

  if (variant === 'buddyTest') {
    const petTypeLabel =
      data.petType === 'dog'
        ? (labels?.dog ?? 'Dog')
        : data.petType === 'cat'
          ? (labels?.cat ?? 'Cat')
          : (labels?.other ?? 'Other');
    const typeColumnLabel = labels?.type ?? labels?.petType ?? 'Type';

    return (
      <div className="mb-1">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="rounded bg-amber-500 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-white">
            Test
          </span>
          <span className="text-[10px] font-medium uppercase tracking-wider text-amber-700">Experimental layout</span>
        </div>
        <h2 className="text-[3.15rem] sm:text-[3.5rem] leading-[0.98] font-black text-[#004541] tracking-tight drop-shadow-sm">
          {withFallback(data.name)}
        </h2>
        <p className="text-[#b45309] font-semibold uppercase text-[11px] mt-3 tracking-[0.18em]">
          {withFallback(data.breed)} <span className="text-amber-300/80 normal-case tracking-normal">·</span>{' '}
          {getGenderLabel(data.gender, t)}
        </p>
        <div className="grid grid-cols-3 gap-2.5 mt-7">
          <div className="rounded-2xl bg-gradient-to-br from-[#eff4ff] to-[#fff7ed] p-3 ring-1 ring-amber-300/50 min-w-0">
            <p className="text-[9px] text-[#3f4947] uppercase tracking-widest font-bold">{labels?.age ?? 'Age'}</p>
            <p className="font-black text-lg text-[#004541] mt-1">{formatAge(data.age, t)}</p>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-[#eff4ff] to-[#fff7ed] p-3 ring-1 ring-amber-300/50 min-w-0">
            <p className="text-[9px] text-[#3f4947] uppercase tracking-widest font-bold">{labels?.weight ?? 'Weight'}</p>
            <p className="font-black text-lg text-[#004541] mt-1">{formatWeight(data.weight, t)}</p>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-[#eff4ff] to-[#fff7ed] p-3 ring-1 ring-amber-300/50 min-w-0">
            <p className="text-[9px] text-[#3f4947] uppercase tracking-widest font-bold">{typeColumnLabel}</p>
            <p className="font-bold text-sm text-[#004541] mt-1 leading-snug">{petTypeLabel}</p>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'buddy') {
    const petTypeLabel =
      data.petType === 'dog'
        ? (labels?.dog ?? 'Dog')
        : data.petType === 'cat'
          ? (labels?.cat ?? 'Cat')
          : (labels?.other ?? 'Other');
    const typeColumnLabel = labels?.type ?? labels?.petType ?? 'Type';

    return (
      <div className="mb-1">
        <h2 className="text-[2.65rem] leading-[1.05] font-extrabold text-[#004541] tracking-tight">
          {withFallback(data.name)}
        </h2>
        <p className="text-[#006b5f] font-medium uppercase text-xs mt-2 tracking-[0.2em]">
          {withFallback(data.breed)} <span className="text-[#94a3b8] normal-case tracking-normal">·</span>{' '}
          {getGenderLabel(data.gender, t)}
        </p>
        <div className="grid grid-cols-3 gap-3 mt-6">
          <div className="bg-[#eff4ff] p-3 rounded-xl border-l-4 border-[#004541] min-w-0">
            <p className="text-[9px] text-[#3f4947] uppercase tracking-widest font-bold">{labels?.age ?? 'Age'}</p>
            <p className="font-bold text-base text-[#004541] mt-1">{formatAge(data.age, t)}</p>
          </div>
          <div className="bg-[#eff4ff] p-3 rounded-xl border-l-4 border-[#004541] min-w-0">
            <p className="text-[9px] text-[#3f4947] uppercase tracking-widest font-bold">{labels?.weight ?? 'Weight'}</p>
            <p className="font-bold text-base text-[#004541] mt-1">{formatWeight(data.weight, t)}</p>
          </div>
          <div className="bg-[#eff4ff] p-3 rounded-xl border-l-4 border-[#004541] min-w-0">
            <p className="text-[9px] text-[#3f4947] uppercase tracking-widest font-bold">{typeColumnLabel}</p>
            <p className="font-bold text-sm text-[#004541] mt-1 leading-snug">{petTypeLabel}</p>
          </div>
        </div>
      </div>
    );
  }

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
          heading:
            'font-bold text-base mb-4 pl-3 border-l-4 border-teal-500 text-slate-900',
          grid: 'grid grid-cols-2 gap-y-3 gap-x-6',
          fieldLabel: 'block text-xs text-teal-900/60 uppercase tracking-wide mb-1.5 font-semibold',
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
          heading:
            'text-[10px] font-mono font-bold uppercase tracking-[0.2em] mb-2 pb-1 border-b border-dashed border-stone-500 text-stone-900',
          grid: 'grid grid-cols-2 gap-y-2 gap-x-4',
          fieldLabel: 'block text-[9px] text-amber-900/70 uppercase tracking-wider mb-1 font-semibold',
          fieldValueLarge: 'font-bold text-sm text-stone-900',
          fieldValue: 'text-xs font-medium text-stone-800'
        };
    }
  };

  const styles = getVariantStyles();
  const labelsMain = t.labels;

  return (
    <div className={styles.container}>
      <h3 className={styles.heading}>{doc?.sectionPet ?? 'Pet details'}</h3>
      <div className={styles.grid}>
        <div>
          <span className={styles.fieldLabel}>{labelsMain?.petName ?? 'Name'}</span>
          <div className={styles.fieldValueLarge}>{withFallback(data.name)}</div>
        </div>
        <div>
          <span className={styles.fieldLabel}>{labelsMain?.breed ?? 'Breed'}</span>
          <div className={styles.fieldValue}>{withFallback(data.breed)}</div>
        </div>
        <div>
          <span className={styles.fieldLabel}>{labelsMain?.gender ?? 'Gender'} / {labelsMain?.age ?? 'Age'}</span>
          <div className={styles.fieldValue}>
            {getGenderLabel(data.gender, t)} / {formatAge(data.age, t)}
          </div>
        </div>
        <div>
          <span className={styles.fieldLabel}>{labelsMain?.weight ?? 'Weight'}</span>
          <div className={styles.fieldValue}>{formatWeight(data.weight, t)}</div>
        </div>
      </div>
    </div>
  );
};

export default PetDetails;
