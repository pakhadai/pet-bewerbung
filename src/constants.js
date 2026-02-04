// Import translations from separate files
import { TRANSLATIONS } from './translations';

const INITIAL_DATA = {
  lang: 'de',
  petType: 'dog',
  ownerName: '',
  email: '',
  phone: '',
  street: '',
  houseNumber: '',
  postal: '',
  city: '',
  name: '',
  breed: '',
  age: '',
  weight: '',
  gender: 'm',
  photo: null,
  chipId: '',
  insuranceProvider: '',
  vetName: '',
  vetPhone: '',
  medicalConditions: '', // allergies/meds when "display medical conditions" is on
  isNeutered: false,
  hasVaccination: true,
  hasRegistration: true,
  keywords: '',
  generatedText: '',
  // Swiss-specific fields
  noiseLevel: 'low', // low, medium, high
  aloneTime: '', // hours per day
  activeHours: '', // e.g. "07:00-09:00, 18:00-20:00"
  previousLandlordName: '',
  previousLandlordPhone: '',
  previousLandlordEmail: '',
  previousDuration: '', // years/months
  emergencyContactName: '',
  emergencyContactPhone: '',
  emergencyContactRelation: '',
  secondaryEmergencyContact: '', // "Name & Phone" one line
  willingToPayDeposit: true,
  behaviorWithChildren: '', // good, neutral, avoid
  behaviorWithPets: '', // good, neutral, avoid
};

const MAX_DESCRIPTION_LENGTH = 470; // limit for generated / manual descriptions

// Simplified Swiss-style templates for 2026
// Only 4 professional templates: Classic (FREE), Modern, Compact, Swiss (Premium)
// Premium templates require one-time payment of 10 CHF
const TEMPLATE_OPTIONS = [
  { id: 'classic', label: 'Classic', isPremium: false, price: 0 },
  { id: 'modern', label: 'Modern', isPremium: true, price: 10 },
  { id: 'compact', label: 'Compact', isPremium: true, price: 10 },
  { id: 'swiss', label: 'Swiss', isPremium: true, price: 10 }
];

// Premium price in CHF (cents for Stripe)
const PREMIUM_PRICE_CHF = 10;
const PREMIUM_PRICE_CENTS = PREMIUM_PRICE_CHF * 100;

// Payment success behavior configuration
// Options: 'show_page' - show PaymentSuccess page, 'redirect_home' - redirect to landing page, 'show_toast' - show toast and stay
const PAYMENT_SUCCESS_BEHAVIOR = import.meta.env.VITE_PAYMENT_SUCCESS_BEHAVIOR || 'show_page';

export { TRANSLATIONS, INITIAL_DATA, MAX_DESCRIPTION_LENGTH, TEMPLATE_OPTIONS, PAYMENT_SUCCESS_BEHAVIOR, PREMIUM_PRICE_CHF, PREMIUM_PRICE_CENTS };
