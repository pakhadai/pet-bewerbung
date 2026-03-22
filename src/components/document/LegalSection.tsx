import React from 'react';
import StatusItem from '../StatusItem';
import { withFallback } from '../../utils/documentHelpers';
import type { FormData } from '../../types/form';
import type { DocumentVariant } from './OwnerInfo';
import { getShowAdvancedHealthInfo } from '../../utils/getShowAdvancedHealthInfo';
import type { TranslationObject } from '../../types/template';

export interface LegalSectionProps {
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
  fieldValue: string;
  fieldValueText: string;
  statusContainer: string;
}

/**
 * LegalSection component - displays insurance and legal status
 * Simplified for Swiss style 2026 with proper alignment
 */
const LegalSection: React.FC<LegalSectionProps> = ({ data, t, variant = 'classic' }) => {
  if (!getShowAdvancedHealthInfo(data)) return null;
  const getVariantStyles = (): VariantStyles => {
    switch (variant) {
      case 'classic':
        return {
          container: 'bg-slate-50 p-2.5 border-2 border-slate-200',
          heading: 'font-bold uppercase tracking-wider text-[10px] mb-2',
          grid: 'grid grid-cols-2 gap-y-1.5 gap-x-3',
          fieldLabel: 'block text-[9px] text-slate-600 uppercase tracking-wide mb-0.5 font-semibold',
          fieldValue: 'font-mono bg-white px-1.5 py-0.5 border border-slate-200 text-[10px] inline-block',
          fieldValueText: 'font-medium text-[11px]',
          statusContainer: 'col-span-2 flex flex-wrap gap-3 mt-2 pt-2 border-t border-slate-200'
        };

      case 'modern':
        return {
          container: 'bg-teal-50/50 p-2.5 border border-teal-200 rounded-xl',
          heading: 'font-bold text-[11px] mb-2 pl-2 border-l-4 border-teal-500 text-teal-950',
          grid: 'grid grid-cols-2 gap-y-1.5 gap-x-3',
          fieldLabel: 'block text-[9px] text-teal-900/65 uppercase tracking-wide mb-0.5 font-semibold',
          fieldValue: 'font-mono bg-white px-1.5 py-0.5 border border-teal-200 rounded text-[10px] inline-block',
          fieldValueText: 'font-medium text-[11px]',
          statusContainer: 'col-span-2 flex flex-wrap gap-3 mt-2 pt-2 border-t border-teal-200/70'
        };

      case 'swiss':
        return {
          container: 'bg-gray-50 p-2.5 border-2 border-red-600',
          heading: 'font-bold uppercase tracking-wider text-[10px] mb-2',
          grid: 'grid grid-cols-2 gap-y-1.5 gap-x-3',
          fieldLabel: 'block text-[9px] text-slate-600 uppercase tracking-wide mb-0.5 font-semibold',
          fieldValue: 'font-mono bg-white px-1.5 py-0.5 border border-gray-300 text-[10px] inline-block',
          fieldValueText: 'font-medium text-[11px]',
          statusContainer: 'col-span-2 flex flex-wrap gap-3 mt-2 pt-2 border-t border-gray-300'
        };

      case 'buddy':
        return {
          container: 'bg-[#dce9ff] p-4 border border-[#93c5fd]/50 rounded-2xl',
          heading: 'text-[#004541] font-bold text-base mb-3 pb-2 border-b border-[#006b5f]/25',
          grid: 'grid grid-cols-2 gap-y-2 gap-x-4',
          fieldLabel: 'block text-[9px] text-[#3f4947] uppercase tracking-wide mb-0.5 font-semibold',
          fieldValue: 'font-mono bg-white px-1.5 py-0.5 border border-[#bec9c7] text-[10px] inline-block text-[#0b1c30]',
          fieldValueText: 'font-medium text-[11px] text-[#0b1c30]',
          statusContainer: 'col-span-2 flex flex-wrap gap-2 mt-2 pt-3 border-t border-[#93c5fd]/40',
        };

      case 'buddyTest':
        return {
          container: 'bg-gradient-to-br from-[#e0f2fe] to-[#fffbeb] p-4 border-2 border-amber-200/60 rounded-2xl shadow-sm',
          heading: 'text-[#0f3d3a] font-extrabold text-base mb-3 pb-2 border-b-2 border-amber-400/40',
          grid: 'grid grid-cols-2 gap-y-2 gap-x-4',
          fieldLabel: 'block text-[9px] text-[#92400e] uppercase tracking-wide mb-0.5 font-bold',
          fieldValue: 'font-mono bg-white px-1.5 py-0.5 border border-amber-200 text-[10px] inline-block text-[#0b1c30]',
          fieldValueText: 'font-medium text-[11px] text-[#0b1c30]',
          statusContainer: 'col-span-2 flex flex-wrap gap-2 mt-2 pt-3 border-t border-amber-200/60',
        };

      case 'compact':
      default:
        return {
          container: 'bg-white p-2 border border-dashed border-amber-800/40 rounded-sm',
          heading: 'text-[9px] font-mono font-bold uppercase tracking-widest mb-1.5 text-amber-950',
          grid: 'grid grid-cols-2 gap-y-1 gap-x-2',
          fieldLabel: 'block text-[8px] text-stone-600 uppercase tracking-wider mb-0.5 font-semibold',
          fieldValue: 'font-mono bg-stone-50 px-1 py-0.5 border border-stone-300 text-[9px] inline-block',
          fieldValueText: 'font-medium text-[10px]',
          statusContainer: 'col-span-2 flex flex-wrap gap-2 mt-1.5 pt-1.5 border-t border-dashed border-stone-400'
        };
    }
  };

  const styles = getVariantStyles();
  const doc = t.doc;
  const labels = t.labels;
  const step2Emergency = t.step2Emergency;

  return (
    <div className={styles.container}>
      <h3 className={styles.heading}>{doc?.sectionLegal ?? 'Legal'}</h3>
      <div className={styles.grid}>
        <div>
          <span className={styles.fieldLabel}>{labels?.chipId ?? 'Chip ID'}</span>
          <span className={styles.fieldValue}>{withFallback(data.chipId)}</span>
        </div>
        <div>
          <span className={styles.fieldLabel}>{labels?.insurance ?? 'Insurance'}</span>
          <span className={styles.fieldValueText}>{withFallback(data.insuranceProvider)}</span>
        </div>
        {(data.vetName || data.vetPhone) && (
          <div className="col-span-2">
            <span className={styles.fieldLabel}>{labels?.vet ?? 'Vet'}</span>
            <span className={styles.fieldValueText}>
              {[data.vetName, data.vetPhone].filter(Boolean).join(' · ') || '—'}
            </span>
          </div>
        )}
        <div className={styles.statusContainer}>
          <StatusItem label={labels?.neutered ?? 'Neutered'} active={data.isNeutered} />
          <StatusItem label={labels?.vaccination ?? 'Vaccinated'} active={data.hasVaccination} />
          <StatusItem label={labels?.registration ?? 'Registered'} active={data.hasRegistration} />
          <StatusItem label={labels?.willingToPayDeposit ?? 'Tierkaution'} active={data.willingToPayDeposit} />
        </div>
        {data.medicalConditions && (
          <div className="col-span-2 mt-1.5 pt-1.5 border-t border-slate-200">
            <span className={styles.fieldLabel}>{step2Emergency?.displayMedical ?? labels?.medicalConditions ?? 'Medizinische Angaben'}</span>
            <p className={`${styles.fieldValueText} text-[10px]`}>{data.medicalConditions}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LegalSection;
