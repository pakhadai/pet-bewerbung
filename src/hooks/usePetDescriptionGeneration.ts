import { useCallback, useRef } from 'react'
import { generatePetDescriptionText } from '../services/textGenerationService'
import { useFormStore } from '../stores/formStore'
import type { PetData } from '../types/form'
import type { TranslationObject } from '../types/template'

type ShowToast = (msg: string, type?: 'success' | 'error' | 'info' | 'warning') => void

export interface UsePetDescriptionGenerationParams {
  data: PetData
  t: TranslationObject
  showToast: ShowToast
}

/**
 * Pet description text generator: cycles phrasing variants and writes to the form store.
 */
export function usePetDescriptionGeneration({
  data,
  t,
  showToast,
}: UsePetDescriptionGenerationParams): () => void {
  const updateData = useFormStore((s) => s.updateData)
  const generationVariantRef = useRef(0)

  return useCallback(() => {
    const labels = t?.labels || {}

    if (!t?.templates?.intro) {
      showToast(labels.pleaseWait || '…', 'info')
      return
    }

    const { text, nextVariantIndex } = generatePetDescriptionText(
      data,
      t,
      generationVariantRef.current
    )
    generationVariantRef.current = nextVariantIndex
    updateData('generatedText', text)
    showToast('✨ Text generiert!', 'success')
  }, [data, t, showToast, updateData])
}
