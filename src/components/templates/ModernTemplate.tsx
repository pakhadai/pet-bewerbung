/**
 * Modern Template - Sleek design
 * Layout: Standard sidebar + main content
 * Theme: Gray/blue tones, soft borders, modern aesthetics
 */

import React from 'react';
import PetPhoto from '../document/PetPhoto';
import OwnerInfo from '../document/OwnerInfo';
import PetDetails from '../document/PetDetails';
import BehaviorSection from '../document/BehaviorSection';
import DescriptionSection from '../document/DescriptionSection';
import LegalSection from '../document/LegalSection';
import ReferenceSection from '../document/ReferenceSection';
import type { FormData } from '../../types/form';
import type { TemplateConfig, StyleOverrides } from './ClassicTemplate';
import type { TranslationObject } from '../../types/template';

export interface ModernTemplateProps {
  data: FormData;
  t: TranslationObject;
  customColors: unknown;
  config: TemplateConfig;
  styleOverrides: StyleOverrides;
}

const ModernTemplate: React.FC<ModernTemplateProps> = ({ data, t, customColors, config, styleOverrides }) => {
  const { header, accent, border, footer } = styleOverrides;
  const doc = t.doc;

  return (
    <>
      {/* Header */}
      <div className={config.headerContainer} style={header}>
        <div className={config.headerFlex}>
          <div className={config.headerIconContainer}>
            <div className={`${config.headerIconBg} flex items-center justify-center overflow-hidden p-1`} style={border}>
              <img
                src="/logo.png"
                alt=""
                className="w-full h-full object-contain"
                style={{ width: config.headerIconSize + 8, height: config.headerIconSize + 8 }}
              />
            </div>
            <div className="flex flex-col">
              <h1 className={config.titleText}>{doc?.title ?? 'Pet Dossier'}</h1>
              <p className={config.subtitleText} style={accent}>{doc?.subtitle ?? 'Application document'}</p>
            </div>
          </div>
          <div className="text-right">
            <p className={config.dateText}>{config.dateLabel}</p>
          </div>
        </div>
      </div>

      {/* Main Content - Sidebar + Main */}
      <div className={config.mainLayout}>
        {/* Sidebar */}
        <div className={`${config.sidebarWidth} ${config.sidebarSpace}`}>
          <PetPhoto photo={data.photo} petType={data.petType} t={t} variant="modern" customColors={customColors} />
          <OwnerInfo data={data} t={t} variant="modern" customColors={customColors} />
          <BehaviorSection data={data} t={t} variant="modern" customColors={customColors} />
        </div>

        {/* Main Content */}
        <div className={`${config.mainWidth} ${config.mainSpace}`}>
          <PetDetails data={data} t={t} variant="modern" customColors={customColors} />
          <DescriptionSection text={data.generatedText} t={t} variant="modern" customColors={customColors} />
          <LegalSection data={data} t={t} variant="modern" customColors={customColors} />
          <ReferenceSection data={data} t={t} variant="modern" customColors={customColors} />
        </div>
      </div>

      {/* Footer - Subtle branding */}
      <div className={config.footerContainer} style={footer}>
        <div className="flex justify-between items-end">
          <p className="text-[6px] text-slate-300 tracking-wide">
            pet-bewerbung.ch
          </p>
          {config.footerSignContainer && (
            <div className={config.footerSignContainer}>
              <p className={config.footerSignText}>{doc?.sign ?? 'Signature'}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ModernTemplate;

/**
 * Template configuration for Modern template
 */
export const getModernConfig = (today: string): TemplateConfig => ({
  container: 'w-[210mm] h-[292mm] bg-white text-slate-900 p-[12mm] text-xs font-sans relative box-border flex flex-col shadow-none mx-auto overflow-hidden',
  headerContainer: 'mb-4 pb-2.5 border-b border-slate-200',
  headerFlex: 'flex items-start justify-between',
  headerIconContainer: 'flex items-center gap-3',
  headerIconBg: 'bg-slate-100 text-slate-700 p-2 rounded-md border border-slate-200',
  headerIconSize: 18,
  titleText: 'text-2xl font-semibold text-slate-900',
  subtitleText: 'text-[11px] text-slate-500 mt-1.5',
  dateText: 'text-[10px] text-slate-400 text-right',
  dateLabel: today,
  mainLayout: 'flex gap-5 flex-1 min-h-0 overflow-hidden',
  sidebarWidth: 'w-[35%] flex-shrink-0',
  sidebarSpace: 'space-y-3',
  mainWidth: 'flex-1 min-w-0',
  mainSpace: 'space-y-3',
  footerContainer: 'mt-auto pt-3 border-t border-slate-200 flex-shrink-0 pb-[5mm]',
  footerText: 'text-[9px] text-slate-400 text-center mb-3',
  footerSignContainer: 'w-44 border-t border-slate-300 pt-3 mt-6',
  footerSignText: 'text-[9px] uppercase font-medium tracking-wider text-slate-500',
  badge: null
});
