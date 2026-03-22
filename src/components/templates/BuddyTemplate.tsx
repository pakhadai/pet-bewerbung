/**
 * Buddy Template — Material-inspired layout (35% / 65%), brand palette.
 * Uses the same document sections and PetData fields as other templates.
 */

import React from 'react';
import { MapPin } from 'lucide-react';
import PetPhoto from '../document/PetPhoto';
import OwnerInfo from '../document/OwnerInfo';
import PetDetails from '../document/PetDetails';
import BehaviorSection from '../document/BehaviorSection';
import DescriptionSection from '../document/DescriptionSection';
import LegalSection from '../document/LegalSection';
import ReferenceSection from '../document/ReferenceSection';
import { PUBLIC_LOGO_PATH } from '../../constants';
import type { FormData } from '../../types/form';
import type { TemplateConfig, StyleOverrides } from './ClassicTemplate';
import type { TranslationObject } from '../../types/template';

export interface BuddyTemplateProps {
  data: FormData;
  t: TranslationObject;
  customColors: unknown;
  config: TemplateConfig;
  styleOverrides: StyleOverrides;
}

const BuddyTemplate: React.FC<BuddyTemplateProps> = ({ data, t, customColors, config }) => {
  const doc = t.doc;

  const cityDate =
    data.city?.toString().trim() ? `${String(data.city).trim()}, ${config.dateLabel}` : config.dateLabel;

  return (
    <>
      <header className={config.headerContainer}>
        <div className={config.headerFlex}>
          <div className={config.headerIconContainer}>
            <div className={`${config.headerIconBg} flex items-center justify-center overflow-hidden p-1`}>
              <img
                src={PUBLIC_LOGO_PATH}
                alt=""
                className="w-full h-full object-contain"
                style={{ width: config.headerIconSize + 8, height: config.headerIconSize + 8 }}
              />
            </div>
            <div className="h-8 w-px shrink-0 bg-[#bec9c7]/50" aria-hidden />
            <div className="flex flex-col min-w-0">
              <span className="text-lg font-black text-[#004541] uppercase tracking-wider leading-tight">
                Pet-Bewerbung
              </span>
              <h1 className={`${config.titleText} mt-1`}>{doc?.title ?? 'Pet CV'}</h1>
              <p className={config.subtitleText}>{doc?.subtitle ?? 'Application document'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-[#3f4947] text-right">
            <MapPin size={16} className="shrink-0 text-[#004541]" aria-hidden />
            <span>{cityDate}</span>
          </div>
        </div>
      </header>

      <div className={config.mainLayout}>
        <aside className={`${config.sidebarWidth} ${config.sidebarSpace} ${config.sidebarShell ?? ''}`}>
          <PetPhoto photo={data.photo} petType={data.petType} t={t} variant="buddy" customColors={customColors} />
          <OwnerInfo data={data} t={t} variant="buddy" customColors={customColors} />
          <BehaviorSection data={data} t={t} variant="buddy" customColors={customColors} />
        </aside>

        <main className={`${config.mainWidth} ${config.mainSpace}`}>
          <PetDetails data={data} t={t} variant="buddy" customColors={customColors} />
          <DescriptionSection text={data.generatedText} t={t} variant="buddy" customColors={customColors} />
          <LegalSection data={data} t={t} variant="buddy" customColors={customColors} />
          <ReferenceSection data={data} t={t} variant="buddy" customColors={customColors} />
        </main>
      </div>

      <footer className={config.footerContainer}>
        <div className="flex justify-between items-end gap-4 w-full">
          <a
            href="https://pet-bewerbung.ch"
            className="font-sans text-[0.6875rem] uppercase tracking-[0.1em] font-bold text-[#abefe8] hover:underline"
          >
            pet-bewerbung.ch
          </a>
          {config.footerSignContainer ? (
            <div className={config.footerSignContainer}>
              <p className={config.footerSignText}>{doc?.sign ?? 'Signature'}</p>
            </div>
          ) : null}
        </div>
      </footer>
    </>
  );
};

export default BuddyTemplate;

export const getBuddyConfig = (today: string): TemplateConfig => ({
  container:
    'w-[210mm] h-[292mm] bg-[#f8f9ff] text-[#0b1c30] p-[10mm] text-xs font-sans relative box-border flex flex-col shadow-none mx-auto overflow-hidden',
  headerContainer: 'mb-0 pb-6 px-2 -mx-2 pt-2 bg-[#eff4ff] border-b border-[#004541]/20',
  headerFlex: 'flex items-start justify-between gap-4',
  headerIconContainer: 'flex items-center gap-4 min-w-0',
  headerIconBg: 'bg-white p-2 rounded-lg border border-[#bec9c7]/60 shadow-sm shrink-0',
  headerIconSize: 18,
  titleText: 'text-xl font-bold text-[#004541] tracking-tight',
  subtitleText: 'text-[10px] uppercase tracking-[0.2em] text-[#3f4947] mt-0.5',
  dateText: 'text-[10px] text-[#64748b]',
  dateLabel: today,
  mainLayout: 'flex gap-0 flex-1 min-h-0 overflow-hidden mt-4',
  sidebarWidth: 'w-[35%] flex-shrink-0 bg-[#eff4ff]/90 border border-[#d3e4fe]/80 rounded-xl p-3',
  sidebarSpace: 'space-y-5',
  sidebarShell: '',
  mainWidth: 'flex-1 min-w-0 pl-6',
  mainSpace: 'space-y-8',
  footerContainer:
    'mt-auto pt-4 flex-shrink-0 pb-[4mm] px-4 py-4 -mx-2 bg-[#004541] text-[#f8f9ff] rounded-t-lg',
  footerText: 'text-[9px] text-[#abefe8]',
  footerSignContainer: 'w-44 border-b border-[#abefe8]/50 pb-2',
  footerSignText: 'text-[0.6875rem] uppercase tracking-[0.1em] text-[#f8f9ff]/90 text-right',
  badge: null,
});
