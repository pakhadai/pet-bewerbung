/**
 * SwissDocument - Main document orchestrator
 * Routes to specific template implementations based on templateType
 * Reduced from 1,652 lines to ~200 lines through template extraction
 */

import React from 'react'
import type { PetData, TemplateType } from '../types/form'
import type { TranslationObject } from '../types/template'
import { getLocale, getStyleOverrides } from './templates/TemplateBase'
import { getTemplateConfig as getConfig, getTemplateComponent } from './templates/templateRegistry'

export interface SwissDocumentProps {
  data: PetData
  t: TranslationObject
  templateType?: TemplateType
}

const SwissDocument: React.FC<SwissDocumentProps> = ({ data, t, templateType = 'classic' }) => {
  const today = new Date().toLocaleDateString(getLocale(data.lang))
  const config = getConfig(templateType, today)
  const styleOverrides = getStyleOverrides()
  const TemplateComponent = getTemplateComponent(templateType)

  return (
    <div className={config.container}>
      <TemplateComponent
        data={data}
        t={t}
        customColors={null}
        config={config}
        styleOverrides={styleOverrides}
      />
    </div>
  )
}

export default SwissDocument
