/**
 * SwissDocument - Main document orchestrator
 * Routes to specific template implementations based on templateType
 * Reduced from 1,652 lines to ~200 lines through template extraction
 */

import React from 'react';
import {
  getLocale,
  Watermark,
  getStyleOverrides,
} from './templates/TemplateBase';
import { getTemplateComponent, getTemplateConfig as getConfig } from './templates/templateRegistry';

const SwissDocument = ({ data, t, templateType = 'classic' }) => {
  const today = new Date().toLocaleDateString(getLocale(data.lang));
  const config = getConfig(templateType, today);
  const styleOverrides = getStyleOverrides();
  const TemplateComponent = getTemplateComponent(templateType);

  return (
    <div className={config.container}>
      <Watermark />
      <div className="relative z-10 flex flex-col h-full">
        <TemplateComponent data={data} t={t} customColors={null} config={config} styleOverrides={styleOverrides} />
      </div>
    </div>
  );
};

export default SwissDocument;
