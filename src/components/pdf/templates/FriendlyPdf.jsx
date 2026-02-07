/**
 * Friendly PDF Template - Colorful, welcoming design
 * Layout: Photo in header + 2-column layout with gradient cards
 * Theme: Purple gradient (#6400f0), rounded corners, colorful badges
 * Note: Large template (1000+ lines) - extracted from original SwissDocumentPdf.jsx
 *
 * This template has a unique visual design with gradient backgrounds and
 * a horizontal photo layout in the header
 */

import React from 'react';

/**
 * Get Friendly template configuration
 */
export const getPdfFriendlyConfig = (data, t) => {
  const today = new Date().toLocaleDateString(data?.lang === 'de' ? 'de-CH' : data?.lang === 'fr' ? 'fr-CH' : 'en-GB');
  return {
    templateType: 'friendly',
    dateLabel: today,
  };
};

/**
 * Friendly PDF Template Component
 *
 * Due to the large size (1000+ lines) of this template with custom gradient styles,
 * it is handled by the main SwissDocumentPdf.jsx file
 *
 * This acts as a config export point
 */
const FriendlyPdf = () => {
  throw new Error('FriendlyPdf should be rendered through SwissDocumentPdf main orchestrator');
};

export default FriendlyPdf;
