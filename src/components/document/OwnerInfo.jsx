import React from 'react';
import { Phone, Mail } from 'lucide-react';
import { formatAddress, withFallback } from '../../utils/documentHelpers.jsx';

/**
 * OwnerInfo component - displays owner information
 * Simplified for Swiss style 2026 with proper alignment
 */
const OwnerInfo = ({ data, t, variant = 'classic' }) => {
  const { streetLine, cityLine } = formatAddress(data.street, data.houseNumber, data.postal, data.city);

  const getVariantStyles = () => {
    switch (variant) {
      case 'classic':
        return {
          container: '',
          heading: 'font-bold uppercase tracking-wider text-xs mb-3 pb-2 border-b-2 border-slate-900',
          content: 'space-y-2',
          name: 'font-semibold text-base leading-tight text-slate-900',
          address: 'text-slate-600 text-sm leading-tight',
          contactContainer: 'pt-3 space-y-2 text-slate-600 text-xs',
          contactItem: 'flex items-center gap-2',
          iconSize: 12
        };

      case 'modern':
        return {
          container: '',
          heading: 'font-semibold text-sm mb-3 pb-2 border-b border-slate-200',
          content: 'space-y-2',
          name: 'font-semibold text-base text-slate-900',
          address: 'text-slate-600 text-sm',
          contactContainer: 'pt-3 space-y-2 text-slate-500 text-xs',
          contactItem: 'flex items-center gap-2',
          iconSize: 12
        };

      case 'swiss':
        return {
          container: '',
          heading: 'font-bold uppercase tracking-wider text-xs mb-3 pb-2 border-b-2 border-red-600',
          content: 'space-y-2',
          name: 'font-semibold text-base leading-tight text-slate-900',
          address: 'text-slate-600 text-sm leading-tight',
          contactContainer: 'pt-3 space-y-2 text-slate-600 text-xs',
          contactItem: 'flex items-center gap-2',
          iconSize: 12
        };

      case 'compact':
      default:
        return {
          container: '',
          heading: 'text-[10px] font-bold uppercase tracking-wider mb-2 pb-1 border-b border-slate-300',
          content: 'space-y-1.5',
          name: 'font-semibold text-sm text-slate-900',
          address: 'text-slate-600 text-xs',
          contactContainer: 'pt-2 space-y-1.5 text-slate-500 text-[10px]',
          contactItem: 'flex items-center gap-1.5',
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
            <Phone size={styles.iconSize} className="flex-shrink-0" /> 
            <span className="break-words">{withFallback(data.phone)}</span>
          </p>
          <p className={styles.contactItem}>
            <Mail size={styles.iconSize} className="flex-shrink-0" /> 
            <span className="break-words">{withFallback(data.email)}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OwnerInfo;
