/**
 * Template Types
 * Type definitions for document templates and configurations
 */

import { PetData, TemplateType } from './form'

export interface TemplateConfig {
  // Container
  container: string

  // Header
  headerContainer: string
  headerFlex: string
  headerIconContainer: string
  headerIconBg: string
  headerIconSize: number
  titleText: string
  subtitleText: string
  dateText: string
  dateLabel: string
  dateBadge?: string | null

  // Main Layout
  mainLayout: string
  sidebarWidth: string
  sidebarSpace: string
  mainWidth: string
  mainSpace: string

  // Footer
  footerContainer: string
  footerText: string
  footerSignContainer: string
  footerSignText: string

  // Optional Layout Properties
  descriptionContainer?: string
  bottomLayout?: string

  // Colors
  primaryColor?: string
  accentColor?: string

  // Badge
  badge: string | null
}

export interface TemplateOption {
  id: TemplateType
  label: string
  description?: string
  previewImage?: string
}

export interface TemplateProps {
  data: PetData
  t: TranslationObject
  customColors: CustomColors | null
  config: TemplateConfig
  styleOverrides: StyleOverrides
}

export interface CustomColors {
  primary: string
  secondary: string
  accentStyle: string
  textColor: string
  backgroundColor: string
  headerFont: string
  bodyFont: string
  headerBold: boolean
  headerItalic: boolean
  bodyBold: boolean
  bodyItalic: boolean
  headerFontSize: number
  bodyFontSize: number
}

export interface StyleOverrides {
  header: React.CSSProperties
  accent: React.CSSProperties
  border: React.CSSProperties
  footer: React.CSSProperties
}

export interface TranslationObject {
  header?: Record<string, string>
  ui?: Record<string, string>
  nav?: Record<string, string>
  validation?: Record<string, string>
  step4?: Record<string, string>
  step2Emergency?: Record<string, string>
  hero?: Record<string, string | string[]>
  footer?: Record<string, string>
  thankYou?: Record<string, string>
  legal?: Record<string, string>
  templates?: {
    intro?: string
    [key: string]: unknown
  }
  /** Pack used by text generation; validated at runtime in AppContent. */
  generationText?: unknown
  premium?: {
    zipDownloaded?: string
    [key: string]: unknown
  }
  faq?: {
    title?: string
    searchPlaceholder?: string
    noResults?: string
    footerHint?: string
    categories?: Record<string, string>
    items?: Array<{
      id: string
      category?: string
      q: string
      a: string
    }>
    [key: string]: unknown
  }
  stepsNew?: {
    step1?: { short?: string; [key: string]: string | undefined }
    step2?: { short?: string; [key: string]: string | undefined }
    step3?: { short?: string; [key: string]: string | undefined }
    step4?: { short?: string; [key: string]: string | undefined }
    step5?: { short?: string; [key: string]: string | undefined }
    step6?: { short?: string; [key: string]: string | undefined }
    [key: string]: { short?: string; [key: string]: string | undefined } | undefined
  }
  doc?: {
    title: string
    subtitle: string
    footer: string
    sign: string
    sectionOwner: string
    sectionPet: string
    sectionDescription: string
    sectionLegal: string
    sectionReference: string
    [key: string]: string
  }
  labels?: Record<string, string>
  [key: string]: any
}

export type TemplateConfigGetter = (today: string) => TemplateConfig

export interface TemplateModule {
  default: React.ComponentType<TemplateProps>
  getConfig: TemplateConfigGetter
}
