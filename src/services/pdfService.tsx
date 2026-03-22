/**
 * PDF Service
 * PDF generation logic - no UI, pure business logic.
 * Uses React-PDF for rendering.
 */

import React from 'react';
import type { PetData, TemplateType } from '../types/form';
import { PUBLIC_LOGO_PATH } from '../constants';
import { toJpegDataUrl } from '../utils/imageCompression';
import { blobUrlToDataUrl } from '../utils/pdfHelpers';
import { buildPublicFileUrl } from '../utils/publicAssetUrl';
import { generateQrDataUrl, getQrContent } from '../utils/qrCode';

export type PdfTranslations = ReturnType<typeof buildPdfTranslations>;

/**
 * Build PDF translation object from app translations
 */
export function buildPdfTranslations(t: Record<string, any>) {
  return {
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
  };
}

/**
 * Fetch logo as data URL
 */
export async function fetchLogoAsDataUrl(): Promise<string | null> {
  try {
    const url = buildPublicFileUrl(
      window.location.origin,
      import.meta.env.BASE_URL || '/',
      PUBLIC_LOGO_PATH
    );
    const res = await fetch(url);
    if (!res.ok) return null;
    const blob = await res.blob();
    let dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
    // @react-pdf/renderer Image is unreliable with WebP in some environments
    if (dataUrl.startsWith('data:image/webp')) {
      dataUrl = await toJpegDataUrl(dataUrl);
    }
    return dataUrl;
  } catch (err) {
    if (import.meta.env.DEV) console.warn('Logo fetch failed:', err);
    return null;
  }
}

/**
 * Prepare form data for PDF (photo conversion: blob→dataURL, webp→jpeg)
 */
export async function preparePdfData(data: PetData): Promise<PetData> {
  if (!data.photo || typeof data.photo !== 'string') {
    return { ...data };
  }
  try {
    let photoUrl = data.photo;
    if (photoUrl.startsWith('blob:')) {
      photoUrl = (await blobUrlToDataUrl(photoUrl)) ?? data.photo;
    }
    if (photoUrl && photoUrl.startsWith('data:image/webp')) {
      photoUrl = await toJpegDataUrl(photoUrl);
    }
    return { ...data, photo: photoUrl };
  } catch (err) {
    if (import.meta.env.DEV) console.warn('Photo conversion failed for PDF:', err);
    return { ...data, photo: null };
  }
}

/** Forces a fresh React tree for each render — @react-pdf/renderer may reuse state without this */
let pdfRenderSeq = 0;

/**
 * Load the concrete PDF root (Classic/Modern/Compact) — avoids routing through one component,
 * which could cause identical PDFs across template switches in some react-pdf builds.
 */
async function loadPdfRootForTemplate(templateType: TemplateType) {
  switch (templateType) {
    case 'modern':
      return (await import('../components/pdf/templates/ModernPdf')).default;
    case 'compact':
      return (await import('../components/pdf/templates/CompactPdf')).default;
    case 'buddy':
      return (await import('../components/pdf/templates/BuddyPdf')).default;
    case 'buddyTest':
      return (await import('../components/pdf/templates/BuddyTestPdf')).default;
    case 'classic':
    default:
      return (await import('../components/pdf/templates/ClassicPdf')).default;
  }
}

/**
 * Generate PDF blob for a template
 * @param data - Form data (use preparePdfData first if photo needs conversion)
 * @param templateType - classic, modern, compact
 * @param pdfT - Translations from buildPdfTranslations
 */
export async function generatePdfBlob(
  data: PetData,
  templateType: TemplateType,
  pdfT: PdfTranslations
): Promise<Blob> {
  const logoUrl = (await fetchLogoAsDataUrl()) || undefined;
  const qrContent = getQrContent(data);
  const qrUrl = qrContent ? await generateQrDataUrl(qrContent, { size: 400, margin: 2 }) : null;

  const [{ pdf }, PdfRoot] = await Promise.all([import('@react-pdf/renderer'), loadPdfRootForTemplate(templateType)]);

  const instanceKey = `${templateType}-${++pdfRenderSeq}`;

  return pdf(
    React.createElement(PdfRoot, {
      key: instanceKey,
      data,
      t: pdfT,
      logoUrl,
      qrUrl,
    })
  ).toBlob();
}
