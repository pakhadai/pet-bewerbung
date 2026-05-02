/**
 * Buddy Template — Material-inspired layout (35% / 65%), brand palette.
 * Uses the same document sections and PetData fields as other templates.
 */

import { MapPin } from 'lucide-react'
import React from 'react'
import { PUBLIC_LOGO_PATH } from '../../constants'
import type { FormData, TemplateType } from '../../types/form'
import type { TranslationObject } from '../../types/template'
import BehaviorSection from '../document/BehaviorSection'
import DescriptionSection from '../document/DescriptionSection'
import LegalSection from '../document/LegalSection'
import OwnerInfo from '../document/OwnerInfo'
import PetDetails from '../document/PetDetails'
import PetPhoto from '../document/PetPhoto'
import ReferenceSection from '../document/ReferenceSection'
import type { StyleOverrides, TemplateConfig } from './ClassicTemplate'

export interface BuddyTemplateProps {
  data: FormData
  t: TranslationObject
  customColors: unknown
  config: TemplateConfig
  styleOverrides: StyleOverrides
  variant: TemplateType
}

const BuddyTemplate: React.FC<BuddyTemplateProps> = ({
  data,
  t,
  customColors,
  config,
  variant,
}) => {
  const doc = t.doc

  const cityDate = data.city?.toString().trim()
    ? `${String(data.city).trim()}, ${config.dateLabel}`
    : config.dateLabel

  return (
    <>
      <header className={config.headerContainer}>
        <div className={config.headerFlex}>
          <div className={config.headerIconContainer}>
            <div
              className={`${config.headerIconBg} flex items-center justify-center overflow-hidden p-1`}
            >
              <img
                src={PUBLIC_LOGO_PATH}
                alt=""
                className="w-full h-full object-contain"
                style={{ width: config.headerIconSize + 8, height: config.headerIconSize + 8 }}
              />
            </div>
            <div className="h-8 w-px shrink-0 bg-[color:var(--tpl-border)]/50" aria-hidden />
            <div className="flex flex-col min-w-0">
              <span className="text-lg font-black text-[color:var(--tpl-primary)] uppercase tracking-wider leading-tight">
                Pet-Bewerbung
              </span>
              <h1 className={`${config.titleText} mt-1`}>{doc?.title ?? 'Pet CV'}</h1>
              <p className={config.subtitleText}>{doc?.subtitle ?? 'Application document'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-[color:var(--tpl-muted)] text-right">
            <MapPin size={16} className="shrink-0 text-[color:var(--tpl-primary)]" aria-hidden />
            <span>{cityDate}</span>
          </div>
        </div>
      </header>

      <div className={config.mainLayout}>
        <aside
          className={`${config.sidebarWidth} ${config.sidebarSpace} ${config.sidebarShell ?? ''}`}
        >
          <PetPhoto
            photo={data.photo}
            petType={data.petType}
            t={t}
            variant={variant}
            customColors={customColors}
          />
          <OwnerInfo data={data} t={t} variant={variant} customColors={customColors} />
          <BehaviorSection data={data} t={t} variant={variant} customColors={customColors} />
        </aside>

        <main className={`${config.mainWidth} ${config.mainSpace}`}>
          <PetDetails data={data} t={t} variant={variant} customColors={customColors} />
          <DescriptionSection
            text={data.generatedText}
            t={t}
            variant={variant}
            customColors={customColors}
          />
          <LegalSection data={data} t={t} variant={variant} customColors={customColors} />
          <ReferenceSection data={data} t={t} variant={variant} customColors={customColors} />
        </main>
      </div>

      <footer className={config.footerContainer}>
        <div className="flex justify-between items-end gap-4 w-full">
          <a
            href="https://pet-bewerbung.ch"
            className="font-sans text-[0.6875rem] uppercase tracking-[0.1em] font-bold text-white/80 hover:underline"
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
  )
}

export default BuddyTemplate

export const getBuddyConfig = (today: string): TemplateConfig => ({
  container:
    'w-[210mm] h-[292mm] bg-[color:var(--tpl-light)] text-[color:var(--tpl-body-text)] p-[var(--tpl-doc-padding)] text-xs font-sans relative box-border flex flex-col shadow-none mx-auto overflow-hidden',
  headerContainer:
    'mb-0 pb-6 px-2 -mx-2 pt-2 bg-[color:var(--tpl-light)] border-b border-[color:var(--tpl-border)]/40',
  headerFlex: 'flex items-start justify-between gap-4',
  headerIconContainer: 'flex items-center gap-4 min-w-0',
  headerIconBg: 'bg-white p-2 rounded-lg border shadow-sm shrink-0',
  headerIconSize: 18,
  titleText: 'text-xl font-bold tracking-tight',
  subtitleText: 'text-[10px] uppercase tracking-[0.2em] text-[color:var(--tpl-muted)] mt-0.5',
  dateText: 'text-[10px] text-[color:var(--tpl-muted)]',
  dateLabel: today,
  mainLayout: 'flex gap-0 flex-1 min-h-0 overflow-hidden mt-4',
  sidebarWidth:
    'w-[35%] flex-shrink-0 bg-white/40 border border-[color:var(--tpl-border)]/30 rounded-xl p-3',
  sidebarSpace: 'space-y-5',
  sidebarShell: '',
  mainWidth: 'flex-1 min-w-0 pl-6',
  mainSpace: 'space-y-8',
  footerContainer:
    'mt-auto pt-4 flex-shrink-0 pb-[4mm] px-4 py-4 -mx-2 bg-[color:var(--tpl-primary)] text-white rounded-t-lg',
  footerText: 'text-[9px] text-white/80',
  footerSignContainer: 'w-44 border-b border-white/40 pb-2',
  footerSignText: 'text-[0.6875rem] uppercase tracking-[0.1em] text-white/90 text-right',
  badge: null,
})
