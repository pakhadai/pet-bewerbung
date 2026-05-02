import React from 'react'
import type { FormData } from '../../types/form'
import type { TranslationObject } from '../../types/template'
import { formatAge, formatWeight, getGenderLabel, withFallback } from '../../utils/documentHelpers'
import { getPetDetailsTokens } from '../../templates/htmlVariantTokens'
import type { DocumentVariant } from './OwnerInfo'

export interface PetDetailsProps {
  data: FormData
  t: TranslationObject
  variant?: DocumentVariant
  customColors?: unknown
}

/**
 * PetDetails component - displays pet information grid
 * Simplified for Swiss style 2026 with proper alignment
 */
const PetDetails: React.FC<PetDetailsProps> = ({ data, t, variant = 'classic' }) => {
  const doc = t.doc
  const labels = t.labels as Record<string, string | undefined> | undefined

  if (variant === 'buddyTest') {
    const petTypeLabel =
      data.petType === 'dog'
        ? (labels?.dog ?? 'Dog')
        : data.petType === 'cat'
          ? (labels?.cat ?? 'Cat')
          : (labels?.other ?? 'Other')
    const typeColumnLabel = labels?.type ?? labels?.petType ?? 'Type'

    return (
      <div className="mb-1">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="rounded bg-amber-500 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-white">
            Test
          </span>
          <span className="text-[10px] font-medium uppercase tracking-wider text-amber-700">
            Experimental layout
          </span>
        </div>
        <h2 className="text-[3.15rem] sm:text-[3.5rem] leading-[0.98] font-black text-[color:var(--tpl-primary)] tracking-tight drop-shadow-sm">
          {withFallback(data.name)}
        </h2>
        <p className="text-[color:var(--tpl-accent)] font-semibold uppercase text-[11px] mt-3 tracking-[0.18em]">
          {withFallback(data.breed)}{' '}
          <span className="text-amber-300/80 normal-case tracking-normal">·</span>{' '}
          {getGenderLabel(data.gender, t)}
        </p>
        <div className="grid grid-cols-3 gap-2.5 mt-7">
          <div className="rounded-2xl bg-gradient-to-br from-[color:var(--tpl-light)] to-white p-3 ring-1 ring-[color:var(--tpl-border)]/30 min-w-0">
            <p className="text-[9px] text-[color:var(--tpl-muted)] uppercase tracking-widest font-bold">
              {labels?.age ?? 'Age'}
            </p>
            <p className="font-black text-lg text-[color:var(--tpl-primary)] mt-1">
              {formatAge(data.age, t)}
            </p>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-[color:var(--tpl-light)] to-white p-3 ring-1 ring-[color:var(--tpl-border)]/30 min-w-0">
            <p className="text-[9px] text-[color:var(--tpl-muted)] uppercase tracking-widest font-bold">
              {labels?.weight ?? 'Weight'}
            </p>
            <p className="font-black text-lg text-[color:var(--tpl-primary)] mt-1">
              {formatWeight(data.weight, t)}
            </p>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-[color:var(--tpl-light)] to-white p-3 ring-1 ring-[color:var(--tpl-border)]/30 min-w-0">
            <p className="text-[9px] text-[color:var(--tpl-muted)] uppercase tracking-widest font-bold">
              {typeColumnLabel}
            </p>
            <p className="font-bold text-sm text-[color:var(--tpl-primary)] mt-1 leading-snug">
              {petTypeLabel}
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (variant === 'buddy') {
    const petTypeLabel =
      data.petType === 'dog'
        ? (labels?.dog ?? 'Dog')
        : data.petType === 'cat'
          ? (labels?.cat ?? 'Cat')
          : (labels?.other ?? 'Other')
    const typeColumnLabel = labels?.type ?? labels?.petType ?? 'Type'

    return (
      <div className="mb-1">
        <h2 className="text-[2.65rem] leading-[1.05] font-extrabold text-[color:var(--tpl-primary)] tracking-tight">
          {withFallback(data.name)}
        </h2>
        <p className="text-[color:var(--tpl-accent)] font-medium uppercase text-xs mt-2 tracking-[0.2em]">
          {withFallback(data.breed)}{' '}
          <span className="text-[color:var(--tpl-muted)]/60 normal-case tracking-normal">·</span>{' '}
          {getGenderLabel(data.gender, t)}
        </p>
        <div className="grid grid-cols-3 gap-3 mt-6">
          <div className="bg-[color:var(--tpl-light)] p-3 rounded-xl border-l-4 border-[color:var(--tpl-primary)] min-w-0">
            <p className="text-[9px] text-[color:var(--tpl-muted)] uppercase tracking-widest font-bold">
              {labels?.age ?? 'Age'}
            </p>
            <p className="font-bold text-base text-[color:var(--tpl-primary)] mt-1">
              {formatAge(data.age, t)}
            </p>
          </div>
          <div className="bg-[color:var(--tpl-light)] p-3 rounded-xl border-l-4 border-[color:var(--tpl-primary)] min-w-0">
            <p className="text-[9px] text-[color:var(--tpl-muted)] uppercase tracking-widest font-bold">
              {labels?.weight ?? 'Weight'}
            </p>
            <p className="font-bold text-base text-[color:var(--tpl-primary)] mt-1">
              {formatWeight(data.weight, t)}
            </p>
          </div>
          <div className="bg-[color:var(--tpl-light)] p-3 rounded-xl border-l-4 border-[color:var(--tpl-primary)] min-w-0">
            <p className="text-[9px] text-[color:var(--tpl-muted)] uppercase tracking-widest font-bold">
              {typeColumnLabel}
            </p>
            <p className="font-bold text-sm text-[color:var(--tpl-primary)] mt-1 leading-snug">
              {petTypeLabel}
            </p>
          </div>
        </div>
      </div>
    )
  }

  const styles = getPetDetailsTokens(variant)
  const labelsMain = t.labels

  return (
    <div className={styles.container}>
      <h3 className={styles.heading}>{doc?.sectionPet ?? 'Pet details'}</h3>
      <div className={styles.grid}>
        <div>
          <span className={styles.fieldLabel}>{labelsMain?.petName ?? 'Name'}</span>
          <div className={styles.fieldValueLarge}>{withFallback(data.name)}</div>
        </div>
        <div>
          <span className={styles.fieldLabel}>{labelsMain?.breed ?? 'Breed'}</span>
          <div className={styles.fieldValue}>{withFallback(data.breed)}</div>
        </div>
        <div>
          <span className={styles.fieldLabel}>
            {labelsMain?.gender ?? 'Gender'} / {labelsMain?.age ?? 'Age'}
          </span>
          <div className={styles.fieldValue}>
            {getGenderLabel(data.gender, t)} / {formatAge(data.age, t)}
          </div>
        </div>
        <div>
          <span className={styles.fieldLabel}>{labelsMain?.weight ?? 'Weight'}</span>
          <div className={styles.fieldValue}>{formatWeight(data.weight, t)}</div>
        </div>
      </div>
    </div>
  )
}

export default PetDetails
