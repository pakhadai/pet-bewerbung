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
  isCustomized,
  Watermark,
  getCustomStyle,
  getStyleOverrides,
  SIDEBAR_SECTIONS,
  MAIN_SECTIONS,
  SECTION_COMPONENTS
} from './templates/TemplateBase';

// Template imports
import ClassicTemplate, { getClassicConfig } from './templates/ClassicTemplate';
import ModernTemplate, { getModernConfig } from './templates/ModernTemplate';
import CompactTemplate, { getCompactConfig } from './templates/CompactTemplate';
import SwissTemplate, { getSwissConfig } from './templates/SwissTemplate';
import ProfessionalTemplate, { getProfessionalConfig } from './templates/ProfessionalTemplate';
import EmergencyTemplate, { getEmergencyConfig } from './templates/EmergencyTemplate';
import FriendlyTemplate, { getFriendlyConfig } from './templates/FriendlyTemplate';
import GridTemplate, { getGridConfig } from './templates/GridTemplate';

const SwissDocument = ({ data, t, templateType = 'classic' }) => {
  // Get custom design settings
  const customDesign = data.customDesign || INITIAL_DATA.customDesign;
  const today = new Date().toLocaleDateString(getLocale(data.lang));

  // Check if customDesign has been modified
  const hasCustomLayout = customDesign.hiddenSections?.length > 0 ||
                          JSON.stringify(customDesign.layoutOrder) !== JSON.stringify(INITIAL_DATA.customDesign.layoutOrder);

  // Custom colors & styles - available for ANY template when user has customized
  const customColors = useMemo(() => getCustomColors(customDesign), [customDesign]);

  /**
   * Get template configuration based on templateType
   */
  const getTemplateConfig = () => {
    const configGetters = {
      classic: getClassicConfig,
      modern: getModernConfig,
      compact: getCompactConfig,
      swiss: getSwissConfig,
      professional: getProfessionalConfig,
      emergency: getEmergencyConfig,
      friendly: getFriendlyConfig,
      grid: getGridConfig
    };

    const configGetter = configGetters[templateType] || configGetters.classic;
    return configGetter(today);
  };

  const config = getTemplateConfig();
  const styleOverrides = getStyleOverrides(customColors);

  /**
   * Render template based on templateType
   */
  const renderTemplate = () => {
    const templateProps = {
      data,
      t,
      customColors,
      customDesign,
      config,
      styleOverrides
    };

    // Route to specific template
    switch (templateType) {
      case 'classic':
        return <ClassicTemplate {...templateProps} />;

      case 'modern':
        return <ModernTemplate {...templateProps} />;

      case 'compact':
        return <CompactTemplate {...templateProps} />;

      case 'swiss':
        return <SwissTemplate {...templateProps} />;

      case 'professional':
        return <ProfessionalTemplate {...templateProps} />;

      case 'emergency':
        return <EmergencyTemplate {...templateProps} />;

      case 'friendly':
        return <FriendlyTemplate {...templateProps} />;

      case 'grid':
        return <GridTemplate {...templateProps} />;

      default:
        return <ClassicTemplate {...templateProps} />;
    }
  };

  /**
   * Render custom layout (when user has reordered/hidden sections)
   * Only applies to standard templates (classic, modern, compact, swiss)
   */
  const renderCustomLayout = () => {
    if (!hasCustomLayout || !['classic', 'modern', 'compact', 'swiss'].includes(templateType)) {
      return renderTemplate();
    }

    const layoutOrder = customDesign.layoutOrder || INITIAL_DATA.customDesign.layoutOrder;
    const hiddenSections = customDesign.hiddenSections || [];

    // Filter out hidden sections
    const visibleSections = layoutOrder.filter(id => !hiddenSections.includes(id));

    // Separate into sidebar and main sections while maintaining order
    const sidebarSections = visibleSections.filter(id => SIDEBAR_SECTIONS.includes(id));
    const mainSections = visibleSections.filter(id => MAIN_SECTIONS.includes(id));

    return (
      <>
        {/* Header - use template's header */}
        {/* Note: Custom layout only affects content, not header/footer */}

        {/* Custom ordered content */}
        <div className={config.mainLayout}>
          <div className={`${config.sidebarWidth} ${config.sidebarSpace}`}>
            {sidebarSections.map(sectionId => {
              const Component = SECTION_COMPONENTS[sectionId];
              return Component ? (
                <div key={sectionId}>
                  {Component({ data, t, variant: 'custom', customColors })}
                </div>
              ) : null;
            })}
          </div>
          <div className={`${config.mainWidth} ${config.mainSpace}`}>
            {mainSections.map(sectionId => {
              const Component = SECTION_COMPONENTS[sectionId];
              return Component ? (
                <div key={sectionId}>
                  {Component({ data, t, variant: 'custom', customColors })}
                </div>
              ) : null;
            })}
          </div>
        </div>

        {/* Footer - use template's footer */}
      </>
    );
  };

  // Dynamic style for custom colors, fonts, background (applies to any template when customized)
  const customStyle = getCustomStyle(customColors);

  return (
    <div className={config.container} style={customStyle}>
      <Watermark />
      <div className="relative z-10 flex flex-col h-full">
        {hasCustomLayout && ['classic', 'modern', 'compact', 'swiss'].includes(templateType)
          ? renderCustomLayout()
          : renderTemplate()
        }
      </div>
    </div>
  );
};

export default SwissDocument;
