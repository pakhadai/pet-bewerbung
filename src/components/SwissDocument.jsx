/**
 * SwissDocument - Main document orchestrator
 * Routes to specific template implementations based on templateType
 * Reduced from 1,652 lines to ~200 lines through template extraction
 */

import React, { useMemo } from 'react';
import { INITIAL_DATA } from '../constants';
import {
  getLocale,
  getCustomColors,
  Watermark,
  getCustomStyle,
  getStyleOverrides,
} from './templates/TemplateBase';
import { getTemplateComponent, getTemplateConfig as getConfig } from './templates/templateRegistry';

const SwissDocument = ({ data, t, templateType = 'classic' }) => {
  const customDesign = data.customDesign || INITIAL_DATA.customDesign;
  const today = new Date().toLocaleDateString(getLocale(data.lang));

  const customColors = useMemo(() => getCustomColors(customDesign), [customDesign]);

  const config = getConfig(templateType, today);
  const styleOverrides = getStyleOverrides(customColors);

  const TemplateComponent = getTemplateComponent(templateType);
  const templateProps = {
    data,
    t,
    customColors,
    customDesign,
    config,
    styleOverrides
  };

  // Dynamic style for custom colors, fonts, background (applies when customized)
  const customStyle = getCustomStyle(customColors);

  return (
    <div className={config.container} style={customStyle}>
      <Watermark />
      <div className="relative z-10 flex flex-col h-full">
        <TemplateComponent {...templateProps} />
      </div>
    </div>
  );
};

export default SwissDocument;
