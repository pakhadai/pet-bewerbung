import React from 'react';
import { Clock, Volume2 } from 'lucide-react';
import { withFallback } from '../../utils/documentHelpers.jsx';

/**
 * BehaviorSection component - displays behavior and daily routine
 * Simplified for Swiss style 2026
 */
const BehaviorSection = ({ data, t, variant = 'classic' }) => {
  const getVariantStyles = () => {
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
          container: 'bg-slate-50 p-3 border border-slate-200 rounded-md',
          heading: 'font-semibold text-xs mb-2',
          grid: 'grid grid-cols-2 gap-y-2 gap-x-3',
          fieldLabel: 'block text-[9px] text-slate-500 uppercase tracking-wide mb-1 font-medium',
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

      case 'compact':
      default:
        return {
          container: 'bg-slate-50 p-2.5 border border-slate-300 rounded',
          heading: 'text-[10px] font-bold uppercase tracking-wider mb-2',
          grid: 'grid grid-cols-2 gap-y-1.5 gap-x-2',
          fieldLabel: 'block text-[9px] text-slate-500 uppercase tracking-wider mb-0.5 font-semibold',
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

  const getNoiseLevelBadge = () => {
    const level = data.noiseLevel || 'low';
    const badgeClass = level === 'low' ? styles.badgeLow : level === 'medium' ? styles.badgeMedium : styles.badgeHigh;
    const label = level === 'low' ? t.labels.noiseLow : level === 'medium' ? t.labels.noiseMedium : t.labels.noiseHigh;

    return <span className={`${styles.badge} ${badgeClass}`}>{label}</span>;
  };

  const getBehaviorBadge = (behavior) => {
    if (!behavior) return withFallback('');
    const badgeClass = behavior === 'good' ? styles.badgeGood : styles.badgeNeutral;
    const label = behavior === 'good' ? t.labels.behaviorGood : behavior === 'neutral' ? t.labels.behaviorNeutral : t.labels.behaviorAvoid;

    return <span className={`${styles.badge} ${badgeClass}`}>{label}</span>;
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.heading}>{t.labels.behaviorTitle}</h3>
      <div className={styles.grid}>
        <div>
          <span className={styles.fieldLabel}>{t.labels.noiseLevel}</span>
          <div className={styles.iconContainer}>
            <Volume2 size={12} className="flex-shrink-0" />
            {getNoiseLevelBadge()}
          </div>
        </div>

        {data.aloneTime && (
          <div>
            <span className={styles.fieldLabel}>{t.labels.aloneTime}</span>
            <div className={styles.iconContainer}>
              <Clock size={12} className="flex-shrink-0" />
              <span className={styles.fieldValue}>{data.aloneTime}h</span>
            </div>
          </div>
        )}

        {data.activeHours && (
          <div className="col-span-2">
            <span className={styles.fieldLabel}>{t.labels.activeHours}</span>
            <span className={styles.fieldValue}>{data.activeHours}</span>
          </div>
        )}

        {data.behaviorWithChildren && (
          <div>
            <span className={styles.fieldLabel}>{t.labels.behaviorWithChildren}</span>
            {getBehaviorBadge(data.behaviorWithChildren)}
          </div>
        )}

        {data.behaviorWithPets && (
          <div>
            <span className={styles.fieldLabel}>{t.labels.behaviorWithPets}</span>
            {getBehaviorBadge(data.behaviorWithPets)}
          </div>
        )}
      </div>
    </div>
  );
};

export default BehaviorSection;
