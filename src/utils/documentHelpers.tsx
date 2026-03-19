import React from 'react';
import { Dog, Cat, Bird } from 'lucide-react';
import type { TranslationObject } from '../types/template';

export interface AddressResult {
  streetLine?: string;
  cityLine?: string;
}

export const formatAddress = (
  street: string | undefined,
  houseNumber: string | undefined,
  postal: string | undefined,
  city: string | undefined
): AddressResult => {
  const rawStreet = (street || '') + (houseNumber ? ' ' + houseNumber : '');
  const rawCity = (postal ? postal + ' ' : '') + (city || '');
  return { streetLine: rawStreet || undefined, cityLine: rawCity || undefined };
};

export const getPetTypeIcon = (petType: string, size = 20): React.ReactElement => {
  const icons: Record<string, React.ReactElement> = {
    dog: <Dog size={size} />,
    cat: <Cat size={size} />,
    other: <Bird size={size} />,
  };
  return icons[petType] ?? icons.other;
};

export const getGenderLabel = (gender: string | undefined, t: TranslationObject): string => {
  const labels = t?.labels;
  if (!labels) return gender === 'm' ? 'M' : 'F';
  return gender === 'm' ? (labels.m ?? 'M') : (labels.f ?? 'F');
};

export const isEmptyText = (text: string | undefined): boolean => {
  return !text || text.trim() === '';
};

export const formatAge = (age: number | string | undefined, t: TranslationObject): string => {
  const labels = t?.labels;
  return age ? `${age} ${labels?.years ?? 'years'}` : '—';
};

export const formatWeight = (weight: number | string | undefined, t: TranslationObject): string => {
  const labels = t?.labels;
  return weight ? `${weight} ${labels?.kg ?? 'kg'}` : '—';
};

export const withFallback = (value: unknown, fallback = '—'): string => {
  return value ? String(value) : fallback;
};

const PDF_WORD_BREAK_THRESHOLD = 50;

export const sanitizeForPdf = (text: unknown): string => {
  if (!text || typeof text !== 'string') return '';
  return String(text)
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    .replace(/\uFFFD/g, '')
    .replace(new RegExp(`([^\\s]{${PDF_WORD_BREAK_THRESHOLD}})`, 'g'), '$1\u200B')
    .trim();
};
