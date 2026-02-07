/**
 * Modern PDF Template - Premium template with softer design
 * Layout: Standard sidebar (35%) + main content (65%)
 * Theme: Gray/slate colors, lighter borders, modern feel
 * Branding: Subtle footer branding
 */

import React from 'react';
import ClassicPdf from './ClassicPdf';

/**
 * Get Modern template configuration
 */
export const getPdfModernConfig = (data, t) => {
  const today = new Date().toLocaleDateString(data?.lang === 'de' ? 'de-CH' : data?.lang === 'fr' ? 'fr-CH' : 'en-GB');
  return {
    templateType: 'modern',
    dateLabel: today,
    photoHeight: 240,
  };
};

/**
 * Modern PDF Template Component
 * Uses same layout as Classic but different colors and styling
 */
const ModernPdf = (props) => {
  // Modern template uses the same structure as Classic
  // Color differences are handled by TEMPLATE_COLORS.modern in PdfBase
  return <ClassicPdf {...props} templateType="modern" />;
};

export default ModernPdf;
