import React from 'react';
import { Phone, Mail } from 'lucide-react';
import { formatAddress, withFallback } from '../../utils/documentHelpers.jsx';

/**
 * OwnerInfo component - displays owner information
 * @param {Object} data - Owner data (ownerName, street, houseNumber, postal, city, phone, email)
 * @param {Object} t - Translations object
 * @param {string} variant - Template variant
 */
const OwnerInfo = ({ data, t, variant = 'classic' }) => {
  const { streetLine, cityLine } = formatAddress(data.street, data.houseNumber, data.postal, data.city);

  const getVariantStyles = () => {
    switch (variant) {
      case 'classic':
        return {
          container: '',
          heading: 'font-black uppercase tracking-wider text-xs mb-4 border-b-2 border-slate-900 pb-2',
          content: 'space-y-2',
          name: 'font-bold text-lg leading-tight',
          address: 'text-slate-600 text-sm leading-tight',
          contactContainer: 'pt-4 space-y-2 text-slate-500 text-xs',
          contactItem: 'flex items-center gap-2',
          iconSize: 12
        };

      case 'modern':
        return {
          container: 'bg-white rounded-xl p-4 shadow-sm',
          heading: 'font-bold text-rose-600 text-sm mb-3 pb-2 border-b-2 border-rose-200',
          content: 'space-y-2',
          name: 'font-bold text-base',
          address: 'text-slate-600 text-sm',
          contactContainer: 'pt-3 space-y-1.5 text-slate-500 text-xs',
          contactItem: 'flex items-center gap-2',
          iconSize: 12
        };

      case 'elegant':
        return {
          container: '',
          heading: 'font-bold text-amber-700 text-sm mb-3 border-b-2 border-amber-400 pb-2',
          content: 'space-y-2',
          name: 'font-bold text-base text-amber-900',
          address: 'text-slate-600 text-sm',
          contactContainer: 'pt-3 space-y-2 text-slate-600 text-xs',
          contactItem: 'flex items-center gap-2',
          iconSize: 12
        };

      case 'minimal':
        return {
          container: 'border-b border-gray-200 pb-4',
          heading: 'text-xs uppercase tracking-widest mb-3 font-bold',
          content: 'space-y-1',
          name: 'font-bold text-base',
          address: 'text-sm',
          contactContainer: 'pt-2 space-y-1 text-xs',
          contactItem: 'flex items-center gap-2',
          iconSize: 10
        };

      case 'colorful':
        return {
          container: 'bg-white rounded-2xl p-5 shadow-md',
          heading: 'font-black text-purple-600 text-sm mb-3',
          content: 'space-y-2',
          name: 'font-bold text-lg text-purple-900',
          address: 'text-slate-600 text-sm',
          contactContainer: 'pt-3 space-y-2 text-slate-600 text-xs',
          contactItem: 'flex items-center gap-2 bg-purple-50 px-2 py-1 rounded-lg',
          iconSize: 12
        };

      case 'professional':
        return {
          container: 'bg-slate-800 rounded-lg p-4',
          heading: 'font-bold text-blue-400 text-sm mb-3 border-b border-slate-600 pb-2',
          content: 'space-y-2',
          name: 'font-bold text-base text-white',
          address: 'text-slate-300 text-sm',
          contactContainer: 'pt-3 space-y-2 text-slate-400 text-xs',
          contactItem: 'flex items-center gap-2',
          iconSize: 12
        };

      case 'playful':
        return {
          container: 'bg-white rounded-3xl p-5 shadow-lg border-2 border-orange-200',
          heading: 'font-black text-orange-600 text-sm mb-3',
          content: 'space-y-2',
          name: 'font-bold text-lg text-orange-900',
          address: 'text-slate-600 text-sm',
          contactContainer: 'pt-3 space-y-2 text-slate-600 text-xs',
          contactItem: 'flex items-center gap-2',
          iconSize: 12
        };

      case 'swiss':
        return {
          container: '',
          heading: 'font-bold uppercase text-xs mb-3 border-b-2 border-red-600 pb-2',
          content: 'space-y-2',
          name: 'font-bold text-base',
          address: 'text-slate-600 text-sm',
          contactContainer: 'pt-3 space-y-2 text-slate-600 text-xs',
          contactItem: 'flex items-center gap-2',
          iconSize: 12
        };

      case 'compact':
      default:
        return {
          container: '',
          heading: 'text-[10px] font-bold uppercase tracking-wider mb-2 border-b border-slate-300 pb-1',
          content: 'space-y-1',
          name: 'font-bold text-sm',
          address: 'text-slate-600 text-xs',
          contactContainer: 'pt-2 space-y-1 text-slate-500 text-[10px]',
          contactItem: 'flex items-center gap-1',
          iconSize: 10
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className={styles.container}>
      <h3 className={styles.heading}>{t.doc.sectionOwner}</h3>
      <div className={styles.content}>
        <p className={styles.name}>{withFallback(data.ownerName)}</p>
        <p className={styles.address}>{streetLine}</p>
        <p className={styles.address}>{cityLine}</p>
        <div className={styles.contactContainer}>
          <p className={styles.contactItem}>
            <Phone size={styles.iconSize} /> {withFallback(data.phone)}
          </p>
          <p className={styles.contactItem}>
            <Mail size={styles.iconSize} /> {withFallback(data.email)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OwnerInfo;
