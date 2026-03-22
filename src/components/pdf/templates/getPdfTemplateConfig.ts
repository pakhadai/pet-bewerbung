import type { TemplateType } from '../../../types/form';
import { pdfBorderRadius, TEMPLATE_COLORS } from '../PdfBase';

export type PdfFooterBrandingVariant = 'freeCentered' | 'altSmall';

export interface PdfTemplateConfig {
  templateType: TemplateType;
  colors: (typeof TEMPLATE_COLORS)[TemplateType];
  photoHeight: number;

  pagePadding?: number;
  pageFontSize?: number;

  footerBrandingVariant: PdfFooterBrandingVariant;

  /** Page background (Classic white, Modern cool gray, Compact warm stone) */
  pageBackgroundColor: string;
  /** Optional tint behind sidebar column */
  sidebarBackgroundColor?: string;
  sidebarPadding?: number;
  sidebarRadius?: number;
}

export function getPdfTemplateConfig(templateType: TemplateType): PdfTemplateConfig {
  const colors = TEMPLATE_COLORS[templateType] ?? TEMPLATE_COLORS.classic;
  const isCompact = templateType === 'compact';
  const isModern = templateType === 'modern';
  const isBuddyLayout = templateType === 'buddy' || templateType === 'buddyTest';

  return {
    templateType,
    colors,
    photoHeight: isCompact ? 210 : isBuddyLayout ? 248 : isModern ? 232 : 240,
    pagePadding: isCompact ? 30 : isBuddyLayout ? 32 : isModern ? 36 : 40,
    pageFontSize: isCompact ? 9 : 10,
    footerBrandingVariant: templateType === 'classic' ? 'freeCentered' : 'altSmall',
    pageBackgroundColor: isCompact ? '#fafaf9' : isModern ? '#fafafa' : isBuddyLayout ? '#f8f9ff' : '#ffffff',
    sidebarBackgroundColor: isModern ? '#f0fdfa' : isCompact ? '#f5f5f4' : isBuddyLayout ? '#eff4ff' : undefined,
    sidebarPadding: isModern ? 8 : isCompact ? 6 : isBuddyLayout ? 10 : undefined,
    sidebarRadius: isModern ? 6 : isCompact ? 3 : isBuddyLayout ? 8 : undefined,
  };
}

/**
 * Section headings: Classic = heavy underline; Modern = teal left bar; Compact = dashed rule
 */
export function buildPdfSectionHeadingStyle(config: PdfTemplateConfig): Record<string, unknown> {
  const baseFs = config.pageFontSize ?? 10;
  const fs = config.templateType === 'compact' ? Math.max(7, baseFs - 1) : Math.max(8, baseFs);

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
      };
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
      };
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
        color: '#0f172a',
        borderRadius: pdfBorderRadius(0),
      };
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
      };
  }
}

/** Tint for the “References” callout block — distinct per template */
export function getPdfReferencePanelStyle(templateType: TemplateType): {
  backgroundColor: string;
  borderColor: string;
  headingRuleColor: string;
  labelColor: string;
} {
  switch (templateType) {
    case 'buddy':
    case 'buddyTest':
      return {
        backgroundColor: '#e5eeff',
        borderColor: '#93c5fd',
        headingRuleColor: '#006b5f',
        labelColor: '#004541',
      };
    case 'modern':
      return {
        backgroundColor: '#f0fdfa',
        borderColor: '#99f6e4',
        headingRuleColor: '#5eead4',
        labelColor: '#115e59',
      };
    case 'compact':
      return {
        backgroundColor: '#fffbeb',
        borderColor: '#fcd34d',
        headingRuleColor: '#fbbf24',
        labelColor: '#b45309',
      };
    default:
      return {
        backgroundColor: '#eff6ff',
        borderColor: '#bfdbfe',
        headingRuleColor: '#bfdbfe',
        labelColor: '#1e40af',
      };
  }
}
