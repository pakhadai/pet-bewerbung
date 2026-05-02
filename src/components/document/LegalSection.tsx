import React from 'react'
import type { FormData } from '../../types/form'
import type { TranslationObject } from '../../types/template'
import { getLegalSectionTokens } from '../../templates/htmlVariantTokens'
import { withFallback } from '../../utils/documentHelpers'
import { getShowAdvancedHealthInfo } from '../../utils/getShowAdvancedHealthInfo'
import StatusItem from '../StatusItem'
import type { DocumentVariant } from './OwnerInfo'

export interface LegalSectionProps {
  data: FormData
  t: TranslationObject
  variant?: DocumentVariant
  customColors?: unknown
}

/**
 * LegalSection component - displays insurance and legal status
 * Simplified for Swiss style 2026 with proper alignment
 */
const LegalSection: React.FC<LegalSectionProps> = ({ data, t, variant = 'classic' }) => {
  if (!getShowAdvancedHealthInfo(data)) return null
  const styles = getLegalSectionTokens(variant)
  const doc = t.doc
  const labels = t.labels
  const step2Emergency = t.step2Emergency

  return (
    <div className={styles.container}>
      <h3 className={styles.heading}>{doc?.sectionLegal ?? 'Legal'}</h3>
      <div className={styles.grid}>
        <div>
          <span className={styles.fieldLabel}>{labels?.chipId ?? 'Chip ID'}</span>
          <span className={styles.fieldValue}>{withFallback(data.chipId)}</span>
        </div>
        <div>
          <span className={styles.fieldLabel}>{labels?.insurance ?? 'Insurance'}</span>
          <span className={styles.fieldValueText}>{withFallback(data.insuranceProvider)}</span>
        </div>
        {(data.vetName || data.vetPhone) && (
          <div className="col-span-2">
            <span className={styles.fieldLabel}>{labels?.vet ?? 'Vet'}</span>
            <span className={styles.fieldValueText}>
              {[data.vetName, data.vetPhone].filter(Boolean).join(' · ') || '—'}
            </span>
          </div>
        )}
        <div className={styles.statusContainer}>
          <StatusItem label={labels?.neutered ?? 'Neutered'} active={!!data.isNeutered} />
          <StatusItem label={labels?.vaccination ?? 'Vaccinated'} active={!!data.hasVaccination} />
          <StatusItem
            label={labels?.registration ?? 'Registered'}
            active={!!data.hasRegistration}
          />
          <StatusItem
            label={labels?.willingToPayDeposit ?? 'Tierkaution'}
            active={!!data.willingToPayDeposit}
          />
        </div>
        {data.medicalConditions && (
          <div className="col-span-2 mt-1.5 pt-1.5 border-t border-slate-200">
            <span className={styles.fieldLabel}>
              {step2Emergency?.displayMedical ??
                labels?.medicalConditions ??
                'Medizinische Angaben'}
            </span>
            <p className={`${styles.fieldValueText} text-[10px]`}>{data.medicalConditions}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default LegalSection
