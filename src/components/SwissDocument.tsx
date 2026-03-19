/**
 * SwissDocument - Main document orchestrator
 * Routes to specific template implementations based on templateType
 * Reduced from 1,652 lines to ~200 lines through template extraction
 */

import React from 'react';
import {
  getLocale,
  getStyleOverrides,
} from './templates/TemplateBase';
import { getTemplateComponent, getTemplateConfig as getConfig } from './templates/templateRegistry';
import type { FormData } from '../../types/form';
import type { TemplateType } from '../types/form';

export interface SwissDocumentProps {
  data: FormData;
  t: Record<string, unknown>;
  templateType?: TemplateType;
}

const SwissDocument: React.FC<SwissDocumentProps> = ({ data, t, templateType = 'classic' }) => {
  const today = new Date().toLocaleDateString(getLocale(data.lang));
  const config = getConfig(templateType, today);
  const styleOverrides = getStyleOverrides();
  const TemplateComponent = getTemplateComponent(templateType);

  return (
    <div className={config.container}>
      <TemplateComponent data={data} t={t} customColors={null} config={config} styleOverrides={styleOverrides} />
    </div>
  );
};

export default SwissDocument;
