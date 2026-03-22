import React from 'react';
import { Clock, Volume2 } from 'lucide-react';
import { withFallback } from '../../utils/documentHelpers';
import type { FormData } from '../../types/form';
import type { DocumentVariant } from './OwnerInfo';
import { getShowAdvancedHealthInfo } from '../../utils/getShowAdvancedHealthInfo';
import type { TranslationObject } from '../../types/template';

export interface BehaviorSectionProps {
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
  badge: string;
  badgeLow: string;
  badgeMedium: string;
  badgeHigh: string;
  badgeGood: string;
  badgeNeutral: string;
  iconContainer: string;
}

/**
 * BehaviorSection component - displays behavior and daily routine
 * Simplified for Swiss style 2026
 */
const BehaviorSection: React.FC<BehaviorSectionProps> = ({ data, t, variant = 'classic' }) => {
  if (!getShowAdvancedHealthInfo(data)) return null;
  const getVariantStyles = (): VariantStyles => {
    switch (variant) {
      case 'classic':
        return {
          container: 'bg-slate-50 p-3 border-2 border-slate-200',
          heading: 'font-bold uppercase tracking-wider text-[10px] mb-2',
          grid: 'grid grid-cols-2 gap-y-2 gap-x-3',
          fieldLabel: 'block text-[9px] text-slate-600 uppercase tracking-wide mb-1 font-semibold',
          fieldValue: 'font-medium text-xs',
          badge: 'inline-block px-2 py-0.5 rounded text-[9px] font-semibold',
          badgeLow: 'bg-green-100 text-green-700',
          badgeMedium: 'bg-yellow-100 text-yellow-700',
          badgeHigh: 'bg-red-100 text-red-700',
          badgeGood: 'bg-green-100 text-green-700',
          badgeNeutral: 'bg-gray-100 text-gray-700',
          iconContainer: 'flex items-center gap-1.5'
        };

      case 'modern':
        return {
          container: 'bg-teal-50/60 p-3 border border-teal-200/80 rounded-xl shadow-sm',
          heading: 'font-bold text-xs mb-2 pl-2 border-l-4 border-teal-500 text-teal-950',
          grid: 'grid grid-cols-2 gap-y-2 gap-x-3',
          fieldLabel: 'block text-[9px] text-teal-900/65 uppercase tracking-wide mb-1 font-semibold',
          fieldValue: 'font-medium text-xs',
          badge: 'inline-block px-2 py-0.5 rounded text-[9px] font-semibold',
          badgeLow: 'bg-green-100 text-green-700',
          badgeMedium: 'bg-yellow-100 text-yellow-700',
          badgeHigh: 'bg-red-100 text-red-700',
          badgeGood: 'bg-green-100 text-green-700',
          badgeNeutral: 'bg-gray-100 text-gray-700',
          iconContainer: 'flex items-center gap-1.5'
        };

      case 'swiss':
        return {
          container: 'bg-gray-50 p-3 border-2 border-red-600',
          heading: 'font-bold uppercase tracking-wider text-[10px] mb-2',
          grid: 'grid grid-cols-2 gap-y-2 gap-x-3',
          fieldLabel: 'block text-[9px] text-slate-600 uppercase tracking-wide mb-1 font-semibold',
          fieldValue: 'font-medium text-xs',
          badge: 'inline-block px-2 py-0.5 rounded text-[9px] font-semibold',
          badgeLow: 'bg-green-100 text-green-700',
          badgeMedium: 'bg-yellow-100 text-yellow-700',
          badgeHigh: 'bg-red-100 text-red-700',
          badgeGood: 'bg-green-100 text-green-700',
          badgeNeutral: 'bg-gray-100 text-gray-700',
          iconContainer: 'flex items-center gap-1.5'
        };

      case 'buddy':
        return {
          container: 'bg-white p-3 border border-[#d3e4fe] rounded-xl shadow-sm',
          heading: 'text-[#004541] font-semibold text-sm uppercase tracking-wider mb-3 pb-2 border-b border-[#d3e4fe]',
          grid: 'grid grid-cols-2 gap-y-3 gap-x-3',
          fieldLabel: 'block text-[9px] text-[#3f4947] uppercase tracking-wide mb-1 font-semibold',
          fieldValue: 'font-medium text-xs text-[#0b1c30]',
          badge: 'inline-block px-2 py-0.5 rounded-full text-[9px] font-semibold',
          badgeLow: 'bg-[#e0f2f1] text-[#004541]',
          badgeMedium: 'bg-amber-100 text-amber-900',
          badgeHigh: 'bg-red-100 text-red-800',
          badgeGood: 'bg-[#e0f2f1] text-[#004541]',
          badgeNeutral: 'bg-slate-100 text-slate-700',
          iconContainer: 'flex items-center gap-1.5',
        };

      case 'buddyTest':
        return {
          container: 'bg-white/90 p-3 border-2 border-amber-200/70 rounded-2xl shadow-md ring-1 ring-amber-100',
          heading: 'text-[#0f3d3a] font-bold text-xs uppercase tracking-[0.12em] mb-3 pb-2 border-b-2 border-amber-300/40',
          grid: 'grid grid-cols-2 gap-y-3 gap-x-3',
          fieldLabel: 'block text-[9px] text-amber-900/80 uppercase tracking-wide mb-1 font-bold',
          fieldValue: 'font-medium text-xs text-[#0b1c30]',
          badge: 'inline-block px-2 py-0.5 rounded-full text-[9px] font-semibold',
          badgeLow: 'bg-emerald-100 text-emerald-900',
          badgeMedium: 'bg-amber-100 text-amber-900',
          badgeHigh: 'bg-red-100 text-red-800',
          badgeGood: 'bg-emerald-100 text-emerald-900',
          badgeNeutral: 'bg-slate-100 text-slate-700',
          iconContainer: 'flex items-center gap-1.5',
        };

      case 'compact':
      default:
        return {
          container: 'bg-amber-50/50 p-2 border border-dashed border-amber-800/35 rounded-sm',
          heading: 'text-[9px] font-mono font-bold uppercase tracking-widest mb-2 text-amber-950',
          grid: 'grid grid-cols-2 gap-y-1.5 gap-x-2',
          fieldLabel: 'block text-[9px] text-stone-600 uppercase tracking-wider mb-0.5 font-semibold',
          fieldValue: 'font-medium text-[10px]',
          badge: 'inline-block px-1.5 py-0.5 rounded text-[8px] font-semibold',
          badgeLow: 'bg-green-100 text-green-700',
          badgeMedium: 'bg-yellow-100 text-yellow-700',
          badgeHigh: 'bg-red-100 text-red-700',
          badgeGood: 'bg-green-100 text-green-700',
          badgeNeutral: 'bg-gray-100 text-gray-700',
          iconContainer: 'flex items-center gap-1'
        };
    }
  };

  const styles = getVariantStyles();
  const labels = t.labels;

  const getNoiseLevelBadge = () => {
    const level = (data.noiseLevel || 'low') as 'low' | 'medium' | 'high';
    const badgeClass = level === 'low' ? styles.badgeLow : level === 'medium' ? styles.badgeMedium : styles.badgeHigh;
    const label = level === 'low'
      ? labels?.noiseLow
      : level === 'medium'
        ? labels?.noiseMedium
        : labels?.noiseHigh;

    return <span className={`${styles.badge} ${badgeClass}`}>{label}</span>;
  };

  const getBehaviorBadge = (behavior: string | undefined) => {
    if (!behavior) return withFallback('');
    const badgeClass = behavior === 'good' ? styles.badgeGood : styles.badgeNeutral;
    const label = behavior === 'good'
      ? labels?.behaviorGood
      : behavior === 'neutral'
        ? labels?.behaviorNeutral
        : labels?.behaviorAvoid;

    return <span className={`${styles.badge} ${badgeClass}`}>{label}</span>;
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.heading}>{labels?.behaviorTitle ?? 'Behavior'}</h3>
      <div className={styles.grid}>
        <div>
            <span className={styles.fieldLabel}>{labels?.noiseLevel ?? 'Noise level'}</span>
          <div className={styles.iconContainer}>
            <Volume2 size={12} className="flex-shrink-0" />
            {getNoiseLevelBadge()}
          </div>
        </div>

        {data.aloneTime && (
          <div>
            <span className={styles.fieldLabel}>{labels?.aloneTime ?? 'Alone time'}</span>
            <div className={styles.iconContainer}>
              <Clock size={12} className="flex-shrink-0" />
              <span className={styles.fieldValue}>{data.aloneTime}h</span>
            </div>
          </div>
        )}

        {data.activeHours && (
          <div className="col-span-2">
            <span className={styles.fieldLabel}>{labels?.activeHours ?? 'Active hours'}</span>
            <span className={styles.fieldValue}>{data.activeHours}</span>
          </div>
        )}

        {data.behaviorWithChildren && (
          <div>
            <span className={styles.fieldLabel}>{labels?.behaviorWithChildren ?? 'With children'}</span>
            {getBehaviorBadge(data.behaviorWithChildren as string)}
          </div>
        )}

        {data.behaviorWithPets && (
          <div>
            <span className={styles.fieldLabel}>{labels?.behaviorWithPets ?? 'With pets'}</span>
            {getBehaviorBadge(data.behaviorWithPets as string)}
          </div>
        )}
      </div>
    </div>
  );
};

export default BehaviorSection;
