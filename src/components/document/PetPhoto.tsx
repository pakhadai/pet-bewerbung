import { Camera } from 'lucide-react'
import React from 'react'
import type { PetType } from '../../types/form'
import type { TranslationObject } from '../../types/template'
import { getPetPhotoTokens } from '../../templates/htmlVariantTokens'
import { getPetTypeIcon } from '../../utils/documentHelpers'
import type { DocumentVariant } from './OwnerInfo'

export interface PetPhotoProps {
  photo: string | null | undefined
  petType?: PetType
  t: TranslationObject
  variant?: DocumentVariant
  customColors?: unknown
}

/**
 * PetPhoto component - displays pet photo with placeholder and pet type badge
 * Simplified for Swiss style 2026
 */
const PetPhoto: React.FC<PetPhotoProps> = ({ photo, petType = 'dog', t, variant = 'classic' }) => {
  const styles = getPetPhotoTokens(variant)
  const ui = t.ui

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
      <div className={styles.badge}>{getPetTypeIcon(petType, styles.badgeIcon)}</div>
    </div>
  )
}

export default PetPhoto
