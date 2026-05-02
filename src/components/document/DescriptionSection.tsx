import React from 'react'
import type { TranslationObject } from '../../types/template'
import { getDescriptionSectionTokens } from '../../templates/htmlVariantTokens'
import { isEmptyText } from '../../utils/documentHelpers'
import type { DocumentVariant } from './OwnerInfo'

export interface DescriptionSectionProps {
  text: string | undefined
  t: TranslationObject
  variant?: DocumentVariant
  customColors?: unknown
}

/**
 * DescriptionSection component - displays pet description/character
 * Simplified for Swiss style 2026 with proper text alignment
 */
const DescriptionSection: React.FC<DescriptionSectionProps> = ({
  text,
  t,
  variant = 'classic',
}) => {
  const styles = getDescriptionSectionTokens(variant)
  const doc = t.doc
  const ui = t.ui

  return (
    <div className={styles.container}>
      <h3 className={styles.heading}>
        {styles.headingAccentBar && (
          <span
            className={`w-8 h-1 rounded-full shrink-0 ${styles.headingAccentBar}`}
            aria-hidden
          />
        )}
        {doc?.sectionAbout ?? 'Character'}
      </h3>
      <div className={styles.text}>
        {isEmptyText(text) ? (
          <span className={styles.emptyText ?? 'text-slate-300 italic'}>
            {ui?.noDescription ?? 'No description'}
          </span>
        ) : (
          text
        )}
      </div>
    </div>
  )
}

export default DescriptionSection
