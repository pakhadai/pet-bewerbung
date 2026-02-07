/**
 * Swiss PDF Template - Swiss-themed premium template
 * Layout: Standard sidebar (35%) + main content (65%)
 * Theme: Red accent colors (#dc2626), Swiss flag inspiration
 * Branding: Subtle footer branding
 * Unique: Red top border and red accents throughout
 */

import React from 'react';
import ClassicPdf from './ClassicPdf';

/**
 * Get Swiss template configuration
 */
export const getPdfSwissConfig = (data, t) => {
  const today = new Date().toLocaleDateString(data?.lang === 'de' ? 'de-CH' : data?.lang === 'fr' ? 'fr-CH' : 'en-GB');
  return {
    templateType: 'swiss',
    dateLabel: today,
    photoHeight: 240,
  };
};

/**
 * Swiss PDF Template Component
 * Uses same structure as Classic but with Swiss red accent colors
 */
const SwissPdf = (props) => {
  // Swiss template uses the same structure as Classic
  // Red color scheme is handled by TEMPLATE_COLORS.swiss in PdfBase
  return <ClassicPdf {...props} templateType="swiss" />;
};

export default SwissPdf;
