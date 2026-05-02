import type { TextProps } from '@react-pdf/renderer'
import {
  getTemplateTokens,
  type PdfColorTokens,
  type PdfReferencePanelTokens,
  TEMPLATE_TOKENS,
} from '../../../templates/templateTokens'
import type { TemplateType } from '../../../types/form'
import { pdfBorderRadius } from '../PdfBase'

export type PdfFooterBrandingVariant = 'freeCentered' | 'altSmall'

/** Slate title text used for modern PDF headings (matches classic primary). */
const MODERN_HEADING_TEXT = TEMPLATE_TOKENS.classic.pdf.colors.primary

export interface PdfTemplateConfig {
  templateType: TemplateType
  colors: PdfColorTokens
  photoHeight: number

  pagePadding?: number
  pageFontSize?: number

  footerBrandingVariant: PdfFooterBrandingVariant

  /** Page background (Classic white, Modern cool gray, Compact warm stone) */
  pageBackgroundColor: string
  /** Optional tint behind sidebar column */
  sidebarBackgroundColor?: string
  sidebarPadding?: number
  sidebarRadius?: number
}

export function getPdfTemplateConfig(templateType: TemplateType): PdfTemplateConfig {
  const tokens = getTemplateTokens(templateType).pdf

  return {
    templateType,
    colors: tokens.colors,
    photoHeight: tokens.photoHeight,
    pagePadding: tokens.pagePadding,
    pageFontSize: tokens.pageFontSize,
    footerBrandingVariant: tokens.footerBrandingVariant,
    pageBackgroundColor: tokens.pageBackgroundColor,
    sidebarBackgroundColor: tokens.sidebarBackgroundColor,
    sidebarPadding: tokens.sidebarPadding,
    sidebarRadius: tokens.sidebarRadius,
  }
}

/**
 * Section headings: Classic = heavy underline; Modern = teal left bar; Compact = dashed rule
 */
export function buildPdfSectionHeadingStyle(config: PdfTemplateConfig): TextProps['style'] {
  const baseFs = config.pageFontSize ?? 10
  const fs = config.templateType === 'compact' ? Math.max(7, baseFs - 1) : Math.max(8, baseFs)

  switch (config.templateType) {
    case 'buddy':
    case 'buddyTest':
      return {
        fontSize: fs,
        fontWeight: 'bold',
        textTransform: 'none',
        letterSpacing: 0,
        marginBottom: 6,
        paddingBottom: 4,
        paddingLeft: 10,
        borderLeftWidth: 4,
        borderLeftColor: config.colors.accent,
        color: config.colors.primary,
        borderRadius: pdfBorderRadius(0),
      }
    case 'classic':
      return {
        fontSize: fs,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 6,
        paddingBottom: 4,
        borderBottomWidth: 2,
        borderBottomColor: config.colors.primary,
        color: config.colors.primary,
        borderRadius: pdfBorderRadius(0),
      }
    case 'modern':
      return {
        fontSize: fs,
        fontWeight: 'bold',
        textTransform: 'none',
        letterSpacing: 0,
        marginBottom: 6,
        paddingBottom: 4,
        paddingLeft: 10,
        borderLeftWidth: 4,
        borderLeftColor: config.colors.accent,
        color: MODERN_HEADING_TEXT,
        borderRadius: pdfBorderRadius(0),
      }
    case 'compact':
    default:
      return {
        fontSize: fs,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 5,
        paddingBottom: 3,
        borderBottomWidth: 1,
        borderBottomColor: config.colors.border,
        borderBottomStyle: 'dashed',
        color: config.colors.primary,
        borderRadius: pdfBorderRadius(0),
      }
  }
}

/** Tint for the “References” callout block — from template tokens */
export function getPdfReferencePanelStyle(templateType: TemplateType): PdfReferencePanelTokens {
  return getTemplateTokens(templateType).pdf.referencePanel
}
