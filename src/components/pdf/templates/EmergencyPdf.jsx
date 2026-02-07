/**
 * Emergency PDF Template - Emergency contact focused template
 * Layout: Unique single-column layout with emergency contact prioritization
 * Theme: Red accents, emergency-focused sections
 * Note: Large template (1000+ lines) - extracted from original SwissDocumentPdf.jsx
 *
 * This template has a unique structure focused on emergency scenarios
 */

import React from 'react';

/**
 * Get Emergency template configuration
 */
export const getPdfEmergencyConfig = (data, t) => {
  const today = new Date().toLocaleDateString(data?.lang === 'de' ? 'de-CH' : data?.lang === 'fr' ? 'fr-CH' : 'en-GB');
  return {
    templateType: 'emergency',
    dateLabel: today,
  };
};

/**
 * Emergency PDF Template Component
 *
 * Due to the large size (1000+ lines) of this template with custom layout,
 * it is handled by the main SwissDocumentPdf.jsx file
 *
 * This acts as a config export point
 */
const EmergencyPdf = () => {
  throw new Error('EmergencyPdf should be rendered through SwissDocumentPdf main orchestrator');
};

export default EmergencyPdf;
