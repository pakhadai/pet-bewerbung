import React from 'react';
import { isEmptyText } from '../../utils/documentHelpers';
import type { DocumentVariant } from './OwnerInfo';
import type { TranslationObject } from '../../types/template';

export interface DescriptionSectionProps {
  text: string | undefined;
  t: TranslationObject;
  variant?: DocumentVariant;
  customColors?: unknown;
}

interface VariantStyles {
  container: string;
  heading: string;
  text: string;
}

/**
 * DescriptionSection component - displays pet description/character
 * Simplified for Swiss style 2026 with proper text alignment
 */
const DescriptionSection: React.FC<DescriptionSectionProps> = ({ text, t, variant = 'classic' }) => {
  const getVariantStyles = (): VariantStyles => {
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
          heading:
            'font-bold text-base mb-3 pl-3 border-l-4 border-teal-500 text-slate-900',
          text: 'text-sm leading-relaxed text-slate-700 text-left'
        };

      case 'swiss':
        return {
          container: '',
          heading: 'font-bold uppercase tracking-wider text-xs mb-3 pb-2 border-b-2 border-red-600',
          text: 'text-sm leading-relaxed text-slate-700 text-left'
        };

      case 'buddy':
        return {
          container: '',
          heading:
            'text-xl font-bold text-[#004541] mb-3 flex items-center gap-2',
          text: 'text-sm leading-relaxed text-[#3f4947] text-left bg-white p-5 rounded-2xl border border-[#bec9c7]/30',
        };

      case 'buddyTest':
        return {
          container: '',
          heading: 'text-xl font-extrabold text-[#0f3d3a] mb-3 flex items-center gap-2',
          text: 'text-sm leading-relaxed text-[#422006] text-left bg-gradient-to-br from-white to-amber-50/40 p-5 rounded-2xl border-2 border-amber-200/50 shadow-inner',
        };

      case 'compact':
      default:
        return {
          container: '',
          heading:
            'text-[10px] font-mono font-bold uppercase tracking-[0.2em] mb-2 pb-1 border-b border-dashed border-stone-500 text-stone-900',
          text: 'text-[11px] leading-relaxed text-stone-800 text-left'
        };
    }
  };

  const styles = getVariantStyles();
  const doc = t.doc;
  const ui = t.ui;

  return (
    <div className={styles.container}>
      <h3 className={styles.heading}>
        {(variant === 'buddy' || variant === 'buddyTest') && (
          <span
            className={`w-8 h-1 rounded-full shrink-0 ${variant === 'buddyTest' ? 'bg-amber-500' : 'bg-[#006b5f]'}`}
            aria-hidden
          />
        )}
        {doc?.sectionAbout ?? 'Character'}
      </h3>
      <div className={styles.text}>
        {isEmptyText(text) ? (
          <span className="text-slate-300 italic">{ui?.noDescription ?? 'No description'}</span>
        ) : (
          text
        )}
      </div>
    </div>
  );
};

export default DescriptionSection;
