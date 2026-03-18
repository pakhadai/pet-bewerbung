/**
 * Template Base - Shared utilities and components for all templates
 * Contains common functions, constants, and helper components used across all document templates
 */

import React from 'react';
import { INITIAL_DATA } from '../../constants';
import PetPhoto from '../document/PetPhoto';
import OwnerInfo from '../document/OwnerInfo';
import PetDetails from '../document/PetDetails';
import BehaviorSection from '../document/BehaviorSection';
import DescriptionSection from '../document/DescriptionSection';
import LegalSection from '../document/LegalSection';
import ReferenceSection from '../document/ReferenceSection';

// Section component mapping for dynamic template rendering
export const SECTION_COMPONENTS = {
  photo: ({ data, t, variant, customColors }) => (
    <PetPhoto photo={data.photo} petType={data.petType} t={t} variant={variant} customColors={customColors} />
  ),
  owner: ({ data, t, variant, customColors }) => (
    <OwnerInfo data={data} t={t} variant={variant} customColors={customColors} />
  ),
  details: ({ data, t, variant, customColors }) => (
    <PetDetails data={data} t={t} variant={variant} customColors={customColors} />
  ),
  behavior: ({ data, t, variant, customColors }) => (
    <BehaviorSection data={data} t={t} variant={variant} customColors={customColors} />
  ),
  description: ({ data, t, variant, customColors }) => (
    <DescriptionSection text={data.generatedText} t={t} variant={variant} customColors={customColors} />
  ),
  legal: ({ data, t, variant, customColors }) => (
    <LegalSection data={data} t={t} variant={variant} customColors={customColors} />
  ),
  reference: ({ data, t, variant, customColors }) => (
    <ReferenceSection data={data} t={t} variant={variant} customColors={customColors} />
  )
};

// Default customDesign values for comparison (Midnight Purple theme)
export const DEFAULT_COLORS = {
  primaryColor: '#4a148c',
  secondaryColor: '#f3e5f5'
};

// Sidebar sections (left column)
export const SIDEBAR_SECTIONS = ['photo', 'owner', 'behavior'];
// Main sections (right column)
export const MAIN_SECTIONS = ['details', 'description', 'legal', 'reference'];

/**
 * Get locale code from language
 */
export const getLocale = (lang) => {
  switch(lang) {
    case 'de': return 'de-CH';
    case 'fr': return 'fr-CH';
    case 'it': return 'it-CH';
    case 'rm': return 'de-CH';
    default: return 'en-GB';
  }
};

/**
 * Font family mapping
 */
export const FONT_FAMILIES = {
  helvetica: 'Helvetica, Arial, sans-serif',
  georgia: 'Georgia, "Times New Roman", serif',
  arial: 'Arial, sans-serif',
  times: '"Times New Roman", Times, serif',
  verdana: 'Verdana, Geneva, sans-serif',
  tahoma: 'Tahoma, Geneva, sans-serif',
  trebuchet: '"Trebuchet MS", sans-serif',
  courier: '"Courier New", monospace',
};

/**
 * Check if customDesign has been modified
 */
export const isCustomized = (customDesign) => {
  const hasCustomColors = customDesign.primaryColor !== DEFAULT_COLORS.primaryColor ||
                          customDesign.secondaryColor !== DEFAULT_COLORS.secondaryColor;
  return customDesign.isEdited || hasCustomColors;
};

/**
 * Generate custom colors object from customDesign
 */
export const getCustomColors = (customDesign) => {
  if (!isCustomized(customDesign)) return null;
  return {
    primary: customDesign.primaryColor || '#b39ddb',
    secondary: customDesign.secondaryColor || '#f5f5f5',
    accentStyle: customDesign.accentStyle || 'modern',
    textColor: customDesign.textColor || '#1f2937',
    backgroundColor: customDesign.backgroundColor || '#ffffff',
    headerFont: customDesign.headerFont || 'helvetica',
    bodyFont: customDesign.bodyFont || 'helvetica',
    headerBold: customDesign.headerBold ?? true,
    headerItalic: customDesign.headerItalic ?? false,
    bodyBold: customDesign.bodyBold ?? false,
    bodyItalic: customDesign.bodyItalic ?? false,
    headerFontSize: customDesign.headerFontSize || 9,
    bodyFontSize: customDesign.bodyFontSize || 10,
  };
};

/**
 * Subtle watermark component
 */
export const Watermark = () => (
  <div
    className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.03] select-none"
    style={{ zIndex: 0 }}
  >
    <div
      className="absolute whitespace-nowrap font-bold text-slate-900"
      style={{
        fontSize: '72px',
        transform: 'rotate(-45deg)',
        top: '50%',
        left: '50%',
        marginLeft: '-360px',
        marginTop: '-90px',
        letterSpacing: '6px',
      }}
    >
      Pet-Bewerbung.ch
    </div>
  </div>
);

/**
 * Get dynamic custom styles
 */
export const getCustomStyle = (customColors) => {
  if (!customColors) return {};
  return {
    '--custom-primary': customColors.primary,
    '--custom-secondary': customColors.secondary,
    borderTopColor: customColors.primary,
    borderTopWidth: '4px',
    backgroundColor: customColors.backgroundColor,
    color: customColors.textColor,
    fontFamily: FONT_FAMILIES[customColors.bodyFont] || FONT_FAMILIES.helvetica,
    fontWeight: customColors.bodyBold ? 'bold' : 'normal',
    fontStyle: customColors.bodyItalic ? 'italic' : 'normal',
    fontSize: `${customColors.bodyFontSize}px`,
  };
};

/**
 * Get inline style overrides for headers, accents, borders, footers
 */
export const getStyleOverrides = (customColors) => {
  if (!customColors) {
    return {
      header: {},
      accent: {},
      border: {},
      footer: {}
    };
  }
  return {
    header: { borderBottomColor: customColors.primary },
    accent: { color: customColors.primary },
    border: { borderColor: customColors.primary },
    footer: { borderTopColor: customColors.primary }
  };
};
