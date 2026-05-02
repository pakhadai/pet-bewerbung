/**
 * Buddy (test) — експериментальна копія Buddy: інша сітка, більше ім’я, рамка TEST,
 * колонки з overflow для стабільності на A4 (контент скролиться всередині сторінки).
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

export interface BuddyTestTemplateProps {
  data: FormData
  t: TranslationObject
  customColors: unknown
  config: TemplateConfig
  styleOverrides: StyleOverrides
  variant: TemplateType
}

const BuddyTestTemplate: React.FC<BuddyTestTemplateProps> = ({
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
            <span
              className="shrink-0 rounded-md bg-amber-500 px-2 py-1 text-[10px] font-black uppercase tracking-widest text-white shadow-sm"
              title="Test template"
            >
              Test
            </span>
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
            <div className="h-8 w-px shrink-0 bg-amber-400/40" aria-hidden />
            <div className="flex flex-col min-w-0">
              <span className="text-lg font-black text-[color:var(--tpl-primary)] uppercase tracking-wider leading-tight">
                Pet-Bewerbung
              </span>
              <h1 className={`${config.titleText} mt-1`}>{doc?.title ?? 'Pet CV'}</h1>
              <p className={config.subtitleText}>{doc?.subtitle ?? 'Application document'}</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1 text-right">
            <div className="flex items-center gap-2 text-xs font-medium text-[color:var(--tpl-muted)]">
              <MapPin size={16} className="shrink-0 text-[color:var(--tpl-primary)]" aria-hidden />
              <span>{cityDate}</span>
            </div>
          </div>
        </div>
      </header>

      <div className={config.mainLayout}>
        <aside
          className={`${config.sidebarWidth} ${config.sidebarSpace} ${config.sidebarShell ?? ''} min-h-0 overflow-y-auto pr-1`}
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

        <main className={`${config.mainWidth} ${config.mainSpace} min-h-0 overflow-y-auto pl-1`}>
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
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-200">
              Test layout
            </span>
            <a
              href="https://pet-bewerbung.ch"
              className="font-sans text-[0.6875rem] uppercase tracking-[0.1em] font-bold text-white/80 hover:underline"
            >
              pet-bewerbung.ch
            </a>
          </div>
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

export default BuddyTestTemplate

export const getBuddyTestConfig = (today: string): TemplateConfig => ({
  container:
    'w-[210mm] h-[292mm] bg-white text-[color:var(--tpl-body-text)] p-[var(--tpl-doc-padding)] text-xs font-sans relative box-border flex flex-col shadow-none mx-auto overflow-hidden border-2 border-dashed border-[color:var(--tpl-accent)]/45 rounded-xl',
  headerContainer:
    'mb-0 pb-5 px-2 -mx-1 pt-2 bg-gradient-to-r from-[color:var(--tpl-light)] to-white border-b-2 border-[color:var(--tpl-accent)]/30',
  headerFlex: 'flex items-start justify-between gap-4',
  headerIconContainer: 'flex items-center gap-3 min-w-0 flex-wrap',
  headerIconBg: 'bg-white p-2 rounded-xl border-2 shadow-md shrink-0',
  headerIconSize: 18,
  titleText: 'text-2xl font-extrabold tracking-tight',
  subtitleText: 'text-[10px] uppercase tracking-[0.25em] text-[color:var(--tpl-accent)] mt-0.5',
  dateText: 'text-[10px] text-[color:var(--tpl-muted)]',
  dateLabel: today,
  mainLayout: 'flex gap-4 flex-1 min-h-0 overflow-hidden mt-3',
  sidebarWidth:
    'w-[34%] max-w-[34%] flex-shrink-0 bg-gradient-to-b from-[color:var(--tpl-light)] to-white border-2 border-[color:var(--tpl-accent)]/22 rounded-2xl p-3 shadow-inner',
  sidebarSpace: 'space-y-4',
  sidebarShell: '',
  mainWidth: 'flex-1 min-w-0 min-h-0 flex flex-col',
  mainSpace: 'space-y-6',
  footerContainer:
    'mt-auto pt-3 flex-shrink-0 pb-[3mm] px-4 py-3 -mx-1 bg-[color:var(--tpl-primary)] text-white rounded-t-xl border-t-4 border-[color:var(--tpl-accent)]',
  footerText: 'text-[9px] text-white/80',
  footerSignContainer: 'w-44 border-b border-white/40 pb-2',
  footerSignText: 'text-[0.6875rem] uppercase tracking-[0.1em] text-white/90 text-right',
  badge: null,
})
