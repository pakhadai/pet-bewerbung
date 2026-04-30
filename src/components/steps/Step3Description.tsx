/**
 * Step3Description - Template-based pet description generation
 */
import React from 'react'
import { MAX_DESCRIPTION_LENGTH } from '../../constants'
import { useWizardContext } from '../../context/WizardContext'
import { useFormStore } from '../../stores/formStore'
import type { FormData } from '../../types/form'
import MaterialIcon from '../MaterialIcon'

interface Step3DescriptionProps {
  onGenerate: () => void
  embedded?: boolean
}

const Step3Description: React.FC<Step3DescriptionProps> = ({ onGenerate, embedded = false }) => {
  const data = useFormStore((s) => s.data) as FormData
  const updateData = useFormStore((s) => s.updateData)
  const { t, animDir, darkMode } = useWizardContext()
  const canGenerate = !!(
    data.name ||
    data.petType ||
    data.breed ||
    data.age ||
    data.noiseLevel ||
    data.aloneTime ||
    data.activeHours ||
    data.behaviorWithChildren ||
    data.behaviorWithPets
  )
  const len = (data.generatedText || '').length
  const titleCl = darkMode ? 'text-white' : 'text-text-main'
  const mutedCl = darkMode ? 'text-gray-400' : 'text-text-secondary'
  const cardCl = darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'

  const petNameFallback = (t?.ui?.yourPet ?? 'your pet').toString()
  const petName = (data.name || petNameFallback).toString().trim() || petNameFallback
  const safeAppend = (text: string) => {
    const current = (data.generatedText || '').toString()
    const next = current.length > 0 ? `${current}\n\n${text}` : text
    updateData('generatedText', next.slice(0, MAX_DESCRIPTION_LENGTH))
  }
  const safeSet = (text: string) =>
    updateData('generatedText', text.slice(0, MAX_DESCRIPTION_LENGTH))

  const templates = [
    {
      id: 'short',
      label: t?.builder?.descTemplateShort ?? 'Short (2–3 sentences)',
      text:
        t?.builder?.descTemplateShortText ??
        `${petName} is calm, clean, and used to living in an apartment. ${petName} is well socialized and behaves quietly at home. We take responsibility and can provide references if needed.`,
    },
    {
      id: 'friendly',
      label: t?.builder?.descTemplateFriendly ?? 'Friendly (warm tone)',
      text:
        t?.builder?.descTemplateFriendlyText ??
        `${petName} is a friendly, gentle companion who is used to everyday routines at home. ${petName} is calm indoors, clean, and respectful with neighbors. We care a lot about a tidy home and are happy to answer any questions.`,
    },
    {
      id: 'formal',
      label: t?.builder?.descTemplateFormal ?? 'Formal (neutral)',
      text:
        t?.builder?.descTemplateFormalText ??
        `We would like to briefly introduce ${petName}. ${petName} is clean, calm indoors, and used to living in an apartment environment. We handle all responsibilities (care, cleanliness, and compliance) and can provide contact details for references upon request.`,
    },
  ] as const

  const content = (
    <div
      className={`flex flex-col gap-6 ${embedded ? '' : 'p-8 lg:p-12 hand-drawn-border border-2 rounded-2xl'} ${embedded ? '' : cardCl} ${embedded ? '' : 'shadow-lg relative'}`}
    >
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-end flex-wrap gap-2">
          <label
            htmlFor="pet-description"
            className={`${embedded ? 'text-lg md:text-xl' : 'text-3xl'} font-display font-bold ${titleCl}`}
          >
            {t?.labels?.tellUsAboutPet ?? 'Erzählen Sie uns von Ihrem Tier'}
          </label>
          <span
            className={`text-sm font-medium px-2 py-0.5 hand-drawn-border rounded ${mutedCl} ${darkMode ? 'bg-gray-700/50' : 'bg-white/80'}`}
          >
            {len} / {MAX_DESCRIPTION_LENGTH}
          </span>
        </div>
        <p className={`text-sm ${mutedCl}`}>
          {t?.labels?.descriptionHint ?? 'Persönlichkeit, Lieblingsspielzeug oder Eigenheiten.'}
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <div className={`text-xs font-semibold uppercase tracking-wide ${mutedCl}`}>
          {t?.builder?.quickStart ?? 'Quick start'}
        </div>
        <div className="flex flex-wrap gap-2">
          {templates.map((tpl) => (
            <button
              key={tpl.id}
              type="button"
              onClick={() =>
                (data.generatedText || '').trim().length ? safeAppend(tpl.text) : safeSet(tpl.text)
              }
              className={`text-sm font-semibold px-3 py-2 rounded-xl border transition-colors ${
                darkMode
                  ? 'border-gray-700 text-gray-100 hover:bg-gray-750'
                  : 'border-gray-200 text-text-main hover:bg-gray-50'
              }`}
              title={t?.builder?.insertTemplateHint ?? 'Insert a ready-to-use text you can edit'}
            >
              <span className="inline-flex items-center gap-2">
                <MaterialIcon name="edit_note" className="text-lg" />
                {tpl.label}
              </span>
            </button>
          ))}
          <button
            type="button"
            onClick={() => safeSet('')}
            className={`text-sm font-semibold px-3 py-2 rounded-xl border transition-colors ${
              darkMode
                ? 'border-gray-700 text-gray-300 hover:bg-gray-750'
                : 'border-gray-200 text-text-secondary hover:bg-gray-50'
            }`}
            title={t?.builder?.clearTextHint ?? 'Clear the text field'}
          >
            <span className="inline-flex items-center gap-2">
              <MaterialIcon name="block" className="text-lg" />
              {t?.builder?.clearText ?? 'Clear'}
            </span>
          </button>
        </div>
      </div>

      <div className="relative">
        <textarea
          id="pet-description"
          maxLength={MAX_DESCRIPTION_LENGTH}
          rows={embedded ? 6 : 8}
          placeholder={t?.labels?.descriptionPlaceholder ?? 'Buddy ist ein temperamentvoller...'}
          className={`w-full p-6 text-lg font-medium hand-drawn-border border-2 rounded-xl resize-none outline-none transition-all placeholder:opacity-60
                ${darkMode ? 'bg-gray-800/80 border-gray-600 text-white focus:border-primary' : 'bg-white/90 border-gray-400 text-text-main focus:border-primary focus:ring-2 focus:ring-primary/20'}`}
          value={data.generatedText || ''}
          onChange={(e) =>
            updateData('generatedText', e.target.value.slice(0, MAX_DESCRIPTION_LENGTH))
          }
          onPaste={(e) => {
            // Keep description styling consistent: paste as plain text.
            e.preventDefault()
            const plain = e.clipboardData.getData('text/plain')
            const next = `${data.generatedText || ''}${plain}`
            updateData('generatedText', next.slice(0, MAX_DESCRIPTION_LENGTH))
          }}
        />
      </div>

      <div className="flex flex-col items-center gap-4 mt-2">
        <button
          type="button"
          onClick={onGenerate}
          disabled={!canGenerate}
          className={`group relative px-6 py-3 ${embedded ? 'text-base' : 'text-xl'} font-bold font-display hand-drawn-button w-full md:w-auto transition-all disabled:opacity-50 disabled:cursor-not-allowed
                ${darkMode ? 'text-gray-100 bg-primary/80 hover:bg-primary border-primary' : 'text-white bg-primary hover:bg-primary-dark border-primary'}`}
        >
          <span className="flex items-center justify-center gap-2">
            <MaterialIcon name="edit_note" className="text-2xl" />
            {t?.labels?.autoGenerateTextBtn ?? 'Automatic text generation'}
          </span>
        </button>
      </div>
    </div>
  )

  if (embedded) return content

  return (
    <div className={`page page-enter-${animDir} reveal fade-enter w-full max-w-2xl mx-auto pb-32`}>
      {content}
    </div>
  )
}

export default Step3Description
