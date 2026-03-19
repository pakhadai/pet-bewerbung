import type { TranslationObject } from '../types/template';

export const validateSwissPhone = (phone: string | undefined | null): boolean => {
  if (!phone) return true;
  const cleaned = phone.replace(/[\s\-()]/g, '');
  return /^\+?[0-9]{7,15}$/.test(cleaned);
};

export const formatSwissPhone = (phone: string | undefined): string => {
  if (!phone) return '';
  const cleaned = phone.replace(/[\s\-()]/g, '');
  let formatted = cleaned;
  if (cleaned.startsWith('0')) {
    formatted = '+41' + cleaned.substring(1);
  }
  if (formatted.startsWith('+41')) {
    const number = formatted.substring(3);
    if (number.length === 9) {
      return `+41 ${number.substring(0, 2)} ${number.substring(2, 5)} ${number.substring(5, 7)} ${number.substring(7)}`;
    }
  }
  return phone;
};

export const validateSwissPostal = (postal: string | undefined | null): boolean => {
  if (!postal) return true;
  return /^[1-9]\d{3}$/.test(postal);
};

export const validateEmail = (email: string | undefined | null): boolean => {
  if (!email) return true;
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailPattern.test(email)) return false;
  if (email.includes('..') || email.startsWith('.') || email.includes('@.') || email.includes('.@')) {
    return false;
  }
  return true;
};

export const formatSwissAddress = (
  street: string | undefined,
  number: string | undefined,
  postal: string | undefined,
  city: string | undefined
): string => {
  const streetLine = [street, number].filter(Boolean).join(' ');
  const cityLine = [postal, city].filter(Boolean).join(' ');
  return [streetLine, cityLine].filter(Boolean).join(', ');
};

export const getPhoneErrorMessage = (t: TranslationObject): string => {
  const validation = t?.validation;
  return validation?.phoneFormat ?? "Format: +41 XX XXX XX XX oder internationale Nummer (+49, +33, etc.)";
};

export const getPostalErrorMessage = (): string => {
  return "PLZ muss 4-stellig sein (1000-9999)";
};

export const SWISS_CANTONS = [
  { code: 'ZH', de: 'Zürich', fr: 'Zurich' },
  { code: 'BE', de: 'Bern', fr: 'Berne' },
  { code: 'LU', de: 'Luzern', fr: 'Lucerne' },
  { code: 'UR', de: 'Uri', fr: 'Uri' },
  { code: 'SZ', de: 'Schwyz', fr: 'Schwytz' },
  { code: 'OW', de: 'Obwalden', fr: 'Obwald' },
  { code: 'NW', de: 'Nidwalden', fr: 'Nidwald' },
  { code: 'GL', de: 'Glarus', fr: 'Glaris' },
  { code: 'ZG', de: 'Zug', fr: 'Zoug' },
  { code: 'FR', de: 'Freiburg', fr: 'Fribourg' },
  { code: 'SO', de: 'Solothurn', fr: 'Soleure' },
  { code: 'BS', de: 'Basel-Stadt', fr: 'Bâle-Ville' },
  { code: 'BL', de: 'Basel-Landschaft', fr: 'Bâle-Campagne' },
  { code: 'SH', de: 'Schaffhausen', fr: 'Schaffhouse' },
  { code: 'AR', de: 'Appenzell Ausserrhoden', fr: 'Appenzell Rhodes-Extérieures' },
  { code: 'AI', de: 'Appenzell Innerrhoden', fr: 'Appenzell Rhodes-Intérieures' },
  { code: 'SG', de: 'St. Gallen', fr: 'Saint-Gall' },
  { code: 'GR', de: 'Graubünden', fr: 'Grisons' },
  { code: 'AG', de: 'Aargau', fr: 'Argovie' },
  { code: 'TG', de: 'Thurgau', fr: 'Thurgovie' },
  { code: 'TI', de: 'Tessin', fr: 'Tessin' },
  { code: 'VD', de: 'Waadt', fr: 'Vaud' },
  { code: 'VS', de: 'Wallis', fr: 'Valais' },
  { code: 'NE', de: 'Neuenburg', fr: 'Neuchâtel' },
  { code: 'GE', de: 'Genf', fr: 'Genève' },
  { code: 'JU', de: 'Jura', fr: 'Jura' },
] as const;

export const CANTON_PET_RULES: Record<string, { requiresAmicus: boolean; dogTax: boolean; note: string }> = {
  ZH: { requiresAmicus: true, dogTax: true, note: 'Hundesteuer obligatorisch' },
  BE: { requiresAmicus: true, dogTax: true, note: 'AMICUS-Registrierung Pflicht' },
  VD: { requiresAmicus: true, dogTax: true, note: 'Taxe pour chiens obligatoire' },
  GE: { requiresAmicus: true, dogTax: true, note: 'Taxe pour chiens obligatoire' },
};
