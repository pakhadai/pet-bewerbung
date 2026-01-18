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
  willingToPayDeposit: true,
  behaviorWithChildren: '', // good, neutral, avoid
  behaviorWithPets: '', // good, neutral, avoid
};

const MAX_DESCRIPTION_LENGTH = 470; // limit for generated / manual descriptions

const TEMPLATE_OPTIONS = [
  { id: 'classic', label: 'Classic' },
  { id: 'modern', label: 'Modern' },
  { id: 'compact', label: 'Compact' },
  { id: 'elegant', label: 'Elegant' },
  { id: 'minimal', label: 'Minimal' },
  { id: 'colorful', label: 'Colorful' },
  { id: 'professional', label: 'Professional' },
  { id: 'playful', label: 'Playful' },
  { id: 'swiss', label: 'Swiss' }
];

// Payment success behavior configuration
// Options: 'show_page' - show PaymentSuccess page, 'redirect_home' - redirect to landing page, 'show_toast' - show toast and stay
const PAYMENT_SUCCESS_BEHAVIOR = import.meta.env.VITE_PAYMENT_SUCCESS_BEHAVIOR || 'show_page';

export { TRANSLATIONS, INITIAL_DATA, MAX_DESCRIPTION_LENGTH, TEMPLATE_OPTIONS, PAYMENT_SUCCESS_BEHAVIOR };
