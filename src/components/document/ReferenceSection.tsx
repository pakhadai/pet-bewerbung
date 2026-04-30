import { AlertCircle, Mail, Phone } from 'lucide-react'
import React from 'react'
import type { FormData } from '../../types/form'
import type { TranslationObject } from '../../types/template'
import { getShowAdvancedHealthInfo } from '../../utils/getShowAdvancedHealthInfo'
import type { DocumentVariant } from './OwnerInfo'

export interface ReferenceSectionProps {
  data: FormData
  t: TranslationObject
  variant?: DocumentVariant
  customColors?: unknown
}

interface VariantStyles {
  container: string
  heading: string
  columnsContainer: string
  subsection: string
  subheading: string
  grid: string
  fieldLabel: string
  fieldValue: string
  contactItem: string
  iconSize: number
}

/**
 * ReferenceSection component - displays previous landlord and emergency contact
 * 2-column layout for better space usage on A4
 */
const ReferenceSection: React.FC<ReferenceSectionProps> = ({ data, t, variant = 'classic' }) => {
  if (!getShowAdvancedHealthInfo(data)) return null
  const hasLandlordInfo =
    data.previousLandlordName || data.previousLandlordPhone || data.previousLandlordEmail
  const hasEmergencyInfo =
    data.emergencyContactName || data.emergencyContactPhone || data.secondaryEmergencyContact

  if (!hasLandlordInfo && !hasEmergencyInfo) {
    return null
  }

  const getVariantStyles = (): VariantStyles => {
    const classic = {
      container: 'bg-blue-50 p-2.5 border-2 border-blue-200 mt-2',
      heading:
        'font-bold uppercase tracking-wider text-[9px] mb-2 text-blue-900 pb-1.5 border-b border-blue-200',
      columnsContainer: 'grid grid-cols-2 gap-3',
      subsection: '',
      subheading: 'text-[8px] font-semibold uppercase tracking-wide mb-1 text-blue-700',
      grid: 'space-y-0.5 text-[10px]',
      fieldLabel: 'text-[8px] text-slate-500 uppercase tracking-wide',
      fieldValue: 'font-medium text-slate-800 text-[10px]',
      contactItem: 'flex items-center gap-1 text-[10px] text-slate-600',
      iconSize: 9,
    }

    const modern = {
      ...classic,
      container: 'bg-teal-50/80 p-2.5 border border-teal-200 rounded-xl mt-2 shadow-sm',
      heading:
        'font-bold text-[11px] mb-2 pl-2 border-l-4 border-teal-500 text-teal-950 pb-1.5 border-b border-teal-200/60',
      subheading: 'text-[8px] font-semibold uppercase tracking-wide mb-1 text-teal-800',
    }

    const compact = {
      ...classic,
      container: 'bg-amber-50/70 p-2 border border-dashed border-amber-700/40 rounded-sm mt-1.5',
      heading:
        'text-[8px] font-mono font-bold uppercase tracking-widest mb-1.5 pb-1 border-b border-dashed border-amber-700/50 text-amber-950',
      subheading: 'text-[8px] font-semibold uppercase tracking-wide mb-1 text-amber-900',
      grid: 'space-y-0.5 text-[9px]',
      fieldValue: 'font-medium text-[9px]',
      contactItem: 'flex items-center gap-1 text-[9px]',
      iconSize: 8,
    }

    const buddy = {
      ...modern,
      container: 'bg-[#e5eeff] p-4 border border-[#93c5fd]/60 rounded-2xl mt-2',
      heading: 'text-[#004541] font-bold text-lg mb-3 pb-2 border-b border-[#006b5f]/30',
      subheading: 'text-[9px] font-bold uppercase tracking-widest mb-1.5 text-[#006b5f]',
    }

    const buddyTest = {
      ...buddy,
      container:
        'bg-gradient-to-br from-[#e0f2fe] to-[#fffbeb] p-4 border-2 border-amber-200/70 rounded-2xl mt-2 shadow-sm',
      heading: 'text-[#0f3d3a] font-extrabold text-lg mb-3 pb-2 border-b-2 border-amber-300/50',
      subheading: 'text-[9px] font-black uppercase tracking-widest mb-1.5 text-amber-800',
    }

    switch (variant) {
      case 'buddyTest':
        return buddyTest
      case 'buddy':
        return buddy
      case 'modern':
        return modern
      case 'swiss':
        return { ...classic, container: 'bg-blue-50 p-2.5 border-2 border-red-600 mt-2' }
      case 'compact':
        return compact
      default:
        return classic
    }
  }

  const styles = getVariantStyles()
  const labels = t.labels
  const step2Emergency = t.step2Emergency

  return (
    <div className={styles.container}>
      <h3 className={styles.heading}>{labels?.referenceTitle ?? 'References'}</h3>

      <div className={styles.columnsContainer}>
        {/* Left column: Previous Landlord */}
        {hasLandlordInfo && (
          <div className={styles.subsection}>
            <h4 className={styles.subheading}>{labels?.previousLandlord ?? 'Previous landlord'}</h4>
            <div className={styles.grid}>
              {data.previousLandlordName && (
                <div className={styles.fieldValue}>{data.previousLandlordName}</div>
              )}
              {data.previousDuration && (
                <div className="text-slate-600">
                  <span className={styles.fieldLabel}>
                    {labels?.previousDuration ?? 'Duration'}:{' '}
                  </span>
                  <span>{data.previousDuration}</span>
                </div>
              )}
              {data.previousLandlordPhone && (
                <div className={styles.contactItem}>
                  <Phone size={styles.iconSize} className="flex-shrink-0" />
                  <span>{data.previousLandlordPhone}</span>
                </div>
              )}
              {data.previousLandlordEmail && (
                <div className={styles.contactItem}>
                  <Mail size={styles.iconSize} className="flex-shrink-0" />
                  <span className="break-all">{data.previousLandlordEmail}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Right column: Emergency Contact */}
        {hasEmergencyInfo && (
          <div className={styles.subsection}>
            <h4 className={styles.subheading}>{labels?.emergencyContact ?? 'Emergency contact'}</h4>
            <div className={styles.grid}>
              {data.emergencyContactName && (
                <div className={styles.fieldValue}>{data.emergencyContactName}</div>
              )}
              {data.emergencyContactRelation && (
                <div className="text-slate-600">
                  <span className={styles.fieldLabel}>
                    {labels?.emergencyContactRelation ?? 'Relation'}:{' '}
                  </span>
                  <span>{data.emergencyContactRelation}</span>
                </div>
              )}
              {data.emergencyContactPhone && (
                <div className={styles.contactItem}>
                  <AlertCircle size={styles.iconSize} className="flex-shrink-0" />
                  <span>{data.emergencyContactPhone}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Secondary contact - full width if exists */}
      {data.secondaryEmergencyContact && (
        <div className="mt-2 pt-1.5 border-t border-blue-200 text-[9px] text-slate-600">
          <span className={styles.fieldLabel}>
            {labels?.secondaryEmergencyContact ??
              step2Emergency?.secondaryContact ??
              'Zweiter Kontakt'}
            :{' '}
          </span>
          <span className={styles.fieldValue}>{data.secondaryEmergencyContact}</span>
        </div>
      )}
    </div>
  )
}

export default ReferenceSection
