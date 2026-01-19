import React from 'react';
import { isEmptyText } from '../../utils/documentHelpers.jsx';

/**
 * DescriptionSection component - displays pet description/character
 * @param {string} text - Description text
 * @param {Object} t - Translations object
 * @param {string} variant - Template variant
 */
const DescriptionSection = ({ text, t, variant = 'classic' }) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'classic':
        return {
          container: 'flex-1 min-h-0 overflow-hidden',
          heading: 'font-black uppercase tracking-wider text-[10px] mb-2 border-b-2 border-slate-900 pb-1',
          text: 'text-[11px] leading-snug text-slate-700 text-justify overflow-hidden'
        };

      case 'modern':
        return {
          container: 'flex-1 min-h-0 overflow-hidden',
          heading: 'font-bold text-rose-600 text-[10px] mb-2 pb-1 border-b-2 border-rose-200',
          text: 'text-[11px] leading-snug text-slate-700 overflow-hidden'
        };

      case 'elegant':
        return {
          container: 'grow',
          heading: 'font-bold text-amber-700 text-sm mb-4 border-b-2 border-amber-400 pb-2',
          text: 'text-sm leading-relaxed text-slate-700 font-serif'
        };

      case 'minimal':
        return {
          container: 'border-t border-gray-200 pt-4 mt-4',
          heading: 'text-xs uppercase tracking-widest mb-3 font-bold',
          text: 'text-sm leading-relaxed'
        };

      case 'colorful':
        return {
          container: 'bg-white rounded-2xl p-5 shadow-md',
          heading: 'font-black text-purple-600 text-base mb-4',
          text: 'text-sm leading-relaxed text-slate-700'
        };

      case 'professional':
        return {
          container: 'grow',
          heading: 'font-bold text-blue-400 text-sm mb-4 border-b border-slate-600 pb-2',
          text: 'text-sm leading-relaxed text-slate-200'
        };

      case 'playful':
        return {
          container: 'bg-white rounded-3xl p-5 shadow-lg',
          heading: 'font-black text-orange-600 text-base mb-4',
          text: 'text-sm leading-relaxed text-slate-700'
        };

      case 'swiss':
        return {
          container: 'grow',
          heading: 'font-bold uppercase text-xs mb-4 border-b-2 border-red-600 pb-2',
          text: 'text-sm leading-relaxed text-slate-700'
        };

      case 'compact':
      default:
        return {
          container: 'flex-1 min-h-0 overflow-hidden',
          heading: 'text-[9px] font-bold uppercase tracking-wider mb-1 border-b border-slate-300 pb-0.5',
          text: 'text-[10px] leading-snug text-slate-700 overflow-hidden'
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className={styles.container}>
      <h3 className={styles.heading}>{t.doc.sectionAbout}</h3>
      <div className={styles.text}>
        {isEmptyText(text) ? (
          <span className="text-slate-300 italic">{t.ui.noDescription}</span>
        ) : (
          text
        )}
      </div>
    </div>
  );
};

export default DescriptionSection;
