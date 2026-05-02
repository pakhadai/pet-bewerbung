import type { TemplateType } from '../types/form'

export type PdfFooterBrandingVariant = 'freeCentered' | 'altSmall'

export interface PdfColorTokens {
  primary: string
  border: string
  muted: string
  light: string
  accent: string
  /** Default body / paragraph color on the PDF page */
  bodyText: string
  /** Lighter accent for borders/links on dark backgrounds (e.g. buddy PDF footer) */
  accentSoft?: string
}

/** Reference section callout panel — PDF-only accents per template */
export interface PdfReferencePanelTokens {
  backgroundColor: string
  borderColor: string
  headingRuleColor: string
  labelColor: string
}

export interface PdfTemplateTokens {
  colors: PdfColorTokens
  photoHeight: number
  pagePadding: number
  pageFontSize: number
  footerBrandingVariant: PdfFooterBrandingVariant
  pageBackgroundColor: string
  sidebarBackgroundColor?: string
  sidebarPadding?: number
  sidebarRadius?: number
  referencePanel: PdfReferencePanelTokens
}

/** HTML A4 preview shell — single source with PDF margins (visual parity). */
export interface HtmlFoundationTokens {
  /** Outer padding of the preview card (e.g. matches former `p-[12mm]` classes). */
  documentPadding: string
}

export interface TemplateTokens {
  id: TemplateType
  pdf: PdfTemplateTokens
  html: HtmlFoundationTokens
}

export const TEMPLATE_TOKENS: Record<TemplateType, TemplateTokens> = {
  classic: {
    id: 'classic',
    html: {
      documentPadding: '12mm',
    },
    pdf: {
      colors: {
        primary: '#0f172a',
        border: '#0f172a',
        muted: '#64748b',
        light: '#f1f5f9',
        accent: '#0f172a',
        bodyText: '#334155',
      },
      photoHeight: 240,
      pagePadding: 40,
      pageFontSize: 10,
      footerBrandingVariant: 'freeCentered',
      pageBackgroundColor: '#ffffff',
      referencePanel: {
        backgroundColor: '#eff6ff',
        borderColor: '#bfdbfe',
        headingRuleColor: '#bfdbfe',
        labelColor: '#1e40af',
      },
    },
  },

  modern: {
    id: 'modern',
    html: {
      documentPadding: '12mm',
    },
    pdf: {
      colors: {
        primary: '#115e59',
        border: '#ccfbf1',
        muted: '#64748b',
        light: '#f0fdfa',
        accent: '#14b8a6',
        bodyText: '#334155',
      },
      photoHeight: 232,
      pagePadding: 36,
      pageFontSize: 10,
      footerBrandingVariant: 'altSmall',
      pageBackgroundColor: '#fafafa',
      sidebarBackgroundColor: '#f0fdfa',
      sidebarPadding: 8,
      sidebarRadius: 6,
      referencePanel: {
        backgroundColor: '#f0fdfa',
        borderColor: '#99f6e4',
        headingRuleColor: '#5eead4',
        labelColor: '#115e59',
      },
    },
  },

  compact: {
    id: 'compact',
    html: {
      documentPadding: '10mm',
    },
    pdf: {
      colors: {
        primary: '#44403c',
        border: '#a8a29e',
        muted: '#78716c',
        light: '#fafaf9',
        accent: '#d97706',
        bodyText: '#44403c',
      },
      photoHeight: 210,
      pagePadding: 30,
      pageFontSize: 9,
      footerBrandingVariant: 'altSmall',
      pageBackgroundColor: '#fafaf9',
      sidebarBackgroundColor: '#f5f5f4',
      sidebarPadding: 6,
      sidebarRadius: 3,
      referencePanel: {
        backgroundColor: '#fffbeb',
        borderColor: '#fcd34d',
        headingRuleColor: '#fbbf24',
        labelColor: '#b45309',
      },
    },
  },

  buddy: {
    id: 'buddy',
    html: {
      documentPadding: '10mm',
    },
    pdf: {
      colors: {
        primary: '#004541',
        border: '#bec9c7',
        muted: '#64748b',
        light: '#eff4ff',
        accent: '#006b5f',
        bodyText: '#0b1c30',
        accentSoft: '#abefe8',
      },
      photoHeight: 248,
      pagePadding: 32,
      pageFontSize: 10,
      footerBrandingVariant: 'altSmall',
      pageBackgroundColor: '#f8f9ff',
      sidebarBackgroundColor: '#eff4ff',
      sidebarPadding: 10,
      sidebarRadius: 8,
      referencePanel: {
        backgroundColor: '#e5eeff',
        borderColor: '#93c5fd',
        headingRuleColor: '#006b5f',
        labelColor: '#004541',
      },
    },
  },

  buddyTest: {
    id: 'buddyTest',
    html: {
      documentPadding: '9mm',
    },
    pdf: {
      colors: {
        primary: '#004541',
        border: '#bec9c7',
        muted: '#64748b',
        light: '#eff4ff',
        accent: '#006b5f',
        bodyText: '#0b1c30',
        accentSoft: '#abefe8',
      },
      photoHeight: 248,
      pagePadding: 32,
      pageFontSize: 10,
      footerBrandingVariant: 'altSmall',
      pageBackgroundColor: '#f8f9ff',
      sidebarBackgroundColor: '#eff4ff',
      sidebarPadding: 10,
      sidebarRadius: 8,
      referencePanel: {
        backgroundColor: '#e5eeff',
        borderColor: '#93c5fd',
        headingRuleColor: '#006b5f',
        labelColor: '#004541',
      },
    },
  },
}

export function getTemplateTokens(templateType: TemplateType): TemplateTokens {
  return TEMPLATE_TOKENS[templateType] ?? TEMPLATE_TOKENS.classic
}
