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
  SIDEBAR_SECTIONS,
  MAIN_SECTIONS,
  SECTION_COMPONENTS
} from './templates/TemplateBase';
import { getTemplateComponent, getTemplateConfig as getConfig } from './templates/templateRegistry';

const SwissDocument = ({ data, t, templateType = 'classic' }) => {
  const customDesign = data.customDesign || INITIAL_DATA.customDesign;
  const today = new Date().toLocaleDateString(getLocale(data.lang));

  const hasCustomLayout = customDesign.hiddenSections?.length > 0 ||
                          JSON.stringify(customDesign.layoutOrder) !== JSON.stringify(INITIAL_DATA.customDesign.layoutOrder);

  const customColors = useMemo(() => getCustomColors(customDesign), [customDesign]);

  const config = getConfig(templateType, today);
  const styleOverrides = getStyleOverrides(customColors);

  const renderTemplate = () => {
    const TemplateComponent = getTemplateComponent(templateType);
    const templateProps = {
      data,
      t,
      customColors,
      customDesign,
      config,
      styleOverrides
    };
    return <TemplateComponent {...templateProps} />;
  };

  const renderCustomLayout = () => {
    if (!hasCustomLayout || !['classic', 'modern', 'compact'].includes(templateType)) {
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
        {hasCustomLayout && ['classic', 'modern', 'compact'].includes(templateType)
          ? renderCustomLayout()
          : renderTemplate()
        }
      </div>
    </div>
  );
};

export default SwissDocument;
