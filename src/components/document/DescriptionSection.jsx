import React from 'react';
import { isEmptyText } from '../../utils/documentHelpers.jsx';

/**
 * DescriptionSection component - displays pet description/character
 * Simplified for Swiss style 2026 with proper text alignment
 */
const DescriptionSection = ({ text, t, variant = 'classic' }) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'classic':
        return {
          container: '',
          heading: 'font-bold uppercase tracking-wider text-xs mb-3 pb-2 border-b-2 border-slate-900',
          text: 'text-sm leading-relaxed text-slate-700 text-left'
        };

      case 'modern':
        return {
          container: '',
          heading: 'font-semibold text-sm mb-3 pb-2 border-b border-slate-200',
          text: 'text-sm leading-relaxed text-slate-700 text-left'
        };

      case 'swiss':
        return {
          container: '',
          heading: 'font-bold uppercase tracking-wider text-xs mb-3 pb-2 border-b-2 border-red-600',
          text: 'text-sm leading-relaxed text-slate-700 text-left'
        };

      case 'compact':
      default:
        return {
          container: '',
          heading: 'text-[10px] font-bold uppercase tracking-wider mb-2 pb-1 border-b border-slate-300',
          text: 'text-[11px] leading-relaxed text-slate-700 text-left'
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
