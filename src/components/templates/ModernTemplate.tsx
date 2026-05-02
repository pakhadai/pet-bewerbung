/**
 * Modern Template - Sleek design
 * Layout: Standard sidebar + main content
 * Theme: Gray/blue tones, soft borders, modern aesthetics
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

export interface ModernTemplateProps {
  data: FormData
  t: TranslationObject
  customColors: unknown
  config: TemplateConfig
  styleOverrides: StyleOverrides
  variant: TemplateType
}

const ModernTemplate: React.FC<ModernTemplateProps> = ({
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
          <p className="text-[6px] text-teal-700/80 tracking-wide font-medium">pet-bewerbung.ch</p>
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

export default ModernTemplate

/**
 * Template configuration for Modern template
 */
export const getModernConfig = (today: string): TemplateConfig => ({
  container:
    'w-[210mm] h-[292mm] bg-gradient-to-br from-[color:var(--tpl-light)] via-white to-slate-50 text-[color:var(--tpl-body-text)] p-[var(--tpl-doc-padding)] text-xs font-sans relative box-border flex flex-col shadow-none mx-auto overflow-hidden',
  headerContainer: 'mb-4 pb-3 border-b-2 border-[color:var(--tpl-accent)]/35',
  headerFlex: 'flex items-start justify-between',
  headerIconContainer: 'flex items-center gap-3',
  headerIconBg: 'bg-white p-2 rounded-xl border shadow-sm',
  headerIconSize: 18,
  titleText: 'text-2xl font-bold tracking-tight',
  subtitleText: 'text-[11px] mt-1.5 font-medium',
  dateText: 'text-[10px] text-[color:var(--tpl-muted)] text-right',
  dateLabel: today,
  mainLayout: 'flex gap-5 flex-1 min-h-0 overflow-hidden',
  sidebarWidth: 'w-[35%] flex-shrink-0',
  sidebarSpace: 'space-y-3',
  sidebarShell:
    'rounded-2xl bg-white/70 backdrop-blur-[2px] border border-[color:var(--tpl-border)]/40 p-2.5 shadow-sm',
  mainWidth: 'flex-1 min-w-0',
  mainSpace: 'space-y-3',
  footerContainer:
    'mt-auto pt-3 border-t border-[color:var(--tpl-border)]/60 flex-shrink-0 pb-[5mm]',
  footerText: 'text-[9px] text-[color:var(--tpl-muted)] text-center mb-3',
  footerSignContainer: 'w-44 border-t border-[color:var(--tpl-border)]/60 pt-3 mt-6',
  footerSignText:
    'text-[9px] uppercase font-medium tracking-wider text-[color:var(--tpl-muted)] text-center',
  badge: null,
})
