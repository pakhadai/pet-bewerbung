/**
 * Compact Template - Minimalist template
 * Layout: Standard sidebar + main content (narrower margins)
 * Theme: Minimal gray/white, space-efficient design
 */

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

export interface CompactTemplateProps {
  data: FormData
  t: TranslationObject
  customColors: unknown
  config: TemplateConfig
  styleOverrides: StyleOverrides
  variant: TemplateType
}

const CompactTemplate: React.FC<CompactTemplateProps> = ({
  data,
  t,
  customColors,
  config,
  styleOverrides,
  variant,
}) => {
  const { header, accent, border, footer } = styleOverrides
  const doc = t.doc

  return (
    <>
      {/* Header */}
      <div className={config.headerContainer} style={header}>
        <div className={config.headerFlex}>
          <div className={config.headerIconContainer}>
            <div
              className={`${config.headerIconBg} flex items-center justify-center overflow-hidden p-1`}
              style={border}
            >
              <img
                src={PUBLIC_LOGO_PATH}
                alt=""
                className="w-full h-full object-contain"
                style={{ width: config.headerIconSize + 8, height: config.headerIconSize + 8 }}
              />
            </div>
            <div className="flex flex-col">
              <h1 className={config.titleText}>{doc?.title ?? 'Pet Dossier'}</h1>
              <p className={config.subtitleText} style={accent}>
                {doc?.subtitle ?? 'Application document'}
              </p>
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
        <div
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
        </div>

        {/* Main Content */}
        <div className={`${config.mainWidth} ${config.mainSpace}`}>
          <PetDetails data={data} t={t} variant={variant} customColors={customColors} />
          <DescriptionSection
            text={data.generatedText}
            t={t}
            variant={variant}
            customColors={customColors}
          />
          <LegalSection data={data} t={t} variant={variant} customColors={customColors} />
          <ReferenceSection data={data} t={t} variant={variant} customColors={customColors} />
        </div>
      </div>

      {/* Footer - Subtle branding */}
      <div className={config.footerContainer} style={footer}>
        <div className="flex justify-between items-end">
          <p className="text-[6px] text-amber-900/55 tracking-widest font-mono uppercase">
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
  )
}

export default CompactTemplate

/**
 * Template configuration for Compact template
 */
export const getCompactConfig = (today: string): TemplateConfig => ({
  container:
    'w-[210mm] h-[292mm] bg-[color:var(--tpl-light)] text-[color:var(--tpl-body-text)] p-[var(--tpl-doc-padding)] text-[10px] font-sans relative box-border flex flex-col shadow-none mx-auto overflow-hidden',
  headerContainer: 'mb-3 pb-2 border-b border-dashed border-[color:var(--tpl-border)]/60',
  headerFlex: 'flex items-start justify-between',
  headerIconContainer: 'flex items-center gap-2',
  headerIconBg: 'bg-[color:var(--tpl-light)] p-1.5 border rounded-sm',
  headerIconSize: 14,
  titleText: 'text-sm font-bold uppercase tracking-[0.18em]',
  subtitleText: 'text-[9px] uppercase tracking-widest text-[color:var(--tpl-muted)] mt-0.5',
  dateText: 'text-[9px] text-[color:var(--tpl-muted)] text-right font-mono',
  dateLabel: today,
  mainLayout: 'flex gap-4 flex-1 min-h-0 overflow-hidden',
  sidebarWidth: 'w-[32%] flex-shrink-0',
  sidebarSpace: 'space-y-2',
  sidebarShell: 'border-r border-dashed border-[color:var(--tpl-border)]/60 pr-2',
  mainWidth: 'flex-1 min-w-0',
  mainSpace: 'space-y-2',
  footerContainer:
    'mt-auto pt-2.5 border-t border-dashed border-[color:var(--tpl-border)] flex-shrink-0 pb-[4mm]',
  footerText: 'text-[8px] text-[color:var(--tpl-muted)] text-center mb-2',
  footerSignContainer: 'w-40 border-t border-[color:var(--tpl-border)]/60 pt-2 mt-5',
  footerSignText:
    'text-[8px] uppercase font-medium tracking-wider text-[color:var(--tpl-muted)] text-center',
  badge: null,
})
