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
  // Custom design settings (Premium feature - Visual Editor)
  // Stored in browser localStorage, not in project
  customDesign: {
    isEdited: false,              // Flag set to true when user applies changes in editor
    // Colors
    primaryColor: '#4a148c',      // Header/title color (Midnight Purple default)
    secondaryColor: '#f3e5f5',    // Accent/highlight color
    backgroundColor: '#ffffff',   // Document background
    textColor: '#1f2937',         // Body text color
    // Fonts
    headerFont: 'helvetica',      // Heading font family
    bodyFont: 'helvetica',        // Body text font family
    headerFontSize: 9,            // Heading font size (px for HTML, pt for PDF)
    bodyFontSize: 10,             // Body font size (px for HTML, pt for PDF)
    // Text styles
    headerBold: true,             // Bold headers
    headerItalic: false,          // Italic headers
    bodyBold: false,              // Bold body text
    bodyItalic: false,            // Italic body text
    // Layout
    layoutOrder: ['photo', 'owner', 'details', 'behavior', 'description', 'legal', 'reference'],
    // Visibility
    hiddenSections: []            // Sections to hide
  }
};

const MAX_DESCRIPTION_LENGTH = 470; // limit for generated / manual descriptions

// Simplified Swiss-style templates for 2026
// 4 professional templates: Classic (FREE), Modern, Compact, Swiss (Premium)
// Premium users can customize ANY template with the Visual Editor (colors, section order)
// Premium access: 10 CHF for 2 hours
const TEMPLATE_OPTIONS = [
  { id: 'classic', label: 'Classic', isPremium: false, price: 0 },
  { id: 'modern', label: 'Modern', isPremium: true, price: 10 },
  { id: 'compact', label: 'Compact', isPremium: true, price: 10 },
  { id: 'swiss', label: 'Swiss', isPremium: true, price: 10 },
  { id: 'professional', label: 'Professional', isPremium: true, price: 10 },
  // TODO: Emergency, Friendly, Grid templates exist in SwissDocumentPdf.jsx.backup
  // but require full extraction (2500+ lines). Disabled until fully implemented.
  // { id: 'emergency', label: 'Emergency', isPremium: true, price: 10 },
  // { id: 'friendly', label: 'Friendly', isPremium: true, price: 10 },
  // { id: 'grid', label: 'Swiss Grid', isPremium: true, price: 10 }
];

// Section definitions for the Template Builder
const SECTION_DEFINITIONS = [
  { id: 'photo', label: 'Foto', icon: 'image', required: false },
  { id: 'owner', label: 'Besitzer Info', icon: 'person', required: true },
  { id: 'details', label: 'Tier Details', icon: 'pets', required: true },
  { id: 'behavior', label: 'Verhalten', icon: 'psychology', required: false },
  { id: 'description', label: 'Beschreibung', icon: 'description', required: false },
  { id: 'legal', label: 'Rechtliches', icon: 'gavel', required: false },
  { id: 'reference', label: 'Referenzen', icon: 'contact_phone', required: false }
];

// Color presets for the builder
const COLOR_PRESETS = [
  { id: 'lavender', primary: '#b39ddb', secondary: '#f3e5f5', label: 'Lavender' },
  { id: 'blue', primary: '#64b5f6', secondary: '#e3f2fd', label: 'Ocean Blue' },
  { id: 'green', primary: '#81c784', secondary: '#e8f5e9', label: 'Nature Green' },
  { id: 'amber', primary: '#ffd54f', secondary: '#fff8e1', label: 'Golden Amber' },
  { id: 'coral', primary: '#ff8a65', secondary: '#fbe9e7', label: 'Coral' },
  { id: 'teal', primary: '#4db6ac', secondary: '#e0f2f1', label: 'Teal' },
  { id: 'rose', primary: '#f48fb1', secondary: '#fce4ec', label: 'Rose' },
  { id: 'slate', primary: '#78909c', secondary: '#eceff1', label: 'Slate' }
];

// Premium price in CHF (cents for Stripe)
const PREMIUM_PRICE_CHF = 10;
const PREMIUM_PRICE_CENTS = PREMIUM_PRICE_CHF * 100;

// Payment success behavior configuration
// Options: 'show_page' - show PaymentSuccess page, 'redirect_home' - redirect to landing page, 'show_toast' - show toast and stay
const PAYMENT_SUCCESS_BEHAVIOR = import.meta.env.VITE_PAYMENT_SUCCESS_BEHAVIOR || 'show_page';

export { 
  TRANSLATIONS, 
  INITIAL_DATA, 
  MAX_DESCRIPTION_LENGTH, 
  TEMPLATE_OPTIONS, 
  PAYMENT_SUCCESS_BEHAVIOR, 
  PREMIUM_PRICE_CHF, 
  PREMIUM_PRICE_CENTS,
  SECTION_DEFINITIONS,
  COLOR_PRESETS
};
