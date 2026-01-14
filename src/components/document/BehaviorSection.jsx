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
          container: 'bg-stone-50 p-6 border-2 border-slate-200',
          heading: 'font-black uppercase tracking-wider text-xs mb-4',
          grid: 'grid grid-cols-2 gap-4 text-sm',
          fieldLabel: 'block text-[10px] text-slate-600 uppercase tracking-wide mb-2 font-bold',
          fieldValue: 'font-medium',
          badge: 'inline-block px-3 py-1 rounded-full text-xs font-semibold',
          badgeLow: 'bg-green-100 text-green-700',
          badgeMedium: 'bg-yellow-100 text-yellow-700',
          badgeHigh: 'bg-red-100 text-red-700',
          badgeGood: 'bg-green-100 text-green-700',
          badgeNeutral: 'bg-gray-100 text-gray-700',
          iconContainer: 'flex items-center gap-2'
        };

      case 'modern':
      case 'colorful':
        return {
          container: 'bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-5 border-2 border-rose-200',
          heading: 'font-bold text-rose-600 text-sm mb-4',
          grid: 'grid grid-cols-2 gap-4 text-sm',
          fieldLabel: 'block text-xs text-rose-400 uppercase tracking-wide mb-2 font-semibold',
          fieldValue: 'font-semibold',
          badge: 'inline-block px-3 py-1 rounded-lg text-xs font-bold',
          badgeLow: 'bg-green-200 text-green-800',
          badgeMedium: 'bg-yellow-200 text-yellow-800',
          badgeHigh: 'bg-red-200 text-red-800',
          badgeGood: 'bg-green-200 text-green-800',
          badgeNeutral: 'bg-gray-200 text-gray-800',
          iconContainer: 'flex items-center gap-2'
        };

      case 'professional':
        return {
          container: 'bg-slate-700 rounded-lg p-5 border border-slate-600',
          heading: 'font-bold text-blue-400 text-sm mb-4',
          grid: 'grid grid-cols-2 gap-4 text-sm',
          fieldLabel: 'block text-xs text-blue-300 uppercase tracking-wide mb-2 font-semibold',
          fieldValue: 'font-medium text-slate-200',
          badge: 'inline-block px-3 py-1 rounded-md text-xs font-semibold',
          badgeLow: 'bg-green-500/20 text-green-300',
          badgeMedium: 'bg-yellow-500/20 text-yellow-300',
          badgeHigh: 'bg-red-500/20 text-red-300',
          badgeGood: 'bg-green-500/20 text-green-300',
          badgeNeutral: 'bg-gray-500/20 text-gray-300',
          iconContainer: 'flex items-center gap-2 text-slate-200'
        };

      case 'minimal':
        return {
          container: 'border-t border-gray-200 pt-4 mt-4',
          heading: 'text-xs uppercase tracking-widest mb-3 font-bold',
          grid: 'grid grid-cols-2 gap-3 text-xs',
          fieldLabel: 'block text-[10px] uppercase tracking-wider mb-1 font-semibold',
          fieldValue: 'font-medium',
          badge: 'inline-block px-2 py-0.5 border text-xs font-medium',
          badgeLow: 'border-green-500 text-green-700',
          badgeMedium: 'border-yellow-500 text-yellow-700',
          badgeHigh: 'border-red-500 text-red-700',
          badgeGood: 'border-green-500 text-green-700',
          badgeNeutral: 'border-gray-500 text-gray-700',
          iconContainer: 'flex items-center gap-1'
        };

      default:
        return {
          container: 'border border-slate-300 p-4',
          heading: 'text-[10px] font-bold uppercase tracking-wider mb-3',
          grid: 'grid grid-cols-2 gap-3 text-xs',
          fieldLabel: 'block text-[9px] text-slate-500 uppercase tracking-wider mb-1 font-bold',
          fieldValue: 'font-medium',
          badge: 'inline-block px-2 py-0.5 rounded text-[10px] font-semibold',
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
