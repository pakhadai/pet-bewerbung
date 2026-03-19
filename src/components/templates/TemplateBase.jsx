/**
 * Template Base - Shared utilities and components for all templates
 * Contains common functions, constants, and helper components used across all document templates
 */

import React from 'react';
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
 * No visual editor — customization always returns null/empty.
 * Kept as stubs so template components don't need to change their signatures.
 */
export const getCustomColors = () => null;

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

export const getCustomStyle = () => ({});
export const getStyleOverrides = () => ({ header: {}, accent: {}, border: {}, footer: {} });
