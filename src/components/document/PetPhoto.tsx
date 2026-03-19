import React from 'react';
import { Camera } from 'lucide-react';
import { getPetTypeIcon } from '../../utils/documentHelpers';
import type { PetType } from '../../types/form';
import type { DocumentVariant } from './OwnerInfo';

export interface PetPhotoProps {
  photo: string | null | undefined;
  petType?: PetType;
  t: Record<string, unknown>;
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
          container: 'aspect-[3/4] w-full bg-slate-50 flex items-center justify-center overflow-hidden relative border border-slate-200 rounded-md',
          image: 'w-full h-full object-cover',
          placeholder: 'text-slate-300 text-center',
          placeholderIcon: 32,
          placeholderText: 'text-xs text-slate-400',
          badge: 'absolute top-2 right-2 bg-slate-700 text-white p-2 rounded-md',
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

      case 'compact':
      default:
        return {
          container: 'aspect-[3/4] w-full bg-slate-50 flex items-center justify-center overflow-hidden relative border border-slate-300 rounded',
          image: 'w-full h-full object-cover',
          placeholder: 'text-slate-300 text-center',
          placeholderIcon: 24,
          placeholderText: 'text-[10px] text-slate-400',
          badge: 'absolute top-1.5 right-1.5 bg-slate-700 text-white p-1.5 rounded',
          badgeIcon: 14
        };
    }
  };

  const styles = getVariantStyles();
  const ui = t.ui as Record<string, string>;

  return (
    <div className={styles.container}>
      {photo ? (
        <img src={photo} className={styles.image} alt={ui.petPhotoAlt} />
      ) : (
        <div className={styles.placeholder}>
          <Camera size={styles.placeholderIcon} className="mx-auto mb-2 opacity-40" />
          <span className={styles.placeholderText}>{ui.noImage}</span>
        </div>
      )}
      <div className={styles.badge}>
        {getPetTypeIcon(petType, styles.badgeIcon)}
      </div>
    </div>
  );
};

export default PetPhoto;
