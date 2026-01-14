import React from 'react';
import { Camera } from 'lucide-react';
import { getPetTypeIcon } from '../../utils/documentHelpers.jsx';

/**
 * PetPhoto component - displays pet photo with placeholder and pet type badge
 * @param {string} photo - Photo URL
 * @param {string} petType - 'dog', 'cat', or 'other'
 * @param {Object} t - Translations object
 * @param {string} variant - Template variant ('classic', 'modern', etc.)
 */
const PetPhoto = ({ photo, petType, t, variant = 'classic' }) => {
  // Variant-specific styles
  const getVariantStyles = () => {
    switch (variant) {
      case 'classic':
        return {
          container: 'aspect-[3/4] w-full bg-slate-100 flex items-center justify-center overflow-hidden relative rounded-none border-4 border-slate-900',
          image: 'w-full h-full object-cover grayscale',
          placeholder: 'text-slate-300 text-center',
          placeholderIcon: 32,
          placeholderText: 'text-xs',
          badge: 'absolute top-0 right-0 bg-slate-900 text-white p-3',
          badgeIcon: 20
        };

      case 'modern':
        return {
          container: 'aspect-square w-full bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center overflow-hidden relative rounded-2xl border-4 border-rose-400 shadow-lg',
          image: 'w-full h-full object-cover',
          placeholder: 'text-rose-200 text-center',
          placeholderIcon: 40,
          placeholderText: 'text-sm font-medium',
          badge: 'absolute bottom-3 right-3 bg-gradient-to-r from-rose-400 to-pink-400 text-white p-2 rounded-full shadow-md',
          badgeIcon: 18
        };

      case 'elegant':
        return {
          container: 'aspect-[3/4] w-full bg-amber-50 flex items-center justify-center overflow-hidden relative rounded-lg border-4 border-amber-300',
          image: 'w-full h-full object-cover sepia',
          placeholder: 'text-amber-200 text-center',
          placeholderIcon: 36,
          placeholderText: 'text-sm',
          badge: 'absolute top-2 right-2 bg-amber-500 text-white p-2 rounded-full',
          badgeIcon: 18
        };

      case 'minimal':
        return {
          container: 'aspect-square w-full bg-gray-100 flex items-center justify-center overflow-hidden relative rounded-none',
          image: 'w-full h-full object-cover grayscale',
          placeholder: 'text-gray-300 text-center',
          placeholderIcon: 32,
          placeholderText: 'text-xs uppercase tracking-wider',
          badge: 'absolute top-0 left-0 bg-black text-white p-2',
          badgeIcon: 16
        };

      case 'colorful':
        return {
          container: 'aspect-square w-full bg-gradient-to-br from-purple-200 via-pink-200 to-blue-200 flex items-center justify-center overflow-hidden relative rounded-3xl shadow-xl',
          image: 'w-full h-full object-cover',
          placeholder: 'text-purple-300 text-center',
          placeholderIcon: 48,
          placeholderText: 'text-base font-bold',
          badge: 'absolute top-4 right-4 bg-white text-purple-600 p-3 rounded-full shadow-lg',
          badgeIcon: 20
        };

      case 'professional':
        return {
          container: 'aspect-[3/4] w-full bg-slate-800 flex items-center justify-center overflow-hidden relative rounded-lg border border-slate-600',
          image: 'w-full h-full object-cover',
          placeholder: 'text-slate-600 text-center',
          placeholderIcon: 36,
          placeholderText: 'text-sm',
          badge: 'absolute bottom-3 left-3 bg-blue-500 text-white p-2 rounded-md',
          badgeIcon: 18
        };

      case 'playful':
        return {
          container: 'aspect-square w-full bg-gradient-to-br from-yellow-200 to-orange-200 flex items-center justify-center overflow-hidden relative rounded-3xl border-4 border-orange-300 shadow-lg',
          image: 'w-full h-full object-cover',
          placeholder: 'text-orange-300 text-center',
          placeholderIcon: 44,
          placeholderText: 'text-base font-bold',
          badge: 'absolute top-3 right-3 bg-gradient-to-r from-orange-400 to-red-400 text-white p-3 rounded-full shadow-md',
          badgeIcon: 20
        };

      case 'swiss':
        return {
          container: 'aspect-[3/4] w-full bg-gray-50 flex items-center justify-center overflow-hidden relative border-2 border-red-600',
          image: 'w-full h-full object-cover',
          placeholder: 'text-gray-300 text-center',
          placeholderIcon: 32,
          placeholderText: 'text-xs uppercase font-bold',
          badge: 'absolute top-0 right-0 bg-red-600 text-white p-3',
          badgeIcon: 18
        };

      case 'compact':
      default:
        return {
          container: 'aspect-[3/4] w-full bg-slate-50 flex items-center justify-center overflow-hidden relative rounded border border-slate-300',
          image: 'w-full h-full object-cover',
          placeholder: 'text-slate-300 text-center',
          placeholderIcon: 28,
          placeholderText: 'text-xs',
          badge: 'absolute top-2 right-2 bg-slate-700 text-white p-2 rounded-md',
          badgeIcon: 16
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className={styles.container}>
      {photo ? (
        <img src={photo} className={styles.image} alt={t.ui.petPhotoAlt} />
      ) : (
        <div className={styles.placeholder}>
          <Camera size={styles.placeholderIcon} className="mx-auto mb-2 opacity-50" />
          <span className={styles.placeholderText}>{t.ui.noImage}</span>
        </div>
      )}
      <div className={styles.badge}>
        {getPetTypeIcon(petType, styles.badgeIcon)}
      </div>
    </div>
  );
};

export default PetPhoto;
