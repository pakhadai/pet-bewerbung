/**
 * Classic Template - Free tier template with prominent branding
 * Layout: Standard sidebar + main content
 * Theme: Black/slate colors, clean professional design
 */

import React from 'react';
import PetPhoto from '../document/PetPhoto';
import OwnerInfo from '../document/OwnerInfo';
import PetDetails from '../document/PetDetails';
import BehaviorSection from '../document/BehaviorSection';
import DescriptionSection from '../document/DescriptionSection';
import LegalSection from '../document/LegalSection';
import ReferenceSection from '../document/ReferenceSection';
import { PUBLIC_LOGO_PATH } from '../../constants';
import type { FormData } from '../../types/form';
import type { TranslationObject } from '../../types/template';

export interface TemplateConfig {
  container: string;
  headerContainer: string;
  headerFlex: string;
  headerIconContainer: string;
  headerIconBg: string;
  headerIconSize: number;
  titleText: string;
  subtitleText: string;
  dateText: string;
  dateLabel: string;
  mainLayout: string;
  sidebarWidth: string;
  sidebarSpace: string;
  mainWidth: string;
  mainSpace: string;
  footerContainer: string;
  footerText: string;
  footerSignContainer: string | null;
  footerSignText: string;
  badge: unknown;
}

export interface StyleOverrides {
  header?: React.CSSProperties;
  accent?: React.CSSProperties;
  border?: React.CSSProperties;
  footer?: React.CSSProperties;
}

export interface ClassicTemplateProps {
  data: FormData;
  t: TranslationObject;
  customColors: unknown;
  config: TemplateConfig;
  styleOverrides: StyleOverrides;
}

const ClassicTemplate: React.FC<ClassicTemplateProps> = ({ data, t, customColors, config, styleOverrides }) => {
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
                src={PUBLIC_LOGO_PATH}
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
          <PetPhoto photo={data.photo} petType={data.petType} t={t} variant="classic" customColors={customColors} />
          <OwnerInfo data={data} t={t} variant="classic" customColors={customColors} />
          <BehaviorSection data={data} t={t} variant="classic" customColors={customColors} />
        </div>

        {/* Main Content */}
        <div className={`${config.mainWidth} ${config.mainSpace}`}>
          <PetDetails data={data} t={t} variant="classic" customColors={customColors} />
          <DescriptionSection text={data.generatedText} t={t} variant="classic" customColors={customColors} />
          <LegalSection data={data} t={t} variant="classic" customColors={customColors} />
          <ReferenceSection data={data} t={t} variant="classic" customColors={customColors} />
        </div>
      </div>

      {/* Footer - Prominent branding */}
      <div className={config.footerContainer} style={footer}>
        <div className="flex flex-col items-center w-full">
          <p className={config.footerText}>
            {doc?.footer ?? 'DOKUMENT GENERIERT VIA PET-BEWERBUNG.CH'}
          </p>
        </div>
        <div className="flex justify-end">
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

export default ClassicTemplate;

/**
 * Template configuration for Classic template
 */
export const getClassicConfig = (today: string): TemplateConfig => ({
  container: 'w-[210mm] h-[292mm] bg-white text-slate-900 p-[12mm] text-xs font-sans relative box-border flex flex-col shadow-none mx-auto overflow-hidden',
  headerContainer: 'mb-4 pb-2.5 border-b-2 border-slate-900',
  headerFlex: 'flex items-start justify-between',
  headerIconContainer: 'flex items-center gap-3',
  headerIconBg: 'bg-white p-2 rounded-sm border-2 border-slate-900',
  headerIconSize: 16,
  titleText: 'text-xl font-bold uppercase tracking-tight text-slate-900',
  subtitleText: 'text-[10px] uppercase tracking-wider text-slate-500 mt-1',
  dateText: 'text-[10px] text-slate-500 text-right',
  dateLabel: today,
  mainLayout: 'flex gap-5 flex-1 min-h-0 overflow-hidden',
  sidebarWidth: 'w-[35%] flex-shrink-0',
  sidebarSpace: 'space-y-3',
  mainWidth: 'flex-1 min-w-0',
  mainSpace: 'space-y-3',
  footerContainer: 'mt-auto pt-2 border-t-2 border-slate-900 flex-shrink-0 pb-[3mm]',
  footerText: 'text-[8px] text-slate-300 uppercase tracking-[0.08em] font-medium text-center mb-3',
  footerSignContainer: 'w-44 border-t border-slate-400 pt-2 mt-3',
  footerSignText: 'text-[9px] uppercase font-semibold tracking-wider text-slate-600 text-center',
  badge: null
});
