/**
 * PDF Base - Shared utilities and components for all PDF templates
 * Contains common styles, colors, helpers, and watermark component used across PDF templates
 */

import { StyleSheet } from '@react-pdf/renderer';
import { INITIAL_DATA } from '../../constants';

// ============= LOCALE HELPERS =============

/**
 * Get locale code from language
 */
export const getLocale = (lang) => {
  switch(lang) {
    case 'de': return 'de-CH';
    case 'fr': return 'fr-CH';
    case 'it': return 'it-CH';
    case 'rm': return 'de-CH';
    default: return 'en-GB';
  }
};

// ============= CONSTANTS =============

// Page dimensions (A4)
export const PAGE_WIDTH = 595.28;
export const PAGE_HEIGHT = 841.89;

// Template-specific accent colors (match SwissDocument)
export const TEMPLATE_COLORS = {
  classic: { primary: '#0f172a', border: '#0f172a', muted: '#64748b', light: '#e2e8f0' },
  modern: { primary: '#334155', border: '#e2e8f0', muted: '#64748b', light: '#f1f5f9' },
  compact: { primary: '#334155', border: '#cbd5e1', muted: '#64748b', light: '#e2e8f0' },
  swiss: { primary: '#dc2626', border: '#dc2626', muted: '#64748b', light: '#fef2f2' },
  professional: { primary: '#000000', border: '#000000', muted: '#6b7280', light: '#f3f4f6' },
  emergency: { primary: '#dc2626', border: '#000000', muted: '#6b7280', light: '#fef2f2' },
  friendly: { primary: '#6400f0', border: '#efe5fd', muted: '#130c1d', light: '#efe5fd' },
  grid: { primary: '#D80000', border: '#D80000', muted: '#1a1a1a', light: '#f5f5f5' },
};

// Default customDesign values (Midnight Purple theme)
export const DEFAULT_STYLE = {
  primaryColor: '#4a148c',
  secondaryColor: '#f3e5f5',
  backgroundColor: '#ffffff',
  textColor: '#1f2937',
  headerBold: true,
  headerItalic: false,
  bodyBold: false,
  bodyItalic: false,
};

// Default layout order (fixed - no drag & drop)
export const DEFAULT_LAYOUT_ORDER = ['photo', 'owner', 'details', 'behavior', 'description', 'legal', 'reference'];

// Sidebar sections (left column)
export const SIDEBAR_SECTION_IDS = ['photo', 'owner', 'behavior'];
// Main sections (right column)
export const MAIN_SECTION_IDS = ['details', 'description', 'legal', 'reference'];

// ============= CUSTOM DESIGN HELPERS =============

/**
 * Check if customDesign has been modified (isEdited flag from Visual Editor)
 */
export const hasCustomDesign = (customDesign) => {
  if (!customDesign) return false;
  return customDesign.isEdited === true;
};

/**
 * Helper to get custom style from data.customDesign
 */
export const getCustomStyle = (customDesign) => {
  if (!customDesign) return null;
  return {
    // Colors
    primary: customDesign.primaryColor || DEFAULT_STYLE.primaryColor,
    border: customDesign.primaryColor || DEFAULT_STYLE.primaryColor,
    muted: '#64748b',
    light: customDesign.secondaryColor || DEFAULT_STYLE.secondaryColor,
    text: customDesign.textColor || DEFAULT_STYLE.textColor,
    background: customDesign.backgroundColor || DEFAULT_STYLE.backgroundColor,
    // Text styles
    headerBold: customDesign.headerBold ?? DEFAULT_STYLE.headerBold,
    headerItalic: customDesign.headerItalic ?? DEFAULT_STYLE.headerItalic,
    bodyBold: customDesign.bodyBold ?? DEFAULT_STYLE.bodyBold,
    bodyItalic: customDesign.bodyItalic ?? DEFAULT_STYLE.bodyItalic,
  };
};

/**
 * Get layout sections from customDesign
 */
export const getLayoutSections = (customDesign) => {
  const layoutOrder = customDesign?.layoutOrder || DEFAULT_LAYOUT_ORDER;
  const hiddenSections = customDesign?.hiddenSections || [];

  // Filter visible sections and split into sidebar/main
  const visibleSections = layoutOrder.filter(id => !hiddenSections.includes(id));
  const sidebarSections = visibleSections.filter(id => SIDEBAR_SECTION_IDS.includes(id));
  const mainSections = visibleSections.filter(id => MAIN_SECTION_IDS.includes(id));

  return { sidebarSections, mainSections, visibleSections };
};

// ============= COMMON PDF STYLES =============

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
    borderBottomColor: '#0f172a',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIcon: {
    width: 32,
    height: 32,
    backgroundColor: '#0f172a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
    textTransform: 'uppercase',
  },
  headerSubtitle: {
    fontSize: 9,
    color: '#64748b',
    marginTop: 2,
    textTransform: 'uppercase',
  },
  headerDate: {
    fontSize: 9,
    color: '#64748b',
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
    borderBottomColor: '#0f172a',
    color: '#0f172a',
  },
  sectionHeadingModern: {
    borderBottomColor: '#e2e8f0',
  },
  text: {
    fontSize: 10,
    color: '#334155',
    lineHeight: 1.4,
  },
  textBold: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 2,
  },
  label: {
    fontSize: 8,
    textTransform: 'uppercase',
    color: '#64748b',
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
    backgroundColor: '#f8fafc',
    padding: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 6,
  },
  footer: {
    marginTop: 'auto',
    paddingTop: 16,
    borderTopWidth: 2,
    borderTopColor: '#0f172a',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    minHeight: 50,
  },
  footerGenerated: {
    fontSize: 7,
    textTransform: 'uppercase',
    color: '#64748b',
    letterSpacing: 0.5,
  },
  // FREE template branding - more prominent
  footerBrandingFree: {
    fontSize: 9,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: '#94a3b8',
    letterSpacing: 1,
    textAlign: 'center',
    marginTop: 8,
  },
  // Premium template branding - subtle
  footerBrandingPremium: {
    fontSize: 6,
    color: '#cbd5e1',
    letterSpacing: 0.3,
  },
  footerSign: {
    width: 140,
    borderTopWidth: 1,
    borderTopColor: '#94a3b8',
    paddingTop: 6,
    fontSize: 8,
    textTransform: 'uppercase',
    color: '#475569',
    marginTop: 20,
  },
  photoContainer: {
    width: '100%',
    overflow: 'hidden',
  },
  photoPlaceholder: {
    width: '100%',
    backgroundColor: '#e2e8f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
});

// ============= FONT FAMILIES =============

export const FONT_FAMILIES = {
  helvetica: 'Helvetica',
  courier: 'Courier',
  times: 'Times-Roman',
};

// ============= RE-EXPORT CONSTANTS =============

/**
 * Re-export INITIAL_DATA for use in PDF templates
 */
export { INITIAL_DATA };
