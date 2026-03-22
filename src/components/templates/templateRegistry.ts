/**
 * Template Registry - Open/Closed principle
 * Add new templates here without modifying SwissDocument.tsx
 */
import React from 'react';
import ClassicTemplate, { getClassicConfig } from './ClassicTemplate';
import ModernTemplate, { getModernConfig } from './ModernTemplate';
import CompactTemplate, { getCompactConfig } from './CompactTemplate';
import BuddyTemplate, { getBuddyConfig } from './BuddyTemplate';
import BuddyTestTemplate, { getBuddyTestConfig } from './BuddyTestTemplate';
import type { TemplateType } from '../../types/form';
import type { TemplateConfig } from './ClassicTemplate';

export type TemplateComponentProps = {
  data: import('../../types/form').FormData;
  t: Record<string, unknown>;
  customColors: unknown;
  config: TemplateConfig;
  styleOverrides: import('./ClassicTemplate').StyleOverrides;
};

export const TEMPLATE_COMPONENTS: Record<TemplateType, React.ComponentType<TemplateComponentProps>> = {
  classic: ClassicTemplate,
  modern: ModernTemplate,
  compact: CompactTemplate,
  buddy: BuddyTemplate,
  buddyTest: BuddyTestTemplate,
};

export const TEMPLATE_CONFIG_GETTERS: Record<TemplateType, (today: string) => TemplateConfig> = {
  classic: getClassicConfig,
  modern: getModernConfig,
  compact: getCompactConfig,
  buddy: getBuddyConfig,
  buddyTest: getBuddyTestConfig,
};

export const getTemplateComponent = (templateType: string): React.ComponentType<TemplateComponentProps> =>
  TEMPLATE_COMPONENTS[templateType as TemplateType] || TEMPLATE_COMPONENTS.classic;

export const getTemplateConfig = (templateType: string, today: string): TemplateConfig => {
  const getter = TEMPLATE_CONFIG_GETTERS[templateType as TemplateType] || TEMPLATE_CONFIG_GETTERS.classic;
  return getter(today);
};
