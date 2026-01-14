import React from 'react';
import { Clock, Volume2 } from 'lucide-react';
import { withFallback } from '../../utils/documentHelpers.jsx';

/**
 * BehaviorSection component - displays behavior and daily routine
 * @param {Object} data - Behavior data (noiseLevel, aloneTime, activeHours, behaviorWithChildren, behaviorWithPets)
 * @param {Object} t - Translations object
 * @param {string} variant - Template variant
 */
const BehaviorSection = ({ data, t, variant = 'classic' }) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'classic':
        return {
          container: 'bg-stone-50 p-3 border-2 border-slate-200',
          heading: 'font-black uppercase tracking-wider text-[10px] mb-2',
          grid: 'grid grid-cols-2 gap-2 text-xs',
          fieldLabel: 'block text-[9px] text-slate-600 uppercase tracking-wide mb-1 font-bold',
          fieldValue: 'font-medium text-[10px]',
          badge: 'inline-block px-2 py-0.5 rounded-full text-[9px] font-semibold',
          badgeLow: 'bg-green-100 text-green-700',
          badgeMedium: 'bg-yellow-100 text-yellow-700',
          badgeHigh: 'bg-red-100 text-red-700',
          badgeGood: 'bg-green-100 text-green-700',
          badgeNeutral: 'bg-gray-100 text-gray-700',
          iconContainer: 'flex items-center gap-1'
        };

      case 'modern':
      case 'colorful':
        return {
          container: 'bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl p-3 border border-rose-200',
          heading: 'font-bold text-rose-600 text-[10px] mb-2',
          grid: 'grid grid-cols-2 gap-2 text-xs',
          fieldLabel: 'block text-[9px] text-rose-400 uppercase tracking-wide mb-1 font-semibold',
          fieldValue: 'font-semibold text-[10px]',
          badge: 'inline-block px-2 py-0.5 rounded-lg text-[9px] font-bold',
          badgeLow: 'bg-green-200 text-green-800',
          badgeMedium: 'bg-yellow-200 text-yellow-800',
          badgeHigh: 'bg-red-200 text-red-800',
          badgeGood: 'bg-green-200 text-green-800',
          badgeNeutral: 'bg-gray-200 text-gray-800',
          iconContainer: 'flex items-center gap-1'
        };

      case 'professional':
        return {
          container: 'bg-slate-700 rounded-lg p-3 border border-slate-600',
          heading: 'font-bold text-blue-400 text-[10px] mb-2',
          grid: 'grid grid-cols-2 gap-2 text-xs',
          fieldLabel: 'block text-[9px] text-blue-300 uppercase tracking-wide mb-1 font-semibold',
          fieldValue: 'font-medium text-slate-200 text-[10px]',
          badge: 'inline-block px-2 py-0.5 rounded-md text-[9px] font-semibold',
          badgeLow: 'bg-green-500/20 text-green-300',
          badgeMedium: 'bg-yellow-500/20 text-yellow-300',
          badgeHigh: 'bg-red-500/20 text-red-300',
          badgeGood: 'bg-green-500/20 text-green-300',
          badgeNeutral: 'bg-gray-500/20 text-gray-300',
          iconContainer: 'flex items-center gap-1 text-slate-200'
        };

      case 'minimal':
        return {
          container: 'border-t border-gray-200 pt-3 mt-3',
          heading: 'text-[10px] uppercase tracking-widest mb-2 font-bold',
          grid: 'grid grid-cols-2 gap-2 text-xs',
          fieldLabel: 'block text-[9px] uppercase tracking-wider mb-1 font-semibold',
          fieldValue: 'font-medium text-[10px]',
          badge: 'inline-block px-2 py-0.5 border text-[9px] font-medium',
          badgeLow: 'border-green-500 text-green-700',
          badgeMedium: 'border-yellow-500 text-yellow-700',
          badgeHigh: 'border-red-500 text-red-700',
          badgeGood: 'border-green-500 text-green-700',
          badgeNeutral: 'border-gray-500 text-gray-700',
          iconContainer: 'flex items-center gap-1'
        };

      default:
        return {
          container: 'border border-slate-300 p-3',
          heading: 'text-[10px] font-bold uppercase tracking-wider mb-2',
          grid: 'grid grid-cols-2 gap-2 text-xs',
          fieldLabel: 'block text-[9px] text-slate-500 uppercase tracking-wider mb-1 font-bold',
          fieldValue: 'font-medium text-[10px]',
          badge: 'inline-block px-2 py-0.5 rounded text-[9px] font-semibold',
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
      <h3 className={styles.heading}>{t.labels.behaviorWithChildren.split(' ')[0]} & {t.labels.aloneTime.split(' ')[0]}</h3>
      <div className={styles.grid}>
        <div>
          <span className={styles.fieldLabel}>{t.labels.noiseLevel}</span>
          <div className={styles.iconContainer}>
            <Volume2 size={14} />
            {getNoiseLevelBadge()}
          </div>
        </div>

        {data.aloneTime && (
          <div>
            <span className={styles.fieldLabel}>{t.labels.aloneTime}</span>
            <div className={styles.iconContainer}>
              <Clock size={14} />
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
