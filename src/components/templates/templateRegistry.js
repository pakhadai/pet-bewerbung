/**
 * Template Registry - Open/Closed principle
 * Add new templates here without modifying SwissDocument.jsx
 */
import ClassicTemplate, { getClassicConfig } from './ClassicTemplate';
import ModernTemplate, { getModernConfig } from './ModernTemplate';
import CompactTemplate, { getCompactConfig } from './CompactTemplate';

export const TEMPLATE_COMPONENTS = {
  classic: ClassicTemplate,
  modern: ModernTemplate,
  compact: CompactTemplate,
};

export const TEMPLATE_CONFIG_GETTERS = {
  classic: getClassicConfig,
  modern: getModernConfig,
  compact: getCompactConfig,
};

export const getTemplateComponent = (templateType) =>
  TEMPLATE_COMPONENTS[templateType] || TEMPLATE_COMPONENTS.classic;

export const getTemplateConfig = (templateType, today) => {
  const getter = TEMPLATE_CONFIG_GETTERS[templateType] || TEMPLATE_CONFIG_GETTERS.classic;
  return getter(today);
};
