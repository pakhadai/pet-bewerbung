/**
 * AppContent Component
 * Static SPA - template-based text generation, PDF export.
 * No backend - all processing client-side.
 */

import React, { useEffect, useRef } from 'react';
import { MAX_DESCRIPTION_LENGTH, TEMPLATE_OPTIONS } from '../constants';
import AppContainer from './AppContainer';
import { buildPdfTranslations } from '../services/pdfService';
import { downloadPdf, downloadAllTemplatesAsZip } from '../services/exportService';
import { useTranslationContext, useToastContext } from '../context/WizardProviders';
import { useFormStore } from '../stores/formStore';
import { trackUmamiEvent } from '../utils/umami';

const selectData = (s: ReturnType<typeof useFormStore.getState>) => s.data;
const selectUpdateData = (s: ReturnType<typeof useFormStore.getState>) => s.updateData;

type GenerationLocale = 'de' | 'en' | 'fr' | 'it' | 'rm';
interface GenerationPack {
  openings: [string, string, string];
  variantBlocks: [string, string, string];
  closings: [string, string, string];
  fillers: [string, string, string];
}

const GENERATION_TEXTS: Record<GenerationLocale, GenerationPack> = {
  de: {
    openings: [
      'Das Tier wird als gepflegter, gut integrierter Mitbewohner vorgestellt.',
      'Die vorliegende Beschreibung zeigt ein alltagstaugliches Tierprofil fuer ein ruhiges Wohnumfeld.',
      'Mit diesem Profil wird das Tier transparent und vermieterfreundlich dargestellt.',
    ],
    variantBlocks: [
      'Im Alltag zeigt das Tier ein stabiles, berechenbares Verhalten und reagiert in neuen Situationen ruhig. Regeln im Haushalt werden verlaesslich eingehalten.',
      'Dank guter Sozialisierung, klarer Tagesstruktur und verantwortungsvoller Betreuung ist das Verhalten kontrolliert und fuer Mehrparteienhaeuser geeignet.',
      'Fuer Vermieter ist besonders relevant, dass das Tier in den Tagesablauf eingebunden ist und keine unkontrollierten Stoerungen verursacht.',
    ],
    closings: [
      'Insgesamt ergibt sich ein verlaessliches Gesamtbild mit guter Wohnungs- und Nachbarschaftskompatibilitaet.',
      'Damit liegt eine nachvollziehbare Grundlage fuer eine vertrauensvolle Mietentscheidung vor.',
      'Die Angaben sprechen fuer ein ruecksichtsvolles Zusammenleben im Wohnobjekt.',
    ],
    fillers: [
      'Sauberkeit, Ruecksicht und planbare Routinen werden konsequent umgesetzt.',
      'Die Betreuung erfolgt verantwortungsvoll und auf Kontinuitaet ausgerichtet.',
      'So entsteht eine stabile, konfliktarme Wohnsituation fuer alle Beteiligten.',
    ],
  },
  en: {
    openings: [
      'This pet is presented as a well-groomed and socially compatible companion.',
      'The profile highlights a reliable pet suited for apartment living.',
      'This document provides a transparent and landlord-friendly overview of the pet.',
    ],
    variantBlocks: [
      'In daily life, the pet shows stable and predictable behavior and remains calm in new situations. Household rules are followed consistently.',
      'Thanks to socialization, structured routines, and responsible care, the pet behaves in a controlled and practical way for shared buildings.',
      'For landlords, it is especially relevant that the pet is integrated into a clear routine and does not cause uncontrolled disturbances.',
    ],
    closings: [
      'Overall, the profile supports a dependable and low-risk living arrangement.',
      'These details provide a clear basis for trust in a rental context.',
      'The information indicates a considerate and apartment-compatible companion.',
    ],
    fillers: [
      'Cleanliness, predictability, and respectful coexistence are consistently maintained.',
      'Care routines are organized and focused on long-term stability.',
      'This helps create a calm and conflict-free home environment.',
    ],
  },
  fr: {
    openings: [
      "Cet animal est presente comme un compagnon soigne et socialement adapte.",
      "Ce profil met en avant un animal fiable, adapte a la vie en appartement.",
      "Ce document offre une presentation claire e rassurante pour le proprietaire.",
    ],
    variantBlocks: [
      "Au quotidien, l'animal adopte un comportement stable et previsible, y compris dans des situations nouvelles. Les regles du foyer sont respectees de maniere constante.",
      "Grace a une bonne socialisation, une routine claire et un encadrement responsable, le comportement reste maitrise et compatible avec un immeuble collectif.",
      "Pour un bailleur, il est essentiel que l'animal soit integre a un rythme bien etabli et ne provoque pas de nuisances non controlees.",
    ],
    closings: [
      "Dans l'ensemble, le profil indique une cohabitation fiable et respectueuse.",
      "Ces informations constituent une base solide pour une relation locative de confiance.",
      "Les elements presentes soutiennent une integration harmonieuse dans le logement.",
    ],
    fillers: [
      "La proprete, la regularite et le respect du voisinage sont appliques de facon coherente.",
      "Le suivi quotidien est organise pour assurer une stabilite durable.",
      "Cela favorise un cadre de vie calme et sans tensions.",
    ],
  },
  it: {
    openings: [
      "L'animale viene presentato come un compagno curato e socialmente equilibrato.",
      "Il profilo evidenzia un animale affidabile, adatto alla vita in appartamento.",
      "Questo documento fornisce una panoramica chiara e rassicurante per il locatore.",
    ],
    variantBlocks: [
      "Nella vita quotidiana l'animale mostra un comportamento stabile e prevedibile, anche in contesti nuovi. Le regole domestiche vengono rispettate con continuita.",
      "Grazie a buona socializzazione, routine strutturata e gestione responsabile, il comportamento resta controllato e compatibile con edifici plurifamiliari.",
      "Per il proprietario e particolarmente importante che l'animale sia inserito in una routine chiara e non provochi disturbi non controllati.",
    ],
    closings: [
      "Nel complesso, il profilo indica una convivenza affidabile e rispettosa.",
      "Questi elementi offrono una base solida per una decisione locativa serena.",
      "Le informazioni supportano un inserimento armonioso nell'ambiente abitativo.",
    ],
    fillers: [
      "Pulizia, regolarita e rispetto del vicinato vengono mantenuti con costanza.",
      "La gestione quotidiana e organizzata per garantire stabilita nel tempo.",
      "Questo favorisce un contesto abitativo tranquillo e privo di conflitti.",
    ],
  },
  rm: {
    openings: [
      "Quest animal vegn preschenta sco cumpogn tgira e socialmain adattà.",
      "Il profil mussa in animal fidaivel, adattà per viver en abitaziun.",
      "Quest document dat ina survista clera e favuraivla per locaturs.",
    ],
    variantBlocks: [
      "En il mintgadi mussa l'animal in cumportament stabil e prevedibel, era en situaziuns novas. Las reglas da la chasa vegnan observadas cun constanza.",
      "Grazia a buna socialisaziun, rutina structurada e tgira responsabla resta il cumportament controllà e cumpatibel cun chasas da pliras famiglias.",
      "Per in locatur e impurtant che l'animal saja integrà en ina rutina clera e na chaschunia nagins disturbis nuncontrolads.",
    ],
    closings: [
      "En total mussa il profil ina convivenza fidaivla e respectusa.",
      "Questas infurmaziuns porschan ina buna basa per ina decisiun da locaziun cun fidanza.",
      "Ils detagls sustegnan ina integraziun harmonica en l'abitaziun.",
    ],
    fillers: [
      "Nettezia, regularitad e risguard envers vischins vegnan mantegnids consequentamain.",
      "La tgira quotidiana e organisada per garantir stabilitad a lunga vista.",
      "Uschia sa sviluppa ina situaziun d'abitar ruassaivla e senza conflicts.",
    ],
  },
};

const isGenerationLocale = (lang: string): lang is GenerationLocale =>
  Object.prototype.hasOwnProperty.call(GENERATION_TEXTS, lang);

const AppContent: React.FC = () => {
  const data = useFormStore(selectData);
  const updateData = useFormStore(selectUpdateData);
  const { t } = useTranslationContext();
  const { showToast } = useToastContext();
  const prevLangRef = useRef(data.lang);
  const generationVariantRef = useRef(0);

  useEffect(() => {
    if (prevLangRef.current !== data.lang && data.generatedText && data.generatedText.length > 0) {
      showToast(t?.labels?.langChangeKeepText || 'Text bleibt erhalten.', 'info');
    }
    prevLangRef.current = data.lang;
  }, [data.lang, data.generatedText, showToast]);

  const generateText = () => {
    const tmpl = t?.templates || {};
    const lbl = t?.labels || {};

    if (!tmpl.intro) {
      showToast(lbl.pleaseWait || '…', 'info');
      return;
    }

    const variant = generationVariantRef.current % 3;
    generationVariantRef.current += 1;
    const locale = isGenerationLocale(data.lang || 'de') ? (data.lang as GenerationLocale) : 'de';
    const pack = GENERATION_TEXTS[locale];

    const petName = data.name?.trim() || (lbl?.petName || 'Pet');
    const petType = data.petType?.trim() || '';
    const breed = data.breed?.trim() || '';
    const age = data.age?.toString().trim() || '';
    const gender = data.gender?.toString().trim() || '';
    const neutered = data.isNeutered ? (lbl?.yes ?? 'yes') : (lbl?.no ?? 'no');
    const vaccinated = data.hasVaccination ? (lbl?.yes ?? 'yes') : (lbl?.no ?? 'no');
    const registered = data.hasRegistration ? (lbl?.yes ?? 'yes') : (lbl?.no ?? 'no');

    const opening = `${petName}${breed ? ` (${breed})` : ''}: ${tmpl.intro || pack.openings[variant]}`;

    const detailSentences: string[] = [];
    if (petType) detailSentences.push(`${lbl?.type ?? 'Type'}: ${petType}.`);
    if (age) detailSentences.push(`${lbl?.age ?? 'Age'}: ${age}.`);
    if (gender) detailSentences.push(`${lbl?.gender ?? 'Gender'}: ${gender}.`);
    if (data.weight) detailSentences.push(`${lbl?.weight ?? 'Weight'}: ${data.weight}.`);
    if (data.noiseLevel) {
      const noiseText =
        data.noiseLevel === 'low'
          ? (lbl?.noiseLow ?? 'low')
          : data.noiseLevel === 'medium'
            ? (lbl?.noiseMedium ?? 'medium')
            : (lbl?.noiseHigh ?? 'high');
      detailSentences.push(`${lbl?.noiseLevel ?? 'Noise level'}: ${noiseText}.`);
    }
    if (data.aloneTime) detailSentences.push(`${lbl?.aloneTime ?? 'Alone time'}: ${data.aloneTime}.`);
    if (data.activeHours) detailSentences.push(`${lbl?.activeHours ?? 'Active hours'}: ${data.activeHours}.`);
    if (data.behaviorWithChildren) detailSentences.push(`${lbl?.behaviorWithChildren ?? 'Behavior with children'}: ${data.behaviorWithChildren}.`);
    if (data.behaviorWithPets) detailSentences.push(`${lbl?.behaviorWithPets ?? 'Behavior with other pets'}: ${data.behaviorWithPets}.`);
    if (data.willingToPayDeposit) detailSentences.push(`${lbl?.willingToPayDeposit ?? 'Pet deposit'}: ${lbl?.yes ?? 'yes'}.`);
    detailSentences.push(
      `${lbl?.vaccination ?? 'Vaccinated'}: ${vaccinated}, ${lbl?.registration ?? 'Registered'}: ${registered}, ${lbl?.neutered ?? 'Neutered'}: ${neutered}.`
    );

    let fullText = [
      opening,
      detailSentences.join(' '),
      pack.variantBlocks[variant],
      pack.closings[variant],
      tmpl.outro || '',
    ]
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();

    const targetLength = Math.floor(MAX_DESCRIPTION_LENGTH * 0.92);
    let fillerIdx = 0;
    while (fullText.length < targetLength && fillerIdx < pack.fillers.length) {
      fullText = `${fullText} ${pack.fillers[(variant + fillerIdx) % pack.fillers.length]}`;
      fillerIdx += 1;
    }

    updateData('generatedText', fullText.slice(0, MAX_DESCRIPTION_LENGTH));
    showToast('✨ Text generiert!', 'success');
  };

  const handleDownloadPDF = async (templateType: string = 'classic') => {
    const pdfT = buildPdfTranslations(t);
    try {
      const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
      await downloadPdf(data, templateType, pdfT, {
        pdfSaveHint: t?.labels?.pdfSaveHint || 'Tippen Sie auf "Teilen" → "In Dateien sichern"',
      });

      trackUmamiEvent('PDF_Downloaded', {
        template: templateType,
      });

      if (isIOS) {
        showToast(t?.labels?.pdfSaveHint || 'Tippen Sie auf "Teilen" → "In Dateien sichern"', 'info');
      } else {
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        showToast(isMobile ? 'PDF downloaded!' : 'PDF downloaded successfully!', 'success');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      if (import.meta.env.DEV) console.error('PDF generation error:', err);
      if (errorMessage.includes('Failed to fetch') || errorMessage.includes('import')) {
        showToast(t?.ui?.pdfModuleError || 'Failed to load PDF module. Check your internet connection and try again.', 'error');
      } else if (errorMessage.includes('memory')) {
        showToast(t?.ui?.pdfMemoryError || 'PDF generation failed due to large image. Try reducing photo size.', 'error');
      } else if (errorMessage.includes('timeout')) {
        showToast(t?.ui?.pdfTimeoutError || 'PDF generation timed out. Please try again.', 'error');
      } else {
        showToast(t?.ui?.pdfError || 'Failed to download PDF: ' + errorMessage, 'error');
      }
    }
  };

  const handleDownloadAllTemplates = async () => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      showToast(t?.labels?.zipMobileDisabled ?? 'ZIP-Download auf Mobilgeräten deaktiviert. Bitte einzelne Vorlagen herunterladen.', 'info');
      return;
    }
    showToast(t?.labels?.generatingZip || 'Generiere alle Vorlagen...', 'info');
    const pdfT = buildPdfTranslations(t);
    try {
      const { successCount, failedTemplates } = await downloadAllTemplatesAsZip(
        data,
        TEMPLATE_OPTIONS,
        pdfT,
        {
          zipMobileDisabled: t?.labels?.zipMobileDisabled ?? 'ZIP-Download auf Mobilgeräten deaktiviert.',
          generatingZip: t?.labels?.generatingZip || 'Generiere alle Vorlagen...',
          zipDownloaded: t?.premium?.zipDownloaded || 'ZIP mit allen Vorlagen heruntergeladen!',
          zipError: t?.labels?.zipError || 'Fehler beim Erstellen des ZIP-Archivs',
        }
      );

      trackUmamiEvent('ZIP_Downloaded', {
        successCount,
        failedCount: failedTemplates.length,
      });

      if (failedTemplates.length > 0) {
        showToast(`${successCount}/${TEMPLATE_OPTIONS.length} templates generated. Failed: ${failedTemplates.join(', ')}`, 'warning');
      } else {
        showToast(t?.premium?.zipDownloaded || 'ZIP mit allen Vorlagen heruntergeladen!', 'success');
      }
    } catch (err: unknown) {
      if (import.meta.env.DEV) console.error('ZIP generation error:', err);
      showToast(t?.labels?.zipError || 'Fehler beim Erstellen des ZIP-Archivs', 'error');
    }
  };

  return (
    <AppContainer
      onDownloadPDF={handleDownloadPDF}
      onDownloadAllTemplates={handleDownloadAllTemplates}
      onGenerateText={generateText}
    />
  );
};

export default AppContent;
