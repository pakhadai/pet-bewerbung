/**
 * Swiss Template - Swiss-themed premium template
 * Layout: Standard sidebar + main content
 * Theme: Red accents (Swiss flag #D80000), professional Swiss style
 */

import React from 'react';
import PetPhoto from '../document/PetPhoto';
import OwnerInfo from '../document/OwnerInfo';
import PetDetails from '../document/PetDetails';
import BehaviorSection from '../document/BehaviorSection';
import DescriptionSection from '../document/DescriptionSection';
import LegalSection from '../document/LegalSection';
import ReferenceSection from '../document/ReferenceSection';

const SwissTemplate = ({ data, t, customColors, config, styleOverrides }) => {
  const { header, accent, border, footer } = styleOverrides;

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
              <h1 className={config.titleText}>{t.doc.title}</h1>
              <p className={config.subtitleText} style={accent}>{t.doc.subtitle}</p>
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
          <PetPhoto photo={data.photo} petType={data.petType} t={t} variant="swiss" customColors={customColors} />
          <OwnerInfo data={data} t={t} variant="swiss" customColors={customColors} />
          <BehaviorSection data={data} t={t} variant="swiss" customColors={customColors} />
        </div>

        {/* Main Content */}
        <div className={`${config.mainWidth} ${config.mainSpace}`}>
          <PetDetails data={data} t={t} variant="swiss" customColors={customColors} />
          <DescriptionSection text={data.generatedText} t={t} variant="swiss" customColors={customColors} />
          <LegalSection data={data} t={t} variant="swiss" customColors={customColors} />
          <ReferenceSection data={data} t={t} variant="swiss" customColors={customColors} />
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
              <p className={config.footerSignText}>{t.doc.sign}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SwissTemplate;

/**
 * Template configuration for Swiss template
 */
export const getSwissConfig = (today) => ({
  container: 'w-[210mm] h-[292mm] bg-white text-slate-900 p-[12mm] text-xs font-sans relative box-border flex flex-col shadow-none mx-auto overflow-hidden border-t-4 border-red-600',
  headerContainer: 'mb-4 pb-2.5 border-b-2 border-red-600',
  headerFlex: 'flex items-start justify-between',
  headerIconContainer: 'flex items-center gap-3',
  headerIconBg: 'bg-white p-2 rounded-sm border border-red-600',
  headerIconSize: 16,
  titleText: 'text-xl font-bold uppercase tracking-tight text-slate-900',
  subtitleText: 'text-[10px] uppercase tracking-wider text-red-600 mt-1 font-semibold',
  dateText: 'text-[10px] text-slate-500 text-right',
  dateLabel: today,
  dateBadge: null,
  mainLayout: 'flex gap-5 flex-1 min-h-0 overflow-hidden',
  sidebarWidth: 'w-[35%] flex-shrink-0',
  sidebarSpace: 'space-y-3',
  mainWidth: 'flex-1 min-w-0',
  mainSpace: 'space-y-3',
  footerContainer: 'mt-auto pt-3 border-t-2 border-red-600 flex-shrink-0 pb-[5mm]',
  footerText: 'text-[9px] text-slate-500 text-center mb-3',
  footerSignContainer: 'w-44 border-t border-red-400 pt-3 mt-6',
  footerSignText: 'text-[9px] uppercase font-semibold tracking-wider text-slate-600',
  badge: null
});
