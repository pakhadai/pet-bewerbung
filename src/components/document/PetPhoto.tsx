import React from 'react';
import { Camera } from 'lucide-react';
import { getPetTypeIcon } from '../../utils/documentHelpers';
import type { PetType } from '../../types/form';
import type { DocumentVariant } from './OwnerInfo';
import type { TranslationObject } from '../../types/template';

export interface PetPhotoProps {
  photo: string | null | undefined;
  petType?: PetType;
  t: TranslationObject;
  variant?: DocumentVariant;
  customColors?: unknown;
}

interface VariantStyles {
  container: string;
  image: string;
  placeholder: string;
  placeholderIcon: number;
  placeholderText: string;
  badge: string;
  badgeIcon: number;
}

/**
 * PetPhoto component - displays pet photo with placeholder and pet type badge
 * Simplified for Swiss style 2026
 */
const PetPhoto: React.FC<PetPhotoProps> = ({ photo, petType = 'dog', t, variant = 'classic' }) => {
  const getVariantStyles = (): VariantStyles => {
    switch (variant) {
      case 'classic':
        return {
          container: 'aspect-[3/4] w-full bg-slate-50 flex items-center justify-center overflow-hidden relative border-2 border-slate-900',
          image: 'w-full h-full object-cover',
          placeholder: 'text-slate-300 text-center',
          placeholderIcon: 32,
          placeholderText: 'text-xs text-slate-400',
          badge: 'absolute top-2 right-2 bg-slate-900 text-white p-2 rounded-sm',
          badgeIcon: 16
        };

      case 'modern':
        return {
          container:
            'aspect-[3/4] w-full bg-white flex items-center justify-center overflow-hidden relative border border-teal-200 rounded-xl shadow-md ring-2 ring-teal-100/80',
          image: 'w-full h-full object-cover',
          placeholder: 'text-slate-300 text-center',
          placeholderIcon: 32,
          placeholderText: 'text-xs text-slate-400',
          badge: 'absolute top-2 right-2 bg-teal-700 text-white p-2 rounded-lg shadow-sm',
          badgeIcon: 16
        };

      case 'swiss':
        return {
          container: 'aspect-[3/4] w-full bg-gray-50 flex items-center justify-center overflow-hidden relative border-2 border-red-600',
          image: 'w-full h-full object-cover',
          placeholder: 'text-gray-300 text-center',
          placeholderIcon: 32,
          placeholderText: 'text-xs text-slate-400',
          badge: 'absolute top-2 right-2 bg-red-600 text-white p-2 rounded-sm',
          badgeIcon: 16
        };

      case 'buddy':
        return {
          container:
            'aspect-[4/5] w-full bg-[#eff4ff] flex items-center justify-center overflow-hidden relative rounded-br-[3.5rem] border-0',
          image: 'w-full h-full object-cover',
          placeholder: 'text-slate-300 text-center',
          placeholderIcon: 32,
          placeholderText: 'text-xs text-slate-400',
          badge: 'absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full border border-[#bec9c7]/50 shadow-sm',
          badgeIcon: 14,
        };

      case 'buddyTest':
        return {
          container:
            'aspect-[4/5] w-full bg-gradient-to-b from-[#eff4ff] to-[#fffbeb] flex items-center justify-center overflow-hidden relative rounded-br-[4rem] border-4 border-amber-300/50 shadow-[0_12px_40px_-12px_rgba(245,158,11,0.35)]',
          image: 'w-full h-full object-cover',
          placeholder: 'text-slate-300 text-center',
          placeholderIcon: 36,
          placeholderText: 'text-xs text-slate-500',
          badge: 'absolute top-2 right-2 bg-amber-500 text-white px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider shadow',
          badgeIcon: 12,
        };

      case 'compact':
      default:
        return {
          container:
            'aspect-[3/4] w-full bg-white flex items-center justify-center overflow-hidden relative border border-amber-700/50 rounded-none',
          image: 'w-full h-full object-cover',
          placeholder: 'text-stone-300 text-center',
          placeholderIcon: 24,
          placeholderText: 'text-[10px] text-stone-500',
          badge: 'absolute top-1.5 right-1.5 bg-amber-800 text-white p-1.5 rounded-sm',
          badgeIcon: 14
        };
    }
  };

  const styles = getVariantStyles();
  const ui = t.ui;

  return (
    <div className={styles.container}>
      {photo ? (
        <img src={photo} className={styles.image} alt={ui?.petPhotoAlt ?? 'Pet photo'} />
      ) : (
        <div className={styles.placeholder}>
          <Camera size={styles.placeholderIcon} className="mx-auto mb-2 opacity-40" />
          <span className={styles.placeholderText}>{ui?.noImage ?? 'No image'}</span>
        </div>
      )}
      <div className={styles.badge}>
        {getPetTypeIcon(petType, styles.badgeIcon)}
      </div>
    </div>
  );
};

export default PetPhoto;
