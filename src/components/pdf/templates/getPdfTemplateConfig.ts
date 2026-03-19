import type { TemplateType } from '../../../types/form';
import { TEMPLATE_COLORS } from '../PdfBase';

export type PdfFooterBrandingVariant = 'freeCentered' | 'altSmall';

export interface PdfTemplateConfig {
  templateType: TemplateType;
  colors: (typeof TEMPLATE_COLORS)[TemplateType];
  photoHeight: number;

  pagePadding?: number;
  pageFontSize?: number;

  headingBorderColor: string;
  headingColor: string;
  useModernHeading: boolean;

  footerBrandingVariant: PdfFooterBrandingVariant;
}

export function getPdfTemplateConfig(templateType: TemplateType): PdfTemplateConfig {
  const colors = TEMPLATE_COLORS[templateType] ?? TEMPLATE_COLORS.classic;
  const isCompact = templateType === 'compact';
  const isModern = templateType === 'modern';

  return {
    templateType,
    colors,
    photoHeight: isCompact ? 220 : 240,
    pagePadding: isCompact ? 32 : undefined,
    pageFontSize: isCompact ? 9 : undefined,
    headingBorderColor: isModern ? colors.border : colors.primary,
    headingColor: colors.primary,
    useModernHeading: isModern,
    footerBrandingVariant: templateType === 'classic' ? 'freeCentered' : 'altSmall',
  };
}

