import React, { useState, useEffect, useRef } from 'react';
import { MAX_DESCRIPTION_LENGTH, TRANSLATIONS, PAYMENT_SUCCESS_BEHAVIOR, TEMPLATE_OPTIONS, PREMIUM_PRICE_CENTS } from './constants';
import PaymentSuccess from './components/PaymentSuccess';
import API_ENDPOINTS from './config';
import compressImage, { toJpegDataUrl } from './utils/imageCompression';
import { generateQrDataUrl, getQrContent } from './utils/qrCode';
import GlobalStyles from './components/GlobalStyles';
import Header from './components/Header';
import Footer from './components/Footer';
import FaqModal from './components/FaqModal';
import Hero from './components/Hero';
import Steps from './components/Steps';
import SwissDocument from './components/SwissDocument';
import { X, Camera } from 'lucide-react';
import DonateModal from './components/DonateModal';
import PaymentModal from './components/PaymentModal';
import LegalPages from './components/LegalPages';
import ErrorBoundary from './components/ErrorBoundary';
import CookieBanner, { COOKIE_CONSENT_KEY, isCookieConsentGiven } from './components/CookieBanner';
import TemplateBuilder from './components/TemplateBuilder';
import DocumentEditor from './components/DocumentEditor';
import FloatingNavigation from './components/FloatingNavigation';

// Import step components
import {
  Step1Details,
  Step2HealthInsurance,
  Step3Description,
  Step4Photo,
  Step5TemplateSelect,
  Step5Preview,
  Step6ThankYou
} from './components/steps/index';
import StepProgress from './components/StepProgress';

// Import custom hooks
import {
  useFormWizard,
  useTemplateSelection,
  usePaymentFlow,
  useToast,
  useScrollVisibility,
  useFormValidation,
  usePremium,
  useAIGenerations
} from './hooks';
import { FormProvider, ThemeProvider, TranslationProvider } from './contexts';

export default function App() {
  // Custom hooks for state management
  const {
    step,
    data,
    animDir,
    t,
    updateData,
    goToStep
  } = useFormWizard();

  const {
    selectedTemplate,
    setSelectedTemplate,
    previewOpen,
    previewTemplate,
    openPreview,
    closePreview
  } = useTemplateSelection();

  const {
    donationAmount,
    setDonationAmount,
    donateOpen,
    setDonateOpen,
    paymentOpen,
    setPaymentOpen
  } = usePaymentFlow();

  const { toast, showToast } = useToast();
  const butterVisible = useScrollVisibility(120);
  const { errors: validationErrors, isValid: canProceed } = useFormValidation(data, step);
  
  // Premium state management with JWT sessions
  const { 
    isPremium, 
    activatePremium, 
    isTemplateAccessible, 
    getTemplateInfo, 
    premiumPrice,
    timeRemaining: premiumTimeRemaining,
    deviceId,
    premiumToken
  } = usePremium();
  const { canGenerate: canGenerateAI, incrementGeneration, remainingGenerations } = useAIGenerations(isPremium);

  // Dark mode state — persist in localStorage so it survives refresh
  const THEME_STORAGE_KEY = 'pet-bewerbung-theme';
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      return saved === 'dark';
    } catch {
      return false;
    }
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [legalPage, setLegalPage] = useState<string | null>(null); // 'impressum', 'privacy', 'terms', or null
  const [faqOpen, setFaqOpen] = useState(false);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [paymentSessionId, setPaymentSessionId] = useState<string | null>(null);
  const [navigationVisible, setNavigationVisible] = useState(true); // Control navigation visibility for Step5Photo
  
  // Cookie consent state - required for Stripe/payment operations
  const [cookieConsent, setCookieConsent] = useState<'accepted' | 'declined' | null>(() => {
    try {
      const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
      return consent as 'accepted' | 'declined' | null;
    } catch {
      return null;
    }
  });
  const [forceCookieBanner, setForceCookieBanner] = useState(false);
  
  // Handler for cookie consent change - reset force flag
  const handleCookieConsentChange = (consent: 'accepted' | 'declined') => {
    setCookieConsent(consent);
    setForceCookieBanner(false); // Hide banner after choice
  };

  // Apply dark mode class to document and persist theme
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    try {
      localStorage.setItem(THEME_STORAGE_KEY, darkMode ? 'dark' : 'light');
    } catch {
      // ignore
    }
  }, [darkMode]);

  // Handle URL parameters for payment success/cancel
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paymentSuccess = params.get('payment_success');
    const premiumSuccess = params.get('premium_success');
    const sessionId = params.get('session_id');
    const paymentCanceled = params.get('payment_canceled');

    // Handle premium purchase success
    if (premiumSuccess === 'true') {
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // Verify session if available
      const pendingSession = sessionStorage.getItem('pending_premium_session');
      if (pendingSession) {
        sessionStorage.removeItem('pending_premium_session');
      }
      
      // Activate premium with JWT token (async)
      const sessionToActivate = pendingSession || sessionId;
      if (sessionToActivate) {
        activatePremium(sessionToActivate).then((success) => {
          if (success) {
            showToast(t?.premium?.purchaseSuccess || '🎉 Premium freigeschaltet! 2 Stunden Zugang.', 'success');
          } else {
            showToast(t?.premium?.activationError || 'Premium konnte nicht aktiviert werden.', 'error');
          }
        });
      }
      
      // Go to preview step to download the PDF
      goToStep(5);
      return;
    }

    if (paymentSuccess === 'true' && sessionId) {
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
      
      if (PAYMENT_SUCCESS_BEHAVIOR === 'show_page') {
        setShowPaymentSuccess(true);
        setPaymentSessionId(sessionId);
      } else if (PAYMENT_SUCCESS_BEHAVIOR === 'redirect_home') {
        goToStep(0);
        showToast(t?.paymentSuccess?.message || 'Payment successful! Thank you!', 'success');
      } else if (PAYMENT_SUCCESS_BEHAVIOR === 'show_toast') {
        showToast(t?.paymentSuccess?.message || 'Payment successful! Thank you!', 'success');
      }
    } else if (paymentCanceled === 'true') {
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
      showToast('Payment was canceled', 'info');
    }
  }, [goToStep, showToast, t, activatePremium]);

  // Clear generated text when language changes
  const prevLangRef = useRef(data.lang);
  useEffect(() => {
    if (prevLangRef.current !== data.lang && data.generatedText && data.generatedText.length > 0) {
      updateData('generatedText', '');
      showToast(TRANSLATIONS[data.lang]?.labels?.aiPrompt || 'Please regenerate text for the new language', 'info');
    }
    prevLangRef.current = data.lang;
  }, [data.lang, data.generatedText, updateData, showToast]);

  // Reset navigation visibility when step changes (except when on step 4 = Upload with cropper open)
  useEffect(() => {
    if (step !== 4) {
      setNavigationVisible(true);
    }
  }, [step]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        // Compress image before storing
        const compressedImage = await compressImage(file, {
          maxWidth: 800,
          maxHeight: 800,
          quality: 0.8,
          maxSizeKB: 500
        });
        updateData('photo', compressedImage);
      } catch (err) {
        // Fallback to uncompressed if compression fails
        const reader = new FileReader();
        reader.onloadend = () => updateData('photo', reader.result);
        reader.readAsDataURL(file);
        showToast('Image compression failed, using original', 'info');
      }
    }
  };

  const generateText = async () => {
    // Check local AI generation limit for free users
    if (!canGenerateAI) {
      showToast(
        t?.premium?.aiLimitReached || 'AI limit erreicht. Premium für unbegrenzte Generierungen freischalten.',
        'info'
      );
      // Still generate fallback text
      generateFallbackText();
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // Prepare pet data for AI - include all relevant info
      // Note: data.name is the pet name (not data.petName)
      const petData = {
        petName: data.name || '',
        petType: data.petType || '',
        breed: data.breed || '',
        age: data.age || '',
        gender: data.gender || '',
        weight: data.weight || '',
        traits: data.keywords || '',
        neutered: data.isNeutered || false,
        vaccinated: data.hasVaccination || false,
      };
      
      const res = await fetch(API_ENDPOINTS.generatePetDescription, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          petData,
          lang: data.lang,
          premiumToken: isPremium ? premiumToken : null,
          deviceId: deviceId,
          tone: data.aiTone || 'formal'
        }),
      });
      
      const json = await res.json();
      
      if (res.status === 429) {
        // Rate limit exceeded
        showToast(json.message || 'AI limit reached. Try again tomorrow.', 'error');
        return;
      }
      
      if (res.status === 503) {
        // AI not configured - fall back to template
        generateFallbackText();
        showToast('Using template (AI not available)', 'info');
        return;
      }
      
      if (!res.ok) {
        throw new Error(json.error || 'AI generation failed');
      }
      
      // Track local generation count for free users
      incrementGeneration();
      
      updateData('generatedText', json.description);
      
      // Show remaining requests
      if (json.remaining !== undefined && !isPremium) {
        showToast(`✨ ${json.remaining} AI requests remaining today.`, 'success');
      } else if (isPremium) {
        showToast('✨ AI text generated!', 'success');
      }
      
    } catch (err: any) {
      if (import.meta.env.DEV) {
        console.error('AI generation error:', err);
      }
      
      // Show user-friendly error message
      const errorMessage = err.message || 'Unknown error';
      showToast(
        errorMessage.includes('network') || errorMessage.includes('fetch')
          ? t?.labels?.aiNetworkError || 'Network error. Please check your connection and try again.'
          : t?.labels?.aiError || 'AI generation failed. Using template instead.',
        'error'
      );
      
      // Fall back to template on error
      generateFallbackText();
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Fallback template-based generation
  const generateFallbackText = () => {
    const tmpl = t.templates;
    const rawKeywords = (data.keywords || '').split(',').map((s: string) => s.trim()).filter((s: string) => s);
    let middleSection = "";
    if (rawKeywords.length > 0) {
      const formattedKeywords = rawKeywords.join(', ');
      middleSection = `${tmpl.keywords || 'Eigenschaften: '}${formattedKeywords}. `;
    }
    const petInfo = [data.petName, data.breed].filter(Boolean).join(', ');
    const intro = petInfo ? `${petInfo} ist ein wunderbares Haustier. ` : (tmpl.intro || '');
    const fullText = `${intro}${middleSection}${tmpl.outro || ''}`;
    updateData('generatedText', fullText.slice(0, MAX_DESCRIPTION_LENGTH));
  };

  // Vector PDF via @react-pdf/renderer: selectable text, small file size, print quality.
  const blobUrlToDataUrl = (blobUrl: string): Promise<string> => {
    return fetch(blobUrl)
      .then((r) => r.blob())
      .then(
        (blob) =>
          new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          })
      );
  };

  const fetchLogoAsDataUrl = async (): Promise<string | null> => {
    try {
      const url = `${window.location.origin}/logo.png`;
      const res = await fetch(url);
      if (!res.ok) return null;
      const blob = await res.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch {
      return null;
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const filename = `${data.name || 'Pet-CV'}-${new Date().getTime()}.pdf`;
      let pdfData = { ...data };
      if (data.photo && typeof data.photo === 'string') {
        try {
          let photoUrl = data.photo;
          if (data.photo.startsWith('blob:')) {
            photoUrl = await blobUrlToDataUrl(data.photo);
          }
          // PDF renderer needs JPEG/PNG; convert WebP to JPEG if needed
          if (photoUrl.startsWith('data:image/webp')) {
            photoUrl = await toJpegDataUrl(photoUrl);
          }
          pdfData = { ...data, photo: photoUrl };
        } catch {
          pdfData = { ...data, photo: null };
        }
      }
      // Pre-resolve translations to a plain object for worker serialization (avoids placeholder/corruption in PDF)
      const pdfT = {
        doc: {
          title: t?.doc?.title ?? 'Pet CV',
          subtitle: t?.doc?.subtitle ?? 'Application document',
          date: t?.doc?.date ?? 'Date',
          sectionOwner: t?.doc?.sectionOwner ?? 'Owner',
          sectionPet: t?.doc?.sectionPet ?? 'Pet',
          sectionAbout: t?.doc?.sectionAbout ?? 'About',
          sectionLegal: t?.doc?.sectionLegal ?? 'Insurance & Legal',
          sectionBehavior: t?.doc?.sectionBehavior ?? 'Behavior',
          sectionReference: t?.doc?.sectionReference ?? 'References',
          sectionDescription: t?.doc?.sectionDescription ?? 'Description',
          petPhoto: t?.doc?.petPhoto ?? t?.ui?.petPhotoAlt ?? 'Photo',
          sign: t?.doc?.sign ?? 'Signature',
          footer: t?.doc?.footer ?? 'Dokument generiert via Pet-Bewerbung.ch',
          emergencyTitle: t?.doc?.emergencyTitle ?? 'Emergency Profile',
          emergencySubtitle: t?.doc?.emergencySubtitle ?? 'Kritische Informationen für Tiersitter',
          ownerTitle: t?.doc?.ownerTitle ?? 'Owner',
          descTitle: t?.doc?.descTitle ?? 'About',
          behavior: t?.doc?.behavior ?? 'Temperament',
          details: t?.doc?.details ?? 'Details',
          behaviorTitle: t?.doc?.behaviorTitle ?? 'Behavior & Routine',
          legalTitle: t?.doc?.legalTitle ?? 'Legal & Health',
          gridTitle: t?.doc?.gridTitle ?? 'Tierhalter-Referenzblatt',
          gridDocId: t?.doc?.gridDocId ?? 'Dokument-ID',
          defaultDescription: t?.doc?.defaultDescription ?? '',
          qrLabel: t?.doc?.qrLabel ?? 'Kontakt scannen',
          qrHint: t?.doc?.qrHint ?? 'vCard hinzufügen',
          digitalSign: t?.doc?.digitalSign ?? 'Digital Signatur Halter',
        },
        labels: {
          petName: t?.labels?.petName ?? 'Name',
          breed: t?.labels?.breed ?? 'Breed',
          gender: t?.labels?.gender ?? 'Gender',
          age: t?.labels?.age ?? 'Age',
          weight: t?.labels?.weight ?? 'Weight',
          chipId: t?.labels?.chipId ?? 'Chip ID',
          insurance: t?.labels?.insurance ?? 'Insurance',
          vet: t?.labels?.vet ?? 'Vet',
          neutered: t?.labels?.neutered ?? 'Neutered',
          vaccination: t?.labels?.vaccination ?? 'Vaccinated',
          registration: t?.labels?.registration ?? 'Registered',
          noiseLevel: t?.labels?.noiseLevel ?? 'Noise',
          behaviorTitle: t?.labels?.behaviorTitle ?? 'Behavior',
          activeHours: t?.labels?.activeHours ?? 'Active hours',
          behaviorWithChildren: t?.labels?.behaviorWithChildren ?? 'With children',
          behaviorWithPets: t?.labels?.behaviorWithPets ?? 'With pets',
          behaviorGood: t?.labels?.behaviorGood ?? 'Good',
          behaviorNeutral: t?.labels?.behaviorNeutral ?? 'Neutral',
          behaviorAvoid: t?.labels?.behaviorAvoid ?? 'Avoid',
          noiseLow: t?.labels?.noiseLow ?? 'Low',
          noiseMedium: t?.labels?.noiseMedium ?? 'Medium',
          noiseHigh: t?.labels?.noiseHigh ?? 'High',
          low: t?.labels?.low ?? 'Low',
          medium: t?.labels?.medium ?? 'Medium',
          high: t?.labels?.high ?? 'High',
          aloneTime: t?.labels?.aloneTime ?? 'Alone',
          yes: t?.labels?.yes ?? 'Yes',
          no: t?.labels?.no ?? 'No',
          years: t?.labels?.years ?? 'years',
          kg: t?.labels?.kg ?? 'kg',
          m: t?.labels?.m ?? 'M',
          f: t?.labels?.f ?? 'F',
          male: t?.labels?.male ?? 'M',
          female: t?.labels?.female ?? 'F',
          name: t?.labels?.name ?? 'Name',
          address: t?.labels?.address ?? 'Address',
          city: t?.labels?.city ?? 'City',
          phone: t?.labels?.phone ?? 'Phone',
          date: t?.labels?.date ?? 'Date',
          previousLandlord: t?.labels?.previousLandlord ?? 'Previous landlord',
          previousDuration: t?.labels?.previousDuration ?? 'Duration',
          emergencyContact: t?.labels?.emergencyContact ?? 'Emergency',
          emergencyContactRelation: t?.labels?.emergencyContactRelation ?? 'Relation',
          referenceTitle: t?.labels?.referenceTitle ?? 'References',
          medicalConditions: t?.labels?.medicalConditions ?? t?.step2Emergency?.displayMedical ?? 'Medizinische Angaben',
          secondaryEmergencyContact: t?.labels?.secondaryEmergencyContact ?? t?.step2Emergency?.secondaryContact ?? 'Zweiter Kontakt',
          houseTrained: t?.labels?.houseTrained ?? 'House trained',
          chipped: t?.labels?.chipped ?? 'Chipped',
          vaccinated: t?.labels?.vaccinated ?? 'Vaccinated',
          dewormed: t?.labels?.dewormed ?? 'Dewormed',
          activityLevel: t?.labels?.activityLevel ?? 'Activity',
          goodWithChildren: t?.labels?.goodWithChildren ?? 'Good with children',
          social: t?.labels?.social ?? 'Social',
          availableForRent: t?.labels?.availableForRent ?? 'Pet CV',
          willingToPayDeposit: t?.labels?.willingToPayDeposit ?? 'Pet Deposit',
        },
        step2Emergency: {
          displayMedical: t?.step2Emergency?.displayMedical ?? 'Medizinische Angaben',
          secondaryContact: t?.step2Emergency?.secondaryContact ?? 'Zweiter Kontakt',
        },
        ui: { noDescription: t?.ui?.noDescription ?? '—' },
      };
      const logoUrl = await fetchLogoAsDataUrl();
      const qrContent = getQrContent(pdfData);
      const qrUrl = qrContent ? await generateQrDataUrl(qrContent, { size: 400, margin: 2 }) : null;
      const [{ pdf }, { default: SwissDocumentPdf }] = await Promise.all([
        import('@react-pdf/renderer'),
        import('./components/SwissDocumentPdf'),
      ]);
      const blob = await pdf(
        <SwissDocumentPdf data={pdfData} t={pdfT} templateType={selectedTemplate} logoUrl={logoUrl} qrUrl={qrUrl} />
      ).toBlob();
      const url = URL.createObjectURL(blob);

      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

      if (isIOS) {
        const newWindow = window.open(url, '_blank');
        if (!newWindow) window.location.href = url;
        showToast(t?.labels?.pdfSaveHint || 'Tippen Sie auf "Teilen" → "In Dateien sichern"', 'info');
      } else if (isMobile) {
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast('PDF downloaded!', 'success');
      } else {
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast('PDF downloaded successfully!', 'success');
      }
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';

      // Log error for debugging
      console.error('PDF generation error:', err);

      if (errorMessage.includes('Failed to fetch') || errorMessage.includes('import')) {
        showToast(
          t?.ui?.pdfModuleError || 'Failed to load PDF module. Check your internet connection and try again.',
          'error'
        );
      } else if (errorMessage.includes('memory')) {
        showToast(
          t?.ui?.pdfMemoryError || 'PDF generation failed due to large image. Try reducing photo size.',
          'error'
        );
      } else if (errorMessage.includes('timeout')) {
        showToast(
          t?.ui?.pdfTimeoutError || 'PDF generation timed out. Please try again.',
          'error'
        );
      } else {
        showToast(
          t?.ui?.pdfError || 'Failed to download PDF: ' + errorMessage,
          'error'
        );
      }
      
      if (import.meta.env.DEV) {
        console.error('PDF generation error:', err);
      }
    }
  };

  // Generate PDF blob for a specific template (used for ZIP download)
  const generatePdfBlob = async (templateType: string): Promise<Blob> => {
    let pdfData = { ...data };
    if (data.photo && typeof data.photo === 'string') {
      try {
        let photoUrl = data.photo;
        if (data.photo.startsWith('blob:')) {
          photoUrl = await blobUrlToDataUrl(data.photo);
        }
        if (photoUrl.startsWith('data:image/webp')) {
          photoUrl = await toJpegDataUrl(photoUrl);
        }
        pdfData = { ...data, photo: photoUrl };
      } catch {
        pdfData = { ...data, photo: null };
      }
    }
    
    const pdfT = {
      doc: {
        title: t?.doc?.title ?? 'Pet CV',
        subtitle: t?.doc?.subtitle ?? 'Application document',
        date: t?.doc?.date ?? 'Date',
        sectionOwner: t?.doc?.sectionOwner ?? 'Owner',
        sectionPet: t?.doc?.sectionPet ?? 'Pet',
        sectionAbout: t?.doc?.sectionAbout ?? 'About',
        sectionLegal: t?.doc?.sectionLegal ?? 'Insurance & Legal',
        sectionBehavior: t?.doc?.sectionBehavior ?? 'Behavior',
        sectionReference: t?.doc?.sectionReference ?? 'References',
        petPhoto: t?.doc?.petPhoto ?? t?.ui?.petPhotoAlt ?? 'Photo',
        sign: t?.doc?.sign ?? 'Signature',
        footer: t?.doc?.footer ?? 'Dokument generiert via Pet-Bewerbung.ch',
      },
      labels: {
        petName: t?.labels?.petName ?? 'Name',
        breed: t?.labels?.breed ?? 'Breed',
        gender: t?.labels?.gender ?? 'Gender',
        age: t?.labels?.age ?? 'Age',
        weight: t?.labels?.weight ?? 'Weight',
        chipId: t?.labels?.chipId ?? 'Chip ID',
        insurance: t?.labels?.insurance ?? 'Insurance',
        vet: t?.labels?.vet ?? 'Vet',
        neutered: t?.labels?.neutered ?? 'Neutered',
        vaccination: t?.labels?.vaccination ?? 'Vaccinated',
        registration: t?.labels?.registration ?? 'Registered',
        noiseLevel: t?.labels?.noiseLevel ?? 'Noise',
        behaviorTitle: t?.labels?.behaviorTitle ?? 'Behavior',
        activeHours: t?.labels?.activeHours ?? 'Active hours',
        behaviorWithChildren: t?.labels?.behaviorWithChildren ?? 'With children',
        behaviorWithPets: t?.labels?.behaviorWithPets ?? 'With pets',
        behaviorGood: t?.labels?.behaviorGood ?? 'Good',
        behaviorNeutral: t?.labels?.behaviorNeutral ?? 'Neutral',
        behaviorAvoid: t?.labels?.behaviorAvoid ?? 'Avoid',
        noiseLow: t?.labels?.noiseLow ?? 'Low',
        noiseMedium: t?.labels?.noiseMedium ?? 'Medium',
        noiseHigh: t?.labels?.noiseHigh ?? 'High',
        low: t?.labels?.low ?? 'Low',
        medium: t?.labels?.medium ?? 'Medium',
        high: t?.labels?.high ?? 'High',
        aloneTime: t?.labels?.aloneTime ?? 'Alone',
        yes: t?.labels?.yes ?? 'Yes',
        no: t?.labels?.no ?? 'No',
        years: t?.labels?.years ?? 'years',
        kg: t?.labels?.kg ?? 'kg',
        m: t?.labels?.m ?? 'M',
        f: t?.labels?.f ?? 'F',
        previousLandlord: t?.labels?.previousLandlord ?? 'Previous landlord',
        previousDuration: t?.labels?.previousDuration ?? 'Duration',
        emergencyContact: t?.labels?.emergencyContact ?? 'Emergency',
        emergencyContactRelation: t?.labels?.emergencyContactRelation ?? 'Relation',
        referenceTitle: t?.labels?.referenceTitle ?? 'References',
        medicalConditions: t?.labels?.medicalConditions ?? 'Medizinische Angaben',
        secondaryEmergencyContact: t?.labels?.secondaryEmergencyContact ?? 'Zweiter Kontakt',
      },
      step2Emergency: {
        displayMedical: t?.step2Emergency?.displayMedical ?? 'Medizinische Angaben',
        secondaryContact: t?.step2Emergency?.secondaryContact ?? 'Zweiter Kontakt',
      },
      ui: { noDescription: t?.ui?.noDescription ?? '—' },
    };
    
    const logoUrl = await fetchLogoAsDataUrl();
    const qrContent = getQrContent(pdfData);
    const qrUrl = qrContent ? await generateQrDataUrl(qrContent, { size: 400, margin: 2 }) : null;
    
    const [{ pdf }, { default: SwissDocumentPdf }] = await Promise.all([
      import('@react-pdf/renderer'),
      import('./components/SwissDocumentPdf'),
    ]);
    
    return await pdf(
      <SwissDocumentPdf data={pdfData} t={pdfT} templateType={templateType} logoUrl={logoUrl} qrUrl={qrUrl} />
    ).toBlob();
  };

  // Download all templates as ZIP (Premium feature)
  const handleDownloadAllTemplates = async () => {
    if (!isPremium) {
      showToast(t?.premium?.zipRequiresPremium || 'ZIP-Download nur für Premium', 'error');
      return;
    }
    
    showToast(t?.premium?.generatingZip || 'Generiere alle Vorlagen...', 'info');
    
    try {
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();
      const petName = data.name || 'Pet-CV';
      
      // Generate PDF for each template
      for (const template of TEMPLATE_OPTIONS) {
        try {
          const blob = await generatePdfBlob(template.id);
          zip.file(`${petName}-${template.id}.pdf`, blob);
        } catch (err) {
          if (import.meta.env.DEV) {
            console.error(`Failed to generate ${template.id}:`, err);
          }
        }
      }
      
      // Generate ZIP
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `${petName}-alle-vorlagen.zip`;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setTimeout(() => URL.revokeObjectURL(url), 5000);
      showToast(t?.premium?.zipDownloaded || 'ZIP mit allen Vorlagen heruntergeladen!', 'success');
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error('ZIP generation error:', err);
      }
      showToast(t?.premium?.zipError || 'Fehler beim Erstellen des ZIP-Archivs', 'error');
    }
  };

  const handleDonateMethod = async (method: string) => {
    // Check cookie consent before loading Stripe
    if (cookieConsent !== 'accepted') {
      // Show cookie banner again so user can accept
      setForceCookieBanner(true);
      showToast(t?.legal?.cookieRequiredForPayment || 'Bitte akzeptieren Sie Cookies für Zahlungen', 'info');
      return;
    }
    
    const parsed = parseFloat(donationAmount || '5');
    const amount = Math.max(1, Math.round(parsed));
    const cents = amount * 100;
    // All payments use CHF (Swiss Francs) - Swiss service
    const currency = 'chf';
    try {
      const res = await fetch(API_ENDPOINTS.createCheckoutSession, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: cents, currency: currency, successUrl: window.location.href, cancelUrl: window.location.href, payment_method: method }),
      });
      
      // Check if response is OK
      if (!res.ok) {
        const errorText = await res.text();
        let errorMessage = `Server error (${res.status})`;
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.error || errorJson.details || errorMessage;
          if (import.meta.env.DEV) {
            console.error('Checkout session error:', {
              status: res.status,
              error: errorJson.error,
              details: errorJson.details,
              type: errorJson.type,
              code: errorJson.code
            });
          }
        } catch {
          errorMessage = errorText.substring(0, 100) || errorMessage;
          if (import.meta.env.DEV) {
            console.error('Checkout session error (non-JSON):', res.status, errorText.substring(0, 200));
          }
        }
        showToast(errorMessage || 'Failed to create checkout session', 'error');
        return;
      }
      
      // Перевірка типу відповіді перед парсингом
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await res.text();
        if (import.meta.env.DEV) {
          console.error('Non-JSON response:', text.substring(0, 200));
        }
        showToast('Payment error: Server returned HTML instead of JSON. Check API connection.', 'error');
        return;
      }
      
      const json = await res.json();
      if (json.url) {
        window.open(json.url, '_blank');
        showToast('Opening Checkout...', 'info');
      } else {
        const errorMsg = json.error || json.details || 'Failed to create checkout session';
        if (import.meta.env.DEV) {
          console.error('Checkout session response error:', json);
        }
        showToast(errorMsg, 'error');
      }
    } catch (err: any) {
      if (import.meta.env.DEV) {
        console.error('Payment error:', err);
      }
      showToast('Payment error: ' + (err.message || err), 'error');
    } finally {
      setDonateOpen(false);
    }
  };

  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplate(templateId);
  };

  // Premium payment modal state
  const [premiumPaymentOpen, setPremiumPaymentOpen] = useState(false);
  
  // Template builder modal state (Premium feature)
  const [builderOpen, setBuilderOpen] = useState(false);
  
  // Handle opening the template builder / visual editor
  // Premium users can customize ANY template (not just a separate "custom" template)
  const handleOpenBuilder = () => {
    if (!isPremium) {
      // For non-premium users, show toast and offer to buy premium
      showToast(t?.premium?.builderRequiresPremium ?? 'Visual Editor benötigt Premium', 'info');
      handleBuyPremium(); // Open payment modal
      return;
    }
    // Open builder for the currently selected template
    setBuilderOpen(true);
  };
  
  // Handle applying builder changes
  const handleApplyBuilder = () => {
    setBuilderOpen(false);
    showToast(t?.builder?.applied ?? 'Änderungen angewendet!', 'success');
  };
  
  // Handle premium purchase - opens payment modal with fixed price
  const handleBuyPremium = () => {
    // Check cookie consent before loading Stripe
    if (cookieConsent !== 'accepted') {
      // Show cookie banner again so user can accept
      setForceCookieBanner(true);
      showToast(t?.legal?.cookieRequiredForPayment || 'Bitte akzeptieren Sie Cookies für Zahlungen', 'info');
      return;
    }
    
    // Open the payment modal with premium price
    setPremiumPaymentOpen(true);
  };
  
  // Handle premium payment success (from modal)
  const handlePremiumPaymentSuccess = async (paymentId: string) => {
    setPremiumPaymentOpen(false);
    
    // Activate premium with JWT token
    const success = await activatePremium(paymentId);
    
    if (success) {
      showToast(t?.premium?.purchaseSuccess || '🎉 Premium freigeschaltet! 2 Stunden Zugang.', 'success');
    } else {
      // Even if JWT activation fails, treat as success since payment went through
      showToast(t?.premium?.purchaseSuccess || '🎉 Premium freigeschaltet!', 'success');
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Convert darkMode to theme string for components that still use theme prop
  const theme = darkMode ? 'dark' : 'light';

  const renderStep = () => {
    switch(step) {
      case 0:
        return (
          <div className={`page page-enter-${animDir} reveal fade-enter flex flex-col items-center pt-28 pb-16 px-4 relative overflow-hidden`}>
            <div className={`absolute top-[15%] left-[5%] opacity-10 pointer-events-none hidden lg:block transition-opacity duration-300 ${darkMode ? 'opacity-5' : 'opacity-10'}`}>
              <span className="material-symbols-outlined text-8xl rotate-12 select-none">pets</span>
            </div>
            <div className={`absolute bottom-[20%] right-[5%] opacity-10 pointer-events-none hidden lg:block transition-opacity duration-300 ${darkMode ? 'opacity-5' : 'opacity-10'}`}>
              <span className="material-symbols-outlined text-9xl -rotate-12 select-none">favorite</span>
            </div>
            <div className="w-full max-w-6xl flex flex-col items-center text-center z-10 gap-16">
              <Hero darkMode={darkMode} t={t} onStartClick={() => goToStep(1)} />
              <Steps darkMode={darkMode} t={t} />
            </div>
          </div>
        );
      case 1:
        return (
          <Step1Details
            animDir={animDir}
            errors={validationErrors}
          />
        );
      case 2:
        return (
          <Step2HealthInsurance
            data={data}
            updateData={updateData}
            t={t}
            animDir={animDir}
            darkMode={darkMode}
          />
        );
      case 3:
        return (
          <Step3Description
            data={data}
            updateData={updateData}
            t={t}
            animDir={animDir}
            darkMode={darkMode}
            isGenerating={isGenerating}
            onGenerate={generateText}
            isPremium={isPremium}
            canGenerateAI={canGenerateAI}
            remainingGenerations={remainingGenerations}
            premiumToken={premiumToken}
            deviceId={deviceId}
            onMagicRewrite={(status: string, error?: string) => {
              if (status === 'success') {
                showToast(t?.premium?.rewriteSuccess || 'Text verbessert!', 'success');
              } else if (error) {
                showToast(error, 'error');
              }
            }}
          />
        );
      case 4:
        return (
          <Step4Photo
            data={data}
            updateData={updateData}
            t={t}
            animDir={animDir}
            onNavigationVisibilityChange={setNavigationVisible}
            darkMode={darkMode}
          />
        );
      case 5:
        return (
          <Step5TemplateSelect
            data={data}
            t={t}
            animDir={animDir}
            selectedTemplate={selectedTemplate}
            onSelectTemplate={handleSelectTemplate}
            showToast={showToast}
            darkMode={darkMode}
            isPremium={isPremium}
            getTemplateInfo={getTemplateInfo}
          />
        );
      case 6:
        return (
          <Step5Preview
            data={data}
            t={t}
            animDir={animDir}
            selectedTemplate={selectedTemplate}
            darkMode={darkMode}
            isPremium={isPremium}
            getTemplateInfo={getTemplateInfo}
            onDownloadPDF={handleDownloadPDF}
            onBuyPremium={handleBuyPremium}
            premiumPrice={premiumPrice}
            onDownloadAllTemplates={handleDownloadAllTemplates}
            onSelectFreeTemplate={() => setSelectedTemplate('classic')}
            updateData={updateData}
            onOpenBuilder={handleOpenBuilder}
          />
        );
      default:
        return null;
    }
  };

  const appContent = showPaymentSuccess ? (
    <PaymentSuccess
      data={data}
      t={t}
      theme={theme}
      onThemeChange={(newTheme: string) => setDarkMode(newTheme === 'dark')}
      onLangChange={(v: string) => updateData('lang', v)}
      onLogoClick={() => { setShowPaymentSuccess(false); goToStep(0); }}
      sessionId={paymentSessionId}
      showToast={showToast}
      onDownloadPDF={handleDownloadPDF}
      onFaqClick={() => setFaqOpen(true)}
    />
  ) : step === 7 ? (
    <Step6ThankYou
      data={data}
      t={t}
      theme={theme}
      onThemeChange={(newTheme: string) => setDarkMode(newTheme === 'dark')}
      onLangChange={(v: string) => updateData('lang', v)}
      onLogoClick={() => goToStep(0)}
      onDownloadPDF={handleDownloadPDF}
      onCreateAnother={() => goToStep(0)}
      onPrev={() => goToStep(6)}
      donationAmount={donationAmount}
      setDonationAmount={setDonationAmount}
      donateOpen={donateOpen}
      setDonateOpen={setDonateOpen}
      paymentOpen={paymentOpen}
      setPaymentOpen={setPaymentOpen}
      onDonate={handleDonateMethod}
      showToast={showToast}
      toast={toast}
      onFaqClick={() => setFaqOpen(true)}
      onPaymentSuccess={(paymentId: string) => {
        if (PAYMENT_SUCCESS_BEHAVIOR === 'show_page') {
          setShowPaymentSuccess(true);
          setPaymentSessionId(paymentId);
        }
      }}
    />
  ) : (
    <div className="min-h-screen font-sans theme-text theme-bg pb-6 print:bg-white print:p-0">
      <GlobalStyles theme={theme} />
      <Header
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        lang={data.lang}
        onLangChange={(v: string) => updateData('lang', v)}
        onLogoClick={() => goToStep(0)}
        t={t}
        isPremium={isPremium}
        premiumTimeRemaining={premiumTimeRemaining}
        onPremiumExpired={() => showToast(t?.premium?.sessionExpired || 'Premium-Sitzung abgelaufen', 'info')}
      />

      <main className={`w-full print:w-full print:max-w-none print:p-0 ${step >= 1 && step <= 6 ? 'pt-24 md:pt-28' : ''}`}>
        {step >= 1 && step <= 6 && (
          <div className={`sticky top-0 z-20 w-full p-0 print:hidden border-b ${darkMode ? 'bg-gray-900 border-transparent' : 'bg-white border-transparent'}`} style={{ borderBottomColor: 'transparent' }}>
            <StepProgress step={step} t={t} darkMode={darkMode} onStepClick={goToStep} />
          </div>
        )}
        <div className={step === 0 ? "w-full" : "max-w-7xl mx-auto p-4 md:p-8 print:border-none print:shadow-none print:p-0"}>
          {renderStep()}
        </div>
      </main>

      {/* Floating Navigation Bar */}
      <FloatingNavigation
        step={step}
        onPrev={() => goToStep(step - 1)}
        onNext={() => goToStep(step + 1)}
        onDownloadPDF={handleDownloadPDF}
        onBuyPremium={handleBuyPremium}
        t={t}
        darkMode={darkMode}
        canProceed={canProceed}
        needsPayment={getTemplateInfo(selectedTemplate).isPremium && !isPremium}
        premiumPrice={premiumPrice}
        visible={navigationVisible}
      />

      <DonateModal
        open={donateOpen}
        onClose={() => setDonateOpen(false)}
        amount={donationAmount}
        onDonate={handleDonateMethod}
        onOpenPayment={() => { setPaymentOpen(true); setDonateOpen(false); }}
      />
      <PaymentModal
        open={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        amount={donationAmount}
        lang={data.lang}
        t={t}
        darkMode={darkMode}
        onSuccess={(paymentId: string) => {
          showToast(t.paymentSuccess?.thankYouMessage || 'Thank you — payment succeeded', 'success');
          // Show PaymentSuccess page
          if (PAYMENT_SUCCESS_BEHAVIOR === 'show_page') {
            setShowPaymentSuccess(true);
            setPaymentSessionId(paymentId);
          }
        }}
        onFailure={(msg: string) => showToast(`${t.ui?.error || 'Payment failed'}: ${msg}`, 'error')}
      />
      
      {/* Premium Payment Modal - fixed 10 CHF price */}
      <PaymentModal
        open={premiumPaymentOpen}
        onClose={() => setPremiumPaymentOpen(false)}
        amount={String(premiumPrice)}
        lang={data.lang}
        t={{
          ...t,
          paymentCheckout: {
            ...t?.paymentCheckout,
            secureCheckout: t?.premium?.securePayment || 'Sichere Zahlung',
            completeDonation: t?.premium?.completePurchase || 'Premium freischalten',
            youreDonating: t?.premium?.yourePayingFor || 'Premium-Zugang für 2 Stunden:',
            toSupport: ''
          }
        }}
        darkMode={darkMode}
        onSuccess={handlePremiumPaymentSuccess}
        onFailure={(msg: string) => showToast(`${t.ui?.error || 'Payment failed'}: ${msg}`, 'error')}
      />
      
      {/* Visual Document Editor - Premium feature */}
      {builderOpen && (
        <DocumentEditor
          data={data}
          updateData={updateData}
          t={t}
          darkMode={darkMode}
          selectedTemplate={selectedTemplate}
          onClose={() => setBuilderOpen(false)}
          onApply={handleApplyBuilder}
        />
      )}

      {/* Preview Modal */}
      {previewOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 print:hidden">
          <div className="relative bg-transparent w-full h-full flex flex-col items-center justify-center" onClick={closePreview}>
            <button
              onClick={(e) => { e.stopPropagation(); closePreview(); }}
              className="absolute top-4 right-4 text-white/70 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all"
            >
              <X size={32} />
            </button>

            <div
              className="text-white mb-4 font-medium flex items-center gap-2 bg-black/50 px-4 py-2 rounded-full backdrop-blur-md"
              onClick={(e) => e.stopPropagation()}
            >
              <Camera size={18} /> {t.ui.previewMode} — {previewTemplate}
            </div>

            <div
              className="w-full max-w-4xl h-full overflow-auto flex justify-center items-start pt-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="origin-top scale-[0.4] sm:scale-[0.6] md:scale-[0.8] lg:scale-100 shadow-2xl">
                <ErrorBoundary
                  fallbackTitle="Preview Error"
                  fallbackMessage="Failed to render document preview. Please check your data and try again."
                  onReset={closePreview}
                >
                  <SwissDocument data={data} t={t} templateType={previewTemplate} />
                </ErrorBoundary>
              </div>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 rounded-lg px-4 py-3 animate-in slide-in-from-bottom-4 ${
          toast.type === 'success' ? 'theme-success' : toast.type === 'error' ? 'theme-error' : 'theme-card theme-text'
        }`}>
          {toast.msg}
        </div>
      )}

      {step === 0 && <Footer darkMode={darkMode} t={t} onOpenLegal={setLegalPage} onFaqClick={() => setFaqOpen(true)} />}

      <LegalPages t={t} openPage={legalPage} onClose={() => setLegalPage(null)} />

      <CookieBanner t={t} onOpenPrivacy={() => setLegalPage('privacy')} onConsentChange={handleCookieConsentChange} forceShow={forceCookieBanner} />
    </div>
  );

  return (
    <FormProvider value={{ data, updateData }}>
      <ThemeProvider value={{ darkMode, setDarkMode }}>
        <TranslationProvider value={{ t }}>
          {appContent}
          <FaqModal isOpen={faqOpen} onClose={() => setFaqOpen(false)} t={t} darkMode={darkMode} />
        </TranslationProvider>
      </ThemeProvider>
    </FormProvider>
  );
}
