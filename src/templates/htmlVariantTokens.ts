import type { DocumentVariant } from '../components/document/OwnerInfo'

export type HtmlSectionTokens = {
  container: string
  heading: string
  content: string
  name: string
  address: string
  contactContainer: string
  contactItem: string
  iconSize: number
}

export type BehaviorSectionTokens = {
  container: string
  heading: string
  grid: string
  fieldLabel: string
  fieldValue: string
  badge: string
  badgeLow: string
  badgeMedium: string
  badgeHigh: string
  badgeGood: string
  badgeNeutral: string
  iconContainer: string
}

export type LegalSectionTokens = {
  container: string
  heading: string
  grid: string
  fieldLabel: string
  fieldValue: string
  fieldValueText: string
  statusContainer: string
}

export type ReferenceSectionTokens = {
  container: string
  heading: string
  columnsContainer: string
  subsection: string
  subheading: string
  grid: string
  fieldLabel: string
  fieldValue: string
  contactItem: string
  iconSize: number
  secondaryContact: {
    container: string
    border: string
  }
}

export type DescriptionSectionTokens = {
  container: string
  heading: string
  text: string
  headingAccentBar?: string
  emptyText?: string
}

export type PetPhotoTokens = {
  container: string
  image: string
  placeholder: string
  placeholderIcon: number
  placeholderText: string
  badge: string
  badgeIcon: number
}

export type PetDetailsTokens = {
  container: string
  heading: string
  grid: string
  fieldLabel: string
  fieldValueLarge: string
  fieldValue: string
}

export const OWNER_INFO_TOKENS: Record<DocumentVariant, HtmlSectionTokens> = {
  classic: {
    container: '',
    heading:
      'font-bold uppercase tracking-wider text-xs mb-3 pb-2 border-b-2 border-[color:var(--tpl-border)] text-[color:var(--tpl-primary)]',
    content: 'space-y-2',
    name: 'font-semibold text-base leading-tight text-[color:var(--tpl-primary)]',
    address: 'text-[color:var(--tpl-muted)] text-sm leading-tight',
    contactContainer: 'pt-3 space-y-2 text-[color:var(--tpl-muted)] text-xs',
    contactItem: 'flex items-center gap-2',
    iconSize: 12,
  },
  modern: {
    container: '',
    heading:
      'font-bold text-base mb-3 pl-3 border-l-4 border-[color:var(--tpl-accent)] text-[color:var(--tpl-primary)]',
    content: 'space-y-2',
    name: 'font-semibold text-base text-[color:var(--tpl-primary)]',
    address: 'text-[color:var(--tpl-muted)] text-sm',
    contactContainer: 'pt-3 space-y-2 text-[color:var(--tpl-muted)] text-xs',
    contactItem: 'flex items-center gap-2',
    iconSize: 12,
  },
  swiss: {
    container: '',
    heading:
      'font-bold uppercase tracking-wider text-xs mb-3 pb-2 border-b-2 border-[color:var(--tpl-border)] text-[color:var(--tpl-primary)]',
    content: 'space-y-2',
    name: 'font-semibold text-base leading-tight text-[color:var(--tpl-primary)]',
    address: 'text-[color:var(--tpl-muted)] text-sm leading-tight',
    contactContainer: 'pt-3 space-y-2 text-[color:var(--tpl-muted)] text-xs',
    contactItem: 'flex items-center gap-2',
    iconSize: 12,
  },
  compact: {
    container: '',
    heading:
      'text-[10px] font-mono font-bold uppercase tracking-[0.2em] mb-2 pb-1 border-b border-dashed border-[color:var(--tpl-border)] text-[color:var(--tpl-primary)]',
    content: 'space-y-1.5',
    name: 'font-semibold text-sm text-[color:var(--tpl-primary)]',
    address: 'text-[color:var(--tpl-muted)] text-xs',
    contactContainer: 'pt-2 space-y-1.5 text-[color:var(--tpl-muted)] text-[10px]',
    contactItem: 'flex items-center gap-1.5',
    iconSize: 10,
  },
  buddy: {
    container: '',
    heading:
      'text-[color:var(--tpl-primary)] font-semibold text-sm uppercase tracking-wider mb-3 pb-2 border-b border-[color:var(--tpl-border)]/40',
    content: 'space-y-2.5',
    name: 'font-semibold text-[color:var(--tpl-primary)] text-sm',
    address: 'text-[color:var(--tpl-muted)] text-xs leading-relaxed',
    contactContainer: 'pt-2 space-y-2 text-[color:var(--tpl-primary)] text-xs',
    contactItem: 'flex items-center gap-2',
    iconSize: 14,
  },
  buddyTest: {
    container: '',
    heading:
      'text-[color:var(--tpl-primary)] font-bold text-xs uppercase tracking-[0.15em] mb-3 pb-2 border-b-2 border-[color:var(--tpl-accent)]/45',
    content: 'space-y-2.5',
    name: 'font-bold text-[color:var(--tpl-primary)] text-sm',
    address: 'text-[color:var(--tpl-muted)] text-xs leading-relaxed',
    contactContainer: 'pt-2 space-y-2 text-[color:var(--tpl-primary)] text-xs',
    contactItem: 'flex items-center gap-2',
    iconSize: 14,
  },
}

export function getOwnerInfoTokens(variant: DocumentVariant): HtmlSectionTokens {
  return OWNER_INFO_TOKENS[variant] ?? OWNER_INFO_TOKENS.classic
}

export const PET_DETAILS_TOKENS: Record<DocumentVariant, PetDetailsTokens> = {
  classic: {
    container: '',
    heading:
      'font-bold uppercase tracking-wider text-xs mb-4 pb-2 border-b-2 border-[color:var(--tpl-border)] text-[color:var(--tpl-primary)]',
    grid: 'grid grid-cols-2 gap-y-4 gap-x-6',
    fieldLabel:
      'block text-[10px] text-[color:var(--tpl-muted)] uppercase tracking-wide mb-1.5 font-semibold',
    fieldValueLarge: 'font-bold text-lg text-[color:var(--tpl-primary)]',
    fieldValue: 'text-sm font-medium text-[color:var(--tpl-primary)]/80',
  },
  modern: {
    container: '',
    heading:
      'font-bold text-base mb-4 pl-3 border-l-4 border-[color:var(--tpl-accent)] text-[color:var(--tpl-primary)]',
    grid: 'grid grid-cols-2 gap-y-3 gap-x-6',
    fieldLabel: 'block text-xs text-[color:var(--tpl-muted)] uppercase tracking-wide mb-1.5 font-semibold',
    fieldValueLarge: 'font-semibold text-lg text-[color:var(--tpl-primary)]',
    fieldValue: 'text-sm font-medium text-[color:var(--tpl-primary)]/80',
  },
  swiss: {
    container: '',
    heading:
      'font-bold uppercase tracking-wider text-xs mb-4 pb-2 border-b-2 border-[color:var(--tpl-border)] text-[color:var(--tpl-primary)]',
    grid: 'grid grid-cols-2 gap-y-4 gap-x-6',
    fieldLabel:
      'block text-[10px] text-[color:var(--tpl-muted)] uppercase tracking-wide mb-1.5 font-semibold',
    fieldValueLarge: 'font-bold text-lg text-[color:var(--tpl-primary)]',
    fieldValue: 'text-sm font-medium text-[color:var(--tpl-primary)]/80',
  },
  compact: {
    container: '',
    heading:
      'text-[10px] font-mono font-bold uppercase tracking-[0.2em] mb-2 pb-1 border-b border-dashed border-[color:var(--tpl-border)] text-[color:var(--tpl-primary)]',
    grid: 'grid grid-cols-2 gap-y-2 gap-x-4',
    fieldLabel: 'block text-[9px] text-[color:var(--tpl-muted)] uppercase tracking-wider mb-1 font-semibold',
    fieldValueLarge: 'font-bold text-sm text-[color:var(--tpl-primary)]',
    fieldValue: 'text-xs font-medium text-[color:var(--tpl-primary)]/85',
  },
  buddy: {
    container: '',
    heading:
      'font-bold uppercase tracking-wider text-xs mb-4 pb-2 border-b-2 border-[color:var(--tpl-border)] text-[color:var(--tpl-primary)]',
    grid: 'grid grid-cols-2 gap-y-4 gap-x-6',
    fieldLabel:
      'block text-[10px] text-[color:var(--tpl-muted)] uppercase tracking-wide mb-1.5 font-semibold',
    fieldValueLarge: 'font-bold text-lg text-[color:var(--tpl-primary)]',
    fieldValue: 'text-sm font-medium text-[color:var(--tpl-primary)]/80',
  },
  buddyTest: {
    container: '',
    heading:
      'font-bold uppercase tracking-wider text-xs mb-4 pb-2 border-b-2 border-[color:var(--tpl-border)] text-[color:var(--tpl-primary)]',
    grid: 'grid grid-cols-2 gap-y-4 gap-x-6',
    fieldLabel:
      'block text-[10px] text-[color:var(--tpl-muted)] uppercase tracking-wide mb-1.5 font-semibold',
    fieldValueLarge: 'font-bold text-lg text-[color:var(--tpl-primary)]',
    fieldValue: 'text-sm font-medium text-[color:var(--tpl-primary)]/80',
  },
}

export function getPetDetailsTokens(variant: DocumentVariant): PetDetailsTokens {
  return PET_DETAILS_TOKENS[variant] ?? PET_DETAILS_TOKENS.classic
}

export const BEHAVIOR_SECTION_TOKENS: Record<DocumentVariant, BehaviorSectionTokens> = {
  classic: {
    container: 'bg-[color:var(--tpl-light)] p-3 border-2 border-[color:var(--tpl-border)]/20',
    heading: 'font-bold uppercase tracking-wider text-[10px] mb-2',
    grid: 'grid grid-cols-2 gap-y-2 gap-x-3',
    fieldLabel: 'block text-[9px] text-[color:var(--tpl-muted)] uppercase tracking-wide mb-1 font-semibold',
    fieldValue: 'font-medium text-xs',
    badge: 'inline-block px-2 py-0.5 rounded text-[9px] font-semibold',
    badgeLow: 'bg-green-100 text-green-700',
    badgeMedium: 'bg-yellow-100 text-yellow-700',
    badgeHigh: 'bg-red-100 text-red-700',
    badgeGood: 'bg-green-100 text-green-700',
    badgeNeutral: 'bg-gray-100 text-gray-700',
    iconContainer: 'flex items-center gap-1.5',
  },
  modern: {
    container: 'bg-[color:var(--tpl-light)]/60 p-3 border border-[color:var(--tpl-border)]/60 rounded-xl shadow-sm',
    heading: 'font-bold text-xs mb-2 pl-2 border-l-4 border-[color:var(--tpl-accent)] text-[color:var(--tpl-primary)]',
    grid: 'grid grid-cols-2 gap-y-2 gap-x-3',
    fieldLabel: 'block text-[9px] text-[color:var(--tpl-muted)] uppercase tracking-wide mb-1 font-semibold',
    fieldValue: 'font-medium text-xs',
    badge: 'inline-block px-2 py-0.5 rounded text-[9px] font-semibold',
    badgeLow: 'bg-green-100 text-green-700',
    badgeMedium: 'bg-yellow-100 text-yellow-700',
    badgeHigh: 'bg-red-100 text-red-700',
    badgeGood: 'bg-green-100 text-green-700',
    badgeNeutral: 'bg-gray-100 text-gray-700',
    iconContainer: 'flex items-center gap-1.5',
  },
  swiss: {
    container: 'bg-[color:var(--tpl-light)] p-3 border-2 border-[color:var(--tpl-border)]/60',
    heading: 'font-bold uppercase tracking-wider text-[10px] mb-2',
    grid: 'grid grid-cols-2 gap-y-2 gap-x-3',
    fieldLabel: 'block text-[9px] text-[color:var(--tpl-muted)] uppercase tracking-wide mb-1 font-semibold',
    fieldValue: 'font-medium text-xs',
    badge: 'inline-block px-2 py-0.5 rounded text-[9px] font-semibold',
    badgeLow: 'bg-green-100 text-green-700',
    badgeMedium: 'bg-yellow-100 text-yellow-700',
    badgeHigh: 'bg-red-100 text-red-700',
    badgeGood: 'bg-green-100 text-green-700',
    badgeNeutral: 'bg-gray-100 text-gray-700',
    iconContainer: 'flex items-center gap-1.5',
  },
  buddy: {
    container: 'bg-white p-3 border border-[color:var(--tpl-border)]/30 rounded-xl shadow-sm',
    heading:
      'text-[color:var(--tpl-primary)] font-semibold text-sm uppercase tracking-wider mb-3 pb-2 border-b border-[color:var(--tpl-border)]/30',
    grid: 'grid grid-cols-2 gap-y-3 gap-x-3',
    fieldLabel: 'block text-[9px] text-[color:var(--tpl-muted)] uppercase tracking-wide mb-1 font-semibold',
    fieldValue: 'font-medium text-xs text-[color:var(--tpl-primary)]',
    badge: 'inline-block px-2 py-0.5 rounded-full text-[9px] font-semibold',
    badgeLow: 'bg-emerald-50 text-[color:var(--tpl-primary)]',
    badgeMedium: 'bg-amber-100 text-amber-900',
    badgeHigh: 'bg-red-100 text-red-800',
    badgeGood: 'bg-emerald-50 text-[color:var(--tpl-primary)]',
    badgeNeutral: 'bg-slate-100 text-slate-700',
    iconContainer: 'flex items-center gap-1.5',
  },
  buddyTest: {
    container:
      'bg-white/90 p-3 border-2 border-amber-200/70 rounded-2xl shadow-md ring-1 ring-amber-100',
    heading:
      'text-[color:var(--tpl-primary)] font-bold text-xs uppercase tracking-[0.12em] mb-3 pb-2 border-b-2 border-[color:var(--tpl-accent)]/25',
    grid: 'grid grid-cols-2 gap-y-3 gap-x-3',
    fieldLabel: 'block text-[9px] text-[color:var(--tpl-muted)] uppercase tracking-wide mb-1 font-bold',
    fieldValue: 'font-medium text-xs text-[color:var(--tpl-primary)]',
    badge: 'inline-block px-2 py-0.5 rounded-full text-[9px] font-semibold',
    badgeLow: 'bg-emerald-100 text-emerald-900',
    badgeMedium: 'bg-amber-100 text-amber-900',
    badgeHigh: 'bg-red-100 text-red-800',
    badgeGood: 'bg-emerald-100 text-emerald-900',
    badgeNeutral: 'bg-slate-100 text-slate-700',
    iconContainer: 'flex items-center gap-1.5',
  },
  compact: {
    container: 'bg-[color:var(--tpl-light)] p-2 border border-dashed border-[color:var(--tpl-border)]/60 rounded-sm',
    heading: 'text-[9px] font-mono font-bold uppercase tracking-widest mb-2 text-[color:var(--tpl-primary)]',
    grid: 'grid grid-cols-2 gap-y-1.5 gap-x-2',
    fieldLabel: 'block text-[9px] text-[color:var(--tpl-muted)] uppercase tracking-wider mb-0.5 font-semibold',
    fieldValue: 'font-medium text-[10px]',
    badge: 'inline-block px-1.5 py-0.5 rounded text-[8px] font-semibold',
    badgeLow: 'bg-green-100 text-green-700',
    badgeMedium: 'bg-yellow-100 text-yellow-700',
    badgeHigh: 'bg-red-100 text-red-700',
    badgeGood: 'bg-green-100 text-green-700',
    badgeNeutral: 'bg-gray-100 text-gray-700',
    iconContainer: 'flex items-center gap-1',
  },
}

export function getBehaviorSectionTokens(variant: DocumentVariant): BehaviorSectionTokens {
  return BEHAVIOR_SECTION_TOKENS[variant] ?? BEHAVIOR_SECTION_TOKENS.classic
}

export const LEGAL_SECTION_TOKENS: Record<DocumentVariant, LegalSectionTokens> = {
  classic: {
    container: 'bg-[color:var(--tpl-light)] p-2.5 border-2 border-[color:var(--tpl-border)]/20',
    heading: 'font-bold uppercase tracking-wider text-[10px] mb-2',
    grid: 'grid grid-cols-2 gap-y-1.5 gap-x-3',
    fieldLabel:
      'block text-[9px] text-[color:var(--tpl-muted)] uppercase tracking-wide mb-0.5 font-semibold',
    fieldValue:
      'font-mono bg-white px-1.5 py-0.5 border border-[color:var(--tpl-border)]/20 text-[10px] inline-block',
    fieldValueText: 'font-medium text-[11px]',
    statusContainer:
      'col-span-2 flex flex-wrap gap-3 mt-2 pt-2 border-t border-[color:var(--tpl-border)]/20',
  },
  modern: {
    container:
      'bg-[color:var(--tpl-light)]/50 p-2.5 border border-[color:var(--tpl-border)]/60 rounded-xl',
    heading:
      'font-bold text-[11px] mb-2 pl-2 border-l-4 border-[color:var(--tpl-accent)] text-[color:var(--tpl-primary)]',
    grid: 'grid grid-cols-2 gap-y-1.5 gap-x-3',
    fieldLabel:
      'block text-[9px] text-[color:var(--tpl-muted)] uppercase tracking-wide mb-0.5 font-semibold',
    fieldValue:
      'font-mono bg-white px-1.5 py-0.5 border border-[color:var(--tpl-border)]/60 rounded text-[10px] inline-block',
    fieldValueText: 'font-medium text-[11px]',
    statusContainer:
      'col-span-2 flex flex-wrap gap-3 mt-2 pt-2 border-t border-[color:var(--tpl-border)]/60',
  },
  swiss: {
    container: 'bg-[color:var(--tpl-light)] p-2.5 border-2 border-[color:var(--tpl-border)]/60',
    heading: 'font-bold uppercase tracking-wider text-[10px] mb-2',
    grid: 'grid grid-cols-2 gap-y-1.5 gap-x-3',
    fieldLabel:
      'block text-[9px] text-[color:var(--tpl-muted)] uppercase tracking-wide mb-0.5 font-semibold',
    fieldValue:
      'font-mono bg-white px-1.5 py-0.5 border border-[color:var(--tpl-border)]/60 text-[10px] inline-block',
    fieldValueText: 'font-medium text-[11px]',
    statusContainer:
      'col-span-2 flex flex-wrap gap-3 mt-2 pt-2 border-t border-[color:var(--tpl-border)]/60',
  },
  buddy: {
    container: 'bg-white/40 p-4 border border-[color:var(--tpl-border)]/30 rounded-2xl',
    heading:
      'text-[color:var(--tpl-primary)] font-bold text-base mb-3 pb-2 border-b border-[color:var(--tpl-border)]/30',
    grid: 'grid grid-cols-2 gap-y-2 gap-x-4',
    fieldLabel:
      'block text-[9px] text-[color:var(--tpl-muted)] uppercase tracking-wide mb-0.5 font-semibold',
    fieldValue:
      'font-mono bg-white px-1.5 py-0.5 border border-[color:var(--tpl-border)]/40 text-[10px] inline-block text-[color:var(--tpl-primary)]',
    fieldValueText: 'font-medium text-[11px] text-[color:var(--tpl-primary)]',
    statusContainer:
      'col-span-2 flex flex-wrap gap-2 mt-2 pt-3 border-t border-[color:var(--tpl-border)]/30',
  },
  buddyTest: {
    container:
      'bg-gradient-to-br from-[color:var(--tpl-light)] to-white p-4 border-2 border-amber-200/60 rounded-2xl shadow-sm',
    heading:
      'text-[color:var(--tpl-primary)] font-extrabold text-base mb-3 pb-2 border-b-2 border-[color:var(--tpl-accent)]/25',
    grid: 'grid grid-cols-2 gap-y-2 gap-x-4',
    fieldLabel:
      'block text-[9px] text-[color:var(--tpl-muted)] uppercase tracking-wide mb-0.5 font-bold',
    fieldValue:
      'font-mono bg-white px-1.5 py-0.5 border border-amber-200 text-[10px] inline-block text-[color:var(--tpl-primary)]',
    fieldValueText: 'font-medium text-[11px] text-[color:var(--tpl-primary)]',
    statusContainer: 'col-span-2 flex flex-wrap gap-2 mt-2 pt-3 border-t border-amber-200/60',
  },
  compact: {
    container: 'bg-white p-2 border border-dashed border-[color:var(--tpl-border)]/60 rounded-sm',
    heading:
      'text-[9px] font-mono font-bold uppercase tracking-widest mb-1.5 text-[color:var(--tpl-primary)]',
    grid: 'grid grid-cols-2 gap-y-1 gap-x-2',
    fieldLabel:
      'block text-[8px] text-[color:var(--tpl-muted)] uppercase tracking-wider mb-0.5 font-semibold',
    fieldValue:
      'font-mono bg-[color:var(--tpl-light)] px-1 py-0.5 border border-[color:var(--tpl-border)]/60 text-[9px] inline-block',
    fieldValueText: 'font-medium text-[10px]',
    statusContainer:
      'col-span-2 flex flex-wrap gap-2 mt-1.5 pt-1.5 border-t border-dashed border-[color:var(--tpl-border)]/60',
  },
}

export function getLegalSectionTokens(variant: DocumentVariant): LegalSectionTokens {
  return LEGAL_SECTION_TOKENS[variant] ?? LEGAL_SECTION_TOKENS.classic
}

export const REFERENCE_SECTION_TOKENS: Record<DocumentVariant, ReferenceSectionTokens> = {
  classic: {
    container:
      'bg-[color:var(--tpl-light)] p-2.5 border-2 border-[color:var(--tpl-border)]/20 mt-2',
    heading:
      'font-bold uppercase tracking-wider text-[9px] mb-2 text-[color:var(--tpl-primary)] pb-1.5 border-b border-[color:var(--tpl-border)]/20',
    columnsContainer: 'grid grid-cols-2 gap-3',
    subsection: '',
    subheading:
      'text-[8px] font-semibold uppercase tracking-wide mb-1 text-[color:var(--tpl-accent)]',
    grid: 'space-y-0.5 text-[10px]',
    fieldLabel: 'text-[8px] text-[color:var(--tpl-muted)] uppercase tracking-wide',
    fieldValue: 'font-medium text-[color:var(--tpl-primary)] text-[10px]',
    contactItem: 'flex items-center gap-1 text-[10px] text-[color:var(--tpl-muted)]',
    iconSize: 9,
    secondaryContact: {
      container: 'mt-2 pt-1.5 text-[9px] text-[color:var(--tpl-muted)]',
      border: 'border-[color:var(--tpl-border)]/20',
    },
  },
  modern: {
    container:
      'bg-[color:var(--tpl-light)]/80 p-2.5 border border-[color:var(--tpl-border)]/60 rounded-xl mt-2 shadow-sm',
    heading:
      'font-bold text-[11px] mb-2 pl-2 border-l-4 border-[color:var(--tpl-accent)] text-[color:var(--tpl-primary)] pb-1.5 border-b border-[color:var(--tpl-border)]/60',
    columnsContainer: 'grid grid-cols-2 gap-3',
    subsection: '',
    subheading:
      'text-[8px] font-semibold uppercase tracking-wide mb-1 text-[color:var(--tpl-accent)]',
    grid: 'space-y-0.5 text-[10px]',
    fieldLabel: 'text-[8px] text-[color:var(--tpl-muted)] uppercase tracking-wide',
    fieldValue: 'font-medium text-[color:var(--tpl-primary)] text-[10px]',
    contactItem: 'flex items-center gap-1 text-[10px] text-[color:var(--tpl-muted)]',
    iconSize: 9,
    secondaryContact: {
      container: 'mt-2 pt-1.5 text-[9px] text-[color:var(--tpl-muted)]',
      border: 'border-[color:var(--tpl-border)]/60',
    },
  },
  swiss: {
    container:
      'bg-[color:var(--tpl-light)] p-2.5 border-2 border-[color:var(--tpl-border)]/60 mt-2',
    heading:
      'font-bold uppercase tracking-wider text-[9px] mb-2 text-[color:var(--tpl-primary)] pb-1.5 border-b border-[color:var(--tpl-border)]/60',
    columnsContainer: 'grid grid-cols-2 gap-3',
    subsection: '',
    subheading:
      'text-[8px] font-semibold uppercase tracking-wide mb-1 text-[color:var(--tpl-accent)]',
    grid: 'space-y-0.5 text-[10px]',
    fieldLabel: 'text-[8px] text-[color:var(--tpl-muted)] uppercase tracking-wide',
    fieldValue: 'font-medium text-[color:var(--tpl-primary)] text-[10px]',
    contactItem: 'flex items-center gap-1 text-[10px] text-[color:var(--tpl-muted)]',
    iconSize: 9,
    secondaryContact: {
      container: 'mt-2 pt-1.5 text-[9px] text-[color:var(--tpl-muted)]',
      border: 'border-[color:var(--tpl-border)]/60',
    },
  },
  compact: {
    container:
      'bg-[color:var(--tpl-light)]/70 p-2 border border-dashed border-[color:var(--tpl-border)]/60 rounded-sm mt-1.5',
    heading:
      'text-[8px] font-mono font-bold uppercase tracking-widest mb-1.5 pb-1 border-b border-dashed border-[color:var(--tpl-border)]/60 text-[color:var(--tpl-primary)]',
    columnsContainer: 'grid grid-cols-2 gap-3',
    subsection: '',
    subheading:
      'text-[8px] font-semibold uppercase tracking-wide mb-1 text-[color:var(--tpl-accent)]',
    grid: 'space-y-0.5 text-[9px]',
    fieldLabel: 'text-[8px] text-[color:var(--tpl-muted)] uppercase tracking-wide',
    fieldValue: 'font-medium text-[9px]',
    contactItem: 'flex items-center gap-1 text-[9px]',
    iconSize: 8,
    secondaryContact: {
      container: 'mt-2 pt-1.5 text-[9px] text-[color:var(--tpl-muted)]',
      border: 'border-[color:var(--tpl-border)]/60',
    },
  },
  buddy: {
    container: 'bg-white/40 p-4 border border-[color:var(--tpl-border)]/30 rounded-2xl mt-2',
    heading:
      'text-[color:var(--tpl-primary)] font-bold text-lg mb-3 pb-2 border-b border-[color:var(--tpl-border)]/30',
    columnsContainer: 'grid grid-cols-2 gap-3',
    subsection: '',
    subheading:
      'text-[9px] font-bold uppercase tracking-widest mb-1.5 text-[color:var(--tpl-accent)]',
    grid: 'space-y-0.5 text-[10px]',
    fieldLabel: 'text-[8px] text-[color:var(--tpl-muted)] uppercase tracking-wide',
    fieldValue: 'font-medium text-[color:var(--tpl-primary)] text-[10px]',
    contactItem: 'flex items-center gap-1 text-[10px] text-[color:var(--tpl-muted)]',
    iconSize: 9,
    secondaryContact: {
      container: 'mt-2 pt-1.5 text-[9px] text-[color:var(--tpl-muted)]',
      border: 'border-[color:var(--tpl-border)]/30',
    },
  },
  buddyTest: {
    container:
      'bg-gradient-to-br from-[color:var(--tpl-light)] to-white p-4 border-2 border-amber-200/70 rounded-2xl mt-2 shadow-sm',
    heading:
      'text-[color:var(--tpl-primary)] font-extrabold text-lg mb-3 pb-2 border-b-2 border-[color:var(--tpl-accent)]/25',
    columnsContainer: 'grid grid-cols-2 gap-3',
    subsection: '',
    subheading:
      'text-[9px] font-black uppercase tracking-widest mb-1.5 text-[color:var(--tpl-accent)]',
    grid: 'space-y-0.5 text-[10px]',
    fieldLabel: 'text-[8px] text-[color:var(--tpl-muted)] uppercase tracking-wide',
    fieldValue: 'font-medium text-[color:var(--tpl-primary)] text-[10px]',
    contactItem: 'flex items-center gap-1 text-[10px] text-[color:var(--tpl-muted)]',
    iconSize: 9,
    secondaryContact: {
      container: 'mt-2 pt-1.5 text-[9px] text-[color:var(--tpl-muted)]',
      border: 'border-[color:var(--tpl-accent)]/25',
    },
  },
}

export function getReferenceSectionTokens(variant: DocumentVariant): ReferenceSectionTokens {
  return REFERENCE_SECTION_TOKENS[variant] ?? REFERENCE_SECTION_TOKENS.classic
}

export const DESCRIPTION_SECTION_TOKENS: Record<DocumentVariant, DescriptionSectionTokens> = {
  classic: {
    container: '',
    heading:
      'font-bold uppercase tracking-wider text-xs mb-3 pb-2 border-b-2 border-[color:var(--tpl-border)] text-[color:var(--tpl-primary)]',
    text: 'text-sm leading-relaxed text-[color:var(--tpl-primary)]/80 text-left',
    emptyText: 'text-[color:var(--tpl-muted)]/40 italic',
  },
  modern: {
    container: '',
    heading:
      'font-bold text-base mb-3 pl-3 border-l-4 border-[color:var(--tpl-accent)] text-[color:var(--tpl-primary)]',
    text: 'text-sm leading-relaxed text-[color:var(--tpl-primary)]/80 text-left',
    emptyText: 'text-[color:var(--tpl-muted)]/40 italic',
  },
  swiss: {
    container: '',
    heading:
      'font-bold uppercase tracking-wider text-xs mb-3 pb-2 border-b-2 border-[color:var(--tpl-border)] text-[color:var(--tpl-primary)]',
    text: 'text-sm leading-relaxed text-[color:var(--tpl-primary)]/80 text-left',
    emptyText: 'text-[color:var(--tpl-muted)]/40 italic',
  },
  buddy: {
    container: '',
    heading: 'text-xl font-bold text-[color:var(--tpl-primary)] mb-3 flex items-center gap-2',
    headingAccentBar: 'bg-[color:var(--tpl-accent)]',
    text: 'text-sm leading-relaxed text-[color:var(--tpl-muted)] text-left bg-white p-5 rounded-2xl border border-[color:var(--tpl-border)]/30',
    emptyText: 'text-[color:var(--tpl-muted)] italic',
  },
  buddyTest: {
    container: '',
    heading: 'text-xl font-extrabold text-[color:var(--tpl-primary)] mb-3 flex items-center gap-2',
    headingAccentBar: 'bg-[color:var(--tpl-accent)]',
    text: 'text-sm leading-relaxed text-[color:var(--tpl-primary)]/80 text-left bg-gradient-to-br from-white to-[color:var(--tpl-light)]/40 p-5 rounded-2xl border-2 border-[color:var(--tpl-border)]/30 shadow-inner',
    emptyText: 'text-[color:var(--tpl-muted)]/40 italic',
  },
  compact: {
    container: '',
    heading:
      'text-[10px] font-mono font-bold uppercase tracking-[0.2em] mb-2 pb-1 border-b border-dashed border-[color:var(--tpl-border)] text-[color:var(--tpl-primary)]',
    text: 'text-[11px] leading-relaxed text-[color:var(--tpl-primary)]/85 text-left',
    emptyText: 'text-[color:var(--tpl-muted)] italic',
  },
}

export function getDescriptionSectionTokens(variant: DocumentVariant): DescriptionSectionTokens {
  return DESCRIPTION_SECTION_TOKENS[variant] ?? DESCRIPTION_SECTION_TOKENS.classic
}

export const PET_PHOTO_TOKENS: Record<DocumentVariant, PetPhotoTokens> = {
  classic: {
    container:
      'aspect-[3/4] w-full bg-[color:var(--tpl-light)] flex items-center justify-center overflow-hidden relative border-2 border-[color:var(--tpl-border)]',
    image: 'w-full h-full object-cover',
    placeholder: 'text-[color:var(--tpl-muted)]/40 text-center',
    placeholderIcon: 32,
    placeholderText: 'text-xs text-[color:var(--tpl-muted)]/70',
    badge: 'absolute top-2 right-2 bg-[color:var(--tpl-primary)] text-white p-2 rounded-sm',
    badgeIcon: 16,
  },
  modern: {
    container:
      'aspect-[3/4] w-full bg-white flex items-center justify-center overflow-hidden relative border border-[color:var(--tpl-border)]/60 rounded-xl shadow-md ring-2 ring-[color:var(--tpl-light)]/80',
    image: 'w-full h-full object-cover',
    placeholder: 'text-[color:var(--tpl-muted)]/40 text-center',
    placeholderIcon: 32,
    placeholderText: 'text-xs text-[color:var(--tpl-muted)]/70',
    badge: 'absolute top-2 right-2 bg-[color:var(--tpl-primary)] text-white p-2 rounded-lg shadow-sm',
    badgeIcon: 16,
  },
  swiss: {
    container:
      'aspect-[3/4] w-full bg-[color:var(--tpl-light)] flex items-center justify-center overflow-hidden relative border-2 border-[color:var(--tpl-border)]/60',
    image: 'w-full h-full object-cover',
    placeholder: 'text-[color:var(--tpl-muted)]/40 text-center',
    placeholderIcon: 32,
    placeholderText: 'text-xs text-[color:var(--tpl-muted)]/70',
    badge: 'absolute top-2 right-2 bg-[color:var(--tpl-primary)] text-white p-2 rounded-sm',
    badgeIcon: 16,
  },
  buddy: {
    container:
      'aspect-[4/5] w-full bg-[color:var(--tpl-light)] flex items-center justify-center overflow-hidden relative rounded-br-[3.5rem] border-0',
    image: 'w-full h-full object-cover',
    placeholder: 'text-[color:var(--tpl-muted)]/40 text-center',
    placeholderIcon: 32,
    placeholderText: 'text-xs text-[color:var(--tpl-muted)]/70',
    badge:
      'absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full border border-[color:var(--tpl-border)]/40 shadow-sm',
    badgeIcon: 14,
  },
  buddyTest: {
    container:
      'aspect-[4/5] w-full bg-gradient-to-b from-[color:var(--tpl-light)] to-white flex items-center justify-center overflow-hidden relative rounded-br-[4rem] border-4 border-amber-300/50 shadow-[0_12px_40px_-12px_rgba(245,158,11,0.35)]',
    image: 'w-full h-full object-cover',
    placeholder: 'text-[color:var(--tpl-muted)]/40 text-center',
    placeholderIcon: 36,
    placeholderText: 'text-xs text-[color:var(--tpl-muted)]',
    badge:
      'absolute top-2 right-2 bg-amber-500 text-white px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider shadow',
    badgeIcon: 12,
  },
  compact: {
    container:
      'aspect-[3/4] w-full bg-white flex items-center justify-center overflow-hidden relative border border-[color:var(--tpl-border)]/60 rounded-none',
    image: 'w-full h-full object-cover',
    placeholder: 'text-[color:var(--tpl-muted)]/40 text-center',
    placeholderIcon: 24,
    placeholderText: 'text-[10px] text-[color:var(--tpl-muted)]',
    badge: 'absolute top-1.5 right-1.5 bg-[color:var(--tpl-primary)] text-white p-1.5 rounded-sm',
    badgeIcon: 14,
  },
}

export function getPetPhotoTokens(variant: DocumentVariant): PetPhotoTokens {
  return PET_PHOTO_TOKENS[variant] ?? PET_PHOTO_TOKENS.classic
}
