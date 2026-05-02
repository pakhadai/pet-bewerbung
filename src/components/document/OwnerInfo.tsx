import { Mail, Phone } from 'lucide-react'
import React, { useEffect, useMemo, useState } from 'react'
import type { FormData } from '../../types/form'
import type { TranslationObject } from '../../types/template'
import { getOwnerInfoTokens } from '../../templates/htmlVariantTokens'
import { formatAddress, withFallback } from '../../utils/documentHelpers'
import { generateQrDataUrl, getQrContent } from '../../utils/qrCode'

export type DocumentVariant = 'classic' | 'modern' | 'swiss' | 'compact' | 'buddy' | 'buddyTest'

export interface OwnerInfoProps {
  data: FormData
  t: TranslationObject
  variant?: DocumentVariant
  customColors?: unknown
}

/**
 * OwnerInfo component - displays owner information
 * Simplified for Swiss style 2026 with proper alignment
 */
const OwnerInfo: React.FC<OwnerInfoProps> = ({ data, t, variant = 'classic' }) => {
  const { ownerName, email, phone, street, houseNumber, postal, city } = data
  const { streetLine, cityLine } = formatAddress(street, houseNumber, postal, city)

  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null)

  const qrContent = useMemo(
    () =>
      getQrContent({
        ownerName,
        email,
        phone,
        street,
        houseNumber,
        postal,
        city,
      }),
    [ownerName, email, phone, street, houseNumber, postal, city]
  )

  useEffect(() => {
    let cancelled = false
    if (qrContent) {
      generateQrDataUrl(qrContent, { size: 120, margin: 1 }).then((url) => {
        if (!cancelled) setQrDataUrl(url)
      })
    } else {
      setQrDataUrl(null)
    }
    return () => {
      cancelled = true
    }
  }, [qrContent])

  const styles = getOwnerInfoTokens(variant)
  const doc = t?.doc

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
            <p className="text-[6px] text-slate-400 mt-0.5">{doc?.qrHint ?? 'vCard hinzufügen'}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default OwnerInfo
