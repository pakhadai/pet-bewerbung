import React from 'react';
import { Dog, Cat, Bird } from 'lucide-react';

/**
 * Formats address into two lines
 * @param {string} street - Street name
 * @param {string} houseNumber - House number
 * @param {string} postal - Postal code
 * @param {string} city - City name
 * @returns {Object} - { streetLine, cityLine }
 */
export const formatAddress = (street, houseNumber, postal, city) => {
  const streetLine = (street || '') + (houseNumber ? ' ' + houseNumber : '');
  const cityLine = (postal ? postal + ' ' : '') + (city || '');
  return { streetLine, cityLine };
};

/**
 * Returns the appropriate pet type icon
 * @param {string} petType - 'dog', 'cat', or 'other'
 * @param {number} size - Icon size
 * @returns {JSX.Element} - Icon component
 */
export const getPetTypeIcon = (petType, size = 20) => {
  const icons = {
    dog: <Dog size={size} />,
    cat: <Cat size={size} />,
    other: <Bird size={size} />
  };
  return icons[petType] || icons.other;
};

/**
 * Returns gender label based on translation
 * @param {string} gender - 'm' or 'f'
 * @param {Object} t - Translations object
 * @returns {string} - Translated gender label
 */
export const getGenderLabel = (gender, t) => {
  return gender === 'm' ? t.labels.m : t.labels.f;
};

/**
 * Checks if text is empty/null
 * @param {string} text - Description text
 * @returns {boolean} - True if text is empty
 */
export const isEmptyText = (text) => {
  return !text || text.trim() === '';
};

/**
 * Formats age with unit
 * @param {number|string} age - Age value
 * @param {Object} t - Translations object
 * @returns {string} - Formatted age
 */
export const formatAge = (age, t) => {
  return age ? `${age} ${t.labels.years}` : '—';
};

/**
 * Formats weight with unit
 * @param {number|string} weight - Weight value
 * @param {Object} t - Translations object
 * @returns {string} - Formatted weight
 */
export const formatWeight = (weight, t) => {
  return weight ? `${weight} ${t.labels.kg}` : '—';
};

/**
 * Returns fallback value with translation
 * @param {string} value - Value to check
 * @param {string} fallback - Fallback string (optional)
 * @returns {string} - Value or fallback
 */
export const withFallback = (value, fallback = '—') => {
  return value || fallback;
};
