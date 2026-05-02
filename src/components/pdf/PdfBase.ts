/**
 * PDF Base - Shared utilities and components for all PDF templates
 * Contains common styles, colors, helpers, and watermark component used across PDF templates
 */

import { StyleSheet } from '@react-pdf/renderer'
import { INITIAL_DATA } from '../../constants'
import { TEMPLATE_TOKENS } from '../../templates/templateTokens'

/** Classic palette baseline for shared PDF chrome (headers/labels commonStyles). */
const cls = TEMPLATE_TOKENS.classic.pdf.colors

/** Neutrals shared across templates where variant tokens do not apply. */
export const PDF_NEUTRAL = {
  /** Matches `TEMPLATE_TOKENS.classic.pdf.colors.bodyText` — base paragraph color for shared StyleSheet text */
  bodyText: '#334155',
  white: '#ffffff',
  borderHairline: '#e2e8f0',
  photoMutedBg: '#e2e8f0',
  footerSignDivider: '#94a3b8',
  footerSignText: '#475569',
  brandingMuted: '#a8b3c2',
  brandingAlt: '#cbd5e1',
} as const

// ============= LOCALE HELPERS =============

/**
 * Get locale code from language
 */
export const getLocale = (lang: string | undefined): string => {
  switch (lang) {
    case 'de':
      return 'de-CH'
    case 'fr':
      return 'fr-CH'
    case 'it':
      return 'it-CH'
    case 'rm':
      return 'de-CH'
    default:
      return 'en-GB'
  }
}

// ============= CONSTANTS =============

// Page dimensions (A4)
export const PAGE_WIDTH = 595.28
export const PAGE_HEIGHT = 841.89

export const DEFAULT_LAYOUT_ORDER = [
  'photo',
  'owner',
  'details',
  'behavior',
  'description',
  'legal',
  'reference',
]

// Sidebar sections (left column)
export const SIDEBAR_SECTION_IDS = ['photo', 'owner', 'behavior']
// Main sections (right column)
export const MAIN_SECTION_IDS = ['details', 'description', 'legal', 'reference']

/**
 * Get layout sections (fixed default - layout customization removed, premium no longer exists)
 */
export const getLayoutSections = (): {
  sidebarSections: string[]
  mainSections: string[]
  visibleSections: string[]
} => {
  const visibleSections = [...DEFAULT_LAYOUT_ORDER]
  const sidebarSections = visibleSections.filter((id) => SIDEBAR_SECTION_IDS.includes(id))
  const mainSections = visibleSections.filter((id) => MAIN_SECTION_IDS.includes(id))
  return { sidebarSections, mainSections, visibleSections }
}

// ============= COMMON PDF STYLES =============

/**
 * @react-pdf/stylesheet: `borderRadius` runs through `resolveBorderShorthand`, which does
 * `const radius = value ? transformUnit(...) : undefined` — numeric `0` is falsy, so it throws
 * "Invalid border radius: undefined". Use this for any `borderRadius` that may be 0.
 */
export function pdfBorderRadius(value: number): number | '0' {
  return value === 0 ? '0' : value
}

/**
 * Same engine quirk: `borderWidth: 0` hits `resolveBorderShorthand` and throws
 * "Invalid border width: undefined" (falsy `0` → width undefined inside empty regex match).
 */
export function pdfBorderWidth(value: number): number | '0' {
  return value === 0 ? '0' : value
}

// Use system fonts so no network required (Helvetica is built-in in react-pdf)
export const commonStyles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
    position: 'relative',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: cls.primary,
    borderRadius: pdfBorderRadius(0),
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIcon: {
    width: 32,
    height: 32,
    backgroundColor: cls.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: cls.primary,
    textTransform: 'uppercase',
  },
  headerSubtitle: {
    fontSize: 9,
    color: cls.muted,
    marginTop: 2,
    textTransform: 'uppercase',
  },
  headerDate: {
    fontSize: 9,
    color: cls.muted,
  },
  mainRow: {
    flexDirection: 'row',
    flex: 1,
    gap: 24,
    marginTop: 8,
  },
  sidebar: {
    width: '35%',
    gap: 12,
  },
  main: {
    flex: 1,
    gap: 12,
  },
  section: {
    marginBottom: 6,
  },
  sectionBlock: {
    marginBottom: 6,
    minHeight: 30,
  },
  descriptionBlock: {
    marginBottom: 6,
    minHeight: 80,
  },
  sectionHeading: {
    fontSize: 9,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: cls.primary,
    color: cls.primary,
    borderRadius: pdfBorderRadius(0),
  },
  sectionHeadingModern: {
    borderBottomColor: PDF_NEUTRAL.borderHairline,
  },
  text: {
    fontSize: 10,
    color: PDF_NEUTRAL.bodyText,
    lineHeight: 1.4,
  },
  textBold: {
    fontSize: 11,
    fontWeight: 'bold',
    color: cls.primary,
    marginBottom: 2,
  },
  label: {
    fontSize: 8,
    textTransform: 'uppercase',
    color: cls.muted,
    marginBottom: 2,
  },
  gridRow: {
    flexDirection: 'row',
    marginBottom: 4,
    gap: 6,
  },
  gridHalf: {
    flex: 1,
  },
  box: {
    backgroundColor: cls.light,
    padding: 8,
    borderWidth: 1,
    borderColor: PDF_NEUTRAL.borderHairline,
    marginBottom: 6,
    borderRadius: pdfBorderRadius(0),
  },
  footer: {
    marginTop: 'auto',
    paddingTop: 16,
    borderTopWidth: 2,
    borderTopColor: cls.primary,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    minHeight: 50,
    borderRadius: pdfBorderRadius(0),
  },
  footerGenerated: {
    fontSize: 7,
    textTransform: 'uppercase',
    color: cls.muted,
    letterSpacing: 0.5,
  },
  // FREE template branding - more prominent
  footerBrandingFree: {
    fontSize: 8,
    fontWeight: 'normal',
    textTransform: 'uppercase',
    color: PDF_NEUTRAL.brandingMuted,
    letterSpacing: 0.8,
    textAlign: 'center',
    marginTop: 8,
  },
  footerBrandingAlt: {
    fontSize: 6,
    color: PDF_NEUTRAL.brandingAlt,
    letterSpacing: 0.3,
  },
  footerSign: {
    width: 140,
    borderTopWidth: 1,
    borderTopColor: PDF_NEUTRAL.footerSignDivider,
    paddingTop: 6,
    fontSize: 8,
    textTransform: 'uppercase',
    color: PDF_NEUTRAL.footerSignText,
    marginTop: 20,
    textAlign: 'center',
    borderRadius: pdfBorderRadius(0),
  },
  photoContainer: {
    width: '100%',
    overflow: 'hidden',
    borderRadius: pdfBorderRadius(0),
  },
  photoPlaceholder: {
    width: '100%',
    backgroundColor: PDF_NEUTRAL.photoMutedBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
})

// ============= FONT FAMILIES =============

export const FONT_FAMILIES: Record<string, string> = {
  helvetica: 'Helvetica',
  courier: 'Courier',
  times: 'Times-Roman',
}

// ============= RE-EXPORT CONSTANTS =============

/**
 * Re-export INITIAL_DATA for use in PDF templates
 */
export { INITIAL_DATA }
