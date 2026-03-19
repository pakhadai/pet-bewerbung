import React, { useState, useEffect } from 'react';
import { Phone, Mail } from 'lucide-react';
import { formatAddress, withFallback } from '../../utils/documentHelpers';
import { generateQrDataUrl, getQrContent } from '../../utils/qrCode';
import type { FormData } from '../../types/form';
import type { TranslationObject } from '../../types/template';

export type DocumentVariant = 'classic' | 'modern' | 'swiss' | 'compact';

export interface OwnerInfoProps {
  data: FormData;
  t: TranslationObject;
  variant?: DocumentVariant;
  customColors?: unknown;
}

interface VariantStyles {
  container: string;
  heading: string;
  content: string;
  name: string;
  address: string;
  contactContainer: string;
  contactItem: string;
  iconSize: number;
}

/**
 * OwnerInfo component - displays owner information
 * Simplified for Swiss style 2026 with proper alignment
 */
const OwnerInfo: React.FC<OwnerInfoProps> = ({ data, t, variant = 'classic' }) => {
  const { streetLine, cityLine } = formatAddress(data.street, data.houseNumber, data.postal, data.city);

  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  useEffect(() => {
    let cancelled = false;
    const content = getQrContent(data);
    if (content) {
      generateQrDataUrl(content, { size: 120, margin: 1 }).then(url => {
        if (!cancelled) setQrDataUrl(url);
      });
    } else {
      setQrDataUrl(null);
    }
    return () => { cancelled = true; };
  }, [data.ownerName, data.email, data.phone, data.street, data.houseNumber, data.postal, data.city]);

  const getVariantStyles = (): VariantStyles => {
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
  const doc = t?.doc;

  return (
    <div className={styles.container}>
      <h3 className={styles.heading}>{doc?.sectionOwner}</h3>
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
        {qrDataUrl && (
          <div className="mt-2 pt-2 border-t border-dashed border-slate-200">
            <p className="text-[7px] uppercase tracking-wider text-slate-400 mb-1">
              {doc?.qrLabel ?? 'Kontakt scannen'}
            </p>
            <img src={qrDataUrl} alt="QR vCard" width={56} height={56} className="w-14 h-14" />
            <p className="text-[6px] text-slate-400 mt-0.5">
              {doc?.qrHint ?? 'vCard hinzufügen'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerInfo;
