/**
 * SwissDocument - Main document orchestrator
 * Routes to specific template implementations based on templateType
 * Reduced from 1,652 lines to ~200 lines through template extraction
 */

import React from 'react'
import { getTemplateTokens } from '../templates/templateTokens'
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
  const tokens = getTemplateTokens(templateType)
  const colors = tokens.pdf.colors
  const styleOverrides = getStyleOverrides(templateType)
  const TemplateComponent = getTemplateComponent(templateType)

  const cssVars = {
    '--tpl-primary': colors.primary,
    '--tpl-accent': colors.accent,
    '--tpl-border': colors.border,
    '--tpl-muted': colors.muted,
    '--tpl-light': colors.light,
    '--tpl-body-text': colors.bodyText,
    '--tpl-doc-padding': tokens.html.documentPadding,
  } as React.CSSProperties

  return (
    <div className={config.container} style={cssVars}>
      <TemplateComponent
        data={data}
        t={t}
        customColors={null}
        config={config}
        styleOverrides={styleOverrides}
        variant={templateType}
      />
    </div>
  )
}

export default SwissDocument
