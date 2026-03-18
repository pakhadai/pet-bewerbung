/**
 * AppContent Component
 * Main application logic orchestrator
 * Uses all hooks and manages business logic:
 * - PDF generation
 * - AI text generation
 * - Payment handling
 * - File uploads
 *
 * Separated from App.tsx to keep it clean and provide structure
 */

import React, { useState, useRef, useEffect } from 'react';
import { MAX_DESCRIPTION_LENGTH, TEMPLATE_OPTIONS, TRANSLATIONS } from '../constants';
import AppContainer from './AppContainer';
import API_ENDPOINTS from '../config';
import compressImage, { toJpegDataUrl } from '../utils/imageCompression';
import { generateQrDataUrl, getQrContent } from '../utils/qrCode';
import { useFormWizard, useToast, usePremium, useAIGenerations, useCsrf } from '../hooks';

const AppContent: React.FC = () => {
  const { data, updateData } = useFormWizard();
  const { showToast } = useToast();
  const { isPremium } = usePremium();
  const { canGenerate: canGenerateAI, remainingGenerations, incrementGeneration } = useAIGenerations(isPremium);
  const { token: csrfToken } = useCsrf();

  const [isGenerating, setIsGenerating] = useState(false);
  const prevLangRef = useRef(data.lang);

  // Clear generated text when language changes
  useEffect(() => {
    if (prevLangRef.current !== data.lang && data.generatedText && data.generatedText.length > 0) {
      updateData('generatedText', '');
      showToast(TRANSLATIONS[data.lang]?.labels?.aiPrompt || 'Please regenerate text for the new language', 'info');
    }
    prevLangRef.current = data.lang;
  }, [data.lang, data.generatedText, updateData, showToast]);

  // Handle file upload and compression
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressedImage = await compressImage(file, {
          maxWidth: 800,
          maxHeight: 800,
          quality: 0.8,
          maxSizeKB: 500
        });
        updateData('photo', compressedImage);
      } catch (err) {
        const reader = new FileReader();
        reader.onloadend = () => updateData('photo', reader.result);
        reader.readAsDataURL(file);
        showToast('Image compression failed, using original', 'info');
      }
    }
  };

  // Generate fallback template-based text
  const generateFallbackText = () => {
    const tmpl = TRANSLATIONS[data.lang]?.templates || TRANSLATIONS.de.templates;
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

  // Generate AI text description
  const generateText = async () => {
    const t = TRANSLATIONS[data.lang];

    // SECURITY: Prevent duplicate requests - early return if already generating
    if (isGenerating) {
      console.warn('⚠️  AI generation already in progress, ignoring duplicate request');
      return;
    }

    if (!canGenerateAI) {
      showToast(
        t?.premium?.aiLimitReached || 'AI limit erreicht. Versuchen Sie es morgen wieder.',
        'info'
      );
      generateFallbackText();
      return;
    }

    setIsGenerating(true);

    try {
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

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (csrfToken) {
        headers['X-CSRF-Token'] = csrfToken;
      }

      const res = await fetch(API_ENDPOINTS.generatePetDescription, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          petData,
          lang: data.lang,
          tone: data.aiTone || 'formal'
        }),
      });

      const json = await res.json();

      if (res.status === 429) {
        showToast(json.message || 'AI limit reached. Try again tomorrow.', 'error');
        return;
      }

      if (res.status === 503) {
        generateFallbackText();
        showToast('Using template (AI not available)', 'info');
        return;
      }

      if (!res.ok) {
        throw new Error(json.error || 'AI generation failed');
      }

      incrementGeneration();
      updateData('generatedText', json.description);

      if (json.remaining !== undefined) {
        showToast(`✨ ${json.remaining} AI-Anfragen heute übrig.`, 'success');
      } else {
        showToast('✨ AI-Text generiert!', 'success');
      }
    } catch (err: any) {
      if (import.meta.env.DEV) {
        console.error('AI generation error:', err);
      }

      const t = TRANSLATIONS[data.lang];
      const errorMessage = err.message || 'Unknown error';
      showToast(
        errorMessage.includes('network') || errorMessage.includes('fetch')
          ? t?.labels?.aiNetworkError || 'Network error. Please check your connection and try again.'
          : t?.labels?.aiError || 'AI generation failed. Using template instead.',
        'error'
      );

      generateFallbackText();
    } finally {
      setIsGenerating(false);
    }
  };

  // Convert blob URL to data URL
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

  // Fetch logo as data URL
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
    } catch (err) {
      if (import.meta.env.DEV) console.warn('Logo fetch failed:', err);
      return null;
    }
  };

  // Helper to build PDF translation object
  const buildPdfTranslations = (t: any) => ({
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
      medicalConditions: t?.labels?.medicalConditions ?? 'Medizinische Angaben',
      secondaryEmergencyContact: t?.labels?.secondaryEmergencyContact ?? 'Zweiter Kontakt',
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
  });

  // Download PDF
  const handleDownloadPDF = async () => {
    const t = TRANSLATIONS[data.lang];

    try {
      const filename = `${data.name || 'Pet-CV'}-${new Date().getTime()}.pdf`;
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
        } catch (err) {
          // Photo conversion failed - PDF will render without photo
          if (import.meta.env.DEV) console.warn('Photo conversion failed for PDF:', err);
          pdfData = { ...data, photo: null };
        }
      }

      const pdfT = buildPdfTranslations(t);
      // SAFETY: Fallback to undefined if logo fails to load (component handles null/undefined)
      const logoUrl = (await fetchLogoAsDataUrl()) || undefined;
      const qrContent = getQrContent(pdfData);
      const qrUrl = qrContent ? await generateQrDataUrl(qrContent, { size: 400, margin: 2 }) : null;

      const [{ pdf }, { default: SwissDocumentPdf }] = await Promise.all([
        import('@react-pdf/renderer'),
        import('./SwissDocumentPdf'),
      ]);

      const blob = await pdf(
        <SwissDocumentPdf data={pdfData} t={pdfT} templateType="classic" logoUrl={logoUrl} qrUrl={qrUrl} />
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

      // MEMORY MANAGEMENT: Delay revocation to allow slow downloads to complete
      // Extended from 5s to 60s to prevent incomplete PDFs on slow connections
      setTimeout(() => URL.revokeObjectURL(url), 60000);
    } catch (err: unknown) {
      const t = TRANSLATIONS[data.lang];
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
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
    }
  };

  // Generate PDF blob for a specific template (used for ZIP download)
  const generatePdfBlob = async (templateType: string): Promise<Blob> => {
    const t = TRANSLATIONS[data.lang];

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
      } catch (err) {
        // Photo conversion failed for ZIP template - continue without photo
        if (import.meta.env.DEV) console.warn('Photo conversion failed for template PDF:', err);
        pdfData = { ...data, photo: null };
      }
    }

    const pdfT = buildPdfTranslations(t);
    // SAFETY: Fallback to undefined if logo fails to load
    const logoUrl = (await fetchLogoAsDataUrl()) || undefined;
    const qrContent = getQrContent(pdfData);
    const qrUrl = qrContent ? await generateQrDataUrl(qrContent, { size: 400, margin: 2 }) : null;

    const [{ pdf }, { default: SwissDocumentPdf }] = await Promise.all([
      import('@react-pdf/renderer'),
      import('./SwissDocumentPdf'),
    ]);

    return await pdf(
      <SwissDocumentPdf data={pdfData} t={pdfT} templateType={templateType} logoUrl={logoUrl} qrUrl={qrUrl} />
    ).toBlob();
  };

  // Download all templates as ZIP
  const handleDownloadAllTemplates = async () => {
    const t = TRANSLATIONS[data.lang];
    showToast(t?.premium?.generatingZip || 'Generiere alle Vorlagen...', 'info');

    try {
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();
      const petName = data.name || 'Pet-CV';
      const failedTemplates: string[] = [];
      let successCount = 0;

      for (const template of TEMPLATE_OPTIONS) {
        try {
          const blob = await generatePdfBlob(template.id);
          zip.file(`${petName}-${template.id}.pdf`, blob);
          successCount++;
        } catch (err) {
          failedTemplates.push(template.label || template.id);
          if (import.meta.env.DEV) {
            console.error(`Failed to generate ${template.id}:`, err);
          }
        }
      }

      // Check if any templates succeeded
      if (successCount === 0) {
        throw new Error('Failed to generate any PDF templates');
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `${petName}-alle-vorlagen.zip`;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // MEMORY MANAGEMENT: Delay revocation for slow downloads (ZIP is larger)
      setTimeout(() => URL.revokeObjectURL(url), 120000); // 2 minutes for ZIP

      // Notify user about results
      if (failedTemplates.length > 0) {
        const msg = `${successCount}/${TEMPLATE_OPTIONS.length} templates generated. Failed: ${failedTemplates.join(', ')}`;
        showToast(msg, 'warning');
      } else {
        showToast(t?.premium?.zipDownloaded || 'ZIP mit allen Vorlagen heruntergeladen!', 'success');
      }
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error('ZIP generation error:', err);
      }
      const t = TRANSLATIONS[data.lang];
      showToast(t?.premium?.zipError || 'Fehler beim Erstellen des ZIP-Archivs', 'error');
    }
  };

  return (
    <AppContainer
      onDownloadPDF={handleDownloadPDF}
      onDownloadAllTemplates={handleDownloadAllTemplates}
      onGenerateText={generateText}
      onDonateMethod={async () => {}}
      canGenerateAI={canGenerateAI}
      remainingGenerations={remainingGenerations}
    />
  );
};

export default AppContent;
