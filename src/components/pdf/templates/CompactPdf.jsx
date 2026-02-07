/**
 * Compact PDF Template - Space-efficient premium template
 * Layout: Standard sidebar (35%) + main content (65%)
 * Theme: Compact spacing, smaller fonts, gray colors
 * Branding: Subtle footer branding
 * Unique: Reduced padding (32 vs 40) and smaller font sizes (9 vs 10)
 */

import React from 'react';
import ClassicPdf from './ClassicPdf';

/**
 * Get Compact template configuration
 */
export const getPdfCompactConfig = (data, t) => {
  const today = new Date().toLocaleDateString(data?.lang === 'de' ? 'de-CH' : data?.lang === 'fr' ? 'fr-CH' : 'en-GB');
  return {
    templateType: 'compact',
    dateLabel: today,
    photoHeight: 220, // Slightly smaller than other templates
  };
};

/**
 * Compact PDF Template Component
 * Uses same structure as Classic but with tighter spacing and smaller fonts
 */
const CompactPdf = (props) => {
  // Compact template uses the same structure as Classic
  // Spacing/size differences are handled by conditional styles in ClassicPdf
  return <ClassicPdf {...props} templateType="compact" />;
};

export default CompactPdf;
