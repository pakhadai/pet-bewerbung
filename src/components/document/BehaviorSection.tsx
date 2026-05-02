import { Clock, Volume2 } from 'lucide-react'
import React from 'react'
import type { FormData } from '../../types/form'
import type { TranslationObject } from '../../types/template'
import { getBehaviorSectionTokens } from '../../templates/htmlVariantTokens'
import { withFallback } from '../../utils/documentHelpers'
import { getShowAdvancedHealthInfo } from '../../utils/getShowAdvancedHealthInfo'
import type { DocumentVariant } from './OwnerInfo'

export interface BehaviorSectionProps {
  data: FormData
  t: TranslationObject
  variant?: DocumentVariant
  customColors?: unknown
}

/**
 * BehaviorSection component - displays behavior and daily routine
 * Simplified for Swiss style 2026
 */
const BehaviorSection: React.FC<BehaviorSectionProps> = ({ data, t, variant = 'classic' }) => {
  if (!getShowAdvancedHealthInfo(data)) return null
  const styles = getBehaviorSectionTokens(variant)
  const labels = t.labels

  const getNoiseLevelBadge = () => {
    const level = (data.noiseLevel || 'low') as 'low' | 'medium' | 'high'
    const badgeClass =
      level === 'low' ? styles.badgeLow : level === 'medium' ? styles.badgeMedium : styles.badgeHigh
    const label =
      level === 'low'
        ? labels?.noiseLow
        : level === 'medium'
          ? labels?.noiseMedium
          : labels?.noiseHigh

    return <span className={`${styles.badge} ${badgeClass}`}>{label}</span>
  }

  const getBehaviorBadge = (behavior: string | undefined) => {
    if (!behavior) return withFallback('')
    const badgeClass = behavior === 'good' ? styles.badgeGood : styles.badgeNeutral
    const label =
      behavior === 'good'
        ? labels?.behaviorGood
        : behavior === 'neutral'
          ? labels?.behaviorNeutral
          : labels?.behaviorAvoid

    return <span className={`${styles.badge} ${badgeClass}`}>{label}</span>
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.heading}>{labels?.behaviorTitle ?? 'Behavior'}</h3>
      <div className={styles.grid}>
        <div>
          <span className={styles.fieldLabel}>{labels?.noiseLevel ?? 'Noise level'}</span>
          <div className={styles.iconContainer}>
            <Volume2 size={12} className="flex-shrink-0" />
            {getNoiseLevelBadge()}
          </div>
        </div>

        {data.aloneTime && (
          <div>
            <span className={styles.fieldLabel}>{labels?.aloneTime ?? 'Alone time'}</span>
            <div className={styles.iconContainer}>
              <Clock size={12} className="flex-shrink-0" />
              <span className={styles.fieldValue}>{data.aloneTime}h</span>
            </div>
          </div>
        )}

        {data.activeHours && (
          <div className="col-span-2">
            <span className={styles.fieldLabel}>{labels?.activeHours ?? 'Active hours'}</span>
            <span className={styles.fieldValue}>{data.activeHours}</span>
          </div>
        )}

        {data.behaviorWithChildren && (
          <div>
            <span className={styles.fieldLabel}>
              {labels?.behaviorWithChildren ?? 'With children'}
            </span>
            {getBehaviorBadge(data.behaviorWithChildren as string)}
          </div>
        )}

        {data.behaviorWithPets && (
          <div>
            <span className={styles.fieldLabel}>{labels?.behaviorWithPets ?? 'With pets'}</span>
            {getBehaviorBadge(data.behaviorWithPets as string)}
          </div>
        )}
      </div>
    </div>
  )
}

export default BehaviorSection
