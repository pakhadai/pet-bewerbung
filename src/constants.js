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

// 3 free templates: Classic, Modern, Compact
const TEMPLATE_OPTIONS = [
  { id: 'classic', label: 'Classic' },
  { id: 'modern', label: 'Modern' },
  { id: 'compact', label: 'Compact' }
];

export {
  INITIAL_DATA,
  MAX_DESCRIPTION_LENGTH,
  TEMPLATE_OPTIONS,
};
