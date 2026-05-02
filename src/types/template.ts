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
  [key: string]: unknown

  title?: string
  landing?: Record<string, unknown>
  steps?: string[]
  stepTitles?: Record<string | number, string>
  summary?: Record<string, unknown>
  templateSelection?: Record<string, unknown>
  preview?: Record<string, unknown>
  finalMessage?: string

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

  templates?: Record<string, unknown>

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
  }

  stepsNew?: Record<string, Record<string, string | undefined> | undefined>

  doc?: Record<string, string>
  labels?: Record<string, string>

  placeholders?: Record<string, string>
  step1Details?: Record<string, string>
  affiliate?: Record<string, string>
  builder?: Record<string, string>
}

export type TemplateConfigGetter = (today: string) => TemplateConfig

export interface TemplateModule {
  default: React.ComponentType<TemplateProps>
  getConfig: TemplateConfigGetter
}
